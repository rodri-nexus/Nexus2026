import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

const ADMIN_EMAIL = "nevuxapp@gmail.com";
const ADMIN_SECRET_KEY = "nevux_admin_sync_2026";
const TIENDANUBE_SCRIPT_ID = 9486; // Script registrado en Tiendanube Partners

interface StoreRecord {
  store_id: number;
  access_token: string;
  user_id: string | null;
  is_active: boolean;
}

// Función para registrar el script oficial en la tienda del comerciante
async function syncStoreScript(storeId: number, accessToken: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": "Nevux (37382 - soportenevux@gmail.com)",
    "Content-Type": "application/json",
  };

  try {
    // 1. Obtener scripts existentes en la tienda
    const listRes = await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts`, {
      headers,
      cache: "no-store",
    });

    let existingScripts: any[] = [];
    if (listRes.ok) {
      const data = await listRes.json();
      if (Array.isArray(data)) {
        existingScripts = data;
        // Eliminar scripts duplicados o viejos si existen
        for (const s of data) {
          if (s.script_id === TIENDANUBE_SCRIPT_ID || (s.src && s.src.includes("nevux-widget.js"))) {
            await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts/${s.id}`, {
              method: "DELETE",
              headers,
            });
          }
        }
      }
    }

    // 2. Instalar el Script oficial usando el ID de Partners #9486
    const createRes = await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        script_id: TIENDANUBE_SCRIPT_ID,
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return {
        success: false,
        error: errText,
        status: createRes.status,
        existing_before: existingScripts,
      };
    }

    const scriptData = await createRes.json();
    return {
      success: true,
      script: scriptData,
      existing_before: existingScripts,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error de red" };
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secretParam = searchParams.get("secret");

    let isAuthorized = secretParam === ADMIN_SECRET_KEY;

    // Si no viene con la clave secreta, verificar si hay sesión de admin
    if (!isAuthorized) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          isAuthorized = true;
        }
      } catch (authErr) {
        console.warn("Error leyendo sesión en sync-scripts:", authErr);
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "No autorizado. Clave de administrador incorrecta o sesión no iniciada." },
        { status: 403 }
      );
    }

    // 2. Obtener todas las tiendas activas con token
    const { data: stores, error: dbError } = await supabaseAdmin
      .from("stores")
      .select("store_id, access_token, user_id, is_active")
      .eq("is_active", true)
      .not("access_token", "is", null);

    if (dbError || !stores) {
      return NextResponse.json(
        { error: "Error consultando tiendas en la base de datos", details: dbError?.message },
        { status: 500 }
      );
    }

    const results = [];

    // 3. Sincronizar tienda por tienda
    for (const store of stores as StoreRecord[]) {
      if (!store.store_id || !store.access_token) continue;

      const syncResult = await syncStoreScript(store.store_id, store.access_token);
      results.push({
        store_id: store.store_id,
        user_id: store.user_id,
        sync: syncResult,
      });
    }

    return NextResponse.json({
      success: true,
      script_id: TIENDANUBE_SCRIPT_ID,
      total_stores_processed: results.length,
      results,
    });
  } catch (error: any) {
    console.error("Error en sincronización global de scripts:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error?.message },
      { status: 500 }
    );
  }
}
