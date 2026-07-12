const fs = require('fs');

let seed = fs.readFileSync('supabase/seed_products_v2.sql', 'utf8');

// Replace product_variants JSONB to remove "Color" entirely from laptops or just globally?
// User said "remove the color field for laptop", so we will remove 'Color' key from the specifications JSONB.
const variantRegex = /\('([^']+)', '([^']+)', '([^']+)', '([^']+)'::jsonb, ([0-9.]+), ([0-9.]+), '([^']+)'\)/g;
seed = seed.replace(variantRegex, (match, id, model_id, sku, specsStr, price, cost, status) => {
    let specs = {};
    try { specs = JSON.parse(specsStr); } catch(e) {}
    
    // Remove the color field
    if (specs.Color) {
        delete specs.Color;
    }
    
    return "('" + id + "', '" + model_id + "', '" + sku + "', '" + JSON.stringify(specs) + "'::jsonb, " + price + ", " + cost + ", '" + status + "')";
});

// Add rental_price to the inventory_units insert statement
seed = seed.replace(
    'INSERT INTO public.inventory_units (id, variant_id, inventory_mode, quantity, serial_number, condition_grade, purchase_price, selling_price_override) VALUES',
    'INSERT INTO public.inventory_units (id, variant_id, inventory_mode, quantity, serial_number, condition_grade, purchase_price, selling_price_override, rental_price) VALUES'
);

// We need to add the rental_price value to every inventory_units row. Let's say 100 for serialized, NULL for quantity
const invRegex = /\('([^']+)', '([^']+)', '([^']+)', ([0-9]+), (NULL|'[^']+'), '([^']+)', ([0-9.]+), ([0-9.]+)\)/g;
seed = seed.replace(invRegex, (match, id, vId, mode, qty, sn, cond, pPrice, sPrice) => {
    const rPrice = mode === 'serialized' ? '100' : 'NULL';
    return "('" + id + "', '" + vId + "', '" + mode + "', " + qty + ", " + sn + ", '" + cond + "', " + pPrice + ", " + sPrice + ", " + rPrice + ")";
});

fs.writeFileSync('supabase/seed_products_v2.sql', seed);
console.log('Removed Color and added rental_price to inventory_units');
