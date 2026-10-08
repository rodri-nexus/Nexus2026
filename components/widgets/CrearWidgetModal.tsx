"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Package,
  Store,
  Sparkles,
  TrendingUp,
  Flame,
  Globe,
  Mic,
  MessageSquare,
  Bot,
  Tag,
  Search,
  ArrowLeft,
  Loader2,
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES
═══════════════════════════════════════════ */
interface CategoryInfo {
  id: number | string;
  name: string;
}

interface ProductInfo {
  id: number;
  name: string;
  image: string | null;
}

interface CrearWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTodos: () => void;
  storeId?: number | string | null;
  categoriesMap?: Record<string, CategoryInfo | null>;
}

interface ProFeature {
  label: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

const proFeatures: ProFeature[] = [
  {
    label: "📈 Métricas en Vivo",
    desc: "Seguimiento de conversiones y ROI.",
    href: "/dashboard/analytics",
    icon: TrendingUp,
    badge: "ROI",
  },
  {
    label: "🔔 Notificaciones de Compras",
    desc: "Prueba social que estimula compras directas.",
    href: "/dashboard/social-proof",
    icon: Flame,
    badge: "PRO",
  },
  {
    label: "🌐 Traductor de Tienda (IA)",
    desc: "Traducción en vivo ES, PT-BR e EN.",
    href: "/dashboard/idiomas-ia",
    icon: Globe,
    badge: "NUEVO",
  },
  {
    label: "🎙️ Buscador por Voz",
    desc: "Comandos de voz inteligentes para tu tienda.",
    href: "/dashboard/busqueda-voz",
    icon: Mic,
    badge: "BETA",
  },
  {
    label: "💬 Asistente de Ventas (IA)",
    desc: "Vendedor virtual que cierra ventas 24/7.",
    href: "/dashboard/vendedor-ia",
    icon: MessageSquare,
    badge: "NUEVO",
  },
  {
    label: "🤖 Asistente de Soporte (IA)",
    desc: "NevuxBot CRM integrado con WhatsApp.",
    href: "/dashboard/nevuxbot",
    icon: Bot,
    badge: "IA CRM",
  },
];

export default function CrearWidgetModal({
  isOpen,
  onClose,
  onSelectTodos,
  storeId,
  categoriesMap = {},
}: CrearWidgetModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<'options' | 'select-product' | 'select-category'>('options');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Estados para búsqueda de productos
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Resetear estados al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep('options');
      setSearchQuery("");
    }
  }, [isOpen]);

  // Cargar productos desde la API al entrar en búsqueda de productos
  useEffect(() => {
    if (step === 'select-product' && storeId) {
      setLoadingProducts(true);
      fetch(`/api/products?store_id=${storeId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingProducts(false));
    }
  }, [step, storeId]);

  const handleProFeatureClick = (href: string) => {
    onClose();
    router.push(href);
  };

  // Filtrado local de categorías
  const filteredCategories = Object.values(categoriesMap)
    .filter((cat): cat is CategoryInfo => !!cat)
    .filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Filtrado local de productos
  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: "18px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                padding: "1.5rem",
                boxSizing: "border-box",
              }}
            >
              {/* HEADER */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {step !== 'options' && (
                    <button
                      onClick={() => { setStep('options'); setSearchQuery(""); }}
                      style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
                    >
                      <ArrowLeft size={20} color="#000000" />
                    </button>
                  )}
                  <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#000000" }}>
                    {step === 'options' && "Crear nuevo widget o función"}
                    {step === 'select-product' && "Seleccionar Producto"}
                    {step === 'select-category' && "Seleccionar Categoría"}
                  </h2>
                </div>
                <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                  <X size={20} color="#000000" />
                </button>
              </div>

              {/* CONTENIDO FLUIDO DEL MODAL */}
              {step === 'options' && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <p style={{ margin: "0 0 10px", fontSize: "0.95rem", color: "#666" }}>
                    Elegí la opción o función que querés activar:
                  </p>

                  {/* Producto Específico */}
                  <button
                    onClick={() => setStep('select-product')}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
                      background: "#ffffff", border: "1.5px solid #e5e7eb", borderRadius: "14px",
                      cursor: "pointer", textAlign: "left", width: "100%", boxSizing: "border-box"
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16, 185, 129, 0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={22} color="#10B981" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#000" }}>Widget para un producto específico</div>
                      <div style={{ fontSize: "0.82rem", color: "#666" }}>Asociá widgets a un producto en particular</div>
                    </div>
                  </button>

                  {/* Todos los Productos */}
                  <button
                    onClick={onSelectTodos}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
                      background: "#ffffff", border: "1.5px solid #e5e7eb", borderRadius: "14px",
                      cursor: "pointer", textAlign: "left", width: "100%", boxSizing: "border-box"
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Store size={22} color="#ffffff" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#000" }}>Widget para todos los productos</div>
                      <div style={{ fontSize: "0.82rem", color: "#666" }}>Asociá widgets a todo tu catálogo e inicio</div>
                    </div>
                  </button>

                  {/* Categoría específica */}
                  <button
                    onClick={() => setStep('select-category')}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
                      background: "#ffffff", border: "1.5px solid #e5e7eb", borderRadius: "14px",
                      cursor: "pointer", textAlign: "left", width: "100%", boxSizing: "border-box"
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Tag size={22} color="#D97706" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#000" }}>🏷️ Widget para una categoría</div>
                      <div style={{ fontSize: "0.82rem", color: "#666" }}>Asociá widgets a una categoría de productos completa</div>
                    </div>
                  </button>

                  {/* Funciones Pro */}
                  <div style={{ padding: "1rem", border: "1.5px solid #e5e7eb", borderRadius: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
                      <Sparkles size={20} color="#10B981" />
                      <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Funciones Pro para tu tienda</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {proFeatures.map((feat) => {
                        const IconComponent = feat.icon;
                        return (
                          <button
                            key={feat.href}
                            onClick={() => handleProFeatureClick(feat.href)}
                            style={{
                              display: "flex", alignItems: "center", gap: 10, padding: "0.6rem",
                              background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10,
                              cursor: "pointer", width: "100%"
                            }}
                          >
                            <IconComponent size={14} color="#10B981" />
                            <span style={{ fontSize: "0.8rem", fontWeight: 700, flex: 1, textAlign: "left" }}>{feat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* BÚSQUEDA DE PRODUCTO CON FOTOS REALES */}
              {step === 'select-product' && (
                <div>
                  <div style={{ position: "relative", marginBottom: "1rem" }}>
                    <Search size={18} color="#9ca3af" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      placeholder="Buscá el producto por su nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px 10px 40px", border: "1.5px solid #e5e7eb", borderRadius: 10, outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  {loadingProducts ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                      <Loader2 size={24} className="animate-spin" color="#10B981" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666", fontSize: "0.9rem", padding: "1.5rem" }}>No se encontraron productos.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "360px", overflowY: "auto", paddingRight: 4 }}>
                      {filteredProducts.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => {
                            onClose();
                            router.push(`/widgets/nuevo/producto/${prod.id}`);
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                            background: "#ffffff", border: "1.5px solid #f3f4f6", borderRadius: 12,
                            cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#10B981')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#f3f4f6')}
                        >
                          {/* FOTO DE PRODUCTO REAL CON PLACEHOLDER SI FALTA */}
                          <div style={{
                            width: 48, height: 48, borderRadius: 8, background: "#f9fafb",
                            border: "1px solid #e5e7eb", display: "flex", alignItems: "center",
                            justifyContent: "center", overflow: "hidden", flexShrink: 0
                          }}>
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <Package size={22} color="#9ca3af" />
                            )}
                          </div>

                          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827", flex: 1, lineHeight: 1.3 }}>
                            {prod.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BÚSQUEDA DE CATEGORÍA */}
              {step === 'select-category' && (
                <div>
                  <div style={{ position: "relative", marginBottom: "1rem" }}>
                    <Search size={18} color="#9ca3af" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      placeholder="Buscá la categoría..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px 10px 40px", border: "1.5px solid #e5e7eb", borderRadius: 10, outline: "none", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  {filteredCategories.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#666", fontSize: "0.9rem", padding: "1.5rem" }}>No se encontraron categorías.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "300px", overflowY: "auto" }}>
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onClose();
                            router.push(`/widgets/nuevo/categoria/${cat.id}`);
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                            background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 10,
                            cursor: "pointer", textAlign: "left", width: "100%"
                          }}
                        >
                          <Tag size={16} color="#D97706" />
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#000" }}>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
