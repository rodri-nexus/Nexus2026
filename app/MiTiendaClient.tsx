// app/mi-tienda/MiTiendaClient.tsx
"use client";

import { useState } from "react";
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

  const hasStore = storeInfo !== null;

  /* ── Desconectar tienda ── */
  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const res = await fetch("/api/tienda/desconectar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Error al desconectar");
      }

      setToast({
        type: "success",
        msg: "Tienda desconectada correctamente ✓",
      });
      setConfirmOpen(false);

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch (e: any) {
      setToast({ type: "error", msg: e.message || "Error inesperado" });
      setDisconnecting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)",
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
            color: "#6b7280",
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
              color: "#111827",
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
              color: "#6b7280",
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
              border: "1px solid #e5e7eb",
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
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <Store size={30} color="#b45309" />
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              No hay tienda conectada
            </h2>
            <p
              style={{
                margin: "0.5rem auto 1.5rem",
                fontSize: "0.9rem",
                color: "#6b7280",
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
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
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
                    color: "#111827",
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
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: 500,
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
                    color: "#374151",
                    fontWeight: 600,
                    background: "#f3f4f6",
                    display: "inline-block",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "6px",
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
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  Conectado
                </div>
              </Field>

              <Field label="Conectado desde">
                <div style={{ fontSize: "0.9rem", color: "#111827" }}>
                  {formatDate(storeInfo.installed_at)}
                </div>
              </Field>

              <Field label="Última sincronización">
                <div style={{ fontSize: "0.9rem", color: "#111827" }}>
                  {formatDate(storeInfo.updated_at)}
                  {storeInfo.updated_at && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.8rem",
                        color: "#9ca3af",
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
                  gap: "0.75rem",
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
                  onClick={() => router.push("/widgets/nuevo")}
                />

                <ActionButton
                  icon={<LayoutGrid size={16} />}
                  label={`Ver widgets (${widgetsCount})`}
                  onClick={() => router.push("/dashboard")}
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
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#ffffff",
                  border: "none",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)",
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
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !disconnecting && setConfirmOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
                zIndex: 200,
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#ffffff",
                borderRadius: "18px",
                padding: "1.75rem",
                width: "calc(100% - 2rem)",
                maxWidth: "420px",
                zIndex: 201,
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #fee2e2, #fecaca)",
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
                  color: "#111827",
                  textAlign: "center",
                }}
              >
                ¿Desconectar la tienda?
              </h3>

              <p
                style={{
                  margin: "0.6rem 0 1.5rem",
                  fontSize: "0.88rem",
                  color: "#6b7280",
                  textAlign: "center",
                  lineHeight: 1.55,
                }}
              >
                Se van a eliminar <strong>{widgetsCount} widgets</strong> y se
                revocará el acceso a tu tienda. Esta acción no se puede
                deshacer.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "0.6rem",
                }}
              >
                <button
                  onClick={() => setConfirmOpen(false)}
                  disabled={disconnecting}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "#f3f4f6",
                    color: "#374151",
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
                    flex: 1.4,
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: disconnecting
                      ? "#fca5a5"
                      : "linear-gradient(135deg, #ef4444, #dc2626)",
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
                      : "0 4px 14px rgba(239,68,68,0.4)",
                  }}
                >
                  {disconnecting ? (
                    <>
                      <Loader2
                        size={15}
                        className="animate-spin"
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
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ TOAST ═══════════ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onAnimationComplete={() => {
              setTimeout(() => setToast(null), 2500);
            }}
            style={{
              position: "fixed",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "0.85rem 1.25rem",
              borderRadius: "12px",
              background:
                toast.type === "success"
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #ef4444, #dc2626)",
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
            {toast.msg}
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
  color: "#111827",
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
          fontWeight: 600,
          color: "#9ca3af",
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
  let color = "#2563eb";
  let border = "1.5px solid #bfdbfe";

  if (isPrimary) {
    bg = "linear-gradient(135deg, #3b82f6, #2563eb)";
    color = "#ffffff";
    border = "none";
  } else if (isWarning) {
    bg = "#fffbeb";
    color = "#b45309";
    border = "1.5px solid #fcd34d";
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
        padding: "0.85rem",
        borderRadius: "999px",
        background: bg,
        color: color,
        border: border,
        fontSize: "0.9rem",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "transform 0.15s, box-shadow 0.15s",
        boxShadow: isPrimary
          ? "0 4px 14px rgba(37, 99, 235, 0.35)"
          : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {icon}
      {label}
    </button>
  );
}
