require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { loadDatabase } = require("./environment");

const config = loadDatabase();
if (!config.supabaseUrl || !config.supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set SUPABASE_URL and one of SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, or SUPABASE_PUBLISHABLE_KEY.",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

module.exports = supabase;
