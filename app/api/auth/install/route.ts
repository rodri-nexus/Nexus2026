import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  const clientId = process.env.TIENDANUBE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "TIENDANUBE_CLIENT_ID no configurado" },
      { status: 500 }
    );
  }

  // Verificar que el usuario esté logueado
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Si no hay usuario logueado, redirigir al login
    return NextResponse.redirect(
      new URL("/login", "https://nexus2026-gx7e.vercel.app")
    );
  }

  // Redirige al usuario a la pantalla de autorización de Tiendanube
  // Pasamos el user_id como "state" para recuperarlo en el callback
  const authUrl = `https://www.tiendanube.com/apps/${clientId}/authorize?state=${user.id}`;

  return NextResponse.redirect(authUrl);
}
