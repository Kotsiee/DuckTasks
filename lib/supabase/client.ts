import { createClient  } from "https://esm.sh/@supabase/supabase-js@2.47.10";
export const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!)