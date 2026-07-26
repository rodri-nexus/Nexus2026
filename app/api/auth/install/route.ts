import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.TIENDANUBE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "TIENDANUBE_CLIENT_ID no configurado" },
      { status: 500 }
    );
  }

  // Redirige al usuario a la pantalla de autorización de Tiendanube
  const authUrl = `https://www.tiendanube.com/apps/${clientId}/authorize`;

  return NextResponse.redirect(authUrl);
}
