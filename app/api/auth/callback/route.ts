import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Falta el parametro 'code' en la URL" },
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
          is_active: true,
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

    console.log("Tienda conectada y guardada:", { store_id: storeId });

    return new Response(
      `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Nevux - Instalacion exitosa</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background: #f9fafb;
      }
      .card {
        background: white;
        padding: 3rem 2rem;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.08);
        text-align: center;
        max-width: 500px;
      }
      h1 { color: #10b981; margin: 0 0 1rem 0; }
      p { color: #6b7280; }
      .store-id {
        background: #f3f4f6;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-family: monospace;
        margin-top: 1rem;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Instalacion exitosa</h1>
      <p>Nevux se conecto correctamente a tu tienda y los datos fueron guardados.</p>
      <p>Ya podes cerrar esta ventana.</p>
      <div class="store-id">Store ID: ${storeId}</div>
    </div>
  </body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  } catch (error) {
    console.error("Error al intercambiar el code:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la autorizacion" },
      { status: 500 }
    );
  }
}
