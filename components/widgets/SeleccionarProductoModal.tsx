"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, RefreshCw, ChevronRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
}

interface SeleccionarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
}

export default function SeleccionarProductoModal({
  isOpen,
  onClose,
  storeId,
}: SeleccionarProductoModalProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?storeId=${storeId}&q=${encodeURIComponent(search)}`
      );
      if (!res.ok) throw new Error("Error");
      const data = await res.json();
      setProducts(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.variants?.[0]?.price || "0",
          image: p.images?.[0]?.src,
        }))
      );
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [storeId, search]);

  useEffect(() => {
    if (isOpen) fetchProducts();
  }, [isOpen, fetchProducts]);

  function handleSelect(productId: number) {
    onClose();
    router.push(`/widgets/nuevo/producto/${productId}`);
  }

  function formatPrice(price: string) {
    const num = parseFloat(price);
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(num);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(17, 24, 39, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Modal Container - Centrado con Flexbox */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 101,
              padding: "1rem",
            }}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "520px",
                maxHeight: "calc(100vh - 2rem)",
                background: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #f3f4f6",
                  flexShrink: 0,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  Seleccionar producto
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    background: "transparent",
                    border: "none",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "10px",
                    color: "#6b7280",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Buscador */}
              <div style={{ padding: "1rem 1.5rem", flexShrink: 0 }}>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search
                    size={18}
                    color="#9ca3af"
                    style={{ position: "absolute", left: "0.85rem" }}
                  />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") fetchProducts();
                    }}
                    style={{
                      width: "100%",
                      padding: "0.7rem 1rem 0.7rem 2.5rem",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      color: "#374151",
                      outline: "none",
                      fontFamily: "inherit",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#6366f1";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  />
                </div>
              </div>

              {/* Lista */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "0 1.5rem 1rem",
                  minHeight: 0,
                }}
              >
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "3rem 0",
                      color: "#9ca3af",
                      fontSize: "0.9rem",
                    }}
                  >
                    Cargando productos...
                  </div>
                ) : products.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "3rem 0",
                      color: "#9ca3af",
                      fontSize: "0.9rem",
                      gap: "0.5rem",
                    }}
                  >
                    <Package size={32} color="#d1d5db" />
                    <span>No se encontraron productos</span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.75rem",
                          background: "#ffffff",
                          border: "1.5px solid #f3f4f6",
                          borderRadius: "10px",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                          transition: "border-color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#6366f1";
                          e.currentTarget.style.background = "#f5f3ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#f3f4f6";
                          e.currentTarget.style.background = "#ffffff";
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "8px",
                            background: "#f3f4f6",
                            overflow: "hidden",
                            flexShrink: 0,
                            position: "relative",
                          }}
                        >
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#d1d5db",
                              }}
                            >
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "#111827",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {product.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#6b7280",
                              marginTop: "0.15rem",
                            }}
                          >
                            {formatPrice(product.price)}
                          </div>
                        </div>
                        <ChevronRight size={18} color="#9ca3af" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "1rem 1.5rem",
                  borderTop: "1px solid #f3f4f6",
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={async () => {
                    setSyncing(true);
                    await fetchProducts();
                    setSyncing(false);
                  }}
                  disabled={syncing}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "transparent",
                    border: "none",
                    color: "#6366f1",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: syncing ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                    opacity: syncing ? 0.6 : 1,
                  }}
                >
                  <RefreshCw
                    size={14}
                    className={syncing ? "animate-spin" : ""}
                  />
                  Sincronizar productos
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
                }
