// lib/tiendanube.ts

const TIENDANUBE_API_BASE = "https://api.tiendanube.com/v1";
const USER_AGENT = "Nevux (soporte@nevux.app)";

// Tipos de datos
export type StoreInfo = {
  id: number;
  name: {
    es?: string;
    en?: string;
    pt?: string;
  };
  url: string;
  country: string;
  main_language: string;
  main_currency: string;
  logo?: string;
  email?: string;
  business_name?: string;
};

// ============================================
// Función 1: Traer info de la tienda
// ============================================
export async function getStoreInfo(
  storeId: number,
  accessToken: string
): Promise<StoreInfo | null> {
  try {
    const response = await fetch(
      `${TIENDANUBE_API_BASE}/${storeId}/store`,
      {
        method: "GET",
        headers: {
          "Authentication": `bearer ${accessToken}`,
          "User-Agent": USER_AGENT,
          "Content-Type": "application/json",
        },
        // Cache 5 minutos para no saturar la API
        next: { revalidate: 300 },
      }
    );

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
          "Authentication": `bearer ${accessToken}`,
          "User-Agent": USER_AGENT,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error(
        "Error al traer cantidad de productos:",
        response.status
      );
      return 0;
    }

    // Tiendanube devuelve el total en el header 'x-total-count'
    const totalCount = response.headers.get("x-total-count");
    return totalCount ? parseInt(totalCount, 10) : 0;
  } catch (error) {
    console.error("Error en getProductsCount:", error);
    return 0;
  }
}

// ============================================
// Helper: Obtener el nombre principal de la tienda
// ============================================
export function getStoreName(storeInfo: StoreInfo | null): string {
  if (!storeInfo) return "Mi tienda";

  // Intenta en este orden: español, inglés, portugués, business_name
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
  // Remover https:// para display
  return storeInfo.url.replace(/^https?:\/\//, "");
          }
