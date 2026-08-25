"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { calculateScores, calculateScoresAsync } from "@/lib/scoring";
import { ImportMatchingService, MatchAction } from "@/lib/services/ImportMatchingService";

export async function matchKnowledgeProductAction(masterData: any, variantData: any) {
  try {
    const suggestion = await ImportMatchingService.matchKnowledgeProduct(masterData, variantData);
    return { success: true, data: suggestion };
  } catch (error: any) {
    console.error("Match error:", error);
    return { success: false, error: error.message };
  }
}

interface AddLaptopParams {
  brandName: string;
  model: string;
  series: string;
  releaseYear: number;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  display: string;
  battery: string;
  weight: number;
  msrp: number;
}

export async function addKnowledgeLaptop(data: AddLaptopParams) {
  try {
    const supabase = await createClient();

    // 1. Get or create the brand
    let brandId = null;
    const { data: existingBrand } = await supabase
      .from('kc_brands')
      .select('id')
      .ilike('name', data.brandName)
      .single();

    if (existingBrand) {
      brandId = existingBrand.id;
    } else {
      const { data: newBrand, error: brandError } = await supabase
        .from('kc_brands')
        .insert({ name: data.brandName })
        .select('id')
        .single();
      
      if (brandError) throw brandError;
      brandId = newBrand.id;
    }

    // 2. Calculate ML-backed scores with heuristic fallback
    const scores = await calculateScoresAsync({
      brand: data.brandName,
      cpu: data.cpu,
      gpu: data.gpu,
      ram: data.ram,
      storage: data.storage,
      display: data.display,
      battery: data.battery,
      weight: data.weight,
      msrp: data.msrp,
    });

    // 3. Insert the laptop
    const { error: insertError } = await supabase
      .from('kc_laptops')
      .insert({
        brand_id: brandId,
        model: data.model,
        series: data.series || null,
        release_year: data.releaseYear,
        cpu: data.cpu,
        gpu: data.gpu,
        ram: data.ram,
        storage: data.storage,
        display: data.display,
        battery: data.battery,
        weight: data.weight,
        msrp: data.msrp,
        programming_score: scores.programming,
        gaming_score: scores.gaming,
        student_score: scores.student,
        business_score: scores.business,
      });

    if (insertError) throw insertError;

    revalidatePath("/admin/knowledge-catalog");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add knowledge laptop:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

export async function deleteKnowledgeLaptop(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('kc_laptops').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath("/admin/knowledge-catalog");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete knowledge laptop:", error);
    return { success: false, error: error.message || "Failed to delete" };
  }
}

export async function addV2ManualKnowledgeEntry(data: any) {
  try {
    const { master, variant, dynamicSpecs } = data;

    // Build intelligence data using ML model with fallback
    const scores = await calculateScoresAsync({
      brand: master.brandName,
      cpu: variant.cpu,
      gpu: variant.gpu || '',
      ram: variant.ram,
      storage: variant.storage,
      display: variant.display,
      battery: variant.battery,
      weight: master.weight || 2,
      msrp: master.msrp || 0,
    });

    const intelligenceData = {
      student_score: scores.student,
      business_score: scores.business,
      gaming_score: scores.gaming,
      programming_score: scores.programming,
    };

    // Transform dynamicSpecs array into official_specifications nested object
    const official_specifications: any = {};
    if (dynamicSpecs && Array.isArray(dynamicSpecs)) {
      dynamicSpecs.forEach((spec: any) => {
        if (!spec.group || !spec.name) return;
        if (!official_specifications[spec.group]) {
          official_specifications[spec.group] = {};
        }
        official_specifications[spec.group][spec.name] = spec.value;
      });
    }

    const masterData = {
      brand: master.brandName,
      model: master.model,
      series: master.series || null,
      gtin: null,
      icecat_id: null,
      msrp: master.msrp || 0,
      official_images: master.images ? master.images.split(',').map((u: string) => u.trim()).filter((u: string) => u.length > 0) : [],
      official_descriptions: master.description || null,
      official_specifications
    };

    const result = await saveV2KnowledgeData({
      masterData,
      variantData: variant,
      intelligenceData,
      actionType: 'CREATE_PRODUCT'
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to add manual V2 knowledge entry:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

export async function saveV2KnowledgeData({
  masterData,
  variantData,
  intelligenceData,
  actionType = 'CREATE_PRODUCT',
  targetId
}: {
  masterData: any;
  variantData: any;
  intelligenceData: any;
  actionType?: MatchAction;
  targetId?: string;
}) {
  try {
    const supabase = createAdminClient();

    // Dynamically compute ML scores via Klarone ML Model service if intelligenceData is incomplete
    if (!intelligenceData || !intelligenceData.student_score) {
      const mlScores = await calculateScoresAsync({
        brand: masterData?.brand || '',
        cpu: variantData?.cpu || '',
        gpu: variantData?.gpu || '',
        ram: variantData?.ram || '',
        storage: variantData?.storage || '',
        display: variantData?.display || '',
        battery: variantData?.battery || '',
        msrp: masterData?.msrp || 0
      });
      intelligenceData = {
        student_score: mlScores.student,
        business_score: mlScores.business,
        gaming_score: mlScores.gaming,
        programming_score: mlScores.programming,
      };
    }

    let masterProductId = actionType === 'CREATE_VARIANT' ? targetId : null;
    let variantId = actionType === 'UPDATE_VARIANT' ? targetId : null;

    // 1. CREATE_PRODUCT logic
    if (actionType === 'CREATE_PRODUCT') {
      let brandId = null;
      const { data: existingBrand } = await supabase
        .from('kc_brands')
        .select('id')
        .ilike('name', masterData.brand)
        .single();

      if (existingBrand) {
        brandId = existingBrand.id;
      } else {
        const { data: newBrand, error: brandError } = await supabase
          .from('kc_brands')
          .insert({ name: masterData.brand })
          .select('id')
          .single();
        
        if (brandError) throw brandError;
        brandId = newBrand.id;
      }

      const { data: masterProduct, error: masterError } = await supabase
        .from('kc_master_products')
        .insert({
          brand_id: brandId,
          model: masterData.model,
          series: masterData.series || null,
          gtin: masterData.gtin || null,
          icecat_id: masterData.icecat_id || null,
          msrp: masterData.msrp || 0,
          official_images: masterData.official_images || [],
          official_descriptions: masterData.official_descriptions || null,
          status: 'Draft'
        })
        .select('id')
        .single();

      if (masterError) throw masterError;
      masterProductId = masterProduct.id;
    }

    // 2. CREATE_VARIANT logic (also runs for CREATE_PRODUCT)
    if (actionType === 'CREATE_PRODUCT' || actionType === 'CREATE_VARIANT') {
      if (!masterProductId) throw new Error("Missing master product ID for variant creation.");
      
      const { data: variant, error: variantError } = await supabase
        .from('kc_variants')
        .insert({
          master_product_id: masterProductId,
          cpu: variantData.cpu,
          ram: variantData.ram,
          storage: variantData.storage,
          display: variantData.display,
          battery: variantData.battery,
        })
        .select('id')
        .single();

      if (variantError) throw variantError;
      variantId = variant.id;

      const { error: intelligenceError } = await supabase
        .from('kc_intelligence')
        .insert({
          variant_id: variantId,
          student_score: intelligenceData.student_score,
          business_score: intelligenceData.business_score,
          gaming_score: intelligenceData.gaming_score,
          programming_score: intelligenceData.programming_score,
        });

      if (intelligenceError) throw intelligenceError;
    }

    // 3. UPDATE_VARIANT logic
    if (actionType === 'UPDATE_VARIANT') {
      if (!variantId) throw new Error("Missing variant ID for variant update.");
      
      const { error: variantError } = await supabase
        .from('kc_variants')
        .update({
          cpu: variantData.cpu,
          ram: variantData.ram,
          storage: variantData.storage,
          display: variantData.display,
          battery: variantData.battery,
        })
        .eq('id', variantId);

      if (variantError) throw variantError;

      const { error: intelligenceError } = await supabase
        .from('kc_intelligence')
        .update({
          student_score: intelligenceData.student_score,
          business_score: intelligenceData.business_score,
          gaming_score: intelligenceData.gaming_score,
          programming_score: intelligenceData.programming_score,
        })
        .eq('variant_id', variantId);

      // It's possible intelligence doesn't exist yet if manually inserted earlier, we can upsert instead, but update is fine for now
      // Delete old dynamic specifications before inserting new ones
      await supabase.from('kc_specifications').delete().eq('variant_id', variantId);
    }

    // 4. Insert Dynamic Specifications (Runs for all actions)
    if (masterData.official_specifications && variantId) {
      const specRecords: any[] = [];
      Object.entries(masterData.official_specifications).forEach(([groupName, specs]) => {
        if (typeof specs === 'object' && specs !== null) {
          Object.entries(specs).forEach(([attrName, attrValue]) => {
            specRecords.push({
              variant_id: variantId,
              group_name: groupName,
              attribute_name: attrName,
              attribute_code: attrName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
              value: String(attrValue),
              source: 'Icecat'
            });
          });
        }
      });

      if (specRecords.length > 0) {
        const { error: specError } = await supabase
          .from('kc_specifications')
          .insert(specRecords);
        if (specError) throw specError;
      }
    }

    revalidatePath("/admin/knowledge-catalog");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save V2 knowledge data:", error);
    return { success: false, error: error.message || "Failed to save data" };
  }
}

export async function getV2KnowledgeCatalog(page = 1, pageSize = 20, searchQuery = "", status = "") {
  try {
    const supabase = createAdminClient();
    
    let query = supabase
      .from('kc_master_products')
      .select('*, kc_brands(name)', { count: 'exact' });
      
    if (status) {
      query = query.eq('status', status);
    }
      
    if (searchQuery) {
      // Find matching brands first to enable searching by brand name
      const { data: brands } = await supabase
        .from('kc_brands')
        .select('id')
        .ilike('name', `%${searchQuery}%`);
        
      const brandIds = brands?.map(b => b.id) || [];
      
      if (brandIds.length > 0) {
        query = query.or(`model.ilike.%${searchQuery}%,series.ilike.%${searchQuery}%,brand_id.in.(${brandIds.join(',')})`);
      } else {
        query = query.or(`model.ilike.%${searchQuery}%,series.ilike.%${searchQuery}%`);
      }
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;
    return { success: true, data, count };
  } catch (error: any) {
    console.error("Failed to fetch V2 knowledge catalog:", error);
    return { success: false, error: error.message || "Failed to fetch data", count: 0 };
  }
}

export async function deleteV2KnowledgeMaster(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('kc_master_products').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath("/admin/knowledge-catalog");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete V2 knowledge master product:", error);
    return { success: false, error: error.message || "Failed to delete" };
  }
}

export async function deleteV2KnowledgeMasters(ids: string[]) {
  try {
    const supabase = createAdminClient();
    
    // Process in batches of 100 to avoid url length limits or timeout issues
    const batchSize = 100;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const { error } = await supabase.from('kc_master_products').delete().in('id', batch);
      if (error) throw error;
    }
    
    revalidatePath("/admin/knowledge-catalog");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to bulk delete V2 knowledge master products:", error);
    return { success: false, error: error.message || "Failed to bulk delete" };
  }
}

export async function getV2KnowledgeCatalogAllIds(searchQuery = "", status = "") {
  try {
    const supabase = createAdminClient();
    
    let allIds: string[] = [];
    let hasMore = true;
    let page = 0;
    const pageSize = 1000;

    // Fetch brands once outside the loop
    let brandIds: string[] = [];
    if (searchQuery) {
      const { data: brands } = await supabase
        .from('kc_brands')
        .select('id')
        .ilike('name', `%${searchQuery}%`);
      brandIds = brands?.map(b => b.id) || [];
    }

    while (hasMore) {
      let query = supabase.from('kc_master_products').select('id');
        
      if (status) {
        query = query.eq('status', status);
      }
        
      if (searchQuery) {
        if (brandIds.length > 0) {
          query = query.or(`model.ilike.%${searchQuery}%,series.ilike.%${searchQuery}%,brand_id.in.(${brandIds.join(',')})`);
        } else {
          query = query.or(`model.ilike.%${searchQuery}%,series.ilike.%${searchQuery}%`);
        }
      }
      
      const { data, error } = await query
        .order('id', { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        allIds = [...allIds, ...data.map(d => d.id)];
        if (data.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    }
    
    return { success: true, data: allIds };
  } catch (error: any) {
    console.error("Failed to fetch V2 knowledge catalog all ids:", error);
    return { success: false, error: error.message || "Failed to fetch IDs", data: [] };
  }
}

export async function getV2KnowledgeMaster(id: string) {
  try {
    const supabase = createAdminClient();
    
    // Fetch master with brand
    const { data: masterData, error: masterError } = await supabase
      .from('kc_master_products')
      .select('*, kc_brands(name)')
      .eq('id', id)
      .single();

    if (masterError) throw masterError;

    // Fetch all variants
    const { data: variantsData, error: variantError } = await supabase
      .from('kc_variants')
      .select('*')
      .eq('master_product_id', id);

    if (variantError) throw variantError;

    const firstVariant = variantsData && variantsData.length > 0 ? variantsData[0] : null;

    let intelligenceData: any[] = [];
    let specificationsData: any[] = [];

    if (variantsData && variantsData.length > 0) {
      const variantIds = variantsData.map(v => v.id);
      
      const { data: intel, error: intelError } = await supabase
        .from('kc_intelligence')
        .select('*')
        .in('variant_id', variantIds);
      
      if (intelError) throw intelError;
      intelligenceData = intel || [];

      const { data: specs, error: specError } = await supabase
        .from('kc_specifications')
        .select('*')
        .in('variant_id', variantIds);
      
      if (specError) throw specError;
      specificationsData = specs || [];
    }

    const firstIntel = intelligenceData && intelligenceData.length > 0 ? intelligenceData[0] : null;

    return { 
      success: true, 
      data: { 
        master: masterData, 
        variants: variantsData, 
        variant: firstVariant,  
        intelligences: intelligenceData, 
        intelligence: firstIntel, 
        specifications: specificationsData 
      } 
    };
  } catch (error: any) {
    console.error("Failed to fetch V2 knowledge master details:", error);
    return { success: false, error: error.message || "Failed to fetch details" };
  }
}

export async function updateV2KnowledgeData({
  id,
  masterData,
  variantData,
  intelligenceData,
  variantsData,
  intelligencesData,
  specificationsData
}: {
  id: string;
  masterData: any;
  variantData?: any;
  intelligenceData?: any;
  variantsData?: any[];
  intelligencesData?: any[];
  specificationsData?: any[];
}) {
  try {
    const supabase = createAdminClient();

    // 1. Update Master
    const { error: masterError } = await supabase
      .from('kc_master_products')
      .update({
        model: masterData.model,
        series: masterData.series || null,
        gtin: masterData.gtin || null,
        status: masterData.status || 'Draft',
        official_descriptions: masterData.official_descriptions || null
      })
      .eq('id', id);

    if (masterError) throw masterError;

    // 2. Update Legacy Variant (if variantsData is not provided)
    if (!variantsData && variantData && variantData.id) {
      const { error: variantError } = await supabase
        .from('kc_variants')
        .update({
          cpu: variantData.cpu,
          ram: variantData.ram,
          storage: variantData.storage,
          display: variantData.display,
          battery: variantData.battery,
        })
        .eq('id', variantData.id);
      if (variantError) throw variantError;
    }

    // 3. Update Legacy Intelligence (if intelligencesData is not provided)
    if (!intelligencesData && intelligenceData && intelligenceData.id) {
      const { error: intelError } = await supabase
        .from('kc_intelligence')
        .update({
          student_score: intelligenceData.student_score,
          business_score: intelligenceData.business_score,
          gaming_score: intelligenceData.gaming_score,
          programming_score: intelligenceData.programming_score,
        })
        .eq('id', intelligenceData.id);
      if (intelError) throw intelError;
    }

    // 4. Update Multiple Variants
    if (variantsData && variantsData.length > 0) {
      for (const v of variantsData) {
        if (v.id) {
          await supabase.from('kc_variants').update({
            cpu: v.cpu,
            ram: v.ram,
            storage: v.storage,
            display: v.display,
            battery: v.battery,
          }).eq('id', v.id);
        }
      }
    }

    // 5. Update Multiple Intelligences
    if (intelligencesData && intelligencesData.length > 0) {
      for (const i of intelligencesData) {
        if (i.id) {
          await supabase.from('kc_intelligence').update({
            student_score: i.student_score,
            business_score: i.business_score,
            gaming_score: i.gaming_score,
            programming_score: i.programming_score,
          }).eq('id', i.id);
        }
      }
    }

    // 6. Update Multiple Specifications
    if (specificationsData && specificationsData.length > 0) {
      for (const s of specificationsData) {
        if (s.id) {
          await supabase.from('kc_specifications').update({
            value: s.value
          }).eq('id', s.id);
        }
      }
    }

    revalidatePath("/admin/knowledge-catalog");
    revalidatePath(`/admin/knowledge-catalog/${id}`);
    revalidatePath(`/admin/knowledge-catalog/${id}/view`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update V2 knowledge data:", error);
    return { success: false, error: error.message || "Failed to update data" };
  }
}
