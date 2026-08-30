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
  store: StoreData | null;
  productsCount: number;
  activeWidgetsCount: number;
  onboardingCompleted: boolean;
  plan: SerializedPlan | null;
}

interface Product {
  id: number;
  name: string;
  price: string | number;
  image_url?: string;
}

const TIENDANUBE_CLIENT_ID = "37382";
const ADMIN_EMAIL = "nevuxapp@gmail.com";

const WIDGET_TEMPLATES = [
  {
    id: "extras-interruptor",
    title: "Extras con interruptor",
    desc: "Suma un producto adicional que se agrega al carrito con solo activar un interruptor toggle.",
    icon: "⚡",
    tag: "NUEVO 🔥",
  },
  {
    id: "contador-visitas",
    title: "Contador de visitas",
    desc: "Muestra cuánta gente está mirando el producto en tiempo real para generar urgencia.",
    icon: "👁️",
    tag: "NUEVO 🚀",
  },
  {
    id: "cuenta-regresiva",
    title: "Oferta Relámpago",
    desc: "Cuenta regresiva estética para ofertas por tiempo limitado.",
    icon: "⏳",
    tag: "Escasez",
  },
  {
    id: "barra-progreso",
    title: "Envío Gratis",
    desc: "Muestra barra de progreso dinámica para envío bonificado.",
    icon: "🚚",
    tag: "Sube Ticket",
  },
  {
    id: "mensaje-alerta",
    title: "Urgencia y Stock",
    desc: "Simula stock crítico para acelerar la compra.",
    icon: "🔥",
    tag: "Conversión",
  },
  {
    id: "mensaje-garantia",
    title: "Confianza Total",
    desc: "Badges de pago seguro, garantía y envíos rápidos.",
    icon: "🛡️",
    tag: "Seguridad",
  },
];

