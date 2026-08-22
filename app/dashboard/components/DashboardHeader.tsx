"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  LogOut,
  Loader2,
  User,
  ChevronDown,
  Store,
  HelpCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

export default function DashboardHeader({
  email,
  onMenuClick,
}: {
  email: string;
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function navigateTo(path: string) {
    setDropdownOpen(false);
    router.push(path);
  }

  // Obtener iniciales del email (ej: "juan@gmail.com" → "JU")
  const initials = email.substring(0, 2).toUpperCase();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #e5e7eb",
        padding: "0.85rem 1.25rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* IZQUIERDA: Logo + Menú */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <NevuxLogo size="medium" />
          </Link>

          {/* Separador vertical */}
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "#e5e7eb",
            }}
          />

          {/* Botón menú hamburguesa */}
          <button
            onClick={onMenuClick}
            aria-label="Abrir menú"
            style={{
              background: "transparent",
              border: "none",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#000000",
              borderRadius: "10px",
              transition: "background 0.15s",
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
            <Menu size={22} />
          </button>
        </div>

        {/* DERECHA: Avatar con dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Menú de usuario"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.3rem 0.5rem 0.3rem 0.3rem",
              background: dropdownOpen ? "#ecfdf5" : "transparent",
              border: "none",
              borderRadius: "999px",
              cursor: "pointer",
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.background = "#ecfdf5";
              }
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {/* Avatar circular Verde Esmeralda */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
              }}
            >
              {initials}
            </div>

            <ChevronDown
              size={16}
              color="#000000"
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                opacity: 0.6,
              }}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "#ffffff",
                  borderRadius: "14px",
                  boxShadow:
                    "0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #f3f4f6",
                  minWidth: "260px",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                {/* Info del usuario */}
                <div
                  style={{
                    padding: "1rem 1.1rem",
                    borderBottom: "1px solid #f3f4f6",
                    background: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ffffff",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      {initials}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#000000",
                          opacity: 0.5,
                          fontWeight: 600,
                          marginBottom: "0.15rem",
                        }}
                      >
                        Conectado como
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#000000",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opciones */}
                <div style={{ padding: "0.4rem" }}>
                  <button
                    onClick={() => navigateTo("/mi-cuenta")}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ecfdf5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <User size={16} color="#10B981" />
                    <span>Mi cuenta</span>
                  </button>

                  <button
                    onClick={() => navigateTo("/mi-tienda")}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ecfdf5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Store size={16} color="#000000" />
                    <span>Mi tienda</span>
                  </button>

                  <button
                    onClick={() => navigateTo("/ayuda")}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ecfdf5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <HelpCircle size={16} color="#000000" />
                    <span>Centro de ayuda</span>
                  </button>

                  {/* Separador */}
                  <div
                    style={{
                      height: "1px",
                      background: "#f3f4f6",
                      margin: "0.4rem 0",
                    }}
                  />

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    style={{
                      ...dropdownItemStyle,
                      color: "#dc2626",
                      cursor: loggingOut ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!loggingOut) {
                        e.currentTarget.style.background = "#fef2f2";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {loggingOut ? (
                      <>
                        <Loader2
                          size={16}
                          color="#dc2626"
                          className="animate-spin"
                        />
                        <span>Saliendo...</span>
                      </>
                    ) : (
                      <>
                        <LogOut size={16} color="#dc2626" />
                        <span>Cerrar sesión</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// Estilo compartido para items del dropdown
const dropdownItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.65rem",
  width: "100%",
  padding: "0.7rem 0.75rem",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  fontSize: "0.9rem",
  color: "#000000",
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
  textAlign: "left",
  transition: "background 0.15s",
};
