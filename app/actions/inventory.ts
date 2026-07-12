"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addInventoryItem(data: any) {
  try {
    const supabase = createAdminClient();
    
    const { error } = await supabase.from('inventory_items').insert({
      variant_id: data.variantId,
      inventory_mode: data.inventoryMode,
      serial_number: data.serialNumber || null,
      quantity: data.quantity || 1,
      condition: data.condition || 'New',
      battery_health: data.batteryHealth || null,
      purchase_price: data.purchasePrice || 0,
      selling_price: data.sellingPrice || 0,
      rental_price: data.rentalPrice || 0,
      warehouse_location: data.warehouseLocation || null,
      rack_location: data.rackLocation || null,
      status: 'In Stock',
      actual_images: data.images || []
    });

    if (error) throw error;
    
    revalidatePath('/admin/product');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add inventory item:", error);
    return { success: false, error: error.message };
  }
}

export async function getInventoryList(page = 1, pageSize = 20, searchQuery = "") {
  try {
    const supabase = createAdminClient();
    
    let query = supabase
      .from('inventory_items')
      .select(`
        *,
        kc_variants!inner (
          id,
          msrp,
          kc_master_products!inner (
            id,
            model,
            series,
            gtin,
            brand_id,
            kc_brands!inner (name)
          )
        )
      `, { count: 'exact' });

    if (searchQuery) {
      // Find matching brands first
      const { data: brands } = await supabase.from('kc_brands').select('id').ilike('name', `%${searchQuery}%`);
      const brandIds = brands?.map(b => b.id) || [];
      
      // Find matching master products
      let masterQuery = supabase.from('kc_master_products').select('id');
      if (brandIds.length > 0) {
        masterQuery = masterQuery.or(`model.ilike.%${searchQuery}%,series.ilike.%${searchQuery}%,brand_id.in.(${brandIds.join(',')})`);
      } else {
        masterQuery = masterQuery.or(`model.ilike.%${searchQuery}%,series.ilike.%${searchQuery}%`);
      }
      const { data: masters } = await masterQuery;
      const masterIds = masters?.map(m => m.id) || [];
      
      // Find variants for those masters
      let variantIds: string[] = [];
      if (masterIds.length > 0) {
        const { data: variants } = await supabase.from('kc_variants').select('id').in('master_product_id', masterIds);
        variantIds = variants?.map(v => v.id) || [];
      }
      
      if (variantIds.length > 0) {
        query = query.or(`serial_number.ilike.%${searchQuery}%,variant_id.in.(${variantIds.join(',')})`);
      } else {
        query = query.ilike('serial_number', `%${searchQuery}%`);
      }
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;
    return { success: true, data, count };
  } catch (error: any) {
    console.error("Failed to fetch inventory:", error);
    return { success: false, error: error.message, count: 0 };
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('inventory_items').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin/product');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete inventory item:", error);
    return { success: false, error: error.message };
  }
}

export async function getInventoryByMasterId(masterId: string) {
  try {
    const supabase = createAdminClient();
    
    const { data: variants, error: variantsError } = await supabase
      .from('kc_variants')
      .select('id')
      .eq('master_product_id', masterId);
      
    if (variantsError) throw variantsError;
    if (!variants || variants.length === 0) return { success: true, data: [] };
    
    const variantIds = variants.map(v => v.id);
    
    const { data, error } = await supabase
      .from('inventory_items')
      .select(`
        *,
        kc_variants (
          id,
          msrp,
          kc_master_products (
            id,
            model,
            series,
            gtin,
            brand_id,
            kc_brands (name)
          )
        )
      `)
      .in('variant_id', variantIds)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch inventory by master id:", error);
    return { success: false, error: error.message };
  }
}
