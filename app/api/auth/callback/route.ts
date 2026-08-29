// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";

async function installStoreScript(
  storeId: number,
  accessToken: string,
  scriptUrl: string
) {
  const res = await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Nevux (37382 - soportenevux@gmail.com)",
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

async function getTiendanubeStoreEmail(
  storeId: number,
  accessToken: string
): Promise<string | null> {
  try {
    const res = await fetch(`https://api.tiendanube.com/v1/${storeId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Nevux (37382 - soportenevux@gmail.com)",
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data.email || data.customer_email || null;
    }
  } catch (err) {
    console.error("Error obteniendo email de tienda Tiendanube:", err);
  }
  return null;
}

function redirectDashboard(
  request: Request,
  params?: Record<string, string>
) {
  const url = new URL("/dashboard", request.url);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return NextResponse.redirect(url);
}

function redirectLogin(
  request: Request,
  params?: Record<string, string>
) {
  const url = new URL("/login", request.url);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // userId Nevux que inició "Conectar"

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

    const storeId = Number(data.user_id);
    const accessToken = data.access_token as string;
    const scope = data.scope || null;

    if (!storeId || !accessToken) {
      return NextResponse.json(
        { error: "Respuesta de Tiendanube incompleta" },
        { status: 400 }
      );
    }

    // 2. Usuario Nevux que debe quedar como dueño (prioridad segura)
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
        console.log("✅ Sesión Nevux:", sessionEmail);
      }
    } catch (e) {
      console.error("Error leyendo sesión:", e);
    }

    // state = userId de quien hizo clic en Conectar (no confiar solo en state si hay sesión)
    const stateUserId =
      state && typeof state === "string" && state.length > 10 ? state : null;

    let userIdToLink: string | null = sessionUserId || stateUserId || null;

    // Si hay sesión Y state distintos → gana la sesión (evita state manipulado)
    if (sessionUserId && stateUserId && sessionUserId !== stateUserId) {
      console.warn(
        "⚠️ state distinto a sesión; se usa sesión:",
        sessionUserId
      );
      userIdToLink = sessionUserId;
    }

    // 3. Tienda existente en Nevux (dueño actual)
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
      console.error("🚫 BLOQUEO: intento de reasignar tienda", {
        storeId,
        owner: existingStore.user_id,
        attemptedBy: userIdToLink,
      });

      // Actualizar token SOLO si fuera el dueño; acá NO tocamos user_id ni plan
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
    let storeEmail: string | null = null;
    if (!userIdToLink && !existingStore?.user_id) {
      storeEmail = await getTiendanubeStoreEmail(storeId, accessToken);
      if (storeEmail) {
        try {
          const { data: usersData, error: usersError } =
            await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });

          if (!usersError && usersData?.users) {
            const matchedUser = usersData.users.find(
              (u) =>
                (u.email || "").toLowerCase() === storeEmail!.toLowerCase()
            );
            if (matchedUser) {
              userIdToLink = matchedUser.id;
              console.log("🎯 Match email →", matchedUser.email);
            }
          }
        } catch (e) {
          console.error("Error listUsers:", e);
        }
      }
    }

    // Si la tienda ya tiene dueño y todavía no hay userIdToLink, no crear huérfano raro:
    // dejamos token actualizado solo para el dueño vía reinstall path below
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
    const isOwnerlessTokenRefresh =
      existingStore && !existingStore.user_id && !userIdToLink;

    // 4. Armar payload SIN pisar planes ajenos
    const upsertPayload: Record<string, unknown> = {
      store_id: storeId,
      access_token: accessToken,
      scope: scope,
      updated_at: now.toISOString(),
      is_active: true,
    };

    // installed_at solo en alta nueva
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
      console.log("🎁 Alta nueva: trial 7 días →", userIdToLink);
    } else if (isOwnerReconnect) {
      // Dueño legítimo reconecta: solo token/script; NO tocar plan/trial/meses
      upsertPayload.user_id = userIdToLink;
      console.log("🔄 Reconexión del dueño; plan intacto");
    } else if (canClaimOrphan) {
      // Tienda sin dueño: se vincula al usuario actual
      upsertPayload.user_id = userIdToLink;
      if (!existingStore.trial_started_at && !existingStore.plan_active_until) {
        upsertPayload.trial_started_at = now.toISOString();
        upsertPayload.trial_ends_at = trialEndsAt.toISOString();
        upsertPayload.plan_status = "trial";
        upsertPayload.feedback_shown = false;
        upsertPayload.months_active = 0;
      }
      console.log("🔗 Claim huérfana →", userIdToLink);
    } else if (isOwnerlessTokenRefresh) {
      // Token refresh sin usuario: no inventar dueño
      console.log("⚠️ Token refresh sin user_id; tienda sigue pendiente de vínculo");
    } else if (
      existingStore?.user_id &&
      !userIdToLink
    ) {
      // Reinstall sin saber usuario: conservar dueño, solo token
      console.log("🔄 Reinstall anónimo: mantengo dueño y plan");
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

    // 5. Script en la tienda (siempre con el token nuevo de Tiendanube)
    const appUrl = new URL(request.url).origin;
    const scriptUrl = `${appUrl}/nevux-widget.js`;

    try {
      await installStoreScript(storeId, accessToken, scriptUrl);
      console.log("Script Nevux instalado en tienda:", storeId);
    } catch (scriptErr) {
      console.error("Error instalando script (no critico):", scriptErr);
    }

    console.log("Tienda procesada OK:", {
      store_id: storeId,
      user_id: userIdToLink || existingStore?.user_id || "PENDIENTE",
      mode: isBrandNewStore
        ? "new"
        : isOwnerReconnect
        ? "owner_reconnect"
        : canClaimOrphan
        ? "claim_orphan"
        : "token_only",
    });

    // 6. Redirección
    const finalUser = userIdToLink || existingStore?.user_id || null;

    if (finalUser) {
      return redirectDashboard(request);
    }

    return redirectLogin(request, {
      pending_store: String(storeId),
      ...(storeEmail ? { email: storeEmail } : {}),
    });
  } catch (error) {
    console.error("Error al intercambiar el code:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la autorizacion" },
      { status: 500 }
    );
  }
      }
