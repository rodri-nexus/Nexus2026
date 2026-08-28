"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package,
  RefreshCw,
  Search,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import SideMenu from "../dashboard/components/SideMenu";
import CentroAyuda from "../dashboard/components/CentroAyuda";

interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

interface ProductImage {
  id: number;
  src: string;
}

interface ProductVariant {
  id: number;
  price: string;
  promotional_price?: string | null;
  stock?: number | null;
}

interface ProductCategory {
  id?: number;
  name?: string;
}

interface ProductItem {
  id: number;
  name: string;
  slug?: string;
  categories?: ProductCategory[];
  variants?: ProductVariant[];
  images?: ProductImage[];
}

interface ProductosClientProps {
  email: string;
  store: StoreData | null;
  productsCount: number;
}

// Helper para formatear dinero en ARS fuera del ciclo de render
function formatMoney(val: string | number | null | undefined): string {
  if (!val) return "$ 0";
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return String(val);
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(num);
}

export default function ProductosClient({
  email,
  store,
  productsCount: initialProductsCount,
}: ProductosClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Carga de productos desde la API blindada
  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
    if (!store?.store_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?storeId=${store.store_id}`, {
        signal,
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        console.error("Error al obtener productos:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [store?.store_id]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  // Manejo de sincronización manual
  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    await fetchProducts();
    setSyncing(false);
  };

  // Filtrado de productos memoizado
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) => {
      const nameMatch = (p.name || "").toLowerCase().includes(q);
      const idMatch = p.id.toString().includes(q);
      return nameMatch || idMatch;
    });
  }, [products, searchQuery]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#000000",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <DashboardHeader email={email} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.25rem 3rem",
          boxSizing: "border-box",
        }}
      >
        {/* Volver al dashboard */}
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.85rem",
            color: "#000000",
            opacity: 0.6,
            textDecoration: "none",
            marginBottom: "1rem",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} />
          Volver al dashboard
        </Link>

        {/* Encabezado Principal */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.35rem 0.85rem",
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  color: "#059669",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                <Sparkles size={13} color="#10B981" />
                Catálogo En Vivo
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                Productos Sincronizados
              </h1>
              <p
                style={{
                  margin: "0.4rem 0 0",
                  fontSize: "0.95rem",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                {store
                  ? `Tenés ${products.length || initialProductsCount} ${
                      (products.length || initialProductsCount) === 1
                        ? "producto activo"
                        : "productos activos"
                    } sincronizados con Tiendanube.`
                  : "Conectá tu Tiendanube para ver tu catálogo."}
              </p>
            </div>

            {store && (
              <button
                type="button"
                onClick={handleSync}
                disabled={syncing || loading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.4rem",
                  borderRadius: "999px",
                  border: "none",
                  background: "#10B981",
                  opacity: syncing || loading ? 0.7 : 1,
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  cursor: syncing || loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
              >
                <RefreshCw
                  size={15}
                  className={syncing || loading ? "animate-spin" : ""}
                />
                {syncing
                  ? "Sincronizando..."
                  : loading
                  ? "Cargando..."
                  : "Sincronizar Productos"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Barra de Búsqueda */}
        {store && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <div style={{ position: "relative", maxWidth: "480px" }}>
              <Search
                size={18}
                color="#10B981"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Buscar producto por nombre o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 2.5rem 0.75rem 2.6rem",
                  fontSize: "0.9rem",
                  borderRadius: "14px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  outline: "none",
                  boxSizing: "border-box",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  color: "#000000",
                  fontWeight: 600,
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={16} color="#000000" style={{ opacity: 0.5 }} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Tablero de Productos */}
        {!store ? (
          /* Estado sin tienda */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "#ecfdf5",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <Package size={30} color="#10B981" />
            </div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "#000000",
                margin: "0 0 0.5rem",
              }}
            >
              Sin tienda conectada
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#000000", opacity: 0.6, margin: 0 }}>
              Instalá Nevux en tu Tiendanube para importar tu catálogo automáticamente.
            </p>
          </motion.div>
        ) : loading ? (
          /* Estado de Carga (Skeletons) */
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  height: "56px",
                  background: "#f3f4f6",
                  borderRadius: "12px",
                }}
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Estado sin resultados */
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <Package size={40} color="#10B981" style={{ marginBottom: "0.75rem", opacity: 0.6 }} />
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.25rem", color: "#000" }}>
              {searchQuery ? "No se encontraron productos" : "No hay productos disponibles"}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#000000", opacity: 0.5, margin: 0 }}>
              {searchQuery
                ? `Intentá buscar con otros términos distintos a "${searchQuery}".`
                : "Asegurate de tener productos creados y visibles en tu Tiendanube."}
            </p>
          </div>
        ) : (
          /* TABLA DE PRODUCTOS OFICIAL */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                  fontSize: "0.88rem",
                  minWidth: "720px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                      color: "#000000",
                    }}
                  >
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6, width: "80px" }}>
                      Imagen
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6 }}>
                      Producto
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6 }}>
                      Categoría
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6 }}>
                      Precio
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6 }}>
                      Stock
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6, textAlign: "center" }}>
                      Nevux Widgets
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, idx) => {
                    const mainVariant = p.variants?.[0];
                    const mainImg = p.images?.[0]?.src;
                    const price = mainVariant?.price;
                    const promoPrice = mainVariant?.promotional_price;
                    const stock = mainVariant?.stock;

                    return (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom:
                            idx === filteredProducts.length - 1
                              ? "none"
                              : "1px solid #f3f4f6",
                          transition: "background 0.15s ease",
                        }}
                      >
                        {/* Imagen */}
                        <td style={{ padding: "0.85rem 1.25rem" }}>
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "10px",
                              background: "#f3f4f6",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #e5e7eb",
                            }}
                          >
                            {mainImg ? (
                              <img
                                src={mainImg}
                                alt={p.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <ImageIcon size={20} color="#000000" style={{ opacity: 0.3 }} />
                            )}
                          </div>
                        </td>

                        {/* Nombre e ID */}
                        <td style={{ padding: "0.85rem 1.25rem" }}>
                          <div style={{ fontWeight: 700, color: "#000000", fontSize: "0.92rem" }}>
                            {p.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#000000",
                              opacity: 0.45,
                              fontFamily: "monospace",
                              marginTop: "2px",
                            }}
                          >
                            ID: {p.id}
                          </div>
                        </td>

                        {/* Categorías */}
                        <td style={{ padding: "0.85rem 1.25rem", color: "#000000", opacity: 0.7 }}>
                          {p.categories && p.categories.length > 0 ? (
                            <span
                              style={{
                                background: "#f3f4f6",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                              }}
                            >
                              {p.categories[0]?.name || "General"}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* Precios */}
                        <td style={{ padding: "0.85rem 1.25rem" }}>
                          {promoPrice ? (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#000000",
                                  opacity: 0.4,
                                  textDecoration: "line-through",
                                }}
                              >
                                {formatMoney(price)}
                              </span>
                              <span style={{ fontWeight: 800, color: "#059669", fontSize: "0.95rem" }}>
                                {formatMoney(promoPrice)}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontWeight: 800, color: "#000000", fontSize: "0.92rem" }}>
                              {formatMoney(price)}
                            </span>
                          )}
                        </td>

                        {/* Stock */}
                        <td style={{ padding: "0.85rem 1.25rem" }}>
                          {stock === null || stock === undefined ? (
                            <span style={{ fontSize: "0.8rem", color: "#000000", opacity: 0.5 }}>
                              Sin límite
                            </span>
                          ) : stock > 0 ? (
                            <span
                              style={{
                                fontSize: "0.78rem",
                                color: "#059669",
                                fontWeight: 700,
                                background: "#ecfdf5",
                                padding: "3px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              {stock} unid.
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "0.78rem",
                                color: "#dc2626",
                                fontWeight: 700,
                                background: "#fef2f2",
                                padding: "3px 8px",
                                borderRadius: "6px",
                              }}
                            >
                              Agotado
                            </span>
                          )}
                        </td>

                        {/* Widgets Nevux Activos */}
                        <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.3rem 0.65rem",
                              borderRadius: "999px",
                              background: "#ecfdf5",
                              border: "1px solid #a7f3d0",
                              color: "#059669",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            <CheckCircle2 size={12} color="#10B981" />
                            Compatible
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Centro de Ayuda */}
        <div style={{ marginTop: "2.5rem" }}>
          <CentroAyuda />
        </div>
      </main>
    </div>
  );
      }
