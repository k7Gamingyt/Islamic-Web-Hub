import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ibdimfskruuudecxbgyw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_RMgMJQzyOzR58YswZToP4A_40esg3RB";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
