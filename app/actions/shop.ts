"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getShopProduct(id: string) {
  try {
    const supabase = createAdminClient();
    
    // Fetch product with variants and inventory
    const { data, error } = await supabase
      .from('kc_master_products')
      .select(`
        *,
        kc_brands (name),
        kc_variants (
          *,
          kc_specifications (
            group_name,
            attribute_name,
            value,
            unit
          ),
          inventory_items (
            id,
            selling_price,
            rental_price,
            status,
            quantity,
            condition
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return { success: false, error: 'Product not found' };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch shop product:", error);
    return { success: false, error: error.message };
  }
}

export async function getShopProducts(ids: string[]) {
  try {
    if (!ids || ids.length === 0) return { success: true, data: [] };
    
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('kc_master_products')
      .select(`
        *,
        kc_brands (name),
        kc_variants (
          *,
          kc_specifications (
            group_name,
            attribute_name,
            value,
            unit
          ),
          inventory_items (
            id,
            selling_price,
            rental_price,
            status,
            quantity,
            condition
          )
        )
      `)
      .in('id', ids);

    if (error) {
      throw error;
    }

    // Preserve the order of the requested IDs
    const orderedData = ids.map(id => data.find(p => p.id === id)).filter(Boolean);

    return { success: true, data: orderedData };
  } catch (error: any) {
    console.error("Failed to fetch shop products:", error);
    return { success: false, error: error.message };
  }
}
