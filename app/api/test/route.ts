import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: models, error } = await supabase
    .from('product_models')
    .select(`
      id,
      name,
      code,
      inventory_units ( quantity, id ),
      product_variants (
        id,
        inventory_units ( quantity, id )
      )
    `)
    .limit(5);

  return NextResponse.json({ error, models });
}
