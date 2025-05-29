import { createClient, SupabaseClient } from "@supabase/supabase-js"
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

export default supabase