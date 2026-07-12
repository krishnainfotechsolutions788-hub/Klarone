const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('product_models')
    .select(`
      id,
      name,
      code,
      status,
      brands ( name ),
      categories ( name, inventory_mode ),
      product_variants (
        id,
        sku,
        specifications,
        selling_price,
        inventory_units ( quantity, condition_grade, rental_price )
      )
    `)
    .limit(1);
    
  console.log('Error:', error);
  if (data && data.length > 0) {
      console.log('Data:', data[0].id, data[0].name);
      console.log('Variants:', data[0].product_variants?.length);
  } else {
      console.log('Data:', data);
  }
}
test();
