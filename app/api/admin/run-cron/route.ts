// app/api/admin/run-cron/route.ts
// Endpoint que permite al admin ejecutar el cron manualmente desde el panel.
// Internamente llama a /api/cron/check-plans con el CRON_SECRET correcto.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ADMIN_EMAIL = "nevux340@gmail.com";

export async function POST(request: Request) {
  console.log("🔵 [admin/run-cron] INICIO");

  try {
    // 1. Auth + guard admin
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("❌ [run-cron] Sin usuario");
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const email = (user.email || "").toLowerCase();
    if (email !== ADMIN_EMAIL) {
      console.error("❌ [run-cron] No es admin:", email);
      return NextResponse.json(
        { error: "Sin permisos" },
        { status: 403 }
      );
    }

    // 2. Verificar que existe CRON_SECRET
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      console.error("❌ [run-cron] CRON_SECRET no configurado");
      return NextResponse.json(
        { error: "CRON_SECRET no configurado en el servidor" },
        { status: 500 }
      );
    }

    // 3. Determinar la URL base del sitio
    // En producción y preview usamos VERCEL_URL (que Vercel setea automático)
    // En local usamos localhost
    const host = request.headers.get("host") || "";
    const protocol =
      host.startsWith("localhost") || host.startsWith("127.")
        ? "http"
        : "https";
    const baseUrl = `${protocol}://${host}`;

    console.log("🔵 [run-cron] Llamando al cron en:", baseUrl);

    // 4. Llamar al cron con el secret
    const cronResponse = await fetch(`${baseUrl}/api/cron/check-plans`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    });

    const cronData = await cronResponse.json();

    if (!cronResponse.ok) {
      console.error("❌ [run-cron] Cron respondió con error:", cronData);
      return NextResponse.json(
        {
          error: `El cron respondió con error: ${
            cronData.error || cronResponse.status
          }`,
          cronData,
        },
        { status: 500 }
      );
    }

    console.log("✅ [run-cron] Cron ejecutado OK");

    return NextResponse.json({
      success: true,
      triggeredBy: email,
      triggeredAt: new Date().toISOString(),
      ...cronData,
    });
  } catch (error: any) {
    console.error("❌ [run-cron] CATCH:", error);
    return NextResponse.json(
      { error: `Error interno: ${error?.message || "desconocido"}` },
      { status: 500 }
    );
  }
  }
