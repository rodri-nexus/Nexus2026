// app/api/admin/install-script/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Endpoint admin para instalar el script nevux-widget.js en una tienda.
 * Uso:
 *   GET /api/admin/install-script?store_id=8053402&secret=XXX
 *   GET /api/admin/install-script?store_id=8053402&secret=XXX&force=1
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeIdParam = searchParams.get("store_id");
  const secret = searchParams.get("secret");
  const force = searchParams.get("force") === "1";

  const expectedSecret = process.env.ADMIN_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET no configurado en el servidor" },
      { status: 500 }
    );
  }
  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Secreto inválido" }, { status: 401 });
  }

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

  const scriptUrl = `${new URL(request.url).origin}/nevux-widget.js`;

  // script_id: identificador ENTERO único del script en Tiendanube
  const NEVUX_SCRIPT_ID = 1;

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

    const rawListText = await listRes.text();
    let rawList: any = null;
    try {
      rawList = JSON.parse(rawListText);
    } catch {
      rawList = null;
    }

    let existingScripts: any[] = [];
    if (Array.isArray(rawList)) {
      existingScripts = rawList;
    } else if (rawList && Array.isArray(rawList.scripts)) {
      existingScripts = rawList.scripts;
    } else if (rawList && typeof rawList === "object") {
      existingScripts = Object.values(rawList).filter(
        (v: any) => v && typeof v === "object"
      );
    }

    if (!listRes.ok) {
      return NextResponse.json(
        {
          error: "Error listando scripts en Tiendanube",
          status: listRes.status,
          rawResponse: rawListText,
        },
        { status: 500 }
      );
    }

    const alreadyInstalled = existingScripts.find(
      (s: any) =>
        s &&
        (s.src === scriptUrl ||
          s.script_id === NEVUX_SCRIPT_ID ||
          (s.name && String(s.name).includes("Nevux")))
    );

    if (alreadyInstalled && !force) {
      return NextResponse.json({
        success: true,
        message: "Script ya estaba instalado (usá &force=1 para reinstalar)",
        script: alreadyInstalled,
        totalScripts: existingScripts.length,
      });
    }

    if (alreadyInstalled && force && alreadyInstalled.id) {
      await fetch(
        `https://api.tiendanube.com/v1/${storeId}/scripts/${alreadyInstalled.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${store.access_token}`,
            "User-Agent": "Nevux (nevux.app)",
            "Content-Type": "application/json",
          },
        }
      );
    }

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
          script_id: NEVUX_SCRIPT_ID,
          src: scriptUrl,
          event: "onfirstinteraction",
          where: "store",
        }),
      }
    );

    const installRawText = await installRes.text();
    let installedParsed: any = null;
    try {
      installedParsed = JSON.parse(installRawText);
    } catch {
      installedParsed = installRawText;
    }

    if (!installRes.ok) {
      return NextResponse.json(
        {
          error: "Error instalando script en Tiendanube",
          status: installRes.status,
          response: installedParsed,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Script instalado correctamente",
      script: installedParsed,
      scriptUrl,
      storeId,
      existingBefore: existingScripts.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Excepción durante la instalación",
        details: err.message,
      },
      { status: 500 }
    );
  }
  }
