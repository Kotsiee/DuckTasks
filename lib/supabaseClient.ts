import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";

const SUPABASE_URL = 'https://adggsbvhmyfjshmcgdal.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZ2dzYnZobXlmanNobWNnZGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDM4MzksImV4cCI6MjA0NjQxOTgzOX0.Mfd_M7Ln2SNDuTyJieDu7N9Gqv57_Z-DK-8nLIhBlT4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)