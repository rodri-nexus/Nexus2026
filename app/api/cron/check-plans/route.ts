// app/api/cron/check-plans/route.ts
// Cron job que corre todos los días a las 10:00 AM Argentina (13:00 UTC).
// - Marca como "expired" los planes vencidos
// - Envía email al admin cuando falta 3 días o 1 día para el vencimiento
// Protegido con CRON_SECRET (Vercel Cron lo manda en el header Authorization).

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendPlanExpiringAlert } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Días antes del vencimiento en los que enviamos email de aviso
const REMINDER_DAYS = [3, 1];

export async function GET(request: Request) {
  console.log("🔵 [cron/check-plans] INICIO");

  // 1. Verificar el CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    console.error("❌ [cron] CRON_SECRET no configurado");
    return NextResponse.json(
      { error: "CRON_SECRET no configurado en el server" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    console.error("❌ [cron] Auth inválida:", authHeader);
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  console.log("✅ [cron] Auth OK");

  // Inicializamos contadores para el reporte
  const report = {
    expired: 0,
    remindersSent: 0,
    remindersFailed: 0,
    checked: 0,
    errors: [] as string[],
    details: {
      expiredStores: [] as Array<{ storeId: number; email: string }>,
      remindersToSend: [] as Array<{
        storeId: number;
        email: string;
        daysLeft: number;
      }>,
    },
  };

  try {
    const now = new Date();
    const todayISO = now.toISOString();

    // ═══════════════════════════════════════════════════════════
    // PARTE 1: Marcar como "expired" los planes vencidos
    // ═══════════════════════════════════════════════════════════
    console.log("🔵 [cron] Buscando planes vencidos...");

    const { data: expiredStores, error: expiredError } = await supabaseAdmin
      .from("stores")
      .select("store_id, user_id, plan_active_until")
      .eq("plan_status", "active")
      .lt("plan_active_until", todayISO);

    if (expiredError) {
      console.error("❌ [cron] Error buscando vencidos:", expiredError);
      report.errors.push(`Buscar vencidos: ${expiredError.message}`);
    } else if (expiredStores && expiredStores.length > 0) {
      console.log(`🔵 [cron] Encontradas ${expiredStores.length} tiendas vencidas`);

      for (const store of expiredStores) {
        try {
          // Traer email del usuario
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
            store.user_id
          );
          const email = userData?.user?.email || "sin-email";

          // Marcar como expirado
          const { error: updateError } = await supabaseAdmin
            .from("stores")
            .update({
              plan_status: "expired",
              updated_at: todayISO,
            })
            .eq("store_id", store.store_id);

          if (updateError) {
            console.error(
              `❌ [cron] Error marcando expirado store ${store.store_id}:`,
              updateError
            );
            report.errors.push(
              `Expirar store ${store.store_id}: ${updateError.message}`
            );
          } else {
            report.expired++;
            report.details.expiredStores.push({
              storeId: store.store_id,
              email,
            });
            console.log(`✅ [cron] Store ${store.store_id} (${email}) marcada como expired`);
          }
        } catch (err: any) {
          console.error("❌ [cron] Error procesando expirado:", err);
          report.errors.push(`Store ${store.store_id}: ${err.message}`);
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // PARTE 2: Enviar recordatorios (3 días y 1 día antes)
    // ═══════════════════════════════════════════════════════════
    for (const daysBeforeExpiry of REMINDER_DAYS) {
      console.log(`🔵 [cron] Buscando planes que vencen en ${daysBeforeExpiry} días...`);

      // Calculamos el rango: entre inicio y fin del día target
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + daysBeforeExpiry);

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: expiringStores, error: expiringError } = await supabaseAdmin
        .from("stores")
        .select("store_id, user_id, plan_active_until, months_active")
        .eq("plan_status", "active")
        .gte("plan_active_until", startOfDay.toISOString())
        .lte("plan_active_until", endOfDay.toISOString());

      if (expiringError) {
        console.error(`❌ [cron] Error buscando (${daysBeforeExpiry}d):`, expiringError);
        report.errors.push(
          `Buscar próximos a vencer (${daysBeforeExpiry}d): ${expiringError.message}`
        );
        continue;
      }

      if (!expiringStores || expiringStores.length === 0) {
        console.log(`  ℹ️ [cron] No hay planes que venzan en ${daysBeforeExpiry} días`);
        continue;
      }

      console.log(
        `🔵 [cron] Encontradas ${expiringStores.length} tiendas que vencen en ${daysBeforeExpiry} días`
      );

      for (const store of expiringStores) {
        report.checked++;

        try {
          // Traer email del usuario
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
            store.user_id
          );
          const email = userData?.user?.email || "sin-email";

          const sent = await sendPlanExpiringAlert({
            customerEmail: email,
            storeId: store.store_id,
            daysLeft: daysBeforeExpiry,
            planEndDate: store.plan_active_until,
            monthsActive: store.months_active || 0,
          });

          if (sent) {
            report.remindersSent++;
            report.details.remindersToSend.push({
              storeId: store.store_id,
              email,
              daysLeft: daysBeforeExpiry,
            });
            console.log(
              `✅ [cron] Recordatorio enviado: ${email} (${daysBeforeExpiry}d)`
            );
          } else {
            report.remindersFailed++;
            report.errors.push(
              `Email falló para store ${store.store_id} (${email})`
            );
          }
        } catch (err: any) {
          console.error("❌ [cron] Error procesando recordatorio:", err);
          report.errors.push(`Recordatorio store ${store.store_id}: ${err.message}`);
          report.remindersFailed++;
        }
      }
    }

    console.log("✅ [cron] FINALIZADO. Reporte:", JSON.stringify(report));

    return NextResponse.json({
      success: true,
      timestamp: todayISO,
      report,
    });
  } catch (error: any) {
    console.error("❌ [cron] CATCH:", error);
    return NextResponse.json(
      {
        error: `Error interno: ${error?.message || "desconocido"}`,
        report,
      },
      { status: 500 }
    );
  }
      }
