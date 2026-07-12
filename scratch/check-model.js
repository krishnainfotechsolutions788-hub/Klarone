import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkModel() {
  const { data, error } = await supabase
    .from('kc_master_products')
    .select('model')
    .ilike('model', '%Warra%')
    .limit(5);
    
  if (error) {
    console.error('Error fetching data:', error);
    return;
  }
  
  console.log('Results:', data);
  if (data && data.length > 0) {
    console.log('Length:', data[0].model.length);
  }
}

checkModel();
