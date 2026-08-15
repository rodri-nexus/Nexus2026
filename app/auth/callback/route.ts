import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Obtener el usuario recién autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Verificar si ya existe el perfil
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        // Si NO existe, crear el perfil (caso Google Auth o primer login)
        if (!existingProfile) {
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Usuario";

          const avatarUrl =
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null;

          // Trial de 7 días desde ahora
          const trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + 7);

          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              full_name: fullName,
              avatar_url: avatarUrl,
              plan: "free",
              onboarding_completed: false,
              trial_ends_at: trialEndsAt.toISOString(),
            });

          if (insertError) {
            console.error("Error al crear perfil:", insertError);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("Error al intercambiar el code:", error);
  }

  // Si algo falló, redirigir al login con un mensaje de error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
      }
