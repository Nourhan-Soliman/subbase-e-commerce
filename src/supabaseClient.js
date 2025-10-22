import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ndmfkgcmkiforsnevdqw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbWZrZ2Nta2lmb3JzbmV2ZHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzM2MjgsImV4cCI6MjA3NjQ0OTYyOH0.An-ZZJ2GGOWBEJ9G8YTaDwvk2e03yOoRsGEJrhL3_AY";

export const supabase = createClient(supabaseUrl, supabaseKey);
