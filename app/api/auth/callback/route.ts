// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

interface TiendanubeStoreDetails {
  email: string | null;
  storeName: string | null;
  businessName: string | null;
  bestName: string | null;
}

async function installStoreScript(
  storeId: number,
  accessToken: string,
  scriptUrl: string
): Promise<boolean> {
  try {
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
  } catch (e: unknown) {
    console.error("Excepción instalando script:", e);
    return false;
  }
}

async function getTiendanubeStoreDetails(
  storeId: number,
  accessToken: string
): Promise<TiendanubeStoreDetails> {
  try {
    const res = await fetch(`https://api.tiendanube.com/v1/${storeId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Nevux (nevux.app)",
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      const email = data.email || data.customer_email || null;

      // Tiendanube puede devolver name como string o como objeto { es: "...", pt: "..." }
      let storeName: string | null = null;
      if (typeof data.name === "string" && data.name.trim()) {
        storeName = data.name.trim();
      } else if (data.name && typeof data.name === "object") {
        const langName =
          data.name.es ||
          data.name.pt ||
          (Object.values(data.name)[0] as string) ||
          null;
        if (typeof langName === "string" && langName.trim()) {
          storeName = langName.trim();
        }
      }

      // business_name suele contener el nombre de la persona titular o razón social
      let businessName: string | null = null;
      if (typeof data.business_name === "string" && data.business_name.trim()) {
        businessName = data.business_name.trim();
      }

      // Seleccionar el mejor nombre disponible
      const bestName =
        businessName ||
        storeName ||
        (email ? email.split("@")[0] : null);

      return {
        email,
        storeName,
        businessName,
        bestName,
      };
    }
  } catch (err: unknown) {
    console.error("Error obteniendo datos de tienda Tiendanube:", err);
  }

  return {
    email: null,
    storeName: null,
    businessName: null,
    bestName: null,
  };
}

function redirectDashboard(
  request: NextRequest,
  params?: Record<string, string>
) {
  const url = new URL("/dashboard", request.url);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return NextResponse.redirect(url);
}

function redirectLogin(
  request: NextRequest,
  params?: Record<string, string>
) {
  const url = new URL("/login", request.url);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // userId Nevux que inició "Conectar"

  if (!code) {
    return NextResponse.json(
      { error: "Falta el parámetro 'code' en la URL" },
      { status: 400 }
    );
  }

  const clientId = process.env.TIENDANUBE_CLIENT_ID || "37382";
  const clientSecret = process.env.TIENDANUBE_CLIENT_SECRET;

  if (!clientSecret) {
    return NextResponse.json(
      { error: "TIENDANUBE_CLIENT_SECRET no configurado en el servidor" },
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

    const storeId = Number(data.user_id);
    const accessToken = data.access_token as string;
    const scope = data.scope || null;

    if (!storeId || !accessToken) {
      return NextResponse.json(
        { error: "Respuesta de Tiendanube incompleta" },
        { status: 400 }
      );
    }

    // 2. Obtener datos completos de la tienda en Tiendanube (Email, Nombre comercial, Nombre tienda)
    const storeDetails = await getTiendanubeStoreDetails(storeId, accessToken);
    const storeEmail = storeDetails.email;

    // 3. Usuario Nevux que debe quedar como dueño (prioridad segura)
    let sessionUserId: string | null = null;
    let sessionEmail: string | null = null;

    try {
      const supabaseServer = createClient();
      const {
        data: { user: currentUser },
      } = await supabaseServer.auth.getUser();

      if (currentUser) {
        sessionUserId = currentUser.id;
        sessionEmail = currentUser.email ?? null;
        console.log("✅ Sesión Nevux detectada:", sessionEmail);
      }
    } catch (e: unknown) {
      console.error("Error leyendo sesión:", e);
    }

    // state = userId de quien hizo clic en Conectar
    const stateUserId =
      state && typeof state === "string" && state.length > 10 ? state : null;

    let userIdToLink: string | null = sessionUserId || stateUserId || null;

    // Si hay sesión Y state distintos → gana la sesión activa
    if (sessionUserId && stateUserId && sessionUserId !== stateUserId) {
      console.warn(
        "⚠️ state distinto a sesión activa; se usa sesión:",
        sessionUserId
      );
      userIdToLink = sessionUserId;
    }

    // 4. Tienda existente en Nevux (dueño actual)
    const { data: existingStore } = await supabaseAdmin
      .from("stores")
      .select(
        "store_id, user_id, trial_started_at, trial_ends_at, plan_status, plan_active_until, months_active, feedback_shown, last_payment_at, is_active"
      )
      .eq("store_id", storeId)
      .maybeSingle();

    // ─────────────────────────────────────────────
    // ANTI-ROBO: tienda ya tiene OTRO dueño
    // ─────────────────────────────────────────────
    if (
      existingStore?.user_id &&
      userIdToLink &&
      existingStore.user_id !== userIdToLink
    ) {
      console.error("🚫 BLOQUEO ANTI-ROBO: intento de reasignar tienda", {
        storeId,
        owner: existingStore.user_id,
        attemptedBy: userIdToLink,
      });

      return redirectDashboard(request, {
        store_link_error: "already_linked",
        store_id: String(storeId),
      });
    }

    // Si no hay userIdToLink aún, intentar dueño existente (reinstall sin sesión)
    if (!userIdToLink && existingStore?.user_id) {
      userIdToLink = existingStore.user_id;
      console.log("🔄 Reinstall: conservo dueño existente", userIdToLink);
    }

    // Match por email de Tiendanube solo si la tienda NO tiene dueño
    if (!userIdToLink && !existingStore?.user_id && storeEmail) {
      try {
        const { data: usersData, error: usersError } =
          await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });

        if (!usersError && usersData?.users) {
          const matchedUser = usersData.users.find(
            (u) =>
              (u.email || "").toLowerCase() === storeEmail.toLowerCase()
          );
          if (matchedUser) {
            userIdToLink = matchedUser.id;
            console.log("🎯 Match email →", matchedUser.email);
          }
        }
      } catch (e: unknown) {
        console.error("Error listUsers:", e);
      }
    }

    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const isBrandNewStore = !existingStore;
    const canClaimOrphan =
      existingStore && !existingStore.user_id && !!userIdToLink;
    const isOwnerReconnect =
      existingStore &&
      existingStore.user_id &&
      userIdToLink &&
      existingStore.user_id === userIdToLink;

    // 5. Armar payload de tienda
    const upsertPayload: Record<string, unknown> = {
      store_id: storeId,
      access_token: accessToken,
      scope: scope,
      updated_at: now.toISOString(),
      is_active: true,
    };

    if (isBrandNewStore) {
      upsertPayload.installed_at = now.toISOString();
      upsertPayload.trial_started_at = now.toISOString();
      upsertPayload.trial_ends_at = trialEndsAt.toISOString();
      upsertPayload.plan_status = "trial";
      upsertPayload.feedback_shown = false;
      upsertPayload.months_active = 0;
      if (userIdToLink) {
        upsertPayload.user_id = userIdToLink;
      }
      console.log("🎁 Alta nueva: trial 7 días asignado →", userIdToLink);
    } else if (isOwnerReconnect) {
      upsertPayload.user_id = userIdToLink;
      console.log("🔄 Reconexión de dueño legítimo: plan intacto");
    } else if (canClaimOrphan) {
      upsertPayload.user_id = userIdToLink;
      if (!existingStore.trial_started_at && !existingStore.plan_active_until) {
        upsertPayload.trial_started_at = now.toISOString();
        upsertPayload.trial_ends_at = trialEndsAt.toISOString();
        upsertPayload.plan_status = "trial";
        upsertPayload.feedback_shown = false;
        upsertPayload.months_active = 0;
      }
      console.log("🔗 Claim de tienda huérfana →", userIdToLink);
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

    // 6. Si tenemos usuario vinculado y tenemos un nombre de Tiendanube, actualizar profiles.full_name si está vacío
    if (userIdToLink && storeDetails.bestName) {
      try {
        const { data: existingProfile } = await supabaseAdmin
          .from("profiles")
          .select("full_name")
          .eq("id", userIdToLink)
          .maybeSingle();

        if (!existingProfile?.full_name || existingProfile.full_name.trim() === "") {
          await supabaseAdmin
            .from("profiles")
            .update({
              full_name: storeDetails.bestName,
              updated_at: now.toISOString(),
            })
            .eq("id", userIdToLink);

          console.log(
            "👤 Nombre actualizado en profile:",
            userIdToLink,
            "→",
            storeDetails.bestName
          );
        }
      } catch (profileErr: unknown) {
        console.error("Error actualizando full_name en profile:", profileErr);
      }
    }

    // 7. Instalar script en la tienda (siempre con token actualizado)
    const appUrl = new URL(request.url).origin;
    const scriptUrl = `${appUrl}/nevux-widget.js`;

    try {
      await installStoreScript(storeId, accessToken, scriptUrl);
      console.log("Script Nevux verificado en tienda:", storeId);
    } catch (scriptErr: unknown) {
      console.error("Error instalando script (no crítico):", scriptErr);
    }

    // 8. Redirección al Dashboard o Login
    const finalUser = userIdToLink || existingStore?.user_id || null;

    if (finalUser) {
      return redirectDashboard(request);
    }

    return redirectLogin(request, {
      pending_store: String(storeId),
      ...(storeEmail ? { email: storeEmail } : {}),
      ...(storeDetails.bestName ? { name: storeDetails.bestName } : {}),
    });
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Error al procesar la autorización";
    console.error("Error en GET /api/auth/callback:", errorMsg);
    return NextResponse.json(
      { error: "Error interno al procesar la autorización", details: errorMsg },
      { status: 500 }
    );
  }
    }
