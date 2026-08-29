import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

const ADMIN_EMAIL = "nevuxapp@gmail.com";

interface StoreRecord {
  store_id: number;
  access_token: string;
  user_id: string | null;
  is_active: boolean;
}

// Función para registrar el script en una tienda específica de Tiendanube
async function syncStoreScript(storeId: number, accessToken: string, scriptUrl: string) {
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

    if (listRes.ok) {
      const scripts = await listRes.json();
      if (Array.isArray(scripts)) {
        // Eliminar scripts viejos o duplicados de Nevux para no acumular basura
        for (const s of scripts) {
          if (s.src && s.src.includes("nevux-widget.js")) {
            await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts/${s.id}`, {
              method: "DELETE",
              headers,
            });
          }
        }
      }
    }

    // 2. Instalar el ScriptTag limpio y oficial en el head de la tienda
    const createRes = await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Nevux Widgets",
        src: scriptUrl,
        where: "head",
        position: "bottom",
      }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return { success: false, error: errText, status: createRes.status };
    }

    const scriptData = await createRes.json();
    return { success: true, script: scriptData };
  } catch (err: any) {
    return { success: false, error: err?.message || "Error de red" };
  }
}

export async function GET(req: NextRequest) {
  try {
    // 1. Validar permisos de Administrador
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: "No autorizado. Solo el administrador puede sincronizar tiendas." },
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

    const appOrigin = new URL(req.url).origin;
    const scriptUrl = `${appOrigin}/nevux-widget.js`;

    const results = [];

    // 3. Sincronizar tienda por tienda
    for (const store of stores as StoreRecord[]) {
      if (!store.store_id || !store.access_token) continue;

      const syncResult = await syncStoreScript(store.store_id, store.access_token, scriptUrl);
      results.push({
        store_id: store.store_id,
        user_id: store.user_id,
        sync: syncResult,
      });
    }

    return NextResponse.json({
      success: true,
      total_stores_processed: results.length,
      script_url_injected: scriptUrl,
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
