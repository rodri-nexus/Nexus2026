import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // Validar que Tiendanube nos mandó el código
  if (!code) {
    return NextResponse.json(
      { error: "Falta el parámetro 'code' en la URL" },
      { status: 400 }
    );
  }

  const clientId = process.env.TIENDANUBE_CLIENT_ID;
  const clientSecret = process.env.TIENDANUBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Variables de entorno no configuradas" },
      { status: 500 }
    );
  }

  try {
    // Intercambiar el code por un access_token
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

    // Si Tiendanube nos devolvio un error
    if (data.error) {
      return NextResponse.json(
        { error: data.error, description: data.error_description },
        { status: 400 }
      );
    }

    // Instalacion exitosa
    // data contiene: access_token, user_id (store_id), scope, token_type
    console.log("Tienda conectada exitosamente:", {
      store_id: data.user_id,
      scope: data.scope,
    });

    // Pagina simple de exito
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
      <p>Nevux se conecto correctamente a tu tienda.</p>
      <p>Ya podes cerrar esta ventana.</p>
      <div class="store-id">Store ID: ${data.user_id}</div>
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
