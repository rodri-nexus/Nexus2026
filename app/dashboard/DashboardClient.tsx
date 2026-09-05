"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  X,
  Search,
  ArrowLeft,
  Package,
  Layers,
  Loader2,
  User,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import SideMenu from "./components/SideMenu";
import StatsCards from "./components/StatsCards";
import MetricsCard from "./components/MetricsCard";
import RecientesCard from "./components/RecientesCard";
import AccionesRapidas from "./components/AccionesRapidas";
import CentroAyuda from "./components/CentroAyuda";
import PlanStatusCard from "./components/PlanStatusCard";
import CampaignActivator from "./components/CampaignActivator";
import type { PlanInfo, PlanStatus, RawPlanStatus } from "@/lib/plan";
import { createClient } from "@/lib/supabase-browser";
import NevuxLogo from "@/app/components/landing/NevuxLogo";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

interface SerializedPlan {
  status: PlanStatus;
  rawStatus: RawPlanStatus;
  isBlocked: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  trialEndsAtISO: string | null;
  planActiveUntilISO: string | null;
  monthsActive: number;
  needsFeedback: boolean;
  needsPayment: boolean;
  canUseApp: boolean;
  canCreateWidgets: boolean;
}

interface DashboardClientProps {
  email: string;
  userId: string;
  fullName?: string;
  store: StoreData | null;
  productsCount: number;
  activeWidgetsCount: number;
  onboardingCompleted: boolean;
  plan: SerializedPlan | null;
}

interface Product {
  id: number;
  name: string;
  price?: string | number;
  image_url?: string;
  images?: { src: string }[];
}

interface RealStatsResponse {
  hasData: boolean;
  totalEvents: number;
  totalExtraRevenue: number;
  subscriptionCost: number;
  roiMultiplier: number;
  metrics: {
    bundlesRevenue: number;
    ruletaLeads: number;
    tallesClicks: number;
    cuponesCopied: number;
  };
}

