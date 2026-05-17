import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gjolhecpstysxzwgbdne.supabase.co";
const supabaseKey = "sb_publishable_mUL0lYXpdyAEVBzCXx9TsA_BOKJGzkM";

export const supabase = createClient(supabaseUrl, supabaseKey);
