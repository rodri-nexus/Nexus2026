import type { Cliente } from "./clientes";

// Estado de cobro de un cliente: decide si su tienda se prende o se apaga
export type EstadoCobro = {
  prendida: boolean;
  motivo: string;
  // Datos de la suscripción para el panel (cuando el cobro es por Mercado Pago)
  suscripcion?: { id: string; estado: string; ultimoCobro: string | null; proximoCobro: string | null };
};

const MP_API = process.env.MP_API_BASE || "https://api.mercadopago.com";
const DIA = 24 * 60 * 60 * 1000;

type Preapproval = {
  id: string;
  status: string;
  date_created?: string;
  next_payment_date?: string;
  summarized?: { last_charged_date?: string | null };
};

async function mp<T>(ruta: string): Promise<T> {
  const r = await fetch(MP_API + ruta, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Mercado Pago respondió ${r.status} en ${ruta}`);
  return r.json() as Promise<T>;
}

// Busca la suscripción del cliente: por ID si está, si no por el email con el que se suscribió (la más reciente)
async function buscarSuscripcion(id?: string, email?: string): Promise<Preapproval | null> {
  if (id) return mp<Preapproval>(`/preapproval/${encodeURIComponent(id)}`);
  if (!email) return null;
  const r = await mp<{ results?: Preapproval[] }>(`/preapproval/search?payer_email=${encodeURIComponent(email)}&limit=50`);
  const lista = (r.results || []).slice().sort((a, b) => (b.date_created || "").localeCompare(a.date_created || ""));
  return lista.find((s) => s.status === "authorized") || lista[0] || null;
}

export async function estadoCobro(c: Cliente, ahora = Date.now()): Promise<EstadoCobro> {
  if (!c.activo) return { prendida: false, motivo: "Apagada a mano (activo: false)" };
  if (c.cobro.tipo === "manual") return { prendida: true, motivo: "Cobro manual: prendida a mano" };

  // Si algo falla del lado de Mercado Pago, la tienda queda prendida: nunca se apaga por un error nuestro
  if (!process.env.MP_ACCESS_TOKEN) return { prendida: true, motivo: "Falta MP_ACCESS_TOKEN: no se puede consultar Mercado Pago (queda prendida)" };
  let s: Preapproval | null;
  try {
    s = await buscarSuscripcion(c.cobro.suscripcion, c.cobro.email);
  } catch (e) {
    return { prendida: true, motivo: `No se pudo consultar Mercado Pago (queda prendida): ${(e as Error).message}` };
  }
  if (!s) return { prendida: false, motivo: "No se encontró ninguna suscripción en Mercado Pago" };

  const gracia = (c.cobro.gracia ?? 5) * DIA;
  const ultimo = s.summarized?.last_charged_date || null;
  const datos = { id: s.id, estado: s.status, ultimoCobro: ultimo, proximoCobro: s.next_payment_date || null };

  if (s.status !== "authorized") {
    const nombres: Record<string, string> = { paused: "pausada", cancelled: "cancelada", pending: "pendiente de pago" };
    return { prendida: false, motivo: `Suscripción ${nombres[s.status] || s.status}`, suscripcion: datos };
  }
  // Activa: tiene que haber cobrado en el último mes (más la gracia). Si todavía no cobró nunca, se cuenta desde el alta
  const desde = Date.parse(ultimo || s.date_created || "");
  if (!isNaN(desde) && ahora - desde > (ultimo ? 31 * DIA : 0) + gracia) {
    return { prendida: false, motivo: ultimo ? "El último cobro tiene más de un mes: pago vencido" : "La suscripción todavía no cobró", suscripcion: datos };
  }
  return { prendida: true, motivo: "Al día con Mercado Pago", suscripcion: datos };
}

// Estado de la conexión con Mercado Pago, para el panel: a qué cuenta apunta el token y cuántas suscripciones activas hay
export async function estadoConexion(): Promise<{ ok: boolean; texto: string }> {
  if (!process.env.MP_ACCESS_TOKEN) return { ok: false, texto: "Falta cargar MP_ACCESS_TOKEN en Vercel" };
  try {
    const yo = await mp<{ id: number; nickname?: string; email?: string }>("/users/me");
    const activas = await mp<{ paging?: { total?: number } }>("/preapproval/search?status=authorized&limit=1");
    const cuenta = yo.nickname || yo.email || String(yo.id);
    return { ok: true, texto: `Conectado a Mercado Pago (${cuenta}) · ${activas.paging?.total ?? 0} suscripciones activas` };
  } catch (e) {
    return { ok: false, texto: `El token no funciona: ${(e as Error).message}` };
  }
}
