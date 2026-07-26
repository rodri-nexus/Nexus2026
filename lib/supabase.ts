import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export type Store = {
  id: number;
  store_id: number;
  access_token: string;
  scope: string | null;
  installed_at: string;
  updated_at: string;
  is_active: boolean;
};
