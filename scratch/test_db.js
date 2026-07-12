const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

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
            status,
            inventory_units ( id, quantity, serial_number, condition_grade )
          )
        `);
    if (error) console.log('Error:', error);
    console.log('Data length:', data ? data.length : 0);
    if (data && data.length > 0) {
        console.log('Sample item:', JSON.stringify(data[0], null, 2));
    }
}
test();
