import { createClient } from '@supabase/supabase-js';

{
  console.warn("[pumkin] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
}
const supabaseAdmin = createClient("", "", {
  auth: { persistSession: false, autoRefreshToken: false }
});

export { supabaseAdmin as s };
