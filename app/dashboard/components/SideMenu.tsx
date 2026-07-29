"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Puzzle,
  Package,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

const menuItems: MenuItem[] = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Widgets", href: "/widgets", icon: Puzzle },
  { label: "Productos", href: "/productos", icon: Package },
  { label: "Métricas", href: "/metricas", icon: BarChart3, disabled: true },
  { label: "Configuración", href: "/configuracion", icon: Settings, disabled: true },
  { label: "Ayuda", href: "/ayuda", icon: HelpCircle, disabled: true },
];

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname();

  // Cerrar con tecla ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Bloquear scroll del body cuando el menú está abierto
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(17, 24, 39, 0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Drawer lateral */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "280px",
              maxWidth: "85vw",
              background: "#ffffff",
              boxShadow: "4px 0 24px rgba(0, 0, 0, 0.08)",
              zIndex: 101,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            {/* Header del drawer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.1rem 1.25rem",
                borderBottom: "1px solid #e5e7eb",
                background: "linear-gradient(135deg, #f9fafb, #ffffff)",
              }}
            >
              <NevuxLogo size="medium" />

              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                style={{
                  background: "transparent",
                  border: "none",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#374151",
                  borderRadius: "10px",
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

            {/* Navegación */}
            <nav
              style={{
                flex: 1,
                padding: "1rem 0.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  padding: "0.5rem 0.75rem 0.5rem",
                }}
              >
                Menú principal
              </div>

              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                if (item.disabled) {
                  return (
                    <div
                      key={item.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        borderRadius: "10px",
                        color: "#9ca3af",
                        cursor: "not-allowed",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        position: "relative",
                      }}
                    >
                      <Icon size={18} color="#9ca3af" />
                      <span>{item.label}</span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          background: "#f3f4f6",
                          color: "#6b7280",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "999px",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                        }}
                      >
                        Pronto
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "10px",
                      textDecoration: "none",
                      color: isActive ? "#6366f1" : "#374151",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))"
                        : "transparent",
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 500,
                      transition: "background 0.15s, color 0.15s",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "#f9fafb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "3px",
                          height: "60%",
                          background:
                            "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          borderRadius: "0 3px 3px 0",
                        }}
                      />
                    )}
                    <Icon
                      size={18}
                      color={isActive ? "#6366f1" : "#6b7280"}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer del drawer */}
            <div
              style={{
                padding: "1rem 1.25rem",
                borderTop: "1px solid #e5e7eb",
                background: "#f9fafb",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.7rem",
                  color: "#9ca3af",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                Nevux · v1.0
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
  }
