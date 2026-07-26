import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
}

// Cliente de Supabase con permisos de servidor (service_role)
// Solo usar desde el backend, NUNCA desde el navegador
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Tipo TypeScript para la tabla stores
export type Store = {
  id: number;
  store_id: number;
  access_token: string;
  scope: string | null;
  installed_at: string;
  updated_at: string;
  is_active: boolean;
};
