import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // ← Este es el user_id

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

    // Guardar la tienda VINCULADA al user_id
    const { error: dbError } = await supabaseAdmin
      .from("stores")
      .upsert(
        {
          store_id: storeId,
          access_token: accessToken,
          scope: scope,
          updated_at: new Date().toISOString(),
          is_active: true,
          user_id: state, // ← Aquí vinculamos la tienda al usuario
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

    console.log("Tienda conectada y vinculada:", {
      store_id: storeId,
      user_id: state,
    });

    // Redirigir al dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error al intercambiar el code:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la autorizacion" },
      { status: 500 }
    );
  }
         }
