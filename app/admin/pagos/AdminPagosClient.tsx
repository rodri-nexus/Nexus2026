"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Eye,
  Check,
  X,
  Loader2,
  LogOut,
  Shield,
  AlertCircle,
  Calendar,
  User,
  Store,
  Copy,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Mail,
  RefreshCw,
  Zap,
  Search,
  Filter,
  RotateCcw,
  Download,
} from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import { createClient } from "@/lib/supabase-browser";
import type { PaymentWithUser } from "./page";

interface AdminPagosClientProps {
  adminEmail: string;
  payments: PaymentWithUser[];
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    totalRevenue: number;
  };
}

type TabKey = "pending" | "approved" | "rejected" | "all";
type DateFilterKey = "all" | "today" | "7days" | "30days" | "thisMonth";

// ═══════════════════════════════════════════════
// HELPERS: construir mailto: para el cliente
// ═══════════════════════════════════════════════

function buildApprovedEmailMailto(
  customerEmail: string,
  amount: number,
  newPlanEndISO: string
): string {
  const formattedAmount = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount);

  const endDate = new Date(newPlanEndISO).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const subject = "✅ Tu plan Nevux está activo";

  const body = `¡Hola!

Confirmamos que recibimos tu pago de ${formattedAmount} y tu plan Nevux ya está ACTIVO. 🎉

📅 Tu plan está activo hasta el ${endDate}.

Ya podés volver a tu dashboard y:
• Instalar y personalizar los 15 widgets disponibles
• Activar y desactivar los que quieras en cualquier momento
• Modificar colores, textos y diseño para que combinen con tu tienda

🎁 Beneficios por fidelidad
Cuanto más tiempo lleves con Nevux, más recompensas vas a desbloquear:
• Mes 3: widgets premium + 1 widget personalizado único
• Mes 6: más widgets custom + descuentos exclusivos
• Mes 12+: beneficios VIP

👉 Volvé a tu dashboard: https://nexus2026-gx7e.vercel.app/dashboard

Si tenés cualquier consulta, respondé este mail y te ayudamos.

Gracias por confiar en Nevux 🚀`;

  return `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

function buildRejectedEmailMailto(
  customerEmail: string,
  reason: string
): string {
  const subject = "❌ Problema con tu comprobante Nevux";

  const body = `¡Hola!

Recibimos tu comprobante de pago, pero lamentablemente NO pudimos aprobarlo.

📝 Motivo del rechazo:
${reason}

No te preocupes: podés volver a subir un nuevo comprobante desde el mismo lugar. Todavía tenés tu cuenta y tus widgets guardados.

👉 Subir un nuevo comprobante: https://nexus2026-gx7e.vercel.app/plan/pagar

Si tenés dudas o necesitás ayuda con el pago, respondé este mail y te ayudamos personalmente.

Gracias por confiar en Nevux 🚀`;

  return `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

