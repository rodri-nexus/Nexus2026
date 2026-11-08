import type { Cliente } from "./clientes";
import { planDe } from "./planes";

// Plan propio de Mercado Pago por cliente (cobro.planPropio): cada cliente paga su propio plan
// ("Nevux Premium · Hogar Digital (hogar-digital)"), así la suscripción se identifica sola y su tienda
// se prende cuando paga, sin cargar su email. El plan se crea la primera vez que el cliente abre nevux.ar/suscribirme?c=<id>.

const MP_API = process.env.MP_API_BASE || "https://api.mercadopago.com";

export type PlanMp = { id: string; reason: string; status: string; init_point?: string; auto_recurring?: { transaction_amount?: number } };

async function mp<T>(ruta: string, init?: RequestInit): Promise<T> {
  const r = await fetch(MP_API + ruta, {
    ...init,
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Mercado Pago respondió ${r.status} en ${ruta}`);
  return r.json() as Promise<T>;
}

// Nombre del plan que ve el cliente en Mercado Pago ("Nevux Premium · Hogar Digital"). Identifica al cliente.
// Los primeros planes (03/11) llevaban además "(id)" al final: también se reconocen.
const marca = (id: string) => `(${id})`;
const tiendaDe = (c: Cliente) => c.nombre.replace(/\s*\(.*\)\s*$/, "");
const nombrePlan = (c: Cliente) => `${planDe(undefined, c.plan).nombre} · ${tiendaDe(c)}`;

// Todos los planes propios de un cliente (puede haber más de uno si cambió el precio)
export async function planesDelCliente(id: string, c?: Cliente): Promise<PlanMp[]> {
  const nombre = c ? nombrePlan(c) : null;
  const res: PlanMp[] = [];
  for (let offset = 0; offset < 1000; offset += 100) {
    const r = await mp<{ results?: PlanMp[]; paging?: { total?: number } }>(`/preapproval_plan/search?limit=100&offset=${offset}`);
    const lista = r.results || [];
    res.push(...lista.filter((p) => (p.reason || "").endsWith(marca(id)) || (nombre !== null && (p.reason || "").trim() === nombre)));
    if (lista.length < 100) break;
  }
  return res;
}

// Link de pago del plan propio del cliente: usa el que ya existe con el precio actual o lo crea
export async function linkPlanPropio(id: string, c: Cliente): Promise<string> {
  const plan = planDe(undefined, c.plan);
  const existentes = await planesDelCliente(id, c);
  const vigente = existentes.find((p) => p.status === "active" && p.reason?.trim() === nombrePlan(c) && p.auto_recurring?.transaction_amount === plan.precio && p.init_point);
  if (vigente?.init_point) return vigente.init_point;
  const nuevo = await mp<PlanMp>("/preapproval_plan", {
    method: "POST",
    body: JSON.stringify({
      reason: nombrePlan(c),
      auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: plan.precio, currency_id: "ARS" },
      back_url: "https://nevux.ar/gracias",
    }),
  });
  if (!nuevo.init_point) throw new Error("Mercado Pago no devolvió el link del plan");
  return nuevo.init_point;
}
