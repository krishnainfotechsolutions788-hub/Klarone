import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    const { selectedBrands = [], selectedProcessors = [], searchQuery = '', page = 1, limit = 20 } = body;

    const brandsJoin = selectedBrands.length > 0 ? '!inner' : '';
    const processorsJoin = selectedProcessors.length > 0 ? '!inner' : '';

    // We query kc_master_products
    // We INNER join kc_variants to only get laptops that have variants
    // We INNER join inventory_items to only get laptops that have IN STOCK inventory
    let query = supabase
      .from('kc_master_products')
      .select(`
        id,
        model,
        series,
        msrp,
        official_images,
        kc_brands${brandsJoin} (name),
        kc_variants${processorsJoin} (
          id,
          cpu,
          msrp,
          inventory_items!inner (
            id,
            selling_price,
            status,
            quantity
          )
        )
      `, { count: 'exact' })
      .eq('kc_variants.inventory_items.status', 'In Stock');

    // Remove status requirement for master product since they might still be 'Draft'
    // .eq('status', 'Published')

    if (selectedBrands.length > 0) {
      query = query.in('kc_brands.name', selectedBrands);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      query = query.or(`model.ilike.%${q}%,series.ilike.%${q}%`);
      // Note: searching nested relations via or() is tricky in postgrest, 
      // typically needs a view or RPC for robust full-text search.
      // We will just search model and series for now.
    }
    
    if (selectedProcessors.length > 0) {
       query = query.in('kc_variants.cpu', selectedProcessors);
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .order('id')
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error executing search query:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out products that ended up with no variants after inner join filtering
    const validData = (data || []).filter((product: any) => product.kc_variants && product.kc_variants.length > 0);

    return NextResponse.json({
      data: validData,
      hasMore: (data || []).length === limit
    });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
