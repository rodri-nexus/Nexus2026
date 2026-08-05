// app/api/admin/install-script/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Endpoint admin para instalar el script nevux-widget.js en una tienda.
 * Uso:
 *   GET /api/admin/install-script?store_id=8053402&secret=XXX
 *
 * Requiere que la tienda ya exista en Supabase con access_token válido.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeIdParam = searchParams.get("store_id");
  const secret = searchParams.get("secret");

  // 1. Validar secreto
  const expectedSecret = process.env.ADMIN_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET no configurado en el servidor" },
      { status: 500 }
    );
  }
  if (secret !== expectedSecret) {
    return NextResponse.json(
      { error: "Secreto inválido" },
      { status: 401 }
    );
  }

  // 2. Validar store_id
  if (!storeIdParam) {
    return NextResponse.json(
      { error: "Falta el parámetro store_id" },
      { status: 400 }
    );
  }
  const storeId = parseInt(storeIdParam, 10);
  if (isNaN(storeId)) {
    return NextResponse.json(
      { error: "store_id debe ser un número" },
      { status: 400 }
    );
  }

  // 3. Buscar la tienda en Supabase
  const { data: store, error: storeErr } = await supabaseAdmin
    .from("stores")
    .select("store_id, access_token, is_active")
    .eq("store_id", storeId)
    .maybeSingle();

  if (storeErr) {
    return NextResponse.json(
      { error: "Error consultando Supabase", details: storeErr.message },
      { status: 500 }
    );
  }
  if (!store) {
    return NextResponse.json(
      { error: `No se encontró la tienda con store_id ${storeId}` },
      { status: 404 }
    );
  }
  if (!store.access_token) {
    return NextResponse.json(
      { error: "La tienda no tiene access_token guardado" },
      { status: 400 }
    );
  }

  // 4. Listar scripts ya instalados (para no duplicar)
  const scriptUrl = `${new URL(request.url).origin}/nevux-widget.js`;

  try {
    const listRes = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/scripts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${store.access_token}`,
          "User-Agent": "Nevux (nevux.app)",
          "Content-Type": "application/json",
        },
      }
    );

    if (!listRes.ok) {
      const errText = await listRes.text();
      return NextResponse.json(
        {
          error: "Error listando scripts en Tiendanube",
          status: listRes.status,
          details: errText,
        },
        { status: 500 }
      );
    }

    const existingScripts: any[] = await listRes.json();
    const alreadyInstalled = existingScripts.find(
      (s) => s.src === scriptUrl || (s.name && s.name.includes("Nevux"))
    );

    if (alreadyInstalled) {
      return NextResponse.json({
        success: true,
        message: "Script ya estaba instalado",
        script: alreadyInstalled,
        totalScripts: existingScripts.length,
      });
    }

    // 5. Instalar el script
    const installRes = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/scripts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${store.access_token}`,
          "User-Agent": "Nevux (nevux.app)",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Nevux Widgets",
          src: scriptUrl,
          event: "onfirstinteraction",
          where: "store",
        }),
      }
    );

    if (!installRes.ok) {
      const errText = await installRes.text();
      return NextResponse.json(
        {
          error: "Error instalando script en Tiendanube",
          status: installRes.status,
          details: errText,
        },
        { status: 500 }
      );
    }

    const installed = await installRes.json();

    return NextResponse.json({
      success: true,
      message: "Script instalado correctamente",
      script: installed,
      scriptUrl,
      storeId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Excepción durante la instalación", details: err.message },
      { status: 500 }
    );
  }
       }
