"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Check,
  Store,
} from "lucide-react";
import Link from "next/link";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import { createClient } from "@/lib/supabase-browser";

interface StoreData {
  store_id: number;
}

interface ProductImage {
  src: string;
}

interface ProductItem {
  id: number;
  name: string;
  images?: ProductImage[];
}

export default function SeleccionarProductoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<StoreData | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar tienda y catálogo
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push("/login");
          return;
        }

        const { data: storeData } = await supabase
          .from("stores")
          .select("store_id")
          .eq("user_id", session.user.id)
          .eq("is_active", true)
          .maybeSingle();

        if (!isMounted) return;

        if (!storeData) {
          setLoading(false);
          return;
        }

        setStore(storeData as StoreData);

        // Traer catálogo de la API
        const res = await fetch(`/api/products?storeId=${storeData.store_id}`, {
          signal: controller.signal,
        });

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data);
          }
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          console.error("Error cargando productos:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [supabase, router]);

  // Selección de producto
  const handleSelectProduct = useCallback((productId: number) => {
    router.push(`/widgets/nuevo/producto/${productId}`);
  }, [router]);

  // Filtrado memoizado ultra-rápido para celulares
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
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "2rem 1.25rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "560px", margin: "0 auto", boxSizing: "border-box" }}>
        {/* Volver */}
        <Link
          href="/widgets/nuevo"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#000000",
            opacity: 0.6,
            fontSize: "0.85rem",
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: "1.5rem",
          }}
        >
          <ArrowLeft size={16} />
          Volver
        </Link>

        {/* Encabezado */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.01em",
            }}
          >
            Seleccioná un producto
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              color: "#000000",
              opacity: 0.6,
              lineHeight: 1.4,
            }}
          >
            Buscá y elegí el producto de tu catálogo al que querés asociarle el widget.
          </p>
        </div>

        {/* Buscador */}
        {!loading && store && products.length > 0 && (
          <div style={{ position: "relative", marginBottom: "1.25rem" }}>
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
                padding: "0.75rem 1rem 0.75rem 2.6rem",
                fontSize: "0.9rem",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                outline: "none",
                boxSizing: "border-box",
                color: "#000000",
                fontWeight: 600,
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#10B981")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>
        )}

        {/* Lista / Estados */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
            <Loader2 size={32} color="#10B981" className="animate-spin" style={{ margin: "0 auto" }} />
            <p style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.6 }}>Cargando catálogo en vivo...</p>
          </div>
        ) : !store ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e5e7eb", borderRadius: "16px" }}>
            <Store size={40} color="#10B981" style={{ margin: "0 auto 1rem auto" }} />
            <p style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>Sin tienda conectada</p>
            <p style={{ fontSize: "0.85rem", opacity: 0.6, margin: 0 }}>Vinculá tu Tiendanube para importar tus productos.</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e5e7eb", borderRadius: "16px" }}>
            <Package size={40} color="#10B981" style={{ margin: "0 auto 1rem auto" }} />
            <p style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>No hay productos</p>
            <p style={{ fontSize: "0.85rem", opacity: 0.6, margin: 0 }}>Cargá productos visibles en tu Tiendanube.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e5e7eb", borderRadius: "16px" }}>
            <Package size={40} color="#000000" style={{ margin: "0 auto 1rem auto", opacity: 0.3 }} />
            <p style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0" }}>Sin coincidencias</p>
            <p style={{ fontSize: "0.85rem", opacity: 0.6, margin: 0 }}>Probá buscando con otro término.</p>
          </div>
        ) : (
          /* Listado optimizado */
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {filteredProducts.map((product) => {
              const mainImg = product.images?.[0]?.src;
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "0.75rem 1rem",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10B981";
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "8px",
                      background: "#f3f4f6",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #e5e7eb",
                      flexShrink: 0,
                    }}
                  >
                    {mainImg ? (
                      <img
                        src={mainImg}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <ImageIcon size={18} color="#000000" style={{ opacity: 0.3 }} />
                    )}
                  </div>

                  {/* Nombre */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#000000",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#000000",
                        opacity: 0.45,
                        fontFamily: "monospace",
                        marginTop: "1px",
                      }}
                    >
                      ID: {product.id}
                    </div>
                  </div>

                  {/* Botón Seleccionar */}
                  <button
                    type="button"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.45rem 0.85rem",
                      background: "#10B981",
                      border: "none",
                      color: "#ffffff",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Elegir <Check size={12} color="#ffffff" strokeWidth={3} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
      }
