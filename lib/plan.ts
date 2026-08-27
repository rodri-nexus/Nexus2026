// lib/plan.ts
// ─────────────────────────────────────────────
// Sistema de planes de Nevux
// Funciones puras + server-side para calcular
// el estado real del plan de cada usuario.
// ─────────────────────────────────────────────

import { supabaseAdmin } from "@/lib/supabase";

// ─── TIPOS ───────────────────────────────────

export type RawPlanStatus =
  | "trial"
  | "feedback_pending"
  | "active"
  | "expired"
  | "cancelled";

export type PlanStatus =
  | "trial"
  | "trial_ending_soon"
  | "feedback_pending"
  | "active"
  | "expiring_soon"
  | "expired"
  | "cancelled";

export interface StorePlanData {
  store_id: number;
  user_id: string | null;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  plan_status: RawPlanStatus | null;
  plan_active_until: string | null;
  last_payment_at: string | null;
  months_active: number | null;
  feedback_shown: boolean | null;
}

export interface PlanInfo {
  status: PlanStatus;
  rawStatus: RawPlanStatus;
  isBlocked: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  trialEndsAt: Date | null;
  planActiveUntil: Date | null;
  monthsActive: number;
  needsFeedback: boolean;
  needsPayment: boolean;
  canUseApp: boolean;
  canCreateWidgets: boolean;
}

// ─── CONSTANTES ──────────────────────────────

export const TRIAL_DURATION_DAYS = 7;
export const PLAN_DURATION_DAYS = 30;
export const PLAN_PRICE_ARS = 30000;
export const TRIAL_WARNING_DAYS = 2;
export const PLAN_WARNING_DAYS = 3;

// ─── FUNCIONES PURAS (SIN SUPABASE) ──────────

/**
 * Calcula el estado REAL del plan basándose en las fechas.
 * No confía en `plan_status` de la BD porque puede estar desactualizado.
 */
export function calculatePlanStatus(store: StorePlanData): PlanStatus {
  const now = new Date();

  // Sin datos de trial: nunca conectó tienda o error → tratamos como expired
  if (!store.trial_started_at || !store.trial_ends_at) {
    return "expired";
  }

  // Si canceló manualmente
  if (store.plan_status === "cancelled") {
    return "cancelled";
  }

  // Si tiene plan pago activo y NO expiró
  if (store.plan_status === "active" && store.plan_active_until) {
    const planEnd = new Date(store.plan_active_until);
    if (planEnd > now) {
      const daysLeft = getDaysBetween(now, planEnd);
      if (daysLeft <= PLAN_WARNING_DAYS) {
        return "expiring_soon";
      }
      return "active";
    }
    // Plan pago expirado
    return "expired";
  }

  // Si el estado de la BD dice que ya mostramos el feedback
  if (store.plan_status === "feedback_pending") {
    return "feedback_pending";
  }

  // Si el estado dice trial, verificamos las fechas
  const trialEnd = new Date(store.trial_ends_at);

  if (trialEnd > now) {
    // Trial vigente
    const daysLeft = getDaysBetween(now, trialEnd);
    if (daysLeft <= TRIAL_WARNING_DAYS) {
      return "trial_ending_soon";
    }
    return "trial";
  }

  // Trial venció → tiene que mostrar feedback
  return "feedback_pending";
}

/**
 * Cantidad de días restantes (redondeado hacia arriba).
 * Devuelve 0 si ya expiró.
 */
export function getRemainingDays(store: StorePlanData): number {
  const now = new Date();

  // Si tiene plan pago activo
  if (store.plan_status === "active" && store.plan_active_until) {
    const planEnd = new Date(store.plan_active_until);
    return Math.max(0, getDaysBetween(now, planEnd));
  }

  // Sino, contamos días de trial
  if (!store.trial_ends_at) return 0;
  const trialEnd = new Date(store.trial_ends_at);
  return Math.max(0, getDaysBetween(now, trialEnd));
}

/**
 * Cantidad de HORAS restantes (útil para el último día).
 * Devuelve 0 si ya expiró.
 */
export function getRemainingHours(store: StorePlanData): number {
  const now = new Date();

  if (store.plan_status === "active" && store.plan_active_until) {
    const planEnd = new Date(store.plan_active_until);
    const diffMs = planEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));
  }

  if (!store.trial_ends_at) return 0;
  const trialEnd = new Date(store.trial_ends_at);
  const diffMs = trialEnd.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));
}

/**
 * ¿Puede usar la app? (crear/editar widgets)
 */
export function canUseApp(status: PlanStatus): boolean {
  return (
    status === "trial" ||
    status === "trial_ending_soon" ||
    status === "active" ||
    status === "expiring_soon"
  );
}

/**
 * ¿La app está bloqueada por paywall?
 */
