import fs from 'fs';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000",
  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000"
];

function generateSerial() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'KLR-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const brandCache = {};

async function processRow(row) {
  try {
    const brandName = row.brand.trim() || 'Unknown';
    const modelName = row.model_name.trim();
    if (!modelName) return;

    const cpu = row.processor_name;
    const ram = row['ram(GB)'] ? `${row['ram(GB)']}GB` : null;
    const ssd = row['ssd(GB)'] ? parseInt(row['ssd(GB)']) : 0;
    const hdd = row['Hard Disk(GB)'] ? parseInt(row['Hard Disk(GB)']) : 0;
    
    let storage = [];
    if (ssd > 0) storage.push(`${ssd}GB SSD`);
    if (hdd > 0) storage.push(`${hdd}GB HDD`);
    const storageStr = storage.length > 0 ? storage.join(' + ') : null;

    const os = row['Operating System'];
    const gpu = row.graphics;
    const display = (row['screen_size(inches)'] && row['resolution (pixels)']) 
        ? `${row['screen_size(inches)']}inch ${row['resolution (pixels)']}` 
        : null;
    
    const price = parseInt(row.price) || 0;
    
    const description = `${brandName} ${modelName} featuring ${cpu}, ${ram || ''} memory, and ${storageStr || ''} storage, running on ${os}.`;

    // 1. Get or Create Brand
    let brandId = brandCache[brandName.toLowerCase()];
    
    if (!brandId) {
        let { data: brandData } = await supabase
            .from('kc_brands')
            .select('id')
            .ilike('name', brandName)
            .maybeSingle();

        if (!brandData) {
            const { data: newBrand, error } = await supabase
                .from('kc_brands')
                .insert({ name: brandName })
                .select('id')
                .single();
            if (error && error.code !== '23505') { // Ignore unique constraint violation
                 throw new Error(`Brand error: ${error.message}`);
            } else if (error && error.code === '23505') {
                 // Fetch again if concurrent insert happened
                 const { data: retryBrand } = await supabase.from('kc_brands').select('id').ilike('name', brandName).single();
                 brandData = retryBrand;
            } else {
                 brandData = newBrand;
            }
        }
        brandId = brandData.id;
        brandCache[brandName.toLowerCase()] = brandId;
    }

    // 2. Insert Master Product
    const { data: masterProduct, error: masterError } = await supabase
        .from('kc_master_products')
        .insert({
            brand_id: brandId,
            model: modelName,
            status: 'Published',
            msrp: price,
            official_images: DEFAULT_IMAGES,
            official_descriptions: description
        })
        .select('id')
        .single();
    
    if (masterError) throw new Error(`Master product error: ${masterError.message}`);

    // 3. Insert Variant
    const { data: variant, error: variantError } = await supabase
        .from('kc_variants')
        .insert({
            master_product_id: masterProduct.id,
            cpu: cpu,
            ram: ram,
            storage: storageStr,
            os: os,
            gpu: gpu,
            display: display,
            selling_price: price
        })
        .select('id')
        .single();
    
    if (variantError) throw new Error(`Variant error: ${variantError.message}`);

    // 4. Insert Inventory Item
    const { error: invError } = await supabase
        .from('inventory_items')
        .insert({
            variant_id: variant.id,
            inventory_mode: 'serialized',
            serial_number: generateSerial(),
            condition: 'New',
            status: 'Available',
            purchase_price: Math.floor(price * 0.7),
            selling_price: price
        });
    
    if (invError) throw new Error(`Inventory error: ${invError.message}`);

    process.stdout.write('.');

  } catch (err) {
    console.error(`\nFailed row: ${row.model_name}`, err.message);
  }
}

async function main() {
  console.log("Starting import...");
  const rows = [];
  
  fs.createReadStream(path.resolve(__dirname, '../data/laptops.csv'))
    .pipe(csv())
    .on('data', (data) => rows.push(data))
    .on('end', async () => {
      console.log(`Parsed ${rows.length} rows. Starting DB inserts...`);
      // Process sequentially instead of Promise.all to avoid race conditions on master products/brands entirely
      for (let i = 0; i < rows.length; i++) {
        await processRow(rows[i]);
      }
      console.log("\nImport complete!");
      process.exit(0);
    });
}

main();
