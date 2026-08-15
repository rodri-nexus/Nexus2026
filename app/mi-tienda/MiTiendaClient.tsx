// app/mi-tienda/MiTiendaClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Package,
  LayoutGrid,
  AlertTriangle,
  Unplug,
  ArrowLeft,
  Loader2,
  KeyRound,
  X,
} from "lucide-react";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import SideMenu from "../dashboard/components/SideMenu";

interface StoreInfo {
  store_id: number;
  installed_at: string;
  updated_at: string | null;
  is_active: boolean;
  scope: string | null;
  url: string;
  name: string;
}

interface MiTiendaClientProps {
  email: string;
  storeInfo: StoreInfo | null;
  productsCount: number;
  widgetsCount: number;
}

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "hace instantes";
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "hace 1 día";
    if (days < 30) return `hace ${days} días`;
    const months = Math.floor(days / 30);
    if (months === 1) return "hace 1 mes";
    return `hace ${months} meses`;
  } catch {
    return "";
  }
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function MiTiendaClient({
  email,
  storeInfo,
  productsCount,
  widgetsCount,
}: MiTiendaClientProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // ── Timer del toast con useRef para evitar memory leaks ──
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (toast) {
      // Limpiar timer anterior si había uno
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
      }, 3500);
    }
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [toast]);

  const hasStore = storeInfo !== null;

  /* ── Desconectar tienda ── */
  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch("/api/tienda/desconectar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data: { error?: string; details?: string } | null = null;
      try {
        data = await res.json();
      } catch {
        // Respuesta sin JSON
      }

      if (!res.ok) {
        const errorMsg =
          data?.error ||
          data?.details ||
          `Error ${res.status}: ${res.statusText || "no se pudo desconectar"}`;
        throw new Error(errorMsg);
      }

      // ✅ Éxito: cerrar modal primero, mostrar toast,
      // luego redirect con window.location para evitar
      // que Framer Motion congele la UI durante la navegación
      setConfirmOpen(false);
      setToast({
        type: "success",
        msg: "Tienda desconectada correctamente ✓",
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1200);

    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : "Error inesperado al desconectar";
      console.error("[Nevux] Error desconectando:", e);
      setToast({
        type: "error",
        msg: errorMessage,
      });
    } finally {
      // ✅ Siempre resetear disconnecting,
      // tanto en éxito como en error
      setDisconnecting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <DashboardHeader email={email} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "1.5rem 1.25rem 4rem",
        }}
      >
        {/* Back link */}
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
          <ArrowLeft size={15} />
          Volver al dashboard
        </Link>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ marginBottom: "1.75rem" }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "1.85rem",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Configuración de la tienda
          </h1>
          <p
            style={{
              margin: "0.35rem 0 0",
              fontSize: "0.9rem",
              color: "#000000",
              opacity: 0.6,
            }}
          >
            Administrá la conexión de tu tienda de Tiendanube.
          </p>
        </motion.div>

        {/* ═══════════ SIN TIENDA ═══════════ */}
        {!hasStore && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#ffffff",
              border: "1.5px solid #000000",
              borderRadius: "16px",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "#fff5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <Store size={30} color="#FF0000" />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#000000",
              }}
            >
              No hay tienda conectada
            </h2>
            <p
              style={{
                margin: "0.5rem auto 1.5rem",
                fontSize: "0.9rem",
                color: "#000000",
                opacity: 0.6,
                maxWidth: "400px",
              }}
            >
              Conectá tu tienda de Tiendanube para gestionar productos, crear
              widgets y ver métricas.
            </p>
            <a
              href="/api/auth/install"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "999px",
                background: "#FF0000",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(255, 0, 0, 0.35)",
              }}
            >
              <Store size={16} />
              Conectar Tiendanube
            </a>
          </motion.div>
        )}

        {/* ═══════════ CON TIENDA ═══════════ */}
        {hasStore && (
          <>
            {/* ── Card: Información de la tienda ── */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              style={cardStyle}
            >
              <h2 style={cardTitleStyle}>Información de la tienda</h2>

              <Divider />

              <Field label="Nombre de la tienda">
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "#000000",
                    fontWeight: 600,
                  }}
                >
                  {storeInfo.name}
                </div>
              </Field>

              <Field label="URL de la tienda">
                <a
                  href={storeInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.9rem",
                    color: "#FF0000",
                    textDecoration: "none",
                    fontWeight: 600,
                    wordBreak: "break-all",
                  }}
                >
                  {storeInfo.url}
                  <ExternalLink size={13} />
                </a>
              </Field>

              <Field label="ID de la tienda">
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontFamily: "monospace",
                    color: "#000000",
                    fontWeight: 600,
                    background: "#f9fafb",
                    display: "inline-block",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {storeInfo.store_id}
                </div>
              </Field>

              <Field label="Estado de conexión">
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.35rem 0.75rem",
                    background: "#FF0000",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(255, 0, 0, 0.3)",
                  }}
                >
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  Conectado
                </div>
              </Field>

              <Field label="Conectado desde">
                <div style={{ fontSize: "0.9rem", color: "#000000" }}>
                  {formatDate(storeInfo.installed_at)}
                </div>
              </Field>

              <Field label="Última sincronización">
                <div style={{ fontSize: "0.9rem", color: "#000000" }}>
                  {formatDate(storeInfo.updated_at)}
                  {storeInfo.updated_at && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.8rem",
                        color: "#000000",
                        opacity: 0.5,
                      }}
                    >
                      ({timeAgo(storeInfo.updated_at)})
                    </span>
                  )}
                </div>
              </Field>
            </motion.section>

            {/* ── Card: Acciones ── */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              style={cardStyle}
            >
              <h2 style={cardTitleStyle}>Acciones</h2>
              <Divider />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                }}
              >
                <ActionButton
                  icon={<RefreshCw size={16} />}
                  label="Sincronizar productos"
                  primary
                  onClick={() => {
                    router.refresh();
                    setToast({
                      type: "success",
                      msg: "Sincronización iniciada",
                    });
                  }}
                />

                <ActionButton
                  icon={<KeyRound size={16} />}
                  label="Renovar token de conexión"
                  variant="warning"
                  onClick={() => {
                    window.location.href = "/api/auth/install";
                  }}
                />

                <ActionButton
                  icon={<Package size={16} />}
                  label={`Ver productos (${productsCount})`}
                  onClick={() => router.push("/productos")}
                />

                <ActionButton
                  icon={<LayoutGrid size={16} />}
                  label={`Ver widgets (${widgetsCount})`}
                  onClick={() => router.push("/widgets")}
                />
              </div>
            </motion.section>

            {/* ── Card: Zona de peligro ── */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              style={{
                ...cardStyle,
                border: "1.5px solid #fecaca",
                background: "#fef2f2",
              }}
            >
              <h2
                style={{
                  ...cardTitleStyle,
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <AlertTriangle size={18} />
                Zona de peligro
              </h2>
              <div
                style={{
                  height: "1px",
                  background: "#fecaca",
                  margin: "0.75rem 0 1rem",
                }}
              />
              <p
                style={{
                  margin: "0 0 1rem",
                  fontSize: "0.88rem",
                  color: "#7f1d1d",
                  lineHeight: 1.55,
                }}
              >
                Esta acción desconectará tu tienda de Tiendanube y eliminará
                todos tus widgets. No podrás recuperar los datos, pero podés
                volver a conectar la tienda cuando quieras.
              </p>
              <button
                onClick={() => setConfirmOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "999px",
                  background: "#dc2626",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(220, 38, 38, 0.35)",
                  transition: "transform 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-1px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Unplug size={16} />
                Desconectar tienda
              </button>
            </motion.section>
          </>
        )}
      </main>

      {/* ═══════════ MODAL CONFIRMACIÓN ═══════════ */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !disconnecting && setConfirmOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(4px)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              boxSizing: "border-box",
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                padding: "1.75rem 1.5rem",
                width: "100%",
                maxWidth: "420px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: "#fef2f2",
                  border: "1.5px solid #fecaca",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <AlertTriangle size={26} color="#dc2626" />
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                ¿Desconectar la tienda?
              </h3>

              <p
                style={{
                  margin: "0.6rem 0 1.5rem",
                  fontSize: "0.88rem",
                  color: "#000000",
                  opacity: 0.65,
                  textAlign: "center",
                  lineHeight: 1.55,
                }}
              >
                Se van a eliminar{" "}
                <strong style={{ opacity: 1, color: "#000000" }}>
                  {widgetsCount} widget{widgetsCount === 1 ? "" : "s"}
                </strong>{" "}
                y se revocará el acceso a tu tienda. Esta acción no se puede
                deshacer.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => setConfirmOpen(false)}
                  disabled={disconnecting}
                  style={{
                    flex: "1 1 120px",
                    padding: "0.85rem",
                    borderRadius: "10px",
                    background: "#f3f4f6",
                    color: "#000000",
                    border: "none",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: disconnecting ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: disconnecting ? 0.5 : 1,
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  style={{
                    flex: "1.4 1 140px",
                    padding: "0.85rem",
                    borderRadius: "10px",
                    background: disconnecting ? "#fca5a5" : "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: disconnecting ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    fontFamily: "inherit",
                    boxShadow: disconnecting
                      ? "none"
                      : "0 4px 14px rgba(220,38,38,0.4)",
                  }}
                >
                  {disconnecting ? (
                    <>
                      <Loader2
                        size={15}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Desconectando...
                    </>
                  ) : (
                    <>
                      <Unplug size={15} />
                      Sí, desconectar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ TOAST ═══════════ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "0.85rem 1.25rem",
              borderRadius: "12px",
              background: toast.type === "success" ? "#059669" : "#dc2626",
              color: "#ffffff",
              fontSize: "0.88rem",
              fontWeight: 600,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              zIndex: 300,
              maxWidth: "calc(100% - 2rem)",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={17} />
            ) : (
              <X size={17} />
            )}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUBCOMPONENTES
═══════════════════════════════════════════ */
const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "16px",
  padding: "1.5rem",
  marginBottom: "1.25rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "1.05rem",
  fontWeight: 700,
  color: "#000000",
  letterSpacing: "-0.01em",
};

function Divider() {
  return (
    <div
      style={{
        height: "1px",
        background: "#f3f4f6",
        margin: "0.9rem 0 1.1rem",
      }}
    />
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#000000",
          opacity: 0.5,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "0.4rem",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  primary,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
  variant?: "warning";
}) {
  const isPrimary = primary === true;
  const isWarning = variant === "warning";

  let bg = "#ffffff";
  let color = "#FF0000";
  let border = "1.5px solid #e5e7eb";
  let hoverBg = "#fff5f5";
  let hoverBorder = "#FF0000";

  if (isPrimary) {
    bg = "#FF0000";
    color = "#ffffff";
    border = "none";
    hoverBg = "#FF0000";
    hoverBorder = "transparent";
  } else if (isWarning) {
    bg = "#fffbeb";
    color = "#b45309";
    border = "1.5px solid #fcd34d";
    hoverBg = "#fef3c7";
    hoverBorder = "#f59e0b";
  }

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        width: "100%",
        padding: "0.85rem 1rem",
        borderRadius: "999px",
        background: bg,
        color: color,
        border: border,
        fontSize: "0.9rem",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        transition:
          "transform 0.15s, box-shadow 0.15s, background 0.15s, border-color 0.15s",
        boxShadow: isPrimary ? "0 4px 14px rgba(255, 0, 0, 0.35)" : "none",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        if (!isPrimary) {
          e.currentTarget.style.background = hoverBg;
          e.currentTarget.style.borderColor = hoverBorder;
        } else {
          e.currentTarget.style.boxShadow =
            "0 6px 18px rgba(255, 0, 0, 0.45)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        if (!isPrimary) {
          e.currentTarget.style.background = bg;
          e.currentTarget.style.borderColor = "#e5e7eb";
        } else {
          e.currentTarget.style.boxShadow =
            "0 4px 14px rgba(255, 0, 0, 0.35)";
        }
      }}
    >
      {icon}
      {label}
    </button>
  );
  }