/* ═══════════════════════════════════════════
   CONSTANTES Y HELPERS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const TIENDANUBE_CLIENT_ID = "37382";
const ADMIN_EMAIL = "nevuxapp@gmail.com";

function isValidFullName(name: string | null | undefined): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  if (trimmed.includes("@")) return false;
  const parts = trimmed.split(/\s+/);
  return parts.length >= 2 && parts[0].length >= 2 && parts[1].length >= 2;
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function DashboardClient({
  email,
  userId,
  fullName = "",
  store,
  productsCount,
  activeWidgetsCount,
  plan,
}: DashboardClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Estados de Nombre y Gatekeeper
  const [currentFullName, setCurrentFullName] = useState(fullName);
  const [gatekeeperNombre, setGatekeeperNombre] = useState("");
  const [gatekeeperApellido, setGatekeeperApellido] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Estados del modal flotante de creación de widgets
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"selection" | "products">("selection");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Estado de Analytics en Tiempo Real
  const [realStats, setRealStats] = useState<RealStatsResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const hasStore = store !== null;
  const isAdmin = (email || "").toLowerCase() === ADMIN_EMAIL;
  const tiendanubeInstallUrl = `https://www.tiendanube.com/apps/${TIENDANUBE_CLIENT_ID}/authorize?state=${userId}`;

  const showGatekeeper = !isAdmin && !isValidFullName(currentFullName);

  // Consulta en vivo a la API de Analytics
  useEffect(() => {
    if (!hasStore) return;
    let isMounted = true;

    async function fetchStats() {
      setLoadingStats(true);
      try {
        const res = await fetch("/api/analytics/stats");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setRealStats(data);
          }
        }
      } catch (err) {
        console.error("Error consultando stats:", err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    }

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [hasStore]);

  // SANEADO: Datos 100% Reales. Si no hay eventos, muestra $0. Sin invenciones.
  const analyticsData = useMemo(() => {
    if (!hasStore) return null;

    if (realStats && realStats.hasData) {
      return {
        isRealData: true,
        totalExtraRevenue: realStats.totalExtraRevenue,
        bundlesRevenue: realStats.metrics.bundlesRevenue,
        ruletaLeads: realStats.metrics.ruletaLeads,
        tallesClicks: realStats.metrics.tallesClicks,
        cuponesCopied: realStats.metrics.cuponesCopied,
        roiMultiplier: realStats.roiMultiplier,
      };
    }

    return {
      isRealData: false,
      bundlesRevenue: 0,
      ruletaLeads: 0,
      tallesClicks: 0,
      cuponesCopied: 0,
      totalExtraRevenue: 0,
      roiMultiplier: 1.0,
    };
  }, [hasStore, realStats]);

  // Guardar Nombre y Apellido desde el Gatekeeper
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);

    const cleanNombre = gatekeeperNombre.trim();
    const cleanApellido = gatekeeperApellido.trim();

    if (!cleanNombre || cleanNombre.length < 2) {
      setNameError("Por favor ingresá tu nombre");
      return;
    }

    if (!cleanApellido || cleanApellido.length < 2) {
      setNameError("Por favor ingresá tu apellido");
      return;
    }

    setIsSavingName(true);

    try {
      const supabase = createClient();
      const finalFullName = `${cleanNombre} ${cleanApellido}`;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: finalFullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Error actualizando profiles:", profileError);
      }

      try {
        await supabase.auth.updateUser({
          data: {
            full_name: finalFullName,
            first_name: cleanNombre,
            last_name: cleanApellido,
          },
        });
      } catch (authErr) {
        console.warn("Auth updateUser warning:", authErr);
      }

      setCurrentFullName(finalFullName);
    } catch (err) {
      console.error("Error guardando nombre:", err);
      setNameError("Ocurrió un error al guardar. Reintentá.");
    } finally {
      setIsSavingName(false);
    }
  };

  const loadProducts = async () => {
    if (!store?.store_id) return;
    setIsLoadingProducts(true);
    setSearchQuery("");
    try {
      const res = await fetch(`/api/products?storeId=${store.store_id}`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleOpenModal = () => {
    setModalStep("selection");
    setSearchQuery("");
    setIsModalOpen(true);
  };

  const handleSelectSpecificProduct = () => {
    setModalStep("products");
    loadProducts();
  };

  const handleSelectProduct = (product: Product) => {
    setIsModalOpen(false);
    window.location.href = `/widgets/nuevo/producto/${product.id}`;
  };

  const handleSelectAllProducts = () => {
    setIsModalOpen(false);
    window.location.href = "/widgets/nuevo/todos";
  };

  const getProductImage = (p: Product) =>
    p.image_url || p.images?.[0]?.src || "";

  const getProductPrice = (p: Product) => {
    if (typeof p.price === "number") return p.price.toLocaleString("es-AR");
    if (p.price) return String(p.price);
    return "—";
  };

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const planInfo: PlanInfo | null = plan
    ? {
        status: plan.status,
        rawStatus: plan.rawStatus,
        isBlocked: plan.isBlocked,
        daysRemaining: plan.daysRemaining,
        hoursRemaining: plan.hoursRemaining,
        trialEndsAt: plan.trialEndsAtISO ? new Date(plan.trialEndsAtISO) : null,
        planActiveUntil: plan.planActiveUntilISO
          ? new Date(plan.planActiveUntilISO)
          : null,
        monthsActive: plan.monthsActive,
        needsFeedback: plan.needsFeedback,
        needsPayment: plan.needsPayment,
        canUseApp: plan.canUseApp,
        canCreateWidgets: plan.canCreateWidgets,
      }
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#000000",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
      }}
    >
      {/* MODAL GATEKEEPER BLOQUEANTE */}
      <AnimatePresence>
        {showGatekeeper && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999999,
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                width: "100%",
                maxWidth: "440px",
                background: "#ffffff",
                borderRadius: "20px",
                padding: "2.2rem 1.8rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid #e5e7eb",
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "0.85rem" }}>
                <NevuxLogo size="large" />
              </div>

              <h2
                style={{
                  margin: "0 0 0.4rem 0",
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                ¡Te damos la bienvenida!
              </h2>
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  fontSize: "0.9rem",
                  color: "#4b5563",
                  lineHeight: 1.45,
                }}
              >
                Completá tu nombre y apellido para personalizar tu cuenta en Nevux.
              </p>

              <form onSubmit={handleSaveName} style={{ textAlign: "left" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#000000",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Nombre
                    </label>
                    <div style={{ position: "relative" }}>
                      <User
                        size={16}
                        style={{
                          position: "absolute",
                          left: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#9ca3af",
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Rodrigo"
                        value={gatekeeperNombre}
                        onChange={(e) => setGatekeeperNombre(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 0.75rem 0.75rem 2.25rem",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "12px",
                          fontSize: "0.92rem",
                          outline: "none",
                          boxSizing: "border-box",
                          fontFamily: "inherit",
                          color: "#000000",
                          background: "#ffffff",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "#000000",
                        marginBottom: "0.35rem",
                      }}
                    >
                      Apellido
                    </label>
                    <div style={{ position: "relative" }}>
                      <User
                        size={16}
                        style={{
                          position: "absolute",
                          left: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#9ca3af",
                          pointerEvents: "none",
                        }}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Pérez"
                        value={gatekeeperApellido}
                        onChange={(e) => setGatekeeperApellido(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 0.75rem 0.75rem 2.25rem",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "12px",
                          fontSize: "0.92rem",
                          outline: "none",
                          boxSizing: "border-box",
                          fontFamily: "inherit",
                          color: "#000000",
                          background: "#ffffff",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>
                  </div>
                </div>

                {nameError && (
                  <div
                    style={{
                      padding: "0.65rem 0.85rem",
                      background: "#fef2f2",
                      color: "#dc2626",
                      borderRadius: "10px",
                      fontSize: "0.82rem",
                      marginBottom: "1rem",
                      border: "1px solid #fecaca",
                      textAlign: "center",
                    }}
                  >
                    {nameError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSavingName}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    background: isSavingName ? "rgba(16, 185, 129, 0.6)" : "#10B981",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: isSavingName ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                    transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                >
                  {isSavingName ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Guardando datos...
                    </>
                  ) : (
                    "Guardar y Continuar →"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        {/* BANNER ADMINISTRADOR */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              background: "#000000",
              color: "#ffffff",
              border: "1.5px solid #10B981",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={24} color="#ffffff" />
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.2rem" }}>
                  Cuenta Administrador
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.75 }}>
                  Gestioná comprobantes y aprobaciones de comercios.
                </p>
              </div>
            </div>
            <a
              href="/admin/pagos"
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "999px",
                background: "#10B981",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 700,
              }}
            >
              Panel de Pagos Admin →
            </a>
          </motion.div>
        )}

        {/* BANNER SIN TIENDA CONECTADA */}
        {!hasStore && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              background: "#ecfdf5",
              border: "1.5px solid #10B981",
              borderRadius: "14px",
              padding: "1.25rem 1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#FFFFFF",
                border: "1px solid #a7f3d0",
                display: "flex",
                alignItems: "center",
                justify { "center" },
                flexShrink: 0,
              }}
            >
              <AlertCircle size={22} color="#10B981" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.35rem" }}>
                Conectá tu Tiendanube para empezar
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.7, lineHeight: 1.5 }}>
                Vinculá <strong>tu</strong> tienda para métricas, widgets y productos reales.
              </p>
              <a
                href={tiendanubeInstallUrl}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginTop: "0.85rem",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "999px",
                  background: "#10B981",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
                }}
              >
                <Store size={15} />
                Conectar Tiendanube
              </a>
            </div>
          </motion.div>
        )}

        {/* HEADER DEL DASHBOARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0.95rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              color: "#059669",
              fontWeight: 700,
              marginBottom: "0.75rem",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
            }}
          >
            <Sparkles size={13} color="#10B981" />
            Ecosistema de Conversión Nevux
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Dashboard
              </h1>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem", opacity: 0.6 }}>
                Hola,{" "}
                <strong style={{ opacity: 1 }}>
                  {isValidFullName(currentFullName) ? currentFullName : email}
                </strong>{" "}
                👋
              </p>
            </div>

            {hasStore && (
              <button
                type="button"
                onClick={handleOpenModal}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#10B981",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#10B981";
                }}
              >
                <Sparkles size={16} />
                + Crear widget
              </button>
            )}
          </div>
        </motion.div>

        {/* TIENDA CONECTADA CHIP */}
        {hasStore && store && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.75rem 1.5rem",
              padding: "0.9rem 1.25rem",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle2 size={16} color="#ffffff" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 700 }}>
                Tienda conectada
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                opacity: 0.6,
              }}
            >
              <Store size={14} />
              <span>ID:</span>
              <strong style={{ opacity: 1, fontFamily: "monospace", fontWeight: 600 }}>
                {store.store_id}
              </strong>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                opacity: 0.6,
              }}
            >
              <Calendar size={14} />
              <span>Desde:</span>
              <strong style={{ opacity: 1, fontWeight: 600 }}>
                {store.installed_at
                  ? new Date(store.installed_at).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </strong>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════
            DIFERENCIADOR ESTRELLA: NEVUX LIVE ANALYTICS (ROI TRACKER EN TIEMPO REAL)
        ═══════════════════════════════════════════ */}
        {hasStore && analyticsData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: "linear-gradient(135deg, #111827 0%, #064e3b 100%)",
              border: "1.5px solid #10B981",
              borderRadius: "20px",
              padding: "1.5rem",
              color: "#ffffff",
              marginBottom: "1.5rem",
              boxShadow: "0 10px 30px rgba(16, 185, 129, 0.15)",
              boxSizing: "border-box",
            }}
          >
            {/* Header del Tracker */}
            <div style={{ display: "flex", alignItems: "center", justify: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ background: "rgba(16, 185, 129, 0.2)", border: "1px solid #10B981", color: "#10B981", padding: "6px", borderRadius: "8px" }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>Nevux Live Analytics</h3>
                  <span style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 700 }}>
                    {analyticsData.isRealData ? "● Datos reales en vivo de tu tienda" : "● Inicializando telemetría en vivo"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {loadingStats && <Loader2 size={14} color="#10B981" className="animate-spin" />}
                <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10B981", padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 800, color: "#10B981" }}>
                  ROI Tracker 30 Días
                </div>
              </div>
            </div>

            {/* ROI Tracker Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
              
              {/* Card 1: Facturación Extra */}
              <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.25rem", borderRadius: "14px" }}>
                <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "bold", textTransform: "uppercase", marginBottom: "6px" }}>
                  Facturación Extra Generada
                </div>
                <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "#10B981" }}>
                  ${analyticsData.totalExtraRevenue.toLocaleString("es-AR")}
                </div>
                <span style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 700 }}>Atribución directa por widgets</span>
              </div>

              {/* Card 2: Costo vs Retorno */}
              <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.25rem", borderRadius: "14px" }}>
                <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "bold", textTransform: "uppercase", marginBottom: "6px" }}>
                  Inversión Mensual Nevux
                </div>
                <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "#ffffff" }}>
                  $30.000
                </div>
                <span style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700 }}>Tarifa plana, sin comisiones</span>
              </div>

              {/* Card 3: Multiplicador de ROI */}
              <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid #10B981", padding: "1.25rem", borderRadius: "14px" }}>
                <div style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: "bold", textTransform: "uppercase", marginBottom: "6px" }}>
                  Multiplicador de Retorno (ROI)
                </div>
                <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "#10B981" }}>
                  {analyticsData.roiMultiplier.toFixed(1)}x
                </div>
                <span style={{ fontSize: "11px", color: "#a7f3d0", fontWeight: 700 }}>Nevux multiplicó tu inversión</span>
              </div>

            </div>

            {/* Sub-métricas desglosadas por widgets principales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginTop: "1.25rem", borderTop: "1px dashed rgba(255, 255, 255, 0.15)", paddingTop: "1.25rem" }}>
              <div>
                <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700 }}>📦 Bundles Ventas</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>${analyticsData.bundlesRevenue.toLocaleString("es-AR")}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700 }}>🎡 Ruleta E-mails</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>{analyticsData.ruletaLeads} capturados</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700 }}>📏 Talles Elegidos</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>{analyticsData.tallesClicks} selecciones</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700 }}>🎟️ Cupones Copiados</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#ffffff" }}>{analyticsData.cuponesCopied} clics</div>
              </div>
            </div>

            {/* SANEADO: Si no hay datos reales, mostramos un estado vacío súper profesional sin inventar nada */}
            {!analyticsData.isRealData && (
              <div
                style={{
                  marginTop: "1.25rem",
                  padding: "0.85rem 1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1.5px dashed rgba(16, 185, 129, 0.3)",
                  borderRadius: "12px",
                  fontSize: "0.82rem",
                  color: "#a7f3d0",
                  lineHeight: 1.45,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.65rem",
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>
                  <b>Esperando actividad:</b> Todavía no registramos interacciones en tus widgets activos. Los datos de facturación extra y ROI se actualizarán automáticamente en vivo a medida que tus clientes interactúen con la tienda.
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* NOVEDAD FASE 3: MODO BLACK FRIDAY / FECHAS ESPECIALES (1 CLICK) */}
        {hasStore && store && (
          <CampaignActivator storeId={store.store_id} />
        )}

        {/* RESTO DE METRICAS Y CARDS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {hasStore && planInfo && <PlanStatusCard plan={planInfo} />}
          <StatsCards
            productsCount={productsCount}
            activeWidgetsCount={activeWidgetsCount}
          />
          <MetricsCard />
          <RecientesCard
            storeId={store?.store_id}
            onCreateClick={hasStore ? handleOpenModal : undefined}
          />
          <AccionesRapidas />
          <CentroAyuda />
        </div>
      </main>

      {/* MODAL FLOTANTE DE CREACIÓN */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              zIndex: 9999,
              padding: "0",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
              }}
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              style={{
                position: "relative",
                zIndex: 1,
                background: "#ffffff",
                width: "100%",
                maxWidth: "560px",
                maxHeight: "88vh",
                borderRadius: "24px 24px 0 0",
                boxShadow: "0 -8px 40px rgba(0, 0, 0, 0.12)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
                margin: "0 auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: "0.65rem",
                  paddingBottom: "0.25rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "4px",
                    borderRadius: "999px",
                    background: "#e5e7eb",
                  }}
                />
              </div>

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justify: "space-between",
                  padding: "0.75rem 1.25rem 1rem",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {modalStep === "products" && (
                    <button
                      type="button"
                      onClick={() => setModalStep("selection")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                      }}
                      aria-label="Volver"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        color: "#000000",
                      }}
                    >
                      {modalStep === "selection" && "Crear nuevo widget"}
                      {modalStep === "products" && "Seleccionar producto"}
                    </h3>
                    {modalStep === "selection" && (
                      <p
                        style={{
                          margin: "0.25rem 0 0",
                          fontSize: "0.85rem",
                          color: "#6b7280",
                        }}
                      >
                        ¿Qué tipo de widget querés crear?
                      </p>
                    )}
                    {modalStep === "products" && (
                      <p
                        style={{
                          margin: "0.25rem 0 0",
                          fontSize: "0.85rem",
                          color: "#6b7280",
                        }}
                      >
                        Elegí un producto para asignarle sus widgets
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Cerrar"
                  style={{
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#000000",
                    flexShrink: 0,
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: "1.25rem",
                  overflowY: "auto",
                  flex: 1,
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {modalStep === "selection" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={handleSelectSpecificProduct}
                      style={{
                        padding: "1.15rem",
                        borderRadius: "16px",
                        border: "1.5px solid #e5e7eb",
                        background: "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        textAlign: "left",
                        width: "100%",
                        fontFamily: "inherit",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#10B981";
                        e.currentTarget.style.background = "#f0fdf4";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.background = "#ffffff";
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "#ecfdf5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Package size={22} color="#10B981" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
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
                            fontSize: "0.8rem",
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}
                        >
                          Asociá widgets a un producto en particular
                        </div>
                      </div>
                      <span style={{ color: "#10B981", fontSize: "1.25rem", fontWeight: 300 }}>
                        ›
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSelectAllProducts}
                      style={{
                        padding: "1.15rem",
                        borderRadius: "16px",
                        border: "1.5px solid #e5e7eb",
                        background: "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        textAlign: "left",
                        width: "100%",
                        fontFamily: "inherit",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#10B981";
                        e.currentTarget.style.background = "#f0fdf4";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.background = "#ffffff";
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "#ecfdf5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Layers size={22} color="#10B981" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
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
                            fontSize: "0.8rem",
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}
                        >
                          Asociá widgets a todos los productos y en el inicio de la tienda
                        </div>
                      </div>
                      <span style={{ color: "#10B981", fontSize: "1.25rem", fontWeight: 300 }}>
                        ›
                      </span>
                    </button>
                  </div>
                )}

                {modalStep === "products" && (
                  <div>
                    <div style={{ position: "relative", marginBottom: "1rem" }}>
                      <Search
                        size={18}
                        color="#9ca3af"
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
                        placeholder="Buscar producto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem 0.75rem 2.6rem",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "12px",
                          fontSize: "0.9rem",
                          outline: "none",
                          boxSizing: "border-box",
                          fontFamily: "inherit",
                          background: "#ffffff",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>

                    {isLoadingProducts ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "3rem 1rem",
                          gap: "0.75rem",
                        }}
                      >
                        <Loader2 size={28} color="#10B981" className="animate-spin" />
                        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                          Cargando productos...
                        </span>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "2.5rem 1rem",
                          color: "#6b7280",
                          fontSize: "0.9rem",
                        }}
                      >
                        {searchQuery
                          ? "No se encontraron productos."
                          : "No hay productos en esta tienda."}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {filteredProducts.map((p) => {
                          const img = getProductImage(p);
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectProduct(p)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.85rem",
                                padding: "0.75rem",
                                borderRadius: "14px",
                                border: "1.5px solid #f3f4f6",
                                background: "#ffffff",
                                cursor: "pointer",
                                textAlign: "left",
                                width: "100%",
                                fontFamily: "inherit",
                                transition: "all 0.15s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#10B981";
                                e.currentTarget.style.background = "#f0fdf4";
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
                                  borderRadius: "10px",
                                  background: "#f3f4f6",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {img ? (
                                  <img
                                    src={img}
                                    alt=""
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <Package size={20} color="#9ca3af" />
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                    color: "#000000",
                                    lineHeight: 1.25,
                                    marginBottom: "0.15rem",
                                  }}
                                >
                                  {p.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    color: "#10B981",
                                  }}
                                >
                                  ${getProductPrice(p)}
                                </div>
                              </div>
                              <span
                                style={{
                                  color: "#10B981",
                                  fontSize: "1.25rem",
                                  flexShrink: 0,
                                  fontWeight: 600,
                                }}
                              >
                                ›
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