export default function DashboardClient({
  email,
  userId,
  store,
  productsCount,
  activeWidgetsCount,
  plan,
}: DashboardClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"selection" | "products" | "catalog">("selection");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Products loading states
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const hasStore = store !== null;
  const isAdmin = (email || "").toLowerCase() === ADMIN_EMAIL;

  const tiendanubeInstallUrl = `https://www.tiendanube.com/apps/${TIENDANUBE_CLIENT_ID}/authorize?state=${userId}`;

  // Fetch products
  const loadProducts = async () => {
    if (!store?.store_id) return;
    setIsLoadingProducts(true);
    try {
      const res = await fetch(`/api/products?storeId=${store.store_id}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      }
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleOpenModal = () => {
    setModalStep("selection");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleSelectSpecificProduct = () => {
    setModalStep("products");
    loadProducts();
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalStep("catalog");
  };

  // Opción B: Manda directo a la pantalla de todos los widgets (fuera del modal)
  const handleSelectAllProducts = () => {
    setIsModalOpen(false);
    window.location.href = "/widgets/nuevo/todos";
  };

  const handleSelectWidgetType = (widgetType: string) => {
    setIsModalOpen(false);
    if (selectedProduct) {
      window.location.href = `/widgets/nuevo/producto/${selectedProduct.id}?type=${widgetType}`;
    }
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
        planActiveUntil: plan.planActiveUntilISO ? new Date(plan.planActiveUntilISO) : null,
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
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
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

        {/* Solo si NO hay tienda propia vinculada a ESTE usuario */}
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
                Vinculá <strong>tu</strong> tienda para métricas, widgets y productos reales de tu cuenta.
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
            Bienvenido a Nevux
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
                Hola, <strong style={{ opacity: 1 }}>{email}</strong> 👋
              </p>
            </div>

            {hasStore && (
              <button
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
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#10B981";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Sparkles size={16} />
                + Crear widget
              </button>
            )}
          </div>
        </motion.div>

        {/* Tienda propia: chip de estado */}
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

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {hasStore && planInfo && <PlanStatusCard plan={planInfo} />}
          <StatsCards productsCount={productsCount} activeWidgetsCount={activeWidgetsCount} />
          <MetricsCard />
          <RecientesCard storeId={store?.store_id} />
          <AccionesRapidas />
          <CentroAyuda />
        </div>
      </main>

      {/* MODAL FLOTANTE PREMIUM CON BACKDROP BLUR */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "1rem",
            }}
          >
            {/* Cerrar al hacer clic fuera */}
            <div
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              style={{
                background: "#ffffff",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "85vh",
                borderRadius: "24px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              {/* Header Modal */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 1.5rem",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {modalStep !== "selection" && (
                    <button
                      onClick={() => {
                        if (modalStep === "products") setModalStep("selection");
                        if (modalStep === "catalog") setModalStep("products");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>
                      {modalStep === "selection" && "Nuevo Widget"}
                      {modalStep === "products" && "Seleccioná el Producto"}
                      {modalStep === "catalog" && "Elegí el Widget Premium"}
                    </h3>
                    <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.5 }}>
                      {modalStep === "selection" && "¿Qué tipo de widget querés crear?"}
                      {modalStep === "products" && "Buscá el producto en tu Tiendanube"}
                      {modalStep === "catalog" &&
                        `Configurando para: ${selectedProduct?.name.substring(0, 30)}...`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#000000",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Contenido dinámico */}
              <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
                
                {/* PASO 1: SELECCION DE ALCANCE */}
                {modalStep === "selection" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div
                      onClick={handleSelectSpecificProduct}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "16px",
                        border: "1.5px solid #e5e7eb",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#10B981";
                        e.currentTarget.style.background = "rgba(16, 185, 129, 0.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.background = "none";
                      }}
                    >
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
                        <Package size={22} color="#10B981" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 700 }}>
                          Widget para un producto específico
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                          Buscá un producto y personalizalo para maximizar sus ventas individuales.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={handleSelectAllProducts}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "16px",
                        border: "1.5px solid #e5e7eb",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#10B981";
                        e.currentTarget.style.background = "rgba(16, 185, 129, 0.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.background = "none";
                      }}
                    >
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
                        <Layers size={22} color="#10B981" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 700 }}>
                          Widget para todos los productos
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.4 }}>
                          Te redirige al catálogo de widgets globales que se muestran en toda tu tienda.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PASO 2: SELECCIONAR PRODUCTO */}
                {modalStep === "products" && (
                  <div>
                    <div
                      style={{
                        position: "relative",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Search
                        size={18}
                        color="#9ca3af"
                        style={{ position: "absolute", left: "12px" }}
                      />
                      <input
                        type="text"
                        placeholder="Buscar producto por nombre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.65rem 0.65rem 2.5rem",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          outline: "none",
                          transition: "all 0.2s",
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
                          justifyContent: "center",
                          padding: "3rem 1rem",
                          gap: "0.5rem",
                        }}
                      >
                        <Loader2 size={24} color="#10B981" className="animate-spin" />
                        <span style={{ fontSize: "0.85rem", opacity: 0.6 }}>
                          Cargando productos de tu tienda...
                        </span>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "2.5rem 1rem",
                          opacity: 0.5,
                          fontSize: "0.85rem",
                        }}
                      >
                        {searchQuery
                          ? "No se encontraron productos que coincidan con la búsqueda."
                          : "No se encontraron productos vinculados en esta tienda."}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {filteredProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProduct(p)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "10px",
                              border: "1px solid #f3f4f6",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#10B981";
                              e.currentTarget.style.background = "rgba(16, 185, 129, 0.02)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#f3f4f6";
                              e.currentTarget.style.background = "none";
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <img
                                src={p.image_url || "/fallback-product.png"}
                                alt={p.name}
                                onError={(e) => {
                                  e.currentTarget.src = "https://placehold.co/50x50?text=NX";
                                }}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "6px",
                                  objectFit: "cover",
                                  background: "#f3f4f6",
                                }}
                              />
                              <div>
                                <div
                                  style={{
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    color: "#000000",
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {p.name}
                                </div>
                                <div style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "2px" }}>
                                  ID: {p.id}
                                </div>
                              </div>
                            </div>

                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10B981" }}>
                              ${typeof p.price === "number" ? p.price.toLocaleString("es-AR") : p.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* PASO 3: CATÁLOGO DE WIDGETS INTERNO */}
                {modalStep === "catalog" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.85rem",
                    }}
                  >
                    {WIDGET_TEMPLATES.map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => handleSelectWidgetType(tpl.id)}
                        style={{
                          padding: "1rem",
                          borderRadius: "14px",
                          border: "1.5px solid #e5e7eb",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                          position: "relative",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#10B981";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "1.5rem" }}>{tpl.icon}</span>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              background: "rgba(16, 185, 129, 0.12)",
                              color: "#059669",
                              padding: "2px 8px",
                              borderRadius: "999px",
                            }}
                          >
                            {tpl.tag}
                          </span>
                        </div>
                        <div>
                          <h4 style={{ margin: "0 0 0.2rem", fontSize: "0.85rem", fontWeight: 700 }}>
                            {tpl.title}
                          </h4>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.3 }}>
                            {tpl.desc}
                          </p>
                        </div>
                      </div>
                    ))}
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
