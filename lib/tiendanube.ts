// lib/tiendanube.ts
"use server";

const API_BASE = "https://api.tiendanube.com/v1";

function getHeaders(accessToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
    "User-Agent": "Nevux (37382 - soportenevux@gmail.com)",
    "Content-Type": "application/json",
  };
}

// Helper: Tiendanube devuelve name como string o como objeto { "es": "...", "pt": "..." }
function normalizeName(name: string | Record<string, string> | null | undefined): string {
  if (!name) return "";
  if (typeof name === "string") return name;
  return name.es || name.pt || name.en || Object.values(name)[0] || "";
}

export interface TiendanubeVariant {
  id: number;
  price: string;
  promotional_price?: string | null;
  stock?: number | null;
}

export interface TiendanubeImage {
  id: number;
  src: string;
}

export interface TiendanubeCategory {
  id?: number;
  name?: string | Record<string, string>;
}

export interface TiendanubeRawProduct {
  id: number;
  name: string | Record<string, string>;
  slug?: string | Record<string, string>;
  description?: string | Record<string, string>;
  variants?: TiendanubeVariant[];
  images?: TiendanubeImage[];
  categories?: TiendanubeCategory[];
}

export interface TiendanubeProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  variants: TiendanubeVariant[];
  images: TiendanubeImage[];
  categories?: Array<{ id?: number; name?: string }>;
}

export interface TiendanubeStoreInfo {
  id: number;
  name: string | Record<string, string>;
  url?: string;
  email?: string;
  customer_email?: string;
  currency?: string;
  country?: string;
}

// ─── Conteo de Productos ───

export async function getProductsCount(
  storeId: number,
  accessToken: string
): Promise<number> {
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
  } catch (err: unknown) {
    console.error("Error fetching products count:", err);
    return 0;
  }
}

// ─── Listado de Productos ───

export async function getProducts(
  storeId: number,
  accessToken: string,
  query?: string
): Promise<TiendanubeProduct[]> {
  const url = new URL(`${API_BASE}/${storeId}/products`);
  url.searchParams.set("per_page", "50");
  if (query) {
    url.searchParams.set("q", query);
  }

  const res = await fetch(url.toString(), {
    headers: getHeaders(accessToken),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Tiendanube getProducts error:", res.status, res.statusText);
    throw new Error("Error al obtener productos de Tiendanube");
  }

  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error("Tiendanube getProducts: response is not array", data);
    throw new Error("Respuesta inválida de Tiendanube");
  }

  const rawProducts: TiendanubeRawProduct[] = data;

  return rawProducts.map((p) => ({
    id: p.id,
    name: normalizeName(p.name),
    slug: typeof p.slug === "string" ? p.slug : normalizeName(p.slug),
    description:
      typeof p.description === "string"
        ? p.description
        : normalizeName(p.description),
    variants: p.variants || [],
    images: p.images || [],
    categories: (p.categories || []).map((cat) => ({
      id: cat.id,
      name: normalizeName(cat.name),
    })),
  }));
}

// ─── Producto Individual ───

export async function getProduct(
  storeId: number,
  accessToken: string,
  productId: number
): Promise<TiendanubeProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/${storeId}/products/${productId}`, {
      headers: getHeaders(accessToken),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: TiendanubeRawProduct = await res.json();
    return {
      id: data.id,
      name: normalizeName(data.name),
      slug: typeof data.slug === "string" ? data.slug : normalizeName(data.slug),
      description:
        typeof data.description === "string"
          ? data.description
          : normalizeName(data.description),
      variants: data.variants || [],
      images: data.images || [],
      categories: (data.categories || []).map((cat) => ({
        id: cat.id,
        name: normalizeName(cat.name),
      })),
    };
  } catch (err: unknown) {
    console.error("Error en getProduct:", err);
    return null;
  }
}

// ─── Información de la Tienda ───

export async function getStoreInfo(
  storeId: number,
  accessToken: string
): Promise<TiendanubeStoreInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/${storeId}/store`, {
      headers: getHeaders(accessToken),
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err: unknown) {
    console.error("Error en getStoreInfo:", err);
    return null;
  }
  }
