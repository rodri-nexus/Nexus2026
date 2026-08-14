// app/api/tienda/desconectar/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

/* ═══════════════════════════════════════════════════
   POST /api/tienda/desconectar
   Desconecta la tienda del usuario logueado:
   1. Elimina el script Nevux de la tienda (Tiendanube API)
   2. Borra todos los widgets asociados
   3. Marca la tienda como inactiva en Supabase
═══════════════════════════════════════════════════ */

async function removeStoreScripts(storeId: number, accessToken: string) {
  try {
    // 1. Listar scripts existentes
    const listRes = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/scripts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Nevux (nevux.app)",
          "Content-Type": "application/json",
        },
      }
    );

    if (!listRes.ok) {
      console.error("No se pudo listar scripts:", listRes.status);
      return { removed: 0, error: "list_failed" };
    }

    const scripts = await listRes.json();
    const nevuxScripts = Array.isArray(scripts)
      ? scripts.filter(
          (s: any) =>
            (s.src && s.src.includes("nevux-widget.js")) ||
            (s.name && s.name.toLowerCase().includes("nevux"))
        )
      : [];

    // 2. Borrar cada script Nevux
    let removed = 0;
    for (const script of nevuxScripts) {
      const delRes = await fetch(
        `https://api.tiendanube.com/v1/${storeId}/scripts/${script.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "Nevux (nevux.app)",
          },
        }
      );
      if (delRes.ok) removed++;
      else console.error("No se pudo borrar script:", script.id, delRes.status);
    }

    return { removed, error: null };
  } catch (e: any) {
    console.error("Error removiendo scripts:", e);
    return { removed: 0, error: e.message };
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verificar sesión
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // 2. Buscar la tienda vinculada al usuario
    const { data: store, error: storeErr } = await supabaseAdmin
      .from("stores")
      .select("store_id, access_token, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (storeErr) {
      console.error("Error buscando tienda:", storeErr);
      return NextResponse.json(
        { error: "Error accediendo a la base de datos" },
        { status: 500 }
      );
    }

    if (!store) {
      return NextResponse.json(
        { error: "No hay tienda conectada para este usuario" },
        { status: 404 }
      );
    }

    // 3. Intentar eliminar el script de Tiendanube (no crítico)
    let scriptResult = { removed: 0, error: null as string | null };
    if (store.access_token) {
      scriptResult = await removeStoreScripts(store.store_id, store.access_token);
      console.log("Scripts eliminados:", scriptResult);
    }

    // 4. Eliminar todos los widgets de esta tienda
    const { error: widgetsErr } = await supabaseAdmin
      .from("widgets")
      .delete()
      .eq("store_id", store.store_id)
      .eq("user_id", user.id);

    if (widgetsErr) {
      console.error("Error borrando widgets:", widgetsErr);
    }

    // 5. Marcar la tienda como inactiva (soft delete)
    // ⚠️ NO seteamos access_token a null porque la columna es NOT NULL.
    // El token viejo queda guardado (no importa, porque is_active = false).
    // Cuando el usuario reconecte, se sobreescribe con uno nuevo.
    const { error: updateErr } = await supabaseAdmin
      .from("stores")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", store.store_id)
      .eq("user_id", user.id);

    if (updateErr) {
      console.error("Error desactivando tienda:", updateErr);
      return NextResponse.json(
        {
          error: "Error desactivando la tienda",
          details: updateErr.message,
        },
        { status: 500 }
      );
    }

    console.log("Tienda desconectada exitosamente:", {
      store_id: store.store_id,
      user_id: user.id,
      scripts_removed: scriptResult.removed,
    });

    return NextResponse.json({
      ok: true,
      message: "Tienda desconectada correctamente",
      scripts_removed: scriptResult.removed,
    });
  } catch (error: any) {
    console.error("Error en POST /api/tienda/desconectar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error?.message },
      { status: 500 }
    );
  }
         }
