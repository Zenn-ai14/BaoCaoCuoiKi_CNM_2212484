require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('Testing users table...');
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log('Error:', error);
  
  console.log('Testing categories table...');
  const { data: catData, error: catError } = await supabase.from('categories').select('*').limit(1);
  console.log('Categories Error:', catError);
}

testSupabase();