// ═══════════════════════════════════════════════
// HELPER: filtrar por rango de fechas
// ═══════════════════════════════════════════════
function isInDateRange(dateStr: string, range: DateFilterKey): boolean {
  if (range === "all") return true;
  const date = new Date(dateStr);
  const now = new Date();

  if (range === "today") {
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  if (range === "7days") {
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    return date >= sevenDaysAgo;
  }

  if (range === "30days") {
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);
    return date >= thirtyDaysAgo;
  }

  if (range === "thisMonth") {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  return true;
}

// ═══════════════════════════════════════════════
// HELPER: EXPORTAR A CSV
// ═══════════════════════════════════════════════

function csvEscape(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  const needsQuotes = /[",\n\r]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return needsQuotes ? `"${escaped}"` : escaped;
}

function formatDateForCSV(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function translateStatus(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
  };
  return map[status] || status;
}

function exportPaymentsToCSV(payments: PaymentWithUser[]) {
  const headers = [
    "ID Pago",
    "Fecha creación",
    "Estado",
    "Email cliente",
    "Store ID",
    "Monto (ARS)",
    "Método pago",
    "Referencia transferencia",
    "Meses activo",
    "Fecha aprobación",
    "Aprobado por",
    "Fecha rechazo",
    "Razón rechazo",
    "Notas admin",
  ];

  const rows = payments.map((p) => [
    p.id,
    formatDateForCSV(p.created_at),
    translateStatus(p.status),
    p.user_email || "",
    p.store_id,
    p.amount,
    p.payment_method || "",
    p.transfer_reference || "",
    p.store_months_active ?? 0,
    formatDateForCSV(p.approved_at),
    p.approved_by || "",
    formatDateForCSV(p.rejected_at),
    p.rejected_reason || "",
    p.admin_notes || "",
  ]);

  const csvContent = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(",")),
  ].join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(
    today.getDate()
  )}`;
  const filename = `nevux-pagos-${dateStr}.csv`;

  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════

export default function AdminPagosClient({
  adminEmail,
  payments,
  stats,
}: AdminPagosClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterKey>("all");
  const [viewingReceipt, setViewingReceipt] = useState<PaymentWithUser | null>(
    null
  );
  const [approvingPayment, setApprovingPayment] =
    useState<PaymentWithUser | null>(null);
  const [rejectingPayment, setRejectingPayment] =
    useState<PaymentWithUser | null>(null);
  const [showCronModal, setShowCronModal] = useState(false);

  const filteredPayments = useMemo(() => {
    let result = payments;

    if (activeTab !== "all") {
      result = result.filter((p) => p.status === activeTab);
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery.length > 0) {
      result = result.filter((p) =>
        (p.user_email || "").toLowerCase().includes(trimmedQuery)
      );
    }

    if (dateFilter !== "all") {
      result = result.filter((p) => isInDateRange(p.created_at, dateFilter));
    }

    return result;
  }, [payments, activeTab, searchQuery, dateFilter]);

  const totalInTab = useMemo(() => {
    if (activeTab === "all") return payments.length;
    return payments.filter((p) => p.status === activeTab).length;
  }, [payments, activeTab]);

  const hasActiveFilters = searchQuery.trim().length > 0 || dateFilter !== "all";
  const isFiltering = hasActiveFilters;

  function handleClearFilters() {
    setSearchQuery("");
    setDateFilter("all");
  }

  function handleExportCSV() {
    if (filteredPayments.length === 0) return;
    exportPaymentsToCSV(filteredPayments);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        background: "#f9fafb",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid #f3f4f6",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <NevuxLogo size="small" />
          <div
            style={{
              padding: "0.25rem 0.6rem",
              background: "#000000",
              color: "white",
              borderRadius: "6px",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Admin
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <button
            onClick={() => setShowCronModal(true)}
            title="Ejecutar cron manualmente"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.5rem 0.7rem",
              background: "transparent",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              color: "#000000",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Zap size={14} color="#10B981" />
            Cron
          </button>

          <button
            onClick={handleLogout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.5rem 0.85rem",
              background: "transparent",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              color: "#000000",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </header>

      {/* Contenido */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 1rem 3rem 1rem",
          boxSizing: "border-box",
        }}
      >
        {/* Título */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 800,
              color: "#000000",
              margin: "0 0 0.4rem 0",
              letterSpacing: "-0.02em",
            }}
          >
            Panel de pagos
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#000000",
              opacity: 0.6,
              margin: 0,
            }}
          >
            Aprobá o rechazá los pagos de los clientes
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <StatCard
            icon={<Clock size={18} />}
            label="Pendientes"
            value={stats.pending}
            color="#f59e0b"
            bg="#fef3c7"
            highlight={stats.pending > 0}
          />
          <StatCard
            icon={<CheckCircle2 size={18} />}
            label="Aprobados"
            value={stats.approved}
            color="#059669"
            bg="#d1fae5"
          />
          <StatCard
            icon={<XCircle size={18} />}
            label="Rechazados"
            value={stats.rejected}
            color="#dc2626"
            bg="#fee2e2"
          />
          <StatCard
            icon={<DollarSign size={18} />}
            label="Ingresos totales"
            value={`$${stats.totalRevenue.toLocaleString("es-AR")}`}
            color="#10B981"
            bg="#ecfdf5"
            isText
          />
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            marginBottom: "1rem",
            overflowX: "auto",
            paddingBottom: "0.25rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <TabButton
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
            count={stats.pending}
            urgent={stats.pending > 0}
          >
            Pendientes
          </TabButton>
          <TabButton
            active={activeTab === "approved"}
            onClick={() => setActiveTab("approved")}
            count={stats.approved}
          >
            Aprobados
          </TabButton>
          <TabButton
            active={activeTab === "rejected"}
            onClick={() => setActiveTab("rejected")}
            count={stats.rejected}
          >
            Rechazados
          </TabButton>
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            count={payments.length}
          >
            Todos
          </TabButton>
        </div>

        {/* Filtros */}
        <FiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          resultsCount={filteredPayments.length}
          totalCount={totalInTab}
          onExportCSV={handleExportCSV}
        />

        {/* Lista de pagos */}
        {filteredPayments.length === 0 ? (
          <EmptyState tab={activeTab} isFiltering={isFiltering} />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onViewReceipt={() => setViewingReceipt(payment)}
                onApprove={() => setApprovingPayment(payment)}
                onReject={() => setRejectingPayment(payment)}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#000000",
            opacity: 0.5,
          }}
        >
          Admin · {adminEmail}
        </div>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {viewingReceipt && (
          <ReceiptModal
            payment={viewingReceipt}
            onClose={() => setViewingReceipt(null)}
          />
        )}
        {approvingPayment && (
          <ApproveModal
            payment={approvingPayment}
            onClose={() => setApprovingPayment(null)}
            onSuccess={() => {
              setApprovingPayment(null);
              router.refresh();
            }}
          />
        )}
        {rejectingPayment && (
          <RejectModal
            payment={rejectingPayment}
            onClose={() => setRejectingPayment(null)}
            onSuccess={() => {
              setRejectingPayment(null);
              router.refresh();
            }}
          />
        )}
        {showCronModal && (
          <CronModal onClose={() => setShowCronModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
// ═══════════════════════════════════════════════
// FILTERS BAR (con botón CSV)
// ═══════════════════════════════════════════════
function FiltersBar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  hasActiveFilters,
  onClearFilters,
  resultsCount,
  totalCount,
  onExportCSV,
}: {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  dateFilter: DateFilterKey;
  onDateFilterChange: (v: DateFilterKey) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  resultsCount: number;
  totalCount: number;
  onExportCSV: () => void;
}) {
  const dateFilters: { key: DateFilterKey; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "today", label: "Hoy" },
    { key: "7days", label: "7 días" },
    { key: "30days", label: "30 días" },
    { key: "thisMonth", label: "Este mes" },
  ];

  const canExport = resultsCount > 0;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #f3f4f6",
        borderRadius: "14px",
        padding: "0.85rem 1rem",
        marginBottom: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "relative", marginBottom: "0.85rem" }}>
        <Search
          size={16}
          color="#000000"
          style={{
            position: "absolute",
            left: "0.85rem",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por email del cliente..."
          style={{
            width: "100%",
            padding: "0.65rem 2.5rem 0.65rem 2.4rem",
            border:
              searchQuery.length > 0
                ? "1px solid #10B981"
                : "1px solid #e5e7eb",
            borderRadius: "10px",
            fontSize: "0.88rem",
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            background: "#f9fafb",
            color: "#000000",
            transition: "border-color 0.15s",
          }}
        />
        {searchQuery.length > 0 && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Limpiar búsqueda"
            style={{
              position: "absolute",
              right: "0.65rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "none",
              background: "#000000",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#000000",
            opacity: 0.5,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginRight: "0.25rem",
          }}
        >
          <Filter size={11} />
          Fecha
        </div>
        {dateFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => onDateFilterChange(f.key)}
            style={{
              padding: "0.35rem 0.75rem",
              background: dateFilter === f.key ? "#10B981" : "white",
              color: dateFilter === f.key ? "white" : "#000000",
              border:
                dateFilter === f.key
                  ? "1px solid #10B981"
                  : "1px solid #e5e7eb",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid #f3f4f6",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            fontSize: "0.78rem",
            color: "#000000",
            opacity: 0.65,
            fontWeight: 500,
          }}
        >
          Mostrando{" "}
          <strong
            style={{
              color: hasActiveFilters ? "#10B981" : "#000000",
              opacity: 1,
              fontWeight: 800,
            }}
          >
            {resultsCount}
          </strong>{" "}
          de{" "}
          <strong style={{ color: "#000000", opacity: 1, fontWeight: 800 }}>
            {totalCount}
          </strong>{" "}
          {totalCount === 1 ? "pago" : "pagos"}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.35rem 0.75rem",
                background: "transparent",
                color: "#10B981",
                border: "1px solid #a7f3d0",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <RotateCcw size={12} />
              Limpiar filtros
            </button>
          )}

          <button
            onClick={onExportCSV}
            disabled={!canExport}
            title={
              canExport
                ? "Descargar CSV con los pagos mostrados"
                : "No hay pagos para exportar"
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.4rem 0.85rem",
              background: canExport ? "#000000" : "#f3f4f6",
              color: canExport ? "white" : "#000000",
              border: "none",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: canExport ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              opacity: canExport ? 1 : 0.5,
              transition: "all 0.15s",
            }}
          >
            <Download size={12} />
            Exportar CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════
function StatCard({
  icon,
  label,
  value,
  color,
  bg,
  isText = false,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  bg: string;
  isText?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "1rem 1.15rem",
        borderRadius: "14px",
        border: highlight ? `2px solid ${color}` : "1px solid #f3f4f6",
        boxShadow: highlight
          ? `0 4px 20px ${color}25`
          : "0 2px 8px rgba(0,0,0,0.03)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "34px",
          height: "34px",
          borderRadius: "10px",
          background: bg,
          color: color,
          marginBottom: "0.6rem",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: "0.72rem",
          color: "#000000",
          opacity: 0.6,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "0.15rem",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: isText ? "1.1rem" : "1.5rem",
          fontWeight: 800,
          color: highlight ? color : "#000000",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB BUTTON
// ═══════════════════════════════════════════════
function TabButton({
  active,
  onClick,
  children,
  count,
  urgent = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
  urgent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.6rem 1rem",
        background: active ? "#000000" : "white",
        color: active ? "white" : "#000000",
        border: active ? "1px solid #000000" : "1px solid #e5e7eb",
        borderRadius: "999px",
        fontSize: "0.85rem",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        transition: "all 0.15s",
      }}
    >
      {children}
      {count > 0 && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "20px",
            height: "20px",
            padding: "0 6px",
            background: active
              ? "white"
              : urgent
              ? "#10B981"
              : "#f3f4f6",
            color: active ? "#000000" : urgent ? "white" : "#000000",
            borderRadius: "999px",
            fontSize: "0.7rem",
            fontWeight: 800,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════
function EmptyState({
  tab,
  isFiltering,
}: {
  tab: TabKey;
  isFiltering: boolean;
}) {
  if (isFiltering) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "3rem 1.5rem",
          textAlign: "center",
          border: "1px solid #f3f4f6",
        }}
      >
        <div style={{ marginBottom: "0.85rem" }}>
          <Search size={40} color="#000000" style={{ opacity: 0.3 }} />
        </div>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#000000",
            opacity: 0.75,
            margin: "0 0 0.35rem 0",
            fontWeight: 700,
          }}
        >
          Sin resultados
        </p>
        <p
          style={{
            fontSize: "0.82rem",
            color: "#000000",
            opacity: 0.5,
            margin: 0,
          }}
        >
          No se encontraron pagos que coincidan con los filtros
        </p>
      </div>
    );
  }

  const messages: Record<TabKey, { icon: React.ReactNode; text: string }> = {
    pending: {
      icon: <Clock size={40} color="#000000" style={{ opacity: 0.3 }} />,
      text: "No hay pagos pendientes por ahora",
    },
    approved: {
      icon: (
        <CheckCircle2 size={40} color="#000000" style={{ opacity: 0.3 }} />
      ),
      text: "Todavía no aprobaste ningún pago",
    },
    rejected: {
      icon: <XCircle size={40} color="#000000" style={{ opacity: 0.3 }} />,
      text: "Todavía no rechazaste ningún pago",
    },
    all: {
      icon: <DollarSign size={40} color="#000000" style={{ opacity: 0.3 }} />,
      text: "Todavía no hay ningún pago registrado",
    },
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "3rem 1.5rem",
        textAlign: "center",
        border: "1px solid #f3f4f6",
      }}
    >
      <div style={{ marginBottom: "0.85rem" }}>{messages[tab].icon}</div>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#000000",
          opacity: 0.6,
          margin: 0,
          fontWeight: 500,
        }}
      >
        {messages[tab].text}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAYMENT CARD
// ═══════════════════════════════════════════════
function PaymentCard({
  payment,
  onViewReceipt,
  onApprove,
  onReject,
}: {
  payment: PaymentWithUser;
  onViewReceipt: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isPending = payment.status === "pending";
  const isApproved = payment.status === "approved";
  const isRejected = payment.status === "rejected";

  const createdDate = new Date(payment.created_at);
  const formattedDate = createdDate.toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const shortId = payment.id.slice(0, 8).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "1.15rem",
        border: `1px solid ${
          isPending ? "#fef3c7" : isApproved ? "#d1fae5" : "#fee2e2"
        }`,
        boxShadow: isPending
          ? "0 4px 14px rgba(245, 158, 11, 0.08)"
          : "0 2px 8px rgba(0,0,0,0.03)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.5rem",
          marginBottom: "0.85rem",
          flexWrap: "wrap",
        }}
      >
        <StatusBadge status={payment.status} />
        <div
          style={{
            fontSize: "0.7rem",
            color: "#000000",
            opacity: 0.5,
            fontWeight: 600,
          }}
        >
          {formattedDate}
        </div>
      </div>

      <div
        style={{
          fontSize: "1.75rem",
          fontWeight: 900,
          color: "#000000",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: "0.85rem",
        }}
      >
        ${payment.amount.toLocaleString("es-AR")}
      </div>

      <div
        style={{
          background: "#f9fafb",
          borderRadius: "10px",
          padding: "0.85rem 1rem",
          marginBottom: "0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <InfoRow
          icon={<User size={13} />}
          label="Cliente"
          value={payment.user_email || "—"}
        />
        <InfoRow
          icon={<Store size={13} />}
          label="Tienda"
          value={`#${payment.store_id}`}
        />
        <InfoRow
          icon={<Calendar size={13} />}
          label="Meses activo"
          value={`${payment.store_months_active} ${
            payment.store_months_active === 1 ? "mes" : "meses"
          }`}
        />
        {payment.transfer_reference && (
          <InfoRow
            icon={<Copy size={13} />}
            label="Ref."
            value={payment.transfer_reference}
            mono
          />
        )}
        <InfoRow
          icon={<Shield size={13} />}
          label="ID pago"
          value={`#${shortId}`}
          mono
        />
      </div>

      {isApproved && payment.approved_at && (
        <div
          style={{
            background: "#d1fae5",
            borderRadius: "10px",
            padding: "0.65rem 0.85rem",
            marginBottom: "0.85rem",
            fontSize: "0.78rem",
            color: "#065f46",
            fontWeight: 600,
          }}
        >
          ✓ Aprobado el{" "}
          {new Date(payment.approved_at).toLocaleDateString("es-AR")}
          {payment.approved_by && ` por ${payment.approved_by}`}
        </div>
      )}
      {isRejected && payment.rejected_reason && (
        <div
          style={{
            background: "#fee2e2",
            borderRadius: "10px",
            padding: "0.65rem 0.85rem",
            marginBottom: "0.85rem",
            fontSize: "0.78rem",
            color: "#991b1b",
            fontWeight: 600,
          }}
        >
          ✗ Rechazado: {payment.rejected_reason}
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {payment.receipt_url && (
          <button
            onClick={onViewReceipt}
            style={{
              flex: "1 1 100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              padding: "0.7rem 1rem",
              background: "#000000",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Eye size={15} />
            Ver comprobante
          </button>
        )}
        {isPending && (
          <>
            <button
              onClick={onApprove}
              style={{
                flex: "1 1 45%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.7rem 1rem",
                background: "#059669",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Check size={15} />
              Aprobar
            </button>
            <button
              onClick={onReject}
              style={{
                flex: "1 1 45%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.7rem 1rem",
                background: "white",
                color: "#dc2626",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <X size={15} />
              Rechazar
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════
// STATUS BADGE
// ═══════════════════════════════════════════════
function StatusBadge({ status }: { status: string }) {
  const config =
    {
      pending: {
        bg: "#fef3c7",
        color: "#b45309",
        icon: <Clock size={11} />,
        text: "Pendiente",
      },
      approved: {
        bg: "#d1fae5",
        color: "#059669",
        icon: <CheckCircle2 size={11} />,
        text: "Aprobado",
      },
      rejected: {
        bg: "#fee2e2",
        color: "#dc2626",
        icon: <XCircle size={11} />,
        text: "Rechazado",
      },
    }[status] || {
      bg: "#f3f4f6",
      color: "#000000",
      icon: <AlertCircle size={11} />,
      text: status,
    };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.3rem 0.7rem",
        background: config.bg,
        color: config.color,
        borderRadius: "999px",
        fontSize: "0.72rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {config.icon}
      {config.text}
    </span>
  );
}

// ═══════════════════════════════════════════════
// INFO ROW
// ═══════════════════════════════════════════════
function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "0.82rem",
      }}
    >
      <span
        style={{
          color: "#000000",
          opacity: 0.4,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          color: "#000000",
          opacity: 0.6,
          fontWeight: 500,
          minWidth: "70px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "#000000",
          fontWeight: 700,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: mono
            ? "'SF Mono', Monaco, Consolas, monospace"
            : "inherit",
          fontSize: mono ? "0.78rem" : "0.82rem",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MODAL: VER COMPROBANTE
// ═══════════════════════════════════════════════
function ReceiptModal({
  payment,
  onClose,
}: {
  payment: PaymentWithUser;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useMemo(() => {
    async function fetchUrl() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/receipt-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: payment.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error");
        setUrl(data.url);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUrl();
  }, [payment.id]);

  const isPdf = url?.toLowerCase().includes(".pdf");

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalContent title="Comprobante de pago" onClose={onClose} large>
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
            <Loader2
              size={32}
              color="#10B981"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <p
              style={{
                marginTop: "1rem",
                color: "#000000",
                opacity: 0.6,
                fontSize: "0.9rem",
              }}
            >
              Cargando comprobante...
            </p>
          </div>
        )}
        {error && (
          <div
            style={{
              padding: "1rem",
              background: "#fee2e2",
              borderRadius: "10px",
              color: "#991b1b",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}
        {url && !loading && (
          <div>
            {isPdf ? (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <FileText
                  size={56}
                  color="#10B981"
                  style={{ marginBottom: "1rem" }}
                />
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#000000",
                    marginBottom: "1.25rem",
                    fontWeight: 600,
                  }}
                >
                  Comprobante en PDF
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.7rem 1.4rem",
                    background: "#10B981",
                    color: "white",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={15} />
                  Abrir PDF
                </a>
              </div>
            ) : (
              <img
                src={url}
                alt="Comprobante"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "10px",
                  background: "#f9fafb",
                }}
              />
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                marginTop: "1rem",
                fontSize: "0.8rem",
                color: "#10B981",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <ExternalLink size={13} />
              Abrir en pestaña nueva
            </a>
          </div>
        )}
      </ModalContent>
    </ModalBackdrop>
  );
}

// ═══════════════════════════════════════════════
// MODAL: APROBAR
// ═══════════════════════════════════════════════
function ApproveModal({
  payment,
  onClose,
  onSuccess,
}: {
  payment: PaymentWithUser;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    newPlanEnd: string;
  } | null>(null);

  async function handleApprove() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment.id,
          adminNotes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setSuccessData({ newPlanEnd: data.newPlanEnd });
      setSubmitting(false);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (successData) {
    const mailtoLink = buildApprovedEmailMailto(
      payment.user_email || "",
      payment.amount,
      successData.newPlanEnd
    );
    const endDate = new Date(successData.newPlanEnd).toLocaleDateString(
      "es-AR",
      { day: "numeric", month: "long", year: "numeric" }
    );

    return (
      <ModalBackdrop onClose={onSuccess}>
        <ModalContent title="Pago aprobado ✓" onClose={onSuccess}>
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#d1fae5",
                marginBottom: "0.75rem",
              }}
            >
              <CheckCircle2 size={36} color="#059669" />
            </div>
            <h4
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#000000",
                margin: "0 0 0.4rem 0",
                letterSpacing: "-0.01em",
              }}
            >
              Plan activado con éxito
            </h4>
            <p
              style={{
                fontSize: "0.88rem",
                color: "#000000",
                opacity: 0.6,
                margin: 0,
              }}
            >
              Vence el {endDate}
            </p>
          </div>

          <div
            style={{
              padding: "0.85rem 1rem",
              background: "#f9fafb",
              borderRadius: "10px",
              marginBottom: "1rem",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ marginBottom: "0.35rem" }}>
              <strong>Cliente:</strong> {payment.user_email}
            </div>
            <div>
              <strong>Monto:</strong> $
              {payment.amount.toLocaleString("es-AR")}
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "12px",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.82rem",
                color: "#000000",
                fontWeight: 600,
                marginBottom: "0.75rem",
                lineHeight: 1.5,
              }}
            >
              📧 Enviale el email de bienvenida al cliente desde tu Gmail. Ya
              está todo redactado, solo tenés que tocar &quot;Enviar&quot;.
            </div>
            <a
              href={mailtoLink}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.85rem",
                background: "#10B981",
                color: "white",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 800,
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              <Mail size={16} />
              Enviar email al cliente
            </a>
          </div>

          <button
            onClick={onSuccess}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "white",
              color: "#000000",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              opacity: 0.7,
            }}
          >
            Cerrar sin enviar email
          </button>
        </ModalContent>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={submitting ? () => {} : onClose}>
      <ModalContent title="Aprobar pago" onClose={onClose}>
        <div
          style={{
            padding: "1rem",
            background: "#d1fae5",
            borderRadius: "10px",
            marginBottom: "1rem",
            display: "flex",
            gap: "0.65rem",
            alignItems: "flex-start",
          }}
        >
          <CheckCircle2
            size={18}
            color="#059669"
            style={{ flexShrink: 0, marginTop: "1px" }}
          />
          <div style={{ fontSize: "0.85rem", color: "#065f46" }}>
            Se va a activar el plan del cliente por{" "}
            <strong>30 días</strong> desde hoy. El usuario podrá usar todos los
            widgets inmediatamente.
          </div>
        </div>

        <div
          style={{
            padding: "0.85rem",
            background: "#f9fafb",
            borderRadius: "10px",
            marginBottom: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <div style={{ marginBottom: "0.35rem" }}>
            <strong>Cliente:</strong> {payment.user_email}
          </div>
          <div style={{ marginBottom: "0.35rem" }}>
            <strong>Monto:</strong> ${payment.amount.toLocaleString("es-AR")}
          </div>
          <div>
            <strong>Tienda:</strong> #{payment.store_id}
          </div>
        </div>

        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#000000",
            opacity: 0.75,
            marginBottom: "0.4rem",
          }}
        >
          Notas internas (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: Verificado en Naranja X, transferencia recibida ok"
          disabled={submitting}
          maxLength={500}
          style={{
            width: "100%",
            minHeight: "80px",
            padding: "0.75rem 0.9rem",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            boxSizing: "border-box",
            resize: "vertical",
            outline: "none",
          }}
        />

        {error && (
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem 0.9rem",
              background: "#fee2e2",
              borderRadius: "10px",
              color: "#991b1b",
              fontSize: "0.82rem",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1.25rem",
          }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "0.85rem",
              background: "white",
              color: "#000000",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: submitting ? 0.5 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleApprove}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "0.85rem",
              background: "#059669",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            {submitting ? (
              <>
                <Loader2
                  size={15}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Aprobando...
              </>
            ) : (
              <>
                <Check size={15} />
                Aprobar pago
              </>
            )}
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

// ═══════════════════════════════════════════════
// MODAL: RECHAZAR
// ═══════════════════════════════════════════════
function RejectModal({
  payment,
  onClose,
  onSuccess,
}: {
  payment: PaymentWithUser;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successReason, setSuccessReason] = useState<string | null>(null);

  const REASONS = [
    "Comprobante ilegible",
    "El monto no coincide",
    "No se encontró la transferencia",
    "Comprobante duplicado",
    "Datos incorrectos",
  ];

  async function handleReject() {
    if (reason.trim().length < 3) {
      setError("Ingresá una razón válida");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reject-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: payment.id,
          reason: reason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setSuccessReason(reason.trim());
      setSubmitting(false);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (successReason) {
    const mailtoLink = buildRejectedEmailMailto(
      payment.user_email || "",
      successReason
    );

    return (
      <ModalBackdrop onClose={onSuccess}>
        <ModalContent title="Pago rechazado" onClose={onSuccess}>
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#fee2e2",
                marginBottom: "0.75rem",
              }}
            >
              <XCircle size={36} color="#dc2626" />
            </div>
            <h4
              style={{
                fontSize: "1.15rem",
                fontWeight: 800,
                color: "#000000",
                margin: "0 0 0.4rem 0",
                letterSpacing: "-0.01em",
              }}
            >
              Pago rechazado
            </h4>
            <p
              style={{
                fontSize: "0.88rem",
                color: "#000000",
                opacity: 0.6,
                margin: 0,
              }}
            >
              El cliente puede volver a subir un nuevo comprobante
            </p>
          </div>

          <div
            style={{
              padding: "0.85rem 1rem",
              background: "#f9fafb",
              borderRadius: "10px",
              marginBottom: "1rem",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ marginBottom: "0.35rem" }}>
              <strong>Cliente:</strong> {payment.user_email}
            </div>
            <div>
              <strong>Razón:</strong> {successReason}
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              borderRadius: "12px",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.82rem",
                color: "#000000",
                fontWeight: 600,
                marginBottom: "0.75rem",
                lineHeight: 1.5,
              }}
            >
              📧 Avisale al cliente por email desde tu Gmail. Ya está el mensaje
              redactado con la razón del rechazo.
            </div>
            <a
              href={mailtoLink}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.85rem",
                background: "#10B981",
                color: "white",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 800,
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              <Mail size={16} />
              Enviar email al cliente
            </a>
          </div>

          <button
            onClick={onSuccess}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "white",
              color: "#000000",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              opacity: 0.7,
            }}
          >
            Cerrar sin enviar email
          </button>
        </ModalContent>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={submitting ? () => {} : onClose}>
      <ModalContent title="Rechazar pago" onClose={onClose}>
        <div
          style={{
            padding: "1rem",
            background: "#fee2e2",
            borderRadius: "10px",
            marginBottom: "1rem",
            display: "flex",
            gap: "0.65rem",
            alignItems: "flex-start",
          }}
        >
          <AlertCircle
            size={18}
            color="#dc2626"
            style={{ flexShrink: 0, marginTop: "1px" }}
          />
          <div style={{ fontSize: "0.85rem", color: "#991b1b" }}>
            El cliente va a ver la razón. Se le va a permitir subir un nuevo
            comprobante.
          </div>
        </div>

        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#000000",
            opacity: 0.75,
            marginBottom: "0.5rem",
          }}
        >
          Razones rápidas
        </label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.35rem",
            marginBottom: "1rem",
          }}
        >
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              disabled={submitting}
              style={{
                padding: "0.4rem 0.75rem",
                background: reason === r ? "#10B981" : "white",
                color: reason === r ? "white" : "#000000",
                border:
                  reason === r ? "1px solid #10B981" : "1px solid #e5e7eb",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#000000",
            opacity: 0.75,
            marginBottom: "0.4rem",
          }}
        >
          Razón del rechazo *
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explicá por qué se rechaza el pago"
          disabled={submitting}
          maxLength={500}
          style={{
            width: "100%",
            minHeight: "90px",
            padding: "0.75rem 0.9rem",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            fontSize: "0.9rem",
            fontFamily: "inherit",
            boxSizing: "border-box",
            resize: "vertical",
            outline: "none",
          }}
        />

        {error && (
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem 0.9rem",
              background: "#fee2e2",
              borderRadius: "10px",
              color: "#991b1b",
              fontSize: "0.82rem",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1.25rem",
          }}
        >
          <button
            onClick={onClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: "0.85rem",
              background: "white",
              color: "#000000",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: submitting ? 0.5 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleReject}
            disabled={submitting || reason.trim().length < 3}
            style={{
              flex: 1,
              padding: "0.85rem",
              background:
                submitting || reason.trim().length < 3
                  ? "#000000"
                  : "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor:
                submitting || reason.trim().length < 3
                  ? "not-allowed"
                  : "pointer",
              fontFamily: "inherit",
              opacity: submitting || reason.trim().length < 3 ? 0.5 : 1,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            {submitting ? (
              <>
                <Loader2
                  size={15}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Rechazando...
              </>
            ) : (
              <>
                <X size={15} />
                Rechazar pago
              </>
            )}
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

// ═══════════════════════════════════════════════
// MODAL: EJECUTAR CRON MANUALMENTE
// ═══════════════════════════════════════════════
function CronModal({ onClose }: { onClose: () => void }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/run-cron", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <ModalBackdrop onClose={running ? () => {} : onClose}>
      <ModalContent title="Ejecutar cron manualmente" onClose={onClose}>
        {!result && !error && (
          <>
            <div
              style={{
                padding: "1rem",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "10px",
                marginBottom: "1rem",
                display: "flex",
                gap: "0.65rem",
                alignItems: "flex-start",
              }}
            >
              <Zap
                size={18}
                color="#10B981"
                style={{ flexShrink: 0, marginTop: "1px" }}
              />
              <div style={{ fontSize: "0.85rem", color: "#000000" }}>
                Esta acción va a ejecutar el chequeo diario de planes al
                instante. Se van a marcar como <strong>expirados</strong> los
                planes vencidos y se enviarán <strong>recordatorios</strong>{" "}
                por email para planes que vencen en 3 días o 1 día.
              </div>
            </div>

            <div
              style={{
                padding: "0.85rem 1rem",
                background: "#f9fafb",
                borderRadius: "10px",
                marginBottom: "1.25rem",
                fontSize: "0.82rem",
                color: "#000000",
                opacity: 0.7,
                lineHeight: 1.5,
              }}
            >
              <strong>Nota:</strong> El cron corre automáticamente todos los
              días a las 10:00 AM (Argentina). Usá este botón solo para
              testear o forzar un chequeo manual.
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={onClose}
                disabled={running}
                style={{
                  flex: 1,
                  padding: "0.85rem",
                  background: "white",
                  color: "#000000",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: running ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleRun}
                disabled={running}
                style={{
                  flex: 1,
                  padding: "0.85rem",
                  background: "#10B981",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: running ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                }}
              >
                {running ? (
                  <>
                    <Loader2
                      size={15}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Zap size={15} />
                    Ejecutar ahora
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {result && (
          <>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#d1fae5",
                  marginBottom: "0.75rem",
                }}
              >
                <CheckCircle2 size={30} color="#059669" />
              </div>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#000000",
                  margin: "0 0 0.4rem 0",
                }}
              >
                Cron ejecutado ✓
              </h4>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#000000",
                  opacity: 0.6,
                  margin: 0,
                }}
              >
                Chequeo completado con éxito
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <CronStat
                label="Expirados"
                value={result.report?.expired ?? 0}
                color="#dc2626"
                bg="#fee2e2"
              />
              <CronStat
                label="Emails OK"
                value={result.report?.remindersSent ?? 0}
                color="#059669"
                bg="#d1fae5"
              />
              <CronStat
                label="Fallidos"
                value={result.report?.remindersFailed ?? 0}
                color="#f59e0b"
                bg="#fef3c7"
              />
            </div>

            {result.report?.details?.expiredStores?.length > 0 && (
              <div
                style={{
                  padding: "0.85rem",
                  background: "#fee2e2",
                  borderRadius: "10px",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#991b1b",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Planes expirados
                </div>
                {result.report.details.expiredStores.map(
                  (s: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "0.8rem",
                        color: "#000000",
                        marginBottom: "0.25rem",
                      }}
                    >
                      • {s.email}{" "}
                      <span style={{ opacity: 0.5 }}>#{s.storeId}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {result.report?.details?.remindersToSend?.length > 0 && (
              <div
                style={{
                  padding: "0.85rem",
                  background: "#fef3c7",
                  borderRadius: "10px",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#b45309",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Recordatorios enviados
                </div>
                {result.report.details.remindersToSend.map(
                  (r: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        fontSize: "0.8rem",
                        color: "#000000",
                        marginBottom: "0.25rem",
                      }}
                    >
                      • {r.email} — vence en {r.daysLeft}d
                    </div>
                  )
                )}
              </div>
            )}

            {result.report?.errors?.length > 0 && (
              <div
                style={{
                  padding: "0.85rem",
                  background: "#fee2e2",
                  borderRadius: "10px",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "#991b1b",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                  }}
                >
                  Errores
                </div>
                {result.report.errors.map((e: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "0.75rem",
                      color: "#991b1b",
                      marginBottom: "0.25rem",
                      fontFamily: "monospace",
                    }}
                  >
                    • {e}
                  </div>
                ))}
              </div>
            )}

            {(result.report?.expired ?? 0) === 0 &&
              (result.report?.remindersSent ?? 0) === 0 &&
              (result.report?.errors?.length ?? 0) === 0 && (
                <div
                  style={{
                    padding: "1rem",
                    background: "#f9fafb",
                    borderRadius: "10px",
                    marginBottom: "0.75rem",
                    textAlign: "center",
                    fontSize: "0.85rem",
                    color: "#000000",
                    opacity: 0.6,
                  }}
                >
                  ℹ️ No había planes vencidos ni por vencer en este momento.
                </div>
              )}

            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: "#000000",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cerrar
            </button>
          </>
        )}

        {error && (
          <>
            <div
              style={{
                padding: "1rem",
                background: "#fee2e2",
                borderRadius: "10px",
                marginBottom: "1rem",
                display: "flex",
                gap: "0.65rem",
                alignItems: "flex-start",
              }}
            >
              <XCircle
                size={18}
                color="#dc2626"
                style={{ flexShrink: 0, marginTop: "1px" }}
              />
              <div style={{ fontSize: "0.85rem", color: "#991b1b" }}>
                <strong>Error al ejecutar el cron:</strong>
                <br />
                {error}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: "#000000",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cerrar
            </button>
          </>
        )}
      </ModalContent>
    </ModalBackdrop>
  );
}

function CronStat({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        padding: "0.75rem 0.5rem",
        background: bg,
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "1.4rem",
          fontWeight: 900,
          color,
          lineHeight: 1,
          marginBottom: "0.25rem",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "#000000",
          opacity: 0.7,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MODAL BACKDROP & CONTENT
// ═══════════════════════════════════════════════
function ModalBackdrop({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      {children}
    </motion.div>
  );
}

function ModalContent({
  children,
  title,
  onClose,
  large = false,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  large?: boolean;
}) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "white",
        borderRadius: "20px 20px 0 0",
        padding: "1.5rem 1.25rem",
        width: "100%",
        maxWidth: large ? "720px" : "500px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxSizing: "border-box",
        boxShadow: "0 -10px 40px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginBottom: "1.25rem",
          paddingBottom: "0.85rem",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 800,
            color: "#000000",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
        <button
          onClick={onClose}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            border: "none",
            background: "#f3f4f6",
            color: "#000000",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <X size={16} />
        </button>
      </div>
      {children}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
}
