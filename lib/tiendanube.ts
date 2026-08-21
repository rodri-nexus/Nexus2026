"use server";

const API_BASE = "https://api.tiendanube.com/v1";

function getHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": "Nevux (37382 - soportenevux@gmail.com)",
    "Content-Type": "application/json",
  };
}

// Helper: Tiendanube devuelve name como string o como objeto { "es": "...", "pt": "..." }
function normalizeName(name: string | Record<string, string>): string {
  if (typeof name === "string") return name;
  return name["es"] || name["pt"] || name["en"] || Object.values(name)[0] || "";
}

// ─── Productos ───

export async function getProductsCount(storeId: number, accessToken: string) {
  try {
    const res = await fetch(`${API_BASE}/${storeId}/products?per_page=1`, {
      headers: getHeaders(accessToken),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Tiendanube API error (count):", res.status, res.statusText);
      return 0;
    }
    const totalCount = res.headers.get("X-Total-Count");
    if (totalCount) {
      return parseInt(totalCount, 10) || 0;
    }
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch (err) {
    console.error("Error fetching products count:", err);
    return 0;
  }
}

export interface TiendanubeProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  variants: Array<{
    id: number;
    price: string;
    promotional_price?: string | null;
    stock?: number | null;
  }>;
  images: Array<{
    id: number;
    src: string;
  }>;
}

export async function getProducts(
  storeId: number,
  accessToken: string,
  query?: string
): Promise<TiendanubeProduct[]> {
  const url = new URL(`${API_BASE}/${storeId}/products`);
  url.searchParams.set("per_page", "50");
  if (query) url.searchParams.set("q", query);

  const res = await fetch(url.toString(), {
    headers: getHeaders(accessToken),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("Tiendanube getProducts error:", res.status, res.statusText);
    throw new Error("Error al obtener productos");
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error("Tiendanube getProducts: response is not array", data);
    throw new Error("Respuesta inválida de Tiendanube");
  }
  return data.map((p: any) => ({
    ...p,
    name: normalizeName(p.name),
  }));
}

export async function getProduct(
  storeId: number,
  accessToken: string,
  productId: number
): Promise<TiendanubeProduct | null> {
  const res = await fetch(`${API_BASE}/${storeId}/products/${productId}`, {
    headers: getHeaders(accessToken),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    ...data,
    name: normalizeName(data.name),
  };
}

// ─── Store info ───

export async function getStoreInfo(storeId: number, accessToken: string) {
  const res = await fetch(`${API_BASE}/${storeId}/store`, {
    headers: getHeaders(accessToken),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
  }
