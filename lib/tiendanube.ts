// lib/tiendanube.ts

const TIENDANUBE_API_BASE = "https://api.tiendanube.com/v1";
const USER_AGENT = "Nevux (soporte@nevux.app)";

type LocalizedText = {
  es?: string;
  en?: string;
  pt?: string;
};

// Tipos de datos
export type StoreInfo = {
  id: number;
  name: LocalizedText;
  url: string;
  country: string;
  main_language: string;
  main_currency: string;
  logo?: string;
  email?: string;
  business_name?: string;
};

export type StoreProduct = {
  id: number;
  name: string;
  price: string;
  image: string | null;
};

type TiendanubeProductResponse = {
  id: number;
  name?: LocalizedText | string;
  images?: Array<{
    src?: string;
    url?: string;
  }>;
  variants?: Array<{
    price?: string | null;
  }>;
};

function getLocalizedText(value?: LocalizedText | string | null): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return value.es || value.en || value.pt || "";
}

// ============================================
// Función 1: Traer info de la tienda
// ============================================
export async function getStoreInfo(
  storeId: number,
  accessToken: string
): Promise<StoreInfo | null> {
  try {
    const response = await fetch(`${TIENDANUBE_API_BASE}/${storeId}/store`, {
      method: "GET",
      headers: {
        Authentication: `bearer ${accessToken}`,
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(
        "Error al traer info de la tienda:",
        response.status,
        await response.text()
      );
      return null;
    }

    const data = await response.json();
    return data as StoreInfo;
  } catch (error) {
    console.error("Error en getStoreInfo:", error);
    return null;
  }
}

// ============================================
// Función 2: Traer cantidad de productos
// ============================================
export async function getProductsCount(
  storeId: number,
  accessToken: string
): Promise<number> {
  try {
    const response = await fetch(
      `${TIENDANUBE_API_BASE}/${storeId}/products?per_page=1&page=1&fields=id`,
      {
        method: "GET",
        headers: {
          Authentication: `bearer ${accessToken}`,
          "User-Agent": USER_AGENT,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error("Error al traer cantidad de productos:", response.status);
      return 0;
    }

    const totalCount = response.headers.get("x-total-count");
    return totalCount ? parseInt(totalCount, 10) : 0;
  } catch (error) {
    console.error("Error en getProductsCount:", error);
    return 0;
  }
}

// ============================================
// Función 3: Traer productos de la tienda
// ============================================
export async function getProducts(
  storeId: number,
  accessToken: string,
  perPage: number = 100
): Promise<StoreProduct[]> {
  try {
    const response = await fetch(
      `${TIENDANUBE_API_BASE}/${storeId}/products?per_page=${perPage}&page=1&published=true`,
      {
        method: "GET",
        headers: {
          Authentication: `bearer ${accessToken}`,
          "User-Agent": USER_AGENT,
          "Content-Type": "application/json",
        },
        // No cacheamos para que el "sincronizar" traiga siempre lo último
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Error al traer productos:",
        response.status,
        await response.text()
      );
      return [];
    }

    const data = (await response.json()) as TiendanubeProductResponse[];

    return data.map((product) => ({
      id: product.id,
      name: getLocalizedText(product.name) || `Producto #${product.id}`,
      price: product.variants?.[0]?.price ?? "0",
      image: product.images?.[0]?.src || product.images?.[0]?.url || null,
    }));
  } catch (error) {
    console.error("Error en getProducts:", error);
    return [];
  }
}

// ============================================
// Helper: Obtener el nombre principal de la tienda
// ============================================
export function getStoreName(storeInfo: StoreInfo | null): string {
  if (!storeInfo) return "Mi tienda";

  return (
    storeInfo.name?.es ||
    storeInfo.name?.en ||
    storeInfo.name?.pt ||
    storeInfo.business_name ||
    "Mi tienda"
  );
}

// ============================================
// Helper: URL limpia de la tienda
// ============================================
export function getStoreUrl(storeInfo: StoreInfo | null): string {
  if (!storeInfo?.url) return "";

  return storeInfo.url.replace(/^https?:\/\//, "");
  }
