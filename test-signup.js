require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignup() {
  console.log('Testing auth.signUp...');
  const { data, error } = await supabase.auth.signUp({
    email: 'test_user_for_debugging@example.com',
    password: 'password123',
    options: {
      data: {
        full_name: 'Test Debug',
        role: 'customer'
      }
    }
  });
  console.log('Result:', data);
  console.log('Error:', error);
}

testSignup();