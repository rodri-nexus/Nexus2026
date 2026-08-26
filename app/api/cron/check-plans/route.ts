// app/api/cron/check-plans/route.ts
// Cron job diario / ejecutable manualmente para verificar vencimientos.
// - Detecta pruebas gratis de 7 días vencidas (trial)
// - Detecta planes mensuales vencidos (active)
// - Marca las tiendas como "expired" y envía alertas por email.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendPlanExpiringAlert } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Días antes del vencimiento en los que enviamos email de aviso
const REMINDER_DAYS = [3, 1];

/**
 * Calcula la fecha exacta de vencimiento de una tienda.
 * Si está en trial: installed_at + 7 días (o trial_ends_at)
 * Si está en plan activo: plan_active_until
 */
function getExpirationDate(store: {
  plan_status: string | null;
  installed_at: string | null;
  plan_active_until: string | null;
  trial_ends_at?: string | null;
}): Date | null {
  if (store.plan_status === "active" || store.plan_status === "expiring_soon") {
    return store.plan_active_until ? new Date(store.plan_active_until) : null;
  }

  // Si es trial, trial_ending_soon o null (default trial)
  if (store.trial_ends_at) {
    return new Date(store.trial_ends_at);
  }

  if (store.installed_at) {
    const installed = new Date(store.installed_at);
    installed.setDate(installed.getDate() + 7); // 7 días de prueba gratis
    return installed;
  }

  return null;
}

export async function GET(request: Request) {
  console.log("🔵 [cron/check-plans] INICIO");

  // 1. Verificar CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    console.error("❌ [cron] CRON_SECRET no configurado");
    return NextResponse.json(
      { error: "CRON_SECRET no configurado en el servidor" },
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

  const report = {
    expired: 0,
    remindersSent: 0,
    remindersFailed: 0,
    checked: 0,
    errors: [] as string[],
    details: {
      expiredStores: [] as Array<{ storeId: number; email: string; reason: string }>,
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
    // PARTE 1: Marcar como "expired" los trials y planes vencidos + ENVIAR EMAIL DE EXPIRACIÓN
    // ═══════════════════════════════════════════════════════════
    console.log("🔵 [cron] Buscando tiendas que no estén expiradas...");

    const { data: candidateStores, error: fetchError } = await supabaseAdmin
      .from("stores")
      .select("store_id, user_id, installed_at, plan_status, plan_active_until, trial_ends_at, months_active")
      .neq("plan_status", "expired")
      .eq("is_active", true);

    if (fetchError) {
      console.error("❌ [cron] Error buscando candidatos:", fetchError);
      report.errors.push(`Buscar tiendas: ${fetchError.message}`);
    } else if (candidateStores && candidateStores.length > 0) {
      console.log(`🔵 [cron] Analizando ${candidateStores.length} tiendas activas/trial`);

      for (const store of candidateStores) {
        report.checked++;
        const expDate = getExpirationDate(store);

        // Si la fecha de vencimiento ya pasó
        if (expDate && expDate.getTime() < now.getTime()) {
          try {
            const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
              store.user_id
            );
            const email = userData?.user?.email || "sin-email";
            const reason = store.plan_status === "active" ? "Plan mensual vencido" : "Trial 7 días vencido";

            // Marcar como expirado en Supabase
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
                reason,
              });

              // ENVIAR EMAIL ALERTA DE EXPIRACIÓN (daysLeft = 0)
              try {
                const sentAlert = await sendPlanExpiringAlert({
                  customerEmail: email,
                  storeId: store.store_id,
                  daysLeft: 0, // 0 significa VENCIDO / HOY
                  planEndDate: expDate.toISOString(),
                  monthsActive: store.months_active || 0,
                });

                if (sentAlert) {
                  report.remindersSent++;
                  console.log(`✉️ [cron] Email de expiración enviado a ${email}`);
                } else {
                  report.remindersFailed++;
                }
              } catch (mailErr: any) {
                console.error("❌ [cron] Error enviando email de expiración:", mailErr);
              }

              console.log(`✅ [cron] Store ${store.store_id} (${email}) vencida -> marcada como EXPIRED (${reason})`);
            }
          } catch (err: any) {
            console.error("❌ [cron] Error procesando vencimiento:", err);
            report.errors.push(`Store ${store.store_id}: ${err.message}`);
          }
        }
      }
    }

    // ═══════════════════════════════════════════════════════════
    // PARTE 2: Enviar recordatorios previos (3 días y 1 día antes)
    // ═══════════════════════════════════════════════════════════
    if (candidateStores && candidateStores.length > 0) {
      for (const store of candidateStores) {
        const expDate = getExpirationDate(store);
        if (!expDate || expDate.getTime() <= now.getTime()) continue;

        const diffTime = expDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (REMINDER_DAYS.includes(diffDays)) {
          try {
            const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
              store.user_id
            );
            const email = userData?.user?.email || "sin-email";

            const sent = await sendPlanExpiringAlert({
              customerEmail: email,
              storeId: store.store_id,
              daysLeft: diffDays,
              planEndDate: expDate.toISOString(),
              monthsActive: store.months_active || 0,
            });

            if (sent) {
              report.remindersSent++;
              report.details.remindersToSend.push({
                storeId: store.store_id,
                email,
                daysLeft: diffDays,
              });
              console.log(
                `✅ [cron] Recordatorio enviado: ${email} (quedan ${diffDays} días)`
              );
            } else {
              report.remindersFailed++;
              report.errors.push(
                `Email falló para store ${store.store_id} (${email})`
              );
            }
          } catch (err: any) {
            console.error("❌ [cron] Error enviando recordatorio:", err);
            report.errors.push(`Recordatorio store ${store.store_id}: ${err.message}`);
            report.remindersFailed++;
          }
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
