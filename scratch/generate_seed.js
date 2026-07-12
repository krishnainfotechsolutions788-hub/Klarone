const fs = require('fs');
const crypto = require('crypto');

function uuid() {
    return crypto.randomUUID();
}

function generateSQL() {
    let sql = `-- Klarone Product Seed Data (approx 80 products)\n\n`;
    
    // Category Groups
    const groupComputers = uuid();
    const groupComponents = uuid();
    const groupPeripherals = uuid();
    const groupAccessories = uuid();
    
    sql += `INSERT INTO public.category_groups (id, name) VALUES\n`;
    sql += `('${groupComputers}', 'Computers'),\n`;
    sql += `('${groupComponents}', 'Components'),\n`;
    sql += `('${groupPeripherals}', 'Peripherals'),\n`;
    sql += `('${groupAccessories}', 'Accessories');\n\n`;

    // Categories
    const catLaptop = uuid();
    const catDesktop = uuid();
    const catSSD = uuid();
    const catRAM = uuid();
    const catMonitor = uuid();
    const catKeyboard = uuid();

    sql += `INSERT INTO public.categories (id, group_id, name, variant_support, inventory_mode, specification_template) VALUES\n`;
    sql += `('${catLaptop}', '${groupComputers}', 'Laptop', true, 'serialized', '{"fields": ["CPU", "RAM", "Storage", "GPU", "Display"]}'::jsonb),\n`;
    sql += `('${catDesktop}', '${groupComputers}', 'Desktop PC', true, 'serialized', '{"fields": ["CPU", "RAM", "Storage", "GPU"]}'::jsonb),\n`;
    sql += `('${catSSD}', '${groupComponents}', 'SSD', false, 'quantity', '{"fields": ["Capacity", "Interface", "Read Speed"]}'::jsonb),\n`;
    sql += `('${catRAM}', '${groupComponents}', 'RAM', false, 'quantity', '{"fields": ["Capacity", "Type", "Speed"]}'::jsonb),\n`;
    sql += `('${catMonitor}', '${groupPeripherals}', 'Monitor', false, 'quantity', '{"fields": ["Resolution", "Refresh Rate", "Panel Type"]}'::jsonb),\n`;
    sql += `('${catKeyboard}', '${groupPeripherals}', 'Keyboard', false, 'quantity', '{"fields": ["Type", "Layout", "Switches"]}'::jsonb);\n\n`;

    // Brands
    const brandLenovo = uuid();
    const brandApple = uuid();
    const brandDell = uuid();
    const brandSamsung = uuid();
    const brandCorsair = uuid();
    const brandLogitech = uuid();
    const brandAsus = uuid();

    sql += `INSERT INTO public.brands (id, name) VALUES\n`;
    sql += `('${brandLenovo}', 'Lenovo'),\n`;
    sql += `('${brandApple}', 'Apple'),\n`;
    sql += `('${brandDell}', 'Dell'),\n`;
    sql += `('${brandSamsung}', 'Samsung'),\n`;
    sql += `('${brandCorsair}', 'Corsair'),\n`;
    sql += `('${brandLogitech}', 'Logitech'),\n`;
    sql += `('${brandAsus}', 'Asus');\n\n`;

    // Series
    const seriesThinkPad = uuid();
    const seriesMacBookPro = uuid();
    const seriesXPS = uuid();
    const seriesROG = uuid();
    
    sql += `INSERT INTO public.series (id, brand_id, name) VALUES\n`;
    sql += `('${seriesThinkPad}', '${brandLenovo}', 'ThinkPad'),\n`;
    sql += `('${seriesMacBookPro}', '${brandApple}', 'MacBook Pro'),\n`;
    sql += `('${seriesXPS}', '${brandDell}', 'XPS'),\n`;
    sql += `('${seriesROG}', '${brandAsus}', 'ROG');\n\n`;

    // Products
    let productSql = `INSERT INTO public.product_models (id, category_id, brand_id, series_id, name, code, description, short_description, status, specifications) VALUES\n`;
    let variantSql = `INSERT INTO public.product_variants (id, model_id, sku, dynamic_attributes, price, cost, status) VALUES\n`;
    let inventorySql = `INSERT INTO public.inventory_units (id, variant_id, model_id, inventory_mode, quantity, serial_number, condition, purchase_price, selling_price, warehouse) VALUES\n`;
    
    let productCount = 0;
    
    // Generates 20 laptops
    const cpus = ['Intel i5', 'Intel i7', 'AMD Ryzen 5', 'AMD Ryzen 7'];
    const rams = ['8GB', '16GB', '32GB'];
    const storages = ['256GB SSD', '512GB SSD', '1TB SSD'];
    
    for(let i=0; i<20; i++) {
        const modelId = uuid();
        const brand = [brandLenovo, brandDell, brandAsus][i % 3];
        const series = [seriesThinkPad, seriesXPS, seriesROG][i % 3];
        const modelName = ['T480', 'Latitude 5420', 'Zephyrus G14', 'ThinkPad X1', 'XPS 15'][i % 5];
        
        productSql += `('${modelId}', '${catLaptop}', '${brand}', '${series}', '${modelName} - Gen ${i+1}', 'LAP-${1000+i}', 'Professional laptop for business', 'Great laptop', 'active', '{"CPU": "${cpus[i%4]}", "RAM": "${rams[i%3]}", "Storage": "${storages[i%3]}"}'::jsonb),\n`;
        
        // 2 Variants per laptop
        for(let v=0; v<2; v++) {
            const variantId = uuid();
            const sku = `SKU-LAP-${1000+i}-${v}`;
            const price = 800 + (i*10) + (v*100);
            const cost = 600 + (i*10) + (v*80);
            
            variantSql += `('${variantId}', '${modelId}', '${sku}', '{"Color": "${v === 0 ? 'Black' : 'Silver'}"}'::jsonb, ${price}, ${cost}, 'active'),\n`;
            
            // 2 Serialized units per variant
            for(let u=0; u<2; u++) {
                const invId = uuid();
                const serial = `SN-${sku}-${u}`;
                inventorySql += `('${invId}', '${variantId}', NULL, 'serialized', 1, '${serial}', 'new', ${cost}, ${price}, 'Main Warehouse'),\n`;
            }
        }
        productCount++;
    }

    // Generates 15 SSDs (Quantity mode, no variants)
    for(let i=0; i<15; i++) {
        const modelId = uuid();
        const modelName = ['970 EVO Plus', '980 PRO', '870 EVO'][i % 3];
        const cap = ['250GB', '500GB', '1TB', '2TB', '4TB'][i % 5];
        
        productSql += `('${modelId}', '${catSSD}', '${brandSamsung}', NULL, 'Samsung ${modelName} ${cap}', 'SSD-${1000+i}', 'High performance NVMe SSD', 'Fast storage', 'active', '{"Capacity": "${cap}", "Interface": "PCIe 4.0"}'::jsonb),\n`;
        
        // Inventory (Quantity mode)
        const invId = uuid();
        inventorySql += `('${invId}', NULL, '${modelId}', 'quantity', ${50 + i*10}, NULL, 'new', 50, 80, 'Main Warehouse'),\n`;
        productCount++;
    }

    // Generates 15 RAM (Quantity mode, no variants)
    for(let i=0; i<15; i++) {
        const modelId = uuid();
        const modelName = ['Vengeance LPX', 'Dominator Platinum'][i % 2];
        const cap = ['8GB', '16GB', '32GB'][i % 3];
        
        productSql += `('${modelId}', '${catRAM}', '${brandCorsair}', NULL, 'Corsair ${modelName} ${cap}', 'RAM-${1000+i}', 'DDR4 Memory', 'Fast RAM', 'active', '{"Capacity": "${cap}", "Speed": "3200MHz"}'::jsonb),\n`;
        
        const invId = uuid();
        inventorySql += `('${invId}', NULL, '${modelId}', 'quantity', ${100 + i*5}, NULL, 'new', 30, 60, 'Main Warehouse'),\n`;
        productCount++;
    }

    // Generates 15 Monitors (Quantity mode)
    for(let i=0; i<15; i++) {
        const modelId = uuid();
        const brand = [brandDell, brandSamsung, brandAsus][i % 3];
        const size = ['24"', '27"', '32"'][i % 3];
        const res = ['1080p', '1440p', '4K'][i % 3];
        
        productSql += `('${modelId}', '${catMonitor}', '${brand}', NULL, '${brand === brandDell ? 'UltraSharp' : 'ProArt'} ${size} Monitor', 'MON-${1000+i}', 'Professional Monitor', 'Clear display', 'active', '{"Resolution": "${res}", "Panel Type": "IPS"}'::jsonb),\n`;
        
        const invId = uuid();
        inventorySql += `('${invId}', NULL, '${modelId}', 'quantity', ${20 + i*2}, NULL, 'new', 200, 300, 'Main Warehouse'),\n`;
        productCount++;
    }

    // Generates 15 Keyboards
    for(let i=0; i<15; i++) {
        const modelId = uuid();
        const modelName = ['MX Mechanical', 'K70 RGB', 'G Pro X'][i % 3];
        const brand = [brandLogitech, brandCorsair][i % 2];
        
        productSql += `('${modelId}', '${catKeyboard}', '${brand}', NULL, '${modelName} Keyboard - V${i}', 'KB-${1000+i}', 'Mechanical Keyboard', 'Clicky', 'active', '{"Switches": "Brown"}'::jsonb),\n`;
        
        const invId = uuid();
        inventorySql += `('${invId}', NULL, '${modelId}', 'quantity', ${40 + i*3}, NULL, 'new', 80, 120, 'Main Warehouse'),\n`;
        productCount++;
    }

    // Clean up trailing commas
    productSql = productSql.slice(0, -2) + `;\n\n`;
    variantSql = variantSql.slice(0, -2) + `;\n\n`;
    inventorySql = inventorySql.slice(0, -2) + `;\n\n`;

    sql += productSql;
    sql += variantSql;
    sql += inventorySql;

    fs.writeFileSync('d:/Contribution/klarone/supabase/seed_products.sql', sql);
    console.log('Seed SQL generated successfully at supabase/seed_products.sql with ' + productCount + ' products.');
}

generateSQL();
