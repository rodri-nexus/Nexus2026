// app/api/onboarding/complete/route.ts
// Marca el tutorial de onboarding como completado para el usuario actual.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  try {
    const supabase = createClient();

    // Verificar que hay un usuario autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    // Actualizar el perfil del usuario
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error al actualizar onboarding_completed:", updateError);
      return NextResponse.json(
        { error: "Error al guardar el estado del onboarding" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error inesperado en /api/onboarding/complete:", err);
    return NextResponse.json(
      { error: "Error inesperado" },
      { status: 500 }
    );
  }
                  }
