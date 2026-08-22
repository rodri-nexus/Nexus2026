"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, RefreshCw, ChevronRight, Package, AlertCircle } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/products?storeId=${storeId}&q=${encodeURIComponent(search)}`
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Respuesta inválida del servidor");
      }
      setProducts(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.variants?.[0]?.price || "0",
          image: p.images?.[0]?.src,
        }))
      );
    } catch (err: any) {
      console.error("Error cargando productos:", err);
      setError(err.message || "Error al cargar productos");
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
              background: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Modal Container */}
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
              boxSizing: "border-box",
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
                borderRadius: "18px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
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
                    fontWeight: 800,
                    color: "#000000",
                    letterSpacing: "-0.01em",
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
                    color: "#000000",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ecfdf5";
                    e.currentTarget.style.color = "#10B981";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#000000";
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
                    color="#000000"
                    style={{ position: "absolute", left: "0.85rem", opacity: 0.4 }}
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
                      color: "#000000",
                      outline: "none",
                      fontFamily: "inherit",
                      transition: "border-color 0.15s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#10B981";
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
                      color: "#000000",
                      opacity: 0.5,
                      fontSize: "0.9rem",
                    }}
                  >
                    Cargando productos...
                  </div>
                ) : error ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2rem 0",
                      color: "#dc2626",
                      fontSize: "0.9rem",
                      gap: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    <AlertCircle size={28} color="#dc2626" />
                    <span style={{ fontWeight: 600 }}>{error}</span>
                    <button
                      onClick={fetchProducts}
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: "1.5px solid #dc2626",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Reintentar
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "3rem 0",
                      color: "#000000",
                      opacity: 0.5,
                      fontSize: "0.9rem",
                      gap: "0.5rem",
                    }}
                  >
                    <Package size={32} color="#000000" style={{ opacity: 0.3 }} />
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
                          borderRadius: "12px",
                          cursor: "pointer",
                          textAlign: "left",
                          width: "100%",
                          transition: "border-color 0.15s, background 0.15s",
                          boxSizing: "border-box",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#10B981";
                          e.currentTarget.style.background = "#ecfdf5";
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
                                color: "#000000",
                                opacity: 0.3,
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
                              fontSize: "0.85rem",
                              color: "#000000",
                              opacity: 0.6,
                              marginTop: "0.15rem",
                            }}
                          >
                            {formatPrice(product.price)}
                          </div>
                        </div>
                        <ChevronRight size={18} color="#000000" style={{ opacity: 0.4 }} />
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
                    color: "#10B981",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: syncing ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                    opacity: syncing ? 0.6 : 1,
                  }}
                >
                  <RefreshCw
                    size={14}
                    style={{
                      animation: syncing ? "spin 1s linear infinite" : "none",
                    }}
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
