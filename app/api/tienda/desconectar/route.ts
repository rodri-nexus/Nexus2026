// app/api/tienda/desconectar/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

interface TiendanubeScript {
  id: number;
  name?: string;
  src?: string;
  created_at?: string;
  updated_at?: string;
}

/* ═══════════════════════════════════════════════════
   POST /api/tienda/desconectar
   Desconecta la tienda del usuario logueado:
   1. Elimina el script Nevux de la tienda (Tiendanube API)
   2. Borra todos los widgets asociados
   3. Marca la tienda como inactiva en Supabase
═══════════════════════════════════════════════════ */

async function removeStoreScripts(
  storeId: number,
  accessToken: string
): Promise<{ removed: number; error: string | null }> {
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

    const scripts: TiendanubeScript[] = await listRes.json();
    const nevuxScripts = Array.isArray(scripts)
      ? scripts.filter(
          (s) =>
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
      if (delRes.ok) {
        removed++;
      } else {
        console.error("No se pudo borrar script:", script.id, delRes.status);
      }
    }

    return { removed, error: null };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Error desconocido";
    console.error("Error removiendo scripts:", errorMsg);
    return { removed: 0, error: errorMsg };
  }
}

export async function POST() {
  try {
    // 1. Verificar sesión del usuario
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

    // 2. Buscar la tienda activa vinculada al usuario
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

    // 3. Intentar eliminar los scripts de Tiendanube (resiliente)
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
    // Se preserva el access_token para cumplir la restricción NOT NULL de la DB
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
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Error interno del servidor";
    console.error("Error en POST /api/tienda/desconectar:", errorMsg);
    return NextResponse.json(
      { error: "Error interno del servidor", details: errorMsg },
      { status: 500 }
    );
  }
}
