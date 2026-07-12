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

async function updateRow(row) {
  try {
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

    // Find all master products by model name
    const { data: masterProducts, error: mpError } = await supabase
      .from('kc_master_products')
      .select('id')
      .eq('model', modelName);

    if (mpError) {
      console.error(`MP Error: ${mpError.message}`);
      return;
    }

    if (!masterProducts || masterProducts.length === 0) {
      return; // Not found, skip
    }

    for (const master of masterProducts) {
      // Find all variants for this master product
      const { data: variants } = await supabase
        .from('kc_variants')
        .select('id')
        .eq('master_product_id', master.id);

      if (variants && variants.length > 0) {
        for (const variant of variants) {
          // Update variant
          const { error: updateError } = await supabase
            .from('kc_variants')
            .update({
              cpu: cpu,
              ram: ram,
              storage: storageStr,
              os: os,
              gpu: gpu,
              display: display,
            })
            .eq('id', variant.id);
          
          if (updateError) {
            console.error(`Error updating variant for ${modelName}:`, updateError.message);
          } else {
            process.stdout.write('.');
          }
        }
      }
    }

  } catch (err) {
    console.error(`\nFailed row: ${row.model_name}`, err.message);
  }
}

async function main() {
  console.log("Starting CSV variant updates for duplicates...");
  const rows = [];
  
  fs.createReadStream(path.resolve(__dirname, '../data/laptops.csv'))
    .pipe(csv())
    .on('data', (data) => rows.push(data))
    .on('end', async () => {
      console.log(`Parsed ${rows.length} rows. Starting DB updates...`);
      for (let i = 0; i < rows.length; i++) {
        await updateRow(rows[i]);
      }
      console.log("\nUpdates complete!");
      process.exit(0);
    });
}

main();
