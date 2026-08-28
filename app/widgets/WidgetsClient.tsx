"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  Search,
  Store,
  Package,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardHeader from "../dashboard/components/DashboardHeader";
import SideMenu from "../dashboard/components/SideMenu";
import CentroAyuda from "../dashboard/components/CentroAyuda";
import EliminarWidgetModal from "@/components/widgets/EliminarWidgetModal";

interface StoreData {
  store_id: number;
  installed_at: string;
  is_active: boolean;
}

interface WidgetDefinition {
  name: string;
  icon: string;
  category: string;
  description: string;
}

interface WidgetRow {
  id: string;
  widget_slug: string;
  widget_type: string;
  target_type: string;
  target_product_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  definition: WidgetDefinition | null;
}

interface ProductInfo {
  id: number;
  name: string;
  image: string | null;
  slug: string;
}

interface WidgetsClientProps {
  email: string;
  store: StoreData | null;
  widgets: WidgetRow[];
  productsMap: Record<number, ProductInfo | null>;
}

export default function WidgetsClient({
  email,
  store,
  widgets,
  productsMap,
}: WidgetsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dismissBanner, setDismissBanner] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<WidgetRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const createdSlug = searchParams.get("created");
  const createdProductId = searchParams.get("product");
  const showCreatedBanner = !!createdSlug && !dismissBanner;

  const createdWidget = useMemo(() => {
    if (!createdSlug) return null;
    return widgets.find((w) => {
      if (w.widget_slug !== createdSlug) return false;
      if (createdProductId) {
        return String(w.target_product_id) === createdProductId;
      }
      return w.target_type === "all";
    });
  }, [createdSlug, createdProductId, widgets]);

  const createdWidgetName =
    createdWidget?.definition?.name ?? createdSlug ?? "Widget";

  const filteredWidgets = useMemo(() => {
    if (!search.trim()) return widgets;
    const q = search.toLowerCase().trim();
    return widgets.filter((w) => {
      const name = w.definition?.name?.toLowerCase() ?? "";
      const cat = w.definition?.category?.toLowerCase() ?? "";
      const slug = w.widget_slug.toLowerCase();
      const productName =
        w.target_product_id && productsMap[w.target_product_id]
          ? productsMap[w.target_product_id]!.name.toLowerCase()
          : "";
      return (
        name.includes(q) ||
        cat.includes(q) ||
        slug.includes(q) ||
        productName.includes(q)
      );
    });
  }, [widgets, search, productsMap]);

  const groupedWidgets = useMemo(() => {
    const generales = filteredWidgets.filter((w) => w.target_type === "all");
    const porProducto = new Map<number, WidgetRow[]>();

    filteredWidgets
      .filter((w) => w.target_type === "product" && w.target_product_id)
      .forEach((w) => {
        const pid = w.target_product_id as number;
        if (!porProducto.has(pid)) porProducto.set(pid, []);
        porProducto.get(pid)!.push(w);
      });

    return { generales, porProducto };
  }, [filteredWidgets]);

  const totalWidgets = widgets.length;
  const activeWidgets = widgets.filter((w) => w.is_active).length;

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleToggle = useCallback(async (widget: WidgetRow) => {
    setBusyId(widget.id);
    try {
      const res = await fetch("/api/widgets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: widget.id,
          is_active: !widget.is_active,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo actualizar el widget");
      }
      showToast(
        "success",
        !widget.is_active ? "Widget activado" : "Widget desactivado"
      );
      router.refresh();
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Error al actualizar";
      showToast("error", errMsg);
    } finally {
      setBusyId(null);
    }
  }, [router, showToast]);

  const handleDelete = useCallback((widget: WidgetRow) => {
    setDeleteTarget(widget);
  }, []);

  const handleCloseModal = useCallback(() => {
    if (isDeleting) return;
    setDeleteTarget(null);
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const widget = deleteTarget;

    setIsDeleting(true);
    setBusyId(widget.id);
    try {
      const res = await fetch(`/api/widgets?id=${widget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo eliminar el widget");
      }
      showToast("success", "Widget eliminado");
      setDeleteTarget(null);
      router.refresh();
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : "Error al eliminar";
      showToast("error", errMsg);
    } finally {
      setIsDeleting(false);
      setBusyId(null);
    }
  }, [deleteTarget, router, showToast]);

  const getScopeLabel = useCallback((widget: WidgetRow): string => {
    if (widget.target_type === "all") {
      return "Todos los productos";
    }
    if (widget.target_product_id) {
      const product = productsMap[widget.target_product_id];
      if (product) {
        return `Producto: ${product.name}`;
      }
      return `Producto #${widget.target_product_id}`;
    }
    return "—";
  }, [productsMap]);

  const goToEditor = useCallback((widget: WidgetRow) => {
    const base = `/widgets/editar/${widget.widget_slug}`;
    const url =
      widget.target_type === "product" && widget.target_product_id
        ? `${base}?product=${widget.target_product_id}`
        : base;
    router.push(url);
  }, [router]);

  const goToProduct = useCallback((productId: number) => {
    const p = productsMap[productId];
    if (!p) return;
    window.open(`https://tienda.com.ar/productos/${p.slug}`, "_blank");
  }, [productsMap]);

  const hasWidgets = totalWidgets > 0;

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
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.25rem 3rem",
          boxSizing: "border-box",
        }}
      >
        {/* Volver al dashboard */}
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.85rem",
            color: "#000000",
            textDecoration: "none",
            marginBottom: "1rem",
            fontWeight: 500,
            opacity: 0.6,
          }}
        >
          <ArrowLeft size={14} />
          Volver al dashboard
        </Link>

        {/* Banner de widget creado */}
        <AnimatePresence>
          {showCreatedBanner && createdWidget && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                border: "1px solid #6ee7b7",
                borderRadius: "16px",
                padding: "1.25rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.9rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#059669",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#065f46",
                    marginBottom: "0.75rem",
                  }}
                >
                  Widget &quot;{createdWidgetName}&quot; creado exitosamente
                </div>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => goToEditor(createdWidget)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: "transparent",
                      border: "1.5px solid #059669",
                      color: "#065f46",
                      padding: "0.55rem 1.1rem",
                      borderRadius: "999px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <Pencil size={14} />
                    Editar widget
                  </button>
                  {createdWidget.target_product_id &&
                    productsMap[createdWidget.target_product_id] && (
                      <button
                        type="button"
                        onClick={() =>
                          goToProduct(createdWidget.target_product_id as number)
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          background: "transparent",
                          border: "1.5px solid #059669",
                          color: "#065f46",
                          padding: "0.55rem 1.1rem",
                          borderRadius: "999px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        <ExternalLink size={14} />
                        Abrir el producto
                      </button>
                    )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDismissBanner(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#065f46",
                  cursor: "pointer",
                  padding: "4px",
                  flexShrink: 0,
                }}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                Mis widgets
              </h1>
              <p
                style={{
                  margin: "0.5rem 0 0",
                  fontSize: "0.95rem",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                {!store
                  ? "Conectá tu Tiendanube para empezar a crear widgets."
                  : hasWidgets
                  ? `${activeWidgets} activo${
                      activeWidgets === 1 ? "" : "s"
                    } · ${totalWidgets} total`
                  : "Todavía no creaste ningún widget. Empezá creando uno."}
              </p>
            </div>

            {store && (
              <Link
                href="/widgets/nuevo/todos"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.7rem 1.25rem",
                  borderRadius: "999px",
                  border: "none",
                  background: "#10B981",
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
                  fontFamily: "inherit",
                  textDecoration: "none",
                }}
              >
                <Plus size={16} />
                Crear widget
              </Link>
            )}
          </div>
        </motion.div>

        {/* Buscador */}
        {store && hasWidgets && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            style={{
              position: "relative",
              marginBottom: "1.5rem",
            }}
          >
            <Search
              size={18}
              color="#000000"
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                opacity: 0.45,
              }}
            />
            <input
              type="text"
              placeholder="Buscá un producto, categoría o widget..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1rem 0.85rem 2.75rem",
                borderRadius: "999px",
                border: "1px solid #e5e7eb",
                background: "#ffffff",
                fontSize: "0.9rem",
                color: "#000000",
                outline: "none",
                fontFamily: "inherit",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#10B981";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            />
          </motion.div>
        )}

        {/* Contenido principal */}
        {!store ? (
          <EmptyState
            title="Conectá tu Tiendanube"
            description="Necesitás vincular tu tienda para poder crear widgets."
          />
        ) : !hasWidgets ? (
          <EmptyState
            title="Aún no tenés widgets"
            description="Empezá creando tu primer widget para aumentar tus ventas."
            ctaLabel="Crear widget"
            ctaHref="/widgets/nuevo/todos"
          />
        ) : filteredWidgets.length === 0 ? (
          <EmptyState
            title="No se encontraron widgets"
            description={`No hay resultados para "${search}". Probá con otro término.`}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {groupedWidgets.generales.length > 0 && (
              <WidgetGroup
                icon={
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "#10B981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    <Store size={22} />
                  </div>
                }
                title="Todos los productos"
                subtitle={`${groupedWidgets.generales.length} widget${
                  groupedWidgets.generales.length === 1 ? "" : "s"
                }`}
                widgets={groupedWidgets.generales}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={goToEditor}
                busyId={busyId}
              />
            )}

            {Array.from(groupedWidgets.porProducto.entries()).map(
              ([productId, wgs]) => {
                const product = productsMap[productId];
                return (
                  <WidgetGroup
                    key={productId}
                    icon={
                      product?.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            objectFit: "cover",
                            flexShrink: 0,
                            background: "#f3f4f6",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#000000",
                            opacity: 0.45,
                            flexShrink: 0,
                          }}
                        >
                          <Package size={22} />
                        </div>
                      )
                    }
                    title={product?.name ?? `Producto #${productId}`}
                    subtitle={
                      product
                        ? `${wgs.length} widget${wgs.length === 1 ? "" : "s"}`
                        : "Producto no disponible en Tiendanube"
                    }
                    productDisabled={!product}
                    widgets={wgs}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={goToEditor}
                    busyId={busyId}
                  />
                );
              }
            )}
          </div>
        )}

        {/* Centro de ayuda */}
        <div style={{ marginTop: "2.5rem" }}>
          <CentroAyuda />
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            style={{
              position: "fixed",
              bottom: "1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              background: toast.type === "success" ? "#059669" : "#dc2626",
              color: "#fff",
              padding: "0.85rem 1.4rem",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: 600,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      <EliminarWidgetModal
        isOpen={!!deleteTarget}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        widgetName={
          deleteTarget?.definition?.name ??
          deleteTarget?.widget_slug ??
          "Widget"
        }
        scopeLabel={deleteTarget ? getScopeLabel(deleteTarget) : ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}

/* ================= EMPTY STATE ================= */

function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "3rem 2rem",
        textAlign: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "18px",
          background: "#ecfdf5",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
        }}
      >
        <LayoutGrid size={34} color="#10B981" strokeWidth={1.75} />
      </div>

      <h2
        style={{
          margin: "0 0 0.75rem",
          fontSize: "1.35rem",
          fontWeight: 700,
          color: "#000000",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: "0 auto 1.5rem",
          maxWidth: "460px",
          fontSize: "0.95rem",
          color: "#000000",
          opacity: 0.6,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem 1.4rem",
            borderRadius: "999px",
            background: "#10B981",
            color: "#ffffff",
            fontSize: "0.9rem",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
          }}
        >
          <Plus size={16} />
          {ctaLabel}
        </Link>
      )}
    </motion.div>
  );
}

