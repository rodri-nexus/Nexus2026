import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function installStoreScript(
  storeId: number,
  accessToken: string,
  scriptUrl: string
) {
  const res = await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Nevux (nevux.app)",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Nevux Widgets",
      src: scriptUrl,
      where: "head",
      position: "bottom",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Error instalando script:", res.status, err);
    return false;
  }

  const data = await res.json();
  console.log("Script instalado:", data);
  return true;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.json(
      { error: "Falta el parametro 'code' en la URL" },
      { status: 400 }
    );
  }

  if (!state) {
    return NextResponse.json(
      { error: "Falta el parametro 'state' (user_id) en la URL" },
      { status: 400 }
    );
  }

  const clientId = process.env.TIENDANUBE_CLIENT_ID;
  const clientSecret = process.env.TIENDANUBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Variables de entorno de Tiendanube no configuradas" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://www.tiendanube.com/apps/authorize/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code: code,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error, description: data.error_description },
        { status: 400 }
      );
    }

    const storeId = data.user_id;
    const accessToken = data.access_token;
    const scope = data.scope || null;

    const { error: dbError } = await supabaseAdmin
      .from("stores")
      .upsert(
        {
          store_id: storeId,
          access_token: accessToken,
          scope: scope,
          updated_at: new Date().toISOString(),
          installed_at: new Date().toISOString(),
          is_active: true,
          user_id: state,
        },
        { onConflict: "store_id" }
      );

    if (dbError) {
      console.error("Error al guardar en Supabase:", dbError);
      return NextResponse.json(
        { error: "Error al guardar la tienda en la base de datos" },
        { status: 500 }
      );
    }

    // Instalar el script de widgets en la tienda del cliente
    const appUrl = new URL(request.url).origin;
    const scriptUrl = `${appUrl}/nevux-widget.js`;
    
    try {
      await installStoreScript(storeId, accessToken, scriptUrl);
      console.log("Script Nevux instalado en tienda:", storeId);
    } catch (scriptErr) {
      console.error("Error instalando script (no critico):", scriptErr);
    }

    console.log("Tienda conectada y vinculada:", {
      store_id: storeId,
      user_id: state,
    });

    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error al intercambiar el code:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la autorizacion" },
      { status: 500 }
    );
  }
    }
