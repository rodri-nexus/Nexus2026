// app/api/auth/install/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.TIENDANUBE_CLIENT_ID || "37382";

    // Verificar que el usuario esté logueado
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      // Si no hay usuario logueado, redirigir al login
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Redirige al comerciante a la pantalla oficial de autorización de Tiendanube
    // Pasamos el user_id como "state" para asociarlo en el callback
    const authUrl = `https://www.tiendanube.com/apps/${clientId}/authorize?state=${user.id}`;

    return NextResponse.redirect(authUrl);
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Error interno del servidor";
    console.error("Error en /api/auth/install:", errorMsg);
    return NextResponse.json(
      { error: "Error iniciando autorización", details: errorMsg },
      { status: 500 }
    );
  }
}
