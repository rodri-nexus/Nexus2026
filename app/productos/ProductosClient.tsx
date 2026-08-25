"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Package,
  RefreshCw,
  Search,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
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

interface ProductItem {
  id: number;
  name: string;
  slug?: string;
  categories?: any[];
  variants?: ProductVariant[];
  images?: ProductImage[];
}

interface ProductosClientProps {
  email: string;
  store: StoreData | null;
  productsCount: number;
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
  const [lastSyncTime, setLastSyncTime] = useState<string>("Recientemente");

  // Helper para formatear dinero en ARS
  const formatMoney = (val: string | number | null | undefined): string => {
    if (!val) return "$0";
    const num = typeof val === "number" ? val : parseFloat(val);
    if (isNaN(num)) return String(val);
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Carga de productos desde la API
  const fetchProducts = useCallback(async () => {
    if (!store?.store_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?storeId=${store.store_id}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          const now = new Date();
          setLastSyncTime(
            `Hoy ${now.getHours().toString().padStart(2, "0")}:${now
              .getMinutes()
              .toString()
              .padStart(2, "0")} hs`
          );
        }
      }
    } catch (err) {
      console.error("Error al obtener productos:", err);
    } finally {
      setLoading(false);
    }
  }, [store?.store_id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Manejo de sincronización manual
  async function handleSync() {
    if (syncing) return;
    setSyncing(true);
    await fetchProducts();
    setSyncing(false);
  }

  // Filtrado de productos por búsqueda
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(q);
    const idMatch = p.id.toString().includes(q);
    return nameMatch || idMatch;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
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
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                Productos sincronizados
              </h1>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.95rem",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                {store
                  ? `Tenés ${products.length || initialProductsCount} ${
                      products.length === 1 ? "producto" : "productos"
                    } sincronizados desde Tiendanube.`
                  : "Conectá tu Tiendanube para ver tus productos."}
              </p>
            </div>

            {store && (
              <button
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
                  fontWeight: 700,
                  cursor: syncing || loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
              >
                <RefreshCw
                  size={15}
                  style={{
                    animation:
                      syncing || loading ? "spin 1s linear infinite" : "none",
                  }}
                />
                {syncing
                  ? "Sincronizando..."
                  : loading
                  ? "Cargando..."
                  : "Sincronizar productos"}
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
            <div style={{ position: "relative", maxWidth: "450px" }}>
              <Search
                size={18}
                color="#000000"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.4,
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
                  padding: "0.75rem 1rem 0.75rem 2.6rem",
                  fontSize: "0.9rem",
                  borderRadius: "14px",
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  outline: "none",
                  boxSizing: "border-box",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  color: "#000000",
                }}
              />
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
              Instalá Nevux en tu Tiendanube para importar tus productos automáticamente.
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
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: "56px",
                  background: "#f3f4f6",
                  borderRadius: "12px",
                  animation: "pulse 1.5s infinite ease-in-out",
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
                ? `Intenta buscar con otros términos distintos a "${searchQuery}".`
                : "Asegúrate de tener productos creados y activos en tu Tiendanube."}
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
                  minWidth: "680px",
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
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6, width: "90px" }}>
                      Imagen
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6 }}>
                      Productos
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6 }}>
                      Categorías
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6 }}>
                      Precio
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6, textAlign: "center" }}>
                      Widgets
                    </th>
                    <th style={{ padding: "1rem 1.25rem", fontWeight: 700, opacity: 0.6 }}>
                      Última actualización
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, idx) => {
                    const mainVariant = p.variants?.[0];
                    const mainImg = p.images?.[0]?.src;
                    const price = mainVariant?.price;
                    const promoPrice = mainVariant?.promotional_price;

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
                                fontWeight: 500,
                              }}
                            >
                              {p.categories[0]?.name || "Categoría"}
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

                        {/* Widgets vinculados */}
                        <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              background: "#ecfdf5",
                              color: "#059669",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            —
                          </span>
                        </td>

                        {/* Última actualización */}
                        <td style={{ padding: "0.85rem 1.25rem", color: "#000000", opacity: 0.6, fontSize: "0.82rem" }}>
                          {lastSyncTime}
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

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
                                                 }
