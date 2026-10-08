"use client";

import { useState } from "react";
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
  Flame,
  Globe,
  Mic,
  MessageSquare,
  Bot,
  Folder,
  Tag,
  type LucideIcon,
} from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import SideMenu from "./components/SideMenu";
import StatsCards from "./components/StatsCards";
import MetricsCard from "./components/MetricsCard";
import RecientesCard from "./components/RecientesCard";
import AccionesRapidas from "./components/AccionesRapidas";
import CentroAyuda from "./components/CentroAyuda";
import PlanStatusCard from "./components/PlanStatusCard";
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

interface Category {
  id: number | string;
  name: string;
  products_count?: number;
}

interface ProFeature {
  label: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

type ModalStep = "selection" | "products" | "categories";

/* ═══════════════════════════════════════════
   CONSTANTES Y HELPERS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const TIENDANUBE_CLIENT_ID = "37382";
const ADMIN_EMAIL = "nevuxapp@gmail.com";

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
    desc: "Prueba social que estimula compras.",
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
    desc: "Comandos de voz inteligentes.",
    href: "/dashboard/busqueda-voz",
    icon: Mic,
    badge: "BETA",
  },
  {
    label: "💬 Asistente de Ventas (IA)",
    desc: "Vendedor virtual 24/7.",
    href: "/dashboard/vendedor-ia",
    icon: MessageSquare,
    badge: "NUEVO",
  },
  {
    label: "🤖 Asistente de Soporte (IA)",
    desc: "NevuxBot CRM + WhatsApp.",
    href: "/dashboard/nevuxbot",
    icon: Bot,
    badge: "IA CRM",
  },
];

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
  const [modalStep, setModalStep] = useState<ModalStep>("selection");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const hasStore = store !== null;
  const isAdmin = (email || "").toLowerCase() === ADMIN_EMAIL;
  const tiendanubeInstallUrl = `https://www.tiendanube.com/apps/${TIENDANUBE_CLIENT_ID}/authorize?state=${userId}`;

  const showGatekeeper = !isAdmin && !isValidFullName(currentFullName);

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

  const loadCategories = async () => {
    if (!store?.store_id) return;
    setIsLoadingCategories(true);
    setSearchQuery("");
    try {
      const res = await fetch(`/api/categories?storeId=${store.store_id}`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.categories || [];
        setCategories(list);
      } else {
        // Fallback si no hay endpoint directo de categorías
        const prodRes = await fetch(`/api/products?storeId=${store.store_id}`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const pList: any[] = Array.isArray(prodData) ? prodData : prodData.products || [];
          const catMap: Record<string, Category> = {};
          pList.forEach((p) => {
            if (p.categories && Array.isArray(p.categories)) {
              p.categories.forEach((c: any) => {
                const cId = c.id || c.name;
                const cName = typeof c.name === "object" ? (c.name.es || c.name.pt || "Categoría") : String(c.name || cId);
                if (!catMap[cId]) {
                  catMap[cId] = { id: cId, name: cName, products_count: 1 };
                } else {
                  catMap[cId].products_count = (catMap[cId].products_count || 0) + 1;
                }
              });
            }
          });
          setCategories(Object.values(catMap));
        }
      }
    } catch (err) {
      console.error("Error cargando categorías:", err);
    } finally {
      setIsLoadingCategories(false);
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

  const handleSelectCategoryOption = () => {
    setModalStep("categories");
    loadCategories();
  };

  const handleSelectProduct = (product: Product) => {
    setIsModalOpen(false);
    window.location.href = `/widgets/nuevo/producto/${product.id}`;
  };

  const handleSelectCategory = (category: Category) => {
    setIsModalOpen(false);
    window.location.href = `/widgets/nuevo/categoria/${category.id}`;
  };

  const handleSelectAllProducts = () => {
    setIsModalOpen(false);
    window.location.href = "/widgets/nuevo/todos";
  };

  const handleProFeatureClick = (href: string) => {
    setIsModalOpen(false);
    window.location.href = href;
  };

  // Helper blindado que soporta todos los formatos de imagen de Tiendanube
  const getProductImage = (p: Product): string => {
    if (p.image_url && typeof p.image_url === "string") return p.image_url;

    const anyProd = p as unknown as Record<string, unknown>;
    const imagesArr = anyProd.images as unknown[] | undefined;
    if (Array.isArray(imagesArr) && imagesArr.length > 0) {
      const first = imagesArr[0];
      if (typeof first === "string") return first;
      if (first && typeof first === "object") {
        const imgObj = first as Record<string, unknown>;
        if (typeof imgObj.src === "string") return imgObj.src;
        if (typeof imgObj.url === "string") return imgObj.url;
        if (typeof imgObj.thumbnail === "string") return imgObj.thumbnail;
        if (typeof imgObj.href === "string") return imgObj.href;
        if (typeof imgObj.image === "string") return imgObj.image;
      }
    }

    if (typeof anyProd.image === "string") return anyProd.image as string;
    if (typeof anyProd.thumbnail === "string") return anyProd.thumbnail as string;
    if (typeof anyProd.main_image === "string") return anyProd.main_image as string;

    const imgSingle = anyProd.image as Record<string, unknown> | undefined;
    if (imgSingle && typeof imgSingle === "object") {
      if (typeof imgSingle.src === "string") return imgSingle.src;
      if (typeof imgSingle.url === "string") return imgSingle.url;
    }

    return "";
  };

  const getProductPrice = (p: Product) => {
    if (typeof p.price === "number") return p.price.toLocaleString("es-AR");
    if (p.price) return String(p.price);
    return "—";
  };

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
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
                justifyContent: "center",
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

        {/* RESTO DE METRICAS Y CARDS (DASHBOARD PRINCIPAL) */}
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

      {/* MODAL FLOTANTE DE CREACIÓN CON 4 BLOQUES */}
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
                  justifyContent: "space-between",
                  padding: "0.75rem 1.25rem 1rem",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {modalStep !== "selection" && (
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
                        fontSize: "1.2rem",
                        fontWeight: 900,
                        color: "#000000",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {modalStep === "selection" && "Crear nuevo widget"}
                      {modalStep === "products" && "Seleccionar producto"}
                      {modalStep === "categories" && "Seleccionar categoría"}
                    </h3>
                    {modalStep === "selection" && (
                      <p
                        style={{
                          margin: "0.25rem 0 0",
                          fontSize: "0.85rem",
                          color: "#6b7280",
                        }}
                      >
                        Elegí el tipo de solución que querés activar:
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
                    {modalStep === "categories" && (
                      <p
                        style={{
                          margin: "0.25rem 0 0",
                          fontSize: "0.85rem",
                          color: "#6b7280",
                        }}
                      >
                        Elegí una categoría para asignarle sus widgets
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {/* BLOQUE 1: Producto específico */}
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
                          width: "50px",
                          height: "50px",
                          borderRadius: "14px",
                          background: "#ecfdf5",
                          border: "1px solid #a7f3d0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Package size={24} color="#10B981" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "1.08rem",
                            fontWeight: 800,
                            color: "#000000",
                            letterSpacing: "-0.01em",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Widget para un producto específico
                        </div>
                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}
                        >
                          Asociá widgets a un producto en particular
                        </div>
                      </div>
                      <span style={{ color: "#10B981", fontSize: "1.3rem", fontWeight: 600 }}>
                        ›
                      </span>
                    </button>

                    {/* BLOQUE 2: Todos los productos */}
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
                          width: "50px",
                          height: "50px",
                          borderRadius: "14px",
                          background: "#ecfdf5",
                          border: "1px solid #a7f3d0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Layers size={24} color="#10B981" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "1.08rem",
                            fontWeight: 800,
                            color: "#000000",
                            letterSpacing: "-0.01em",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Widget para todos los productos
                        </div>
                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}
                        >
                          Asociá widgets a todos los productos y en el inicio de la tienda
                        </div>
                      </div>
                      <span style={{ color: "#10B981", fontSize: "1.3rem", fontWeight: 600 }}>
                        ›
                      </span>
                    </button>

                    {/* BLOQUE 3: Widget para categoría */}
                    <button
                      type="button"
                      onClick={handleSelectCategoryOption}
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
                          width: "50px",
                          height: "50px",
                          borderRadius: "14px",
                          background: "#ecfdf5",
                          border: "1px solid #a7f3d0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Folder size={24} color="#10B981" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "1.08rem",
                            fontWeight: 800,
                            color: "#000000",
                            letterSpacing: "-0.01em",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Widget para categoría
                        </div>
                        <div
                          style={{
                            fontSize: "0.82rem",
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}
                        >
                          Asociá widgets a todos los productos de una categoría
                        </div>
                      </div>
                      <span style={{ color: "#10B981", fontSize: "1.3rem", fontWeight: 600 }}>
                        ›
                      </span>
                    </button>

                    {/* BLOQUE 4: Funciones Pro para tu tienda */}
                    <div
                      style={{
                        padding: "1.15rem",
                        borderRadius: "16px",
                        border: "1.5px solid #e5e7eb",
                        background: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.85rem",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "14px",
                            background: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Sparkles size={24} color="#10B981" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "1.08rem",
                              fontWeight: 800,
                              color: "#000000",
                              letterSpacing: "-0.01em",
                              marginBottom: "0.2rem",
                            }}
                          >
                            Funciones Pro para tu tienda
                          </div>
                          <div
                            style={{
                              fontSize: "0.82rem",
                              color: "#6b7280",
                              lineHeight: 1.35,
                            }}
                          >
                            IA, analíticas premium y prueba social
                          </div>
                        </div>
                      </div>

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
                              type="button"
                              onClick={() => handleProFeatureClick(feat.href)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.65rem",
                                padding: "0.65rem 0.75rem",
                                background: "#f9fafb",
                                border: "1px solid #f3f4f6",
                                borderRadius: "10px",
                                cursor: "pointer",
                                textAlign: "left",
                                width: "100%",
                                fontFamily: "inherit",
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
                                  borderRadius: "7px",
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
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.3rem",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.82rem",
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
                                    color: "#6b7280",
                                    marginTop: "0.05rem",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {feat.desc}
                                </div>
                              </div>
                              <span
                                style={{
                                  color: "#10B981",
                                  fontSize: "1.1rem",
                                  fontWeight: 300,
                                  flexShrink: 0,
                                }}
                              >
                                ›
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
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
                                  width: "55px",
                                  height: "55px",
                                  borderRadius: "12px",
                                  background: "#f9fafb",
                                  border: "1.5px solid #e5e7eb",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  position: "relative",
                                }}
                              >
                                {img ? (
                                  <img
                                    src={img}
                                    alt={p.name}
                                    loading="lazy"
                                    onError={(e) => {
                                      const parent = e.currentTarget.parentElement;
                                      e.currentTarget.style.display = "none";
                                      if (parent) {
                                        parent.style.background = "#ecfdf5";
                                        parent.innerHTML =
                                          '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>';
                                      }
                                    }}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      display: "block",
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      background: "#ecfdf5",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Package size={22} color="#10B981" />
                                  </div>
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

                {/* PASO CATEGORÍAS */}
                {modalStep === "categories" && (
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
                        placeholder="Buscar categoría (ej: AUDIO - AURICULARES)..."
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

                    {isLoadingCategories ? (
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
                          Cargando categorías de la tienda...
                        </span>
                      </div>
                    ) : filteredCategories.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "2.5rem 1rem",
                          color: "#6b7280",
                          fontSize: "0.9rem",
                        }}
                      >
                        {searchQuery
                          ? "No se encontraron categorías."
                          : "No hay categorías registradas en esta tienda."}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {filteredCategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleSelectCategory(cat)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.85rem",
                              padding: "0.85rem 1rem",
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
                                width: "42px",
                                height: "42px",
                                borderRadius: "10px",
                                background: "#ecfdf5",
                                border: "1px solid #a7f3d0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Tag size={20} color="#10B981" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: "0.95rem",
                                  fontWeight: 800,
                                  color: "#000000",
                                  lineHeight: 1.25,
                                  marginBottom: "0.15rem",
                                }}
                              >
                                {cat.name}
                              </div>
                              {cat.products_count !== undefined && (
                                <div
                                  style={{
                                    fontSize: "0.78rem",
                                    color: "#6b7280",
                                  }}
                                >
                                  {cat.products_count} {cat.products_count === 1 ? "producto" : "productos"}
                                </div>
                              )}
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
                        ))}
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
