const fs = require('fs');
let content = fs.readFileSync('supabase/seed_products.sql', 'utf8');

// 1. Extract model specifications
const modelRegex = /\('([^']+)', '([^']+)', '([^']+)', (NULL|'[^']+'), '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)'::jsonb\)/g;
let models = [];
let modelSpecs = {};
let match;
while ((match = modelRegex.exec(content)) !== null) {
    const id = match[1];
    models.push({ id: id, code: match[6] });
    try {
        modelSpecs[id] = JSON.parse(match[10]);
    } catch(e) {
        modelSpecs[id] = {};
    }
}

// 2. product_models: Drop specifications, add highlights
content = content.replace('description, short_description, status, specifications', 'description, short_description, status, highlights');
// Replace the model insert values to change the jsonb to just []
content = content.replace(/\('([^']+)', '([^']+)', '([^']+)', (NULL|'[^']+'), '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)'::jsonb\)/g, 
    "('$1', '$2', '$3', $4, '$5', '$6', '$7', '$8', '$9', '[]'::jsonb)");

// 3. product_variants: dynamic_attributes -> specifications, price -> selling_price, cost -> cost_price
content = content.replace('dynamic_attributes, price, cost, status', 'specifications, selling_price, cost_price, status');

// 4. Update existing variants to merge model specs
const variantRegex = /\('([^']+)', '([^']+)', '([^']+)', '([^']+)'::jsonb, ([0-9]+), ([0-9]+), '([^']+)'\)/g;
const modelsWithVariants = new Set();
content = content.replace(variantRegex, (match, id, model_id, sku, dynAttrsStr, price, cost, status) => {
    modelsWithVariants.add(model_id);
    let dynAttrs = {};
    try { dynAttrs = JSON.parse(dynAttrsStr); } catch(e) {}
    
    const parentSpecs = modelSpecs[model_id] || {};
    const mergedSpecs = { ...parentSpecs, ...dynAttrs };
    
    return "('" + id + "', '" + model_id + "', '" + sku + "', '" + JSON.stringify(mergedSpecs) + "'::jsonb, " + price + ", " + cost + ", '" + status + "')";
});

// 5. Generate default variants
let newVariantsSql = '\n-- Default Variants for non-variant products\nINSERT INTO public.product_variants (id, model_id, sku, specifications, selling_price, cost_price, status) VALUES\n';
const defaultVariants = {}; 
let hasDefaultVariants = false;
let dvValues = [];

for (const model of models) {
    if (!modelsWithVariants.has(model.id)) {
        hasDefaultVariants = true;
        const crypto = require('crypto');
        const vId = crypto.randomUUID();
        defaultVariants[model.id] = vId;
        const specs = JSON.stringify(modelSpecs[model.id] || {});
        dvValues.push("('" + vId + "', '" + model.id + "', 'DEF-" + model.code + "', '" + specs + "'::jsonb, 0, 0, 'active')");
    }
}
if (hasDefaultVariants) {
    newVariantsSql += dvValues.join(',\n') + ';\n\n';
    content = content.replace('INSERT INTO public.inventory_units', newVariantsSql + 'INSERT INTO public.inventory_units');
}

// 6. inventory_units: remove model_id, condition -> condition_grade, selling_price -> selling_price_override
content = content.replace(
    'INSERT INTO public.inventory_units (id, variant_id, model_id, inventory_mode, quantity, serial_number, condition, purchase_price, selling_price, warehouse) VALUES',
    'INSERT INTO public.inventory_units (id, variant_id, inventory_mode, quantity, serial_number, condition_grade, purchase_price, selling_price_override) VALUES'
);

const invRegex = /\('([^']+)', (NULL|'[^']+'), (NULL|'[^']+'), '([^']+)', ([0-9]+), (NULL|'[^']+'), '([^']+)', ([0-9]+), ([0-9]+), '([^']+)'\)/g;
content = content.replace(invRegex, (match, id, vId, mId, mode, qty, sn, cond, pPrice, sPrice, wh) => {
    let finalVId = vId;
    if (finalVId === 'NULL') {
        const mIdStr = mId.replace(/'/g, '');
        if (defaultVariants[mIdStr]) {
            finalVId = "'" + defaultVariants[mIdStr] + "'";
        }
    }
    return "('" + id + "', " + finalVId + ", '" + mode + "', " + qty + ", " + sn + ", '" + cond + "', " + pPrice + ", " + sPrice + ")";
});

content = '-- Wipe old product data safely to avoid duplicate key constraints\nTRUNCATE public.category_groups CASCADE;\nTRUNCATE public.brands CASCADE;\n\n' + content;
fs.writeFileSync('supabase/seed_products_v2.sql', content);
console.log('Successfully generated complete seed_products_v2.sql');
