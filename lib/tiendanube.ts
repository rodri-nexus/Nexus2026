"use server";

const API_BASE = "https://api.tiendanube.com/v1";

function getHeaders(accessToken: string) {
  return {
    Authentication: `bearer ${accessToken}`,
    "User-Agent": "Nevux (nevux.app)",
    "Content-Type": "application/json",
  };
}

// ─── Productos ───

export async function getProductsCount(storeId: number, accessToken: string) {
  try {
    const res = await fetch(`${API_BASE}/${storeId}/products/count`, {
      headers: getHeaders(accessToken),
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.count || 0;
  } catch {
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
  url.searchParams.set(
    "fields",
    "id,name,slug,description,variants,id,price,promotional_price,stock,images,id,src"
  );
  if (query) url.searchParams.set("q", query);

  const res = await fetch(url.toString(), {
    headers: getHeaders(accessToken),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
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
  return res.json();
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
