const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const email = 'naitikkumar2408@gmail.com';
  const password = 'SecurePassword123!';

  console.log('Attempting to create user...');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: 'Naitik',
        last_name: 'Admin'
      }
    }
  });

  if (error) {
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('User created successfully in auth.users!');
  console.log('User ID:', data.user.id);
  console.log('Please run the following SQL in your Supabase Dashboard to grant Super Admin privileges:');
  console.log(`
INSERT INTO public.user_roles (profile_id, role_id)
SELECT p.id, r.id 
FROM public.profiles p, public.roles r 
WHERE p.auth_user_id = '${data.user.id}' AND r.name = 'Super Admin';
  `);
}

createAdmin();
