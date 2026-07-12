import { createAdminClient } from "@/lib/supabase/admin";

export type MatchAction = 'CREATE_PRODUCT' | 'CREATE_VARIANT' | 'UPDATE_VARIANT';

export interface MatchSuggestion {
  actionType: MatchAction;
  confidence: number;
  reason: string;
  targetId?: string; // master_product_id for CREATE_VARIANT, variant_id for UPDATE_VARIANT
  existingProduct?: any;
  existingVariant?: any;
}

export class ImportMatchingService {
  /**
   * Matches an imported product against the Knowledge Catalog
   */
  static async matchKnowledgeProduct(
    masterData: any,
    variantData: any
  ): Promise<MatchSuggestion> {
    const supabase = createAdminClient();

    // 1. Icecat ID Match (Highest Priority)
    if (masterData.icecat_id && masterData.icecat_id !== "Imported via MPN") {
      const { data: exactProduct } = await supabase
        .from('kc_master_products')
        .select(`
          id, model, brand_id, kc_brands(name),
          kc_variants (
            id, cpu, ram, storage, display, battery
          )
        `)
        .eq('icecat_id', masterData.icecat_id)
        .single();

      if (exactProduct && exactProduct.kc_variants && exactProduct.kc_variants.length > 0) {
        return {
          actionType: 'UPDATE_VARIANT',
          confidence: 100,
          reason: 'Icecat Product ID exact match found.',
          targetId: exactProduct.kc_variants[0].id,
          existingProduct: exactProduct,
          existingVariant: exactProduct.kc_variants[0]
        };
      }
    }

    // 2. GTIN Match
    if (masterData.gtin && masterData.gtin.length > 0) {
      const { data: gtinProduct } = await supabase
        .from('kc_master_products')
        .select(`
          id, model, brand_id, kc_brands(name),
          kc_variants (
            id, cpu, ram, storage, display, battery
          )
        `)
        .eq('gtin', masterData.gtin)
        .single();

      if (gtinProduct && gtinProduct.kc_variants && gtinProduct.kc_variants.length > 0) {
        return {
          actionType: 'UPDATE_VARIANT',
          confidence: 98,
          reason: 'GTIN / EAN exact match found.',
          targetId: gtinProduct.kc_variants[0].id,
          existingProduct: gtinProduct,
          existingVariant: gtinProduct.kc_variants[0]
        };
      }
    }

    // 3. Model Matching
    if (masterData.model) {
      // Normalize string for fuzzy matching (lowercase, remove spaces and hyphens)
      const normalize = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const normalizedInputModel = normalize(masterData.model);

      // We need to fetch all models of this brand to compare, since we can't do complex regex in simple supabase JS easily
      let brandId = null;
      if (masterData.brand) {
        const { data: brand } = await supabase.from('kc_brands').select('id').ilike('name', masterData.brand).single();
        if (brand) brandId = brand.id;
      }

      if (brandId) {
        const { data: brandProducts } = await supabase
          .from('kc_master_products')
          .select(`
            id, model,
            kc_variants (
              id, cpu, ram, storage, display, battery
            )
          `)
          .eq('brand_id', brandId);

        if (brandProducts) {
          for (const bp of brandProducts) {
            const normalizedDbModel = normalize(bp.model);
            if (normalizedInputModel === normalizedDbModel || normalizedDbModel.includes(normalizedInputModel) || normalizedInputModel.includes(normalizedDbModel)) {
              
              // We found a matching model. Let's check variants to see if it's an exact config match, or a new config.
              const fingerprintMatch = bp.kc_variants.find((v: any) => 
                v.cpu === variantData.cpu && 
                v.ram === variantData.ram && 
                v.storage === variantData.storage
              );

              if (fingerprintMatch) {
                return {
                  actionType: 'UPDATE_VARIANT',
                  confidence: 90,
                  reason: 'Model name matches and configuration is identical.',
                  targetId: fingerprintMatch.id,
                  existingProduct: bp,
                  existingVariant: fingerprintMatch
                };
              } else {
                return {
                  actionType: 'CREATE_VARIANT',
                  confidence: 85,
                  reason: 'Model name matches, but this appears to be a different configuration.',
                  targetId: bp.id,
                  existingProduct: bp
                };
              }
            }
          }
        }
      }
    }

    // 4. No Match
    return {
      actionType: 'CREATE_PRODUCT',
      confidence: 95,
      reason: 'No matching product or configuration found in the catalog.',
    };
  }
}
