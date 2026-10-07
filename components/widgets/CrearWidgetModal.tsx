"use client";

import { useRouter } from "next/navigation";
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
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface CrearWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProducto: () => void;
  onSelectTodos: () => void;
  onSelectCategoria: () => void;
}

interface ProFeature {
  label: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

/* ═══════════════════════════════════════════
   LISTA DE LAS 6 FUNCIONES PRO (IA/METRICAS)
═══════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function CrearWidgetModal({
  isOpen,
  onClose,
  onSelectProducto,
  onSelectTodos,
  onSelectCategoria,
}: CrearWidgetModalProps) {
  const router = useRouter();

  const handleProFeatureClick = (href: string) => {
    onClose();
    router.push(href);
  };

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
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#000000",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Crear nuevo widget o función
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

              <p
                style={{
                  margin: "0 0 1.25rem 0",
                  fontSize: "0.95rem",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                Elegí la opción o función que querés activar:
              </p>

              {/* Opciones */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                
                {/* Opción A: Producto específico */}
                <button
                  onClick={onSelectProducto}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10B981";
                    e.currentTarget.style.background = "#ecfdf5";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(16, 185, 129, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "rgba(16, 185, 129, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Package size={22} color="#10B981" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#000000",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Widget para un producto específico
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#000000",
                        opacity: 0.6,
                        lineHeight: 1.3,
                      }}
                    >
                      Asociá widgets a un producto en particular
                    </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Opción B: Todos los productos */}
                <button
                  onClick={onSelectTodos}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#10B981";
                    e.currentTarget.style.background = "#ecfdf5";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(16, 185, 129, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#000000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Store size={22} color="#ffffff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#000000",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Widget para todos los productos
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#000000",
                        opacity: 0.6,
                        lineHeight: 1.3,
                      }}
                    >
                      Asociá widgets a todo tu catálogo e inicio
                    </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Opción C: Widget para una Categoría (NUEVO REGULADO v21) */}
                <button
                  onClick={onSelectCategoria}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                    transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#D97706";
                    e.currentTarget.style.background = "#FEF3C7";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(217, 119, 6, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#FEF3C7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Tag size={22} color="#D97706" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#000000",
                        marginBottom: "0.2rem",
                      }}
                    >
                      🏷️ Widget para una categoría
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#000000",
                        opacity: 0.6,
                        lineHeight: 1.3,
                      }}
                    >
                      Asociá widgets a una categoría de productos completa
                    </div>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {/* Opción D: TERCER BLOQUE DE FUNCIONES PRO / IA */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    padding: "1rem 1.1rem",
                    background: "#ffffff",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Encabezado del bloque 4 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "#ecfdf5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Sparkles size={22} color="#10B981" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "#000000",
                        }}
                      >
                        Funciones Pro para tu tienda
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#000000",
                          opacity: 0.6,
                          lineHeight: 1.3,
                          marginTop: "0.15rem",
                        }}
                      >
                        Inteligencia artificial, analíticas y prueba social
                      </div>
                    </div>
                  </div>

                  {/* Sub-lista de las 6 herramientas Pro */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      borderTop: "1px solid #f3f4f6",
                      paddingTop: "0.75rem",
                    }}
                  >
                    {proFeatures.map((feat) => {
                      const IconComponent = feat.icon;
                      return (
                        <button
                          key={feat.href}
                          onClick={() => handleProFeatureClick(feat.href)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.65rem",
                            padding: "0.6rem 0.75rem",
                            background: "#f9fafb",
                            border: "1px solid #f3f4f6",
                            borderRadius: "10px",
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                            transition: "all 0.15s ease",
                            boxSizing: "border-box",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#10B981";
                            e.currentTarget.style.background = "#ecfdf5";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#f3f4f6";
                            e.currentTarget.style.background = "#f9fafb";
                          }}
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "6px",
                              background: "#ffffff",
                              border: "1px solid #e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <IconComponent size={14} color="#10B981" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: 700,
                                  color: "#000000",
                                }}
                              >
                                {feat.label}
                              </span>
                              {feat.badge && (
                                <span
                                  style={{
                                    fontSize: "0.55rem",
                                    fontWeight: 800,
                                    background: "#10B981",
                                    color: "#ffffff",
                                    padding: "0.05rem 0.3rem",
                                    borderRadius: "3px",
                                  }}
                                >
                                  {feat.badge}
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: "0.72rem",
                                color: "#000000",
                                opacity: 0.5,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {feat.desc}
                            </div>
                          </div>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0 }}
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
              }
