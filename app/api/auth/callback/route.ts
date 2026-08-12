// app/api/auth/callback/route.ts
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
  const state = searchParams.get("state"); // opcional ahora

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
    // 1. Intercambiar code por access_token
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
      console.error("Tiendanube token error:", data);
      return NextResponse.json(
        { error: data.error, description: data.error_description },
        { status: 400 }
      );
    }

    const storeId = data.user_id;
    const accessToken = data.access_token;
    const scope = data.scope || null;

    // 2. Buscar si la tienda ya existía y traer trial_started_at
    //    Esto es CLAVE para no resetear el trial si es una reinstalación
    const { data: existingStore } = await supabaseAdmin
      .from("stores")
      .select("user_id, trial_started_at, trial_ends_at, plan_status")
      .eq("store_id", storeId)
      .maybeSingle();

    let userIdToLink: string | null = state || null;

    if (!userIdToLink && existingStore?.user_id) {
      userIdToLink = existingStore.user_id;
      console.log("Reinstalación: recupero user_id existente", userIdToLink);
    }

    // 3. Determinar el trial: solo setear si es PRIMERA instalación
    const isFirstInstall = !existingStore?.trial_started_at;
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 días

    // 4. Upsert de la tienda
    const upsertPayload: any = {
      store_id: storeId,
      access_token: accessToken,
      scope: scope,
      updated_at: now.toISOString(),
      installed_at: now.toISOString(),
      is_active: true,
    };

    if (userIdToLink) {
      upsertPayload.user_id = userIdToLink;
    }

    // Solo setear campos de trial si es PRIMERA instalación
    if (isFirstInstall) {
      upsertPayload.trial_started_at = now.toISOString();
      upsertPayload.trial_ends_at = trialEndsAt.toISOString();
      upsertPayload.plan_status = "trial";
      upsertPayload.feedback_shown = false;
      upsertPayload.months_active = 0;
      console.log("🎁 Primera instalación: trial de 7 días iniciado hasta", trialEndsAt.toISOString());
    } else {
      console.log("🔄 Reinstalación: mantengo trial existente. Estado actual:", existingStore.plan_status);
    }

    const { error: dbError } = await supabaseAdmin
      .from("stores")
      .upsert(upsertPayload, { onConflict: "store_id" });

    if (dbError) {
      console.error("Error al guardar en Supabase:", dbError);
      return NextResponse.json(
        { error: "Error al guardar la tienda en la base de datos" },
        { status: 500 }
      );
    }

    // 5. Instalar el script de widgets en la tienda del cliente
    const appUrl = new URL(request.url).origin;
    const scriptUrl = `${appUrl}/nevux-widget.js`;

    try {
      await installStoreScript(storeId, accessToken, scriptUrl);
      console.log("Script Nevux instalado en tienda:", storeId);
    } catch (scriptErr) {
      console.error("Error instalando script (no critico):", scriptErr);
    }

    console.log("Tienda conectada:", {
      store_id: storeId,
      user_id: userIdToLink || "PENDIENTE_VINCULACION",
      trial_active: isFirstInstall,
    });

    // 6. Redirección final
    if (userIdToLink) {
      // Todo OK, tienda vinculada al user
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Tienda guardada pero sin user_id: pedir login para vincular
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("pending_store", String(storeId));
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    console.error("Error al intercambiar el code:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la autorizacion" },
      { status: 500 }
    );
  }
  }