/* ================= WIDGET GROUP ================= */

function WidgetGroup({
  icon,
  title,
  subtitle,
  widgets,
  onToggle,
  onDelete,
  onEdit,
  busyId,
  productDisabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  widgets: WidgetRow[];
  onToggle: (w: WidgetRow) => void;
  onDelete: (w: WidgetRow) => void;
  onEdit: (w: WidgetRow) => void;
  busyId: string | null;
  productDisabled?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1.25rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.9rem",
          marginBottom: "1rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        {icon}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#000000",
              opacity: productDisabled ? 0.45 : 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#000000",
              opacity: 0.6,
              marginTop: "0.15rem",
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {widgets.map((w) => (
          <WidgetRowItem
            key={w.id}
            widget={w}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            busy={busyId === w.id}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ================= WIDGET ROW ================= */

function WidgetRowItem({
  widget,
  onToggle,
  onDelete,
  onEdit,
  busy,
}: {
  widget: WidgetRow;
  onToggle: (w: WidgetRow) => void;
  onDelete: (w: WidgetRow) => void;
  onEdit: (w: WidgetRow) => void;
  busy: boolean;
}) {
  const name = widget.definition?.name ?? widget.widget_slug;
  const icon = widget.definition?.icon ?? "🧩";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        opacity: busy ? 0.6 : 1,
        transition: "opacity 0.15s",
        flexWrap: "wrap",
      }}
    >
      {/* Toggle */}
      <button
        type="button"
        onClick={() => onToggle(widget)}
        disabled={busy}
        aria-label={widget.is_active ? "Desactivar" : "Activar"}
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: busy ? "wait" : "pointer",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "22px",
            borderRadius: "999px",
            background: widget.is_active ? "#10B981" : "#e5e7eb",
            position: "relative",
            transition: "background 0.15s",
          }}
        >
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#ffffff",
              position: "absolute",
              top: "2px",
              left: widget.is_active ? "20px" : "2px",
              transition: "left 0.15s",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </button>

      {/* Chip con nombre */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.4rem 0.85rem",
          background: widget.is_active ? "#10B981" : "#000000",
          color: "#ffffff",
          borderRadius: "999px",
          fontSize: "0.8rem",
          fontWeight: 600,
          maxWidth: "100%",
          minWidth: 0,
          opacity: widget.is_active ? 1 : 0.75,
        }}
      >
        <span style={{ fontSize: "0.95rem", lineHeight: 1 }}>{icon}</span>
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Editar */}
      <button
        type="button"
        onClick={() => onEdit(widget)}
        disabled={busy}
        aria-label="Editar"
        title="Editar widget"
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          border: "1.5px solid #e5e7eb",
          background: "#ffffff",
          color: "#000000",
          cursor: busy ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (!busy) {
            e.currentTarget.style.background = "#ecfdf5";
            e.currentTarget.style.borderColor = "#10B981";
            e.currentTarget.style.color = "#10B981";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.color = "#000000";
        }}
      >
        <Pencil size={16} />
      </button>

      {/* Eliminar (Rojo es permitido por ser acción destructiva de advertencia) */}
      <button
        type="button"
        onClick={() => onDelete(widget)}
        disabled={busy}
        aria-label="Eliminar"
        title="Eliminar widget"
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          border: "1.5px solid #fecaca",
          background: "#ffffff",
          color: "#dc2626",
          cursor: busy ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (!busy) {
            e.currentTarget.style.background = "#fef2f2";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#ffffff";
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
    }