export function isAppBlocked(status: PlanStatus): boolean {
  return (
    status === "feedback_pending" ||
    status === "expired" ||
    status === "cancelled"
  );
}

/**
 * ¿Necesita mostrar la pregunta "¿te gustó?"?
 */
export function needsFeedback(store: StorePlanData): boolean {
  const status = calculatePlanStatus(store);
  return status === "feedback_pending" && !store.feedback_shown;
}

/**
 * ¿Necesita pagar? (feedback ya respondido O plan expirado)
 */
export function needsPayment(store: StorePlanData): boolean {
  const status = calculatePlanStatus(store);
  return (
    (status === "feedback_pending" && store.feedback_shown === true) ||
    status === "expired" ||
    status === "cancelled"
  );
}

/**
 * Construye el objeto completo con toda la info del plan.
 * Es lo que consumen las páginas y middleware.
 */
export function buildPlanInfo(store: StorePlanData): PlanInfo {
  const status = calculatePlanStatus(store);
  const rawStatus: RawPlanStatus =
    store.plan_status || (status === "expired" ? "expired" : "trial");

  return {
    status,
    rawStatus,
    isBlocked: isAppBlocked(status),
    daysRemaining: getRemainingDays(store),
    hoursRemaining: getRemainingHours(store),
    trialEndsAt: store.trial_ends_at ? new Date(store.trial_ends_at) : null,
    planActiveUntil: store.plan_active_until
      ? new Date(store.plan_active_until)
      : null,
    monthsActive: store.months_active || 0,
    needsFeedback: needsFeedback(store),
    needsPayment: needsPayment(store),
    canUseApp: canUseApp(status),
    canCreateWidgets: canUseApp(status),
  };
}

// ─── HELPER INTERNO ──────────────────────────

/**
 * Días entre 2 fechas (redondeado hacia arriba).
 */
function getDaysBetween(from: Date, to: Date): number {
  const diffMs = to.getTime() - from.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

// ─── FUNCIONES SERVER-SIDE (CON SUPABASE) ────

/**
 * Trae el estado completo del plan del usuario logueado.
 * Devuelve null si no tiene tienda vinculada.
 */
export async function getPlanForUser(
  userId: string
): Promise<{ store: StorePlanData; plan: PlanInfo } | null> {
  const { data: store, error } = await supabaseAdmin
    .from("stores")
    .select(
      "store_id, user_id, trial_started_at, trial_ends_at, plan_status, plan_active_until, last_payment_at, months_active, feedback_shown"
    )
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error trayendo plan del usuario:", error);
    return null;
  }

  if (!store) {
    return null;
  }

  const plan = buildPlanInfo(store as StorePlanData);
  return { store: store as StorePlanData, plan };
}

/**
 * Verifica de forma estricta si una tienda (por store_id) tiene el plan/trial vigente.
 * Retorna FALSE si el trial de 7 días o el plan pago expiró.
 */
export async function isStorePlanActive(
  storeId: number | string
): Promise<boolean> {
  try {
    const cleanStoreId = String(storeId).trim();
    const { data: store, error } = await supabaseAdmin
      .from("stores")
      .select(
        "store_id, user_id, trial_started_at, trial_ends_at, plan_status, plan_active_until, last_payment_at, months_active, feedback_shown, is_active"
      )
      .eq("store_id", cleanStoreId)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !store) {
      return false;
    }

    const plan = buildPlanInfo(store as StorePlanData);
    return plan.canUseApp;
  } catch (err) {
    console.error("Error verificando vencimiento de tienda:", err);
    return false;
  }
}

/**
 * Sincroniza el `plan_status` de la BD con el estado real calculated.
 */
export async function syncPlanStatusIfNeeded(
  store: StorePlanData
): Promise<void> {
  const realStatus = calculatePlanStatus(store);

  let dbStatus: RawPlanStatus;

  if (realStatus === "trial" || realStatus === "trial_ending_soon") {
    dbStatus = "trial";
  } else if (realStatus === "active" || realStatus === "expiring_soon") {
    dbStatus = "active";
  } else if (realStatus === "feedback_pending") {
    dbStatus = "feedback_pending";
  } else if (realStatus === "cancelled") {
    dbStatus = "cancelled";
  } else {
    dbStatus = "expired";
  }

  if (store.plan_status !== dbStatus) {
    console.log(
      `🔄 Sincronizando plan: ${store.plan_status} → ${dbStatus} (store ${store.store_id})`
    );

    const { error } = await supabaseAdmin
      .from("stores")
      .update({
        plan_status: dbStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("store_id", store.store_id);

    if (error) {
      console.error("Error sincronizando plan_status:", error);
    }
  }
}

/**
 * Formatea el precio en pesos argentinos con separadores.
 * Ej: 30000 → "$30.000"
 */
export function formatPrice(amount: number = PLAN_PRICE_ARS): string {
  return `$${amount.toLocaleString("es-AR")}`;
}
