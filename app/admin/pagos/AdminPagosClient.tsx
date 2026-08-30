// app/admin/pagos/AdminPagosClient.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
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
  AlertCircle,
  Calendar,
  User,
  Store,
  Copy,
  FileText,
  ExternalLink,
  Mail,
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

interface CronReportDetails {
  expiredStores?: { email: string; storeId: number }[];
  remindersToSend?: { email: string; daysLeft: number }[];
}

interface CronReport {
  expired: number;
  remindersSent: number;
  remindersFailed: number;
  details?: CronReportDetails;
  errors?: string[];
}

interface CronResult {
  report?: CronReport;
}

// ─── GENERADORES DE MAILTO ───
function buildApprovedEmailMailto(customerEmail: string, amount: number, newPlanEndISO: string): string {
  const formattedAmount = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
  const endDate = new Date(newPlanEndISO).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const subject = "✅ Tu plan Nevux está activo";
  const body = `¡Hola!\n\nConfirmamos que recibimos tu pago de ${formattedAmount} y tu plan Nevux ya está ACTIVO. 🎉\n\n📅 Tu plan está activo hasta el ${endDate}.\n\nYa podés volver a tu dashboard y configurar tus widgets premium.\n\n👉 Volvé a tu dashboard: https://nexus2026-gx7e.vercel.app/dashboard\n\nGracias por confiar en Nevux 🚀`;
  return `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildRejectedEmailMailto(customerEmail: string, reason: string): string {
  const subject = "❌ Problema con tu comprobante Nevux";
  const body = `¡Hola!\n\nRecibimos tu comprobante de pago, pero lamentablemente NO pudimos aprobarlo.\n\n📝 Motivo del rechazo:\n${reason}\n\nPodés volver a subir un nuevo comprobante desde tu panel.\n\n👉 Subir nuevo comprobante: https://nexus2026-gx7e.vercel.app/plan/pagar\n\nGracias por confiar en Nevux 🚀`;
  return `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function isInDateRange(dateStr: string, range: DateFilterKey): boolean {
  if (range === "all") return true;
  const date = new Date(dateStr);
  const now = new Date();
  if (range === "today") {
    return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  if (range === "7days") {
    const limit = new Date(now);
    limit.setDate(now.getDate() - 7);
    return date >= limit;
  }
  if (range === "30days") {
    const limit = new Date(now);
    limit.setDate(now.getDate() - 30);
    return date >= limit;
  }
  if (range === "thisMonth") {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  return true;
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  const escaped = str.replace(/"/g, '""');
  return /[",\n\r]/.test(str) ? `"${escaped}"` : escaped;
}

function formatDateForCSV(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminPagosClient({ adminEmail, payments, stats }: AdminPagosClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterKey>("all");
  const [searchFocused, setSearchFocused] = useState(false);
  
  const [viewingReceipt, setViewingReceipt] = useState<PaymentWithUser | null>(null);
  const [approvingPayment, setApprovingPayment] = useState<PaymentWithUser | null>(null);
  const [rejectingPayment, setRejectingPayment] = useState<PaymentWithUser | null>(null);
  const [showCronModal, setShowCronModal] = useState(false);

  const filteredPayments = useMemo(() => {
    let result = payments;
    if (activeTab !== "all") {
      result = result.filter((p) => p.status === activeTab);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((p) => (p.user_email || "").toLowerCase().includes(q));
    }
    if (dateFilter !== "all") {
      result = result.filter((p) => isInDateRange(p.created_at, dateFilter));
    }
    return result;
  }, [payments, activeTab, searchQuery, dateFilter]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setDateFilter("all");
  }, []);

  const handleExportCSV = useCallback(() => {
    if (filteredPayments.length === 0) return;
    const headers = ["ID Pago", "Fecha creación", "Estado", "Email cliente", "Store ID", "Monto (ARS)", "Método pago", "Referencia", "Meses activo"];
    const rows = filteredPayments.map((p) => [
      p.id,
      formatDateForCSV(p.created_at),
      p.status === "pending" ? "Pendiente" : p.status === "approved" ? "Aprobado" : "Rechazado",
      p.user_email || "",
      p.store_id,
      p.amount,
      p.payment_method || "",
      p.transfer_reference || "",
      p.store_months_active ?? 0,
    ]);
    const csvContent = [headers.map(csvEscape).join(","), ...rows.map((row) => row.map(csvEscape).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nevux-pagos-${new Date().toISOString().split("T")[0]}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredPayments]);

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#fafafa] text-black overflow-x-hidden box-border">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <NevuxLogo size="small" />
          <span className="px-2 py-1 bg-black text-white rounded text-[10px] font-extrabold tracking-wider uppercase">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCronModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-gray-200 rounded-xl text-xs font-bold text-black cursor-pointer hover:bg-gray-50 transition"
          >
            <Zap size={14} className="text-[#10B981]" /> Cron
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-gray-200 rounded-xl text-xs font-bold text-black cursor-pointer hover:bg-gray-50 transition"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 box-border">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-black tracking-tight mb-1">Panel de pagos</h1>
          <p className="text-sm text-gray-500">Aprobá o rechazá los comprobantes de transferencia de los comercios de Nevux.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<Clock size={18} />} label="Pendientes" value={stats.pending} color="text-[#f59e0b]" bg="bg-amber-50" highlight={stats.pending > 0} />
          <StatCard icon={<CheckCircle2 size={18} />} label="Aprobados" value={stats.approved} color="text-[#059669]" bg="bg-emerald-50" />
          <StatCard icon={<XCircle size={18} />} label="Rechazados" value={stats.rejected} color="text-[#dc2626]" bg="bg-red-50" />
          <StatCard icon={<DollarSign size={18} />} label="Ingresos" value={`$${stats.totalRevenue.toLocaleString("es-AR")}`} color="text-[#10B981]" bg="bg-emerald-50" isText />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} count={stats.pending} urgent={stats.pending > 0}>Pendientes</TabButton>
          <TabButton active={activeTab === "approved"} onClick={() => setActiveTab("approved")} count={stats.approved}>Aprobados</TabButton>
          <TabButton active={activeTab === "rejected"} onClick={() => setActiveTab("rejected")} count={stats.rejected}>Rechazados</TabButton>
          <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")} count={payments.length}>Todos</TabButton>
        </div>

        {/* Filtros */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 box-border shadow-sm">
          <div className="relative mb-3">
            <Search size={16} color={searchFocused ? "#10B981" : "#9ca3af"} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por email del cliente..."
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none border transition ${searchQuery ? "border-[#10B981] bg-white" : "border-gray-200 bg-gray-50"}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center cursor-pointer p-0 border-none"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-1"><Filter size={11} />Fecha</span>
            {(["all", "today", "7days", "30days", "thisMonth"] as DateFilterKey[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setDateFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${dateFilter === f ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white text-black border-gray-200"}`}
              >
                {f === "all" ? "Todas" : f === "today" ? "Hoy" : f === "7days" ? "7 días" : f === "30days" ? "30 días" : "Este mes"}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
            <span className="text-xs text-gray-500">Mostrando <b>{filteredPayments.length}</b> de <b>{activeTab === "all" ? payments.length : payments.filter((p) => p.status === activeTab).length}</b> pagos</span>
            <div className="flex gap-2 items-center flex-wrap">
              {(searchQuery || dateFilter !== "all") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 px-3.5 py-1.5 bg-transparent border border-emerald-200 rounded-full text-xs font-bold text-[#10B981] cursor-pointer"
                >
                  <RotateCcw size={12} /> Limpiar filtros
                </button>
              )}
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={filteredPayments.length === 0}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition border-none cursor-pointer ${filteredPayments.length > 0 ? "bg-black text-white opacity-100" : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"}`}
              >
                <Download size={12} /> Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Pagos */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm font-bold text-gray-700">Sin pagos registrados</p>
            <p className="text-xs text-gray-400 mt-1">No hay comprobantes para mostrar en esta lista.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPayments.map((p) => (
              <PaymentCard key={p.id} payment={p} onViewReceipt={() => setViewingReceipt(p)} onApprove={() => setApprovingPayment(p)} onReject={() => setRejectingPayment(p)} />
            ))}
          </div>
        )}
      </main>

      {/* Modales */}
      <AnimatePresence>
        {viewingReceipt && <ReceiptModal payment={viewingReceipt} onClose={() => setViewingReceipt(null)} />}
        {approvingPayment && <ApproveModal payment={approvingPayment} onClose={() => setApprovingPayment(null)} onSuccess={() => { setApprovingPayment(null); router.refresh(); }} />}
        {rejectingPayment && <RejectModal payment={rejectingPayment} onClose={() => setRejectingPayment(null)} onSuccess={() => { setRejectingPayment(null); router.refresh(); }} />}
        {showCronModal && <CronModal onClose={() => setShowCronModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

// ─── COMPONENTES AUXILIARES INTERNOS ───

function StatCard({ icon, label, value, color, bg, isText = false, highlight = false }: { icon: React.ReactNode; label: string; value: number | string; color: string; bg: string; isText?: boolean; highlight?: boolean }) {
  return (
    <div className={`bg-white p-4 rounded-2xl border transition shadow-sm ${highlight ? `border-[#f59e0b] ring-2 ring-amber-100` : "border-gray-100"}`}>
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${bg} ${color} mb-2`}>{icon}</div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`font-extrabold tracking-tight ${isText ? "text-lg" : "text-2xl"} ${highlight ? color : "text-black"}`}>{value}</div>
    </div>
  );
}

function TabButton({ active, onClick, children, count, urgent = false }: { active: boolean; onClick: () => void; children: React.ReactNode; count: number; urgent?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs font-bold cursor-pointer transition ${active ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200"}`}
    >
      {children}
      {count > 0 && (
        <span className={`inline-flex items-center justify-center h-5 px-1.5 rounded-full text-[10px] font-extrabold ${active ? "bg-white text-black" : urgent ? "bg-[#f59e0b] text-white" : "bg-gray-100 text-gray-600"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function PaymentCard({ payment, onViewReceipt, onApprove, onReject }: { payment: PaymentWithUser; onViewReceipt: () => void; onApprove: () => void; onReject: () => void }) {
  const isPending = payment.status === "pending";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-5 border shadow-sm ${isPending ? "border-amber-200 bg-amber-50/10" : payment.status === "approved" ? "border-emerald-100" : "border-red-100"}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${isPending ? "bg-amber-100 text-amber-700" : payment.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
          {isPending ? "Pendiente" : payment.status === "approved" ? "Aprobado" : "Rechazado"}
        </span>
        <span className="text-[11px] text-gray-400 font-semibold">{new Date(payment.created_at).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
      </div>

      <div className="text-3xl font-black text-black tracking-tight mb-4">${payment.amount.toLocaleString("es-AR")}</div>

      <div className="bg-gray-50 rounded-xl p-3 mb-4 flex flex-col gap-2">
        <div className="flex justify-between text-xs"><span className="text-gray-400 flex items-center gap-1"><User size={12} /> Cliente</span><b className="text-black truncate max-w-[180px]">{payment.user_email}</b></div>
        <div className="flex justify-between text-xs"><span className="text-gray-400 flex items-center gap-1"><Store size={12} /> Tienda</span><b className="text-black">#{payment.store_id}</b></div>
        <div className="flex justify-between text-xs"><span className="text-gray-400 flex items-center gap-1"><Calendar size={12} /> Activo</span><b className="text-black">{payment.store_months_active} mes(es)</b></div>
        {payment.transfer_reference && <div className="flex justify-between text-xs"><span className="text-gray-400 flex items-center gap-1"><Copy size={12} /> Ref.</span><b className="text-black font-mono">{payment.transfer_reference}</b></div>}
      </div>

      <div className="flex gap-2">
        {payment.receipt_url && (
          <button type="button" onClick={onViewReceipt} className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-black text-white border-none rounded-xl text-xs font-bold cursor-pointer hover:bg-gray-900 transition">
            <Eye size={14} /> Ver Comprobante
          </button>
        )}
        {isPending && (
          <>
            <button type="button" onClick={onApprove} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#10B981] text-white border-none rounded-xl text-xs font-bold cursor-pointer hover:bg-[#059669] transition">
              <Check size={14} /> Aprobar
            </button>
            <button type="button" onClick={onReject} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-[#dc2626] border border-red-200 rounded-xl text-xs font-bold cursor-pointer hover:bg-red-50 transition">
              <X size={14} /> Rechazar
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── MODAL CONTENEDOR COMÚN ───
function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4 overflow-y-auto box-border"
    >
      {children}
    </motion.div>
  );
}

function ModalContent({ children, title, onClose, large = false }: { children: React.ReactNode; title: string; onClose: () => void; large?: boolean }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 30, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className={`bg-white rounded-t-3xl p-6 w-full box-border max-h-[90vh] overflow-y-auto shadow-2xl ${large ? "max-w-2xl" : "max-w-md"}`}
    >
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100 mb-5">
        <h3 className="text-base font-extrabold text-black tracking-tight">{title}</h3>
        <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg border-none bg-gray-100 text-black flex items-center justify-center cursor-pointer"><X size={16} /></button>
      </div>
      {children}
    </motion.div>
  );
}

// ─── MODAL COMPROBANTE ───
function ReceiptModal({ payment, onClose }: { payment: PaymentWithUser; onClose: () => void }) {
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
        if (!res.ok) throw new Error(data.error || "No se pudo obtener la URL");
        setUrl(data.url);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error imprevisto");
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
          <div className="text-center py-12">
            <Loader2 size={32} className="mx-auto text-[#10B981] animate-spin" />
            <p className="text-xs text-gray-500 mt-3">Cargando comprobante...</p>
          </div>
        )}
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100">{error}</div>}
        {url && !loading && (
          <div>
            {isPdf ? (
              <div className="text-center py-8">
                <FileText size={56} className="mx-auto text-[#10B981] mb-4" />
                <p className="text-sm font-bold text-black mb-4">Comprobante en PDF</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#10B981] text-white rounded-xl text-xs font-bold no-underline"><ExternalLink size={14} /> Abrir PDF</a>
              </div>
            ) : (
              <img src={url} alt="Comprobante" className="w-full h-auto max-h-[60vh] object-contain rounded-xl bg-gray-50" />
            )}
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#10B981] font-bold no-underline mt-4"><ExternalLink size={13} /> Abrir en pestaña nueva</a>
          </div>
        )}
      </ModalContent>
    </ModalBackdrop>
  );
}

// ─── MODAL APROBAR ───
function ApproveModal({ payment, onClose, onSuccess }: { payment: PaymentWithUser; onClose: () => void; onSuccess: () => void }) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ newPlanEnd: string } | null>(null);

  async function handleApprove() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.id, adminNotes: notes.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setSuccessData({ newPlanEnd: data.newPlanEnd });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al aprobar");
    } finally {
      setSubmitting(false);
    }
  }

  if (successData) {
    const mailtoLink = buildApprovedEmailMailto(payment.user_email || "", payment.amount, successData.newPlanEnd);
    return (
      <ModalBackdrop onClose={onSuccess}>
        <ModalContent title="Pago aprobado ✓" onClose={onSuccess}>
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 mb-3"><CheckCircle2 size={36} className="text-[#10B981]" /></div>
            <h4 className="text-base font-extrabold text-black mb-1">Plan activado con éxito</h4>
            <p className="text-xs text-gray-500">Vence el {new Date(successData.newPlanEnd).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl mb-4 text-xs">
            <div><b>Cliente:</b> {payment.user_email}</div>
            <div className="mt-1"><b>Monto:</b> ${payment.amount.toLocaleString("es-AR")}</div>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 text-xs">
            <p className="font-bold text-emerald-800 mb-3">📧 Enviale el email de confirmación redactado automáticamente.</p>
            <a href={mailtoLink} className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-extrabold text-sm no-underline transition-colors"><Mail size={16} /> Enviar email al cliente</a>
          </div>
          <button type="button" onClick={onSuccess} className="w-full py-2.5 bg-white text-black border border-gray-200 rounded-xl font-semibold text-xs cursor-pointer opacity-70">Cerrar</button>
        </ModalContent>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={submitting ? () => {} : onClose}>
      <ModalContent title="Aprobar pago" onClose={onClose}>
        <div className="p-3.5 bg-emerald-50 rounded-xl mb-4 flex gap-2 items-start text-xs text-emerald-800">
          <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
          <span>Se va a activar el plan del cliente por <b>30 días</b>. El usuario podrá usar todos los widgets inmediatamente.</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl mb-4 text-xs flex flex-col gap-1">
          <div><b>Cliente:</b> {payment.user_email}</div>
          <div><b>Monto:</b> ${payment.amount.toLocaleString("es-AR")}</div>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas internas (opcional)..."
          disabled={submitting}
          className="w-full min-h-[80px] p-3 rounded-xl border border-gray-200 text-sm font-sans box-border resize-y outline-none focus:border-[#10B981] transition-all"
        />
        {error && <div className="mt-3 p-3 bg-red-50 text-[#dc2626] rounded-xl text-xs">{error}</div>}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose} disabled={submitting} className="flex-1 py-2.5 bg-white text-black border border-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancelar</button>
          <button type="button" onClick={handleApprove} disabled={submitting} className="flex-1 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white border-none rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1 transition-colors">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Aprobar pago
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

// ─── MODAL RECHAZAR ───
function RejectModal({ payment, onClose, onSuccess }: { payment: PaymentWithUser; onClose: () => void; onSuccess: () => void }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successReason, setSuccessReason] = useState<string | null>(null);

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
        body: JSON.stringify({ paymentId: payment.id, reason: reason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setSuccessReason(reason.trim());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al rechazar");
    } finally {
      setSubmitting(false);
    }
  }

  if (successReason) {
    const mailtoLink = buildRejectedEmailMailto(payment.user_email || "", successReason);
    return (
      <ModalBackdrop onClose={onSuccess}>
        <ModalContent title="Pago rechazado" onClose={onSuccess}>
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-3"><XCircle size={36} className="text-[#dc2626]" /></div>
            <h4 className="text-base font-extrabold text-black mb-1">Pago rechazado</h4>
            <p className="text-xs text-gray-500">El cliente puede subir otro comprobante.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl mb-4 text-xs">
            <div><b>Cliente:</b> {payment.user_email}</div>
            <div className="mt-1"><b>Razón:</b> {successReason}</div>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 text-xs">
            <p className="font-bold text-emerald-800 mb-3">📧 Enviale el email de rechazo redactado automáticamente.</p>
            <a href={mailtoLink} className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-extrabold text-sm no-underline transition-colors"><Mail size={16} /> Enviar email al cliente</a>
          </div>
          <button type="button" onClick={onSuccess} className="w-full py-2.5 bg-white text-black border border-gray-200 rounded-xl font-semibold text-xs cursor-pointer opacity-70">Cerrar</button>
        </ModalContent>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={submitting ? () => {} : onClose}>
      <ModalContent title="Rechazar pago" onClose={onClose}>
        <div className="p-3.5 bg-red-50 rounded-xl mb-4 flex gap-2 items-start text-xs text-red-800 border border-red-100">
          <AlertCircle size={18} className="text-[#dc2626] shrink-0 mt-0.5" />
          <span>El cliente verá la razón del rechazo de inmediato y podrá volver a cargar un comprobante desde su cuenta.</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {["Comprobante ilegible", "Monto no coincide", "Transferencia no encontrada", "Comprobante duplicado"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${reason === r ? "bg-[#10B981] text-white border-[#10B981]" : "bg-white text-black border-gray-200"}`}
            >
              {r}
            </button>
          ))}
        </div>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Escribí la razón del rechazo..."
          disabled={submitting}
          className="w-full min-h-[90px] p-3 rounded-xl border border-gray-200 text-sm font-sans box-border resize-y outline-none focus:border-[#dc2626] transition-all"
        />
        {error && <div className="mt-3 p-3 bg-red-50 text-[#dc2626] rounded-xl text-xs">{error}</div>}
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={onClose} disabled={submitting} className="flex-1 py-2.5 bg-white text-black border border-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancelar</button>
          <button
            type="button"
            onClick={handleReject}
            disabled={submitting || reason.trim().length < 3}
            className={`flex-1 py-2.5 text-white border-none rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1 transition-colors ${submitting || reason.trim().length < 3 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#dc2626] hover:bg-red-700"}`}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Rechazar pago
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

// ─── MODAL CRON ───
function CronModal({ onClose }: { onClose: () => void }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CronResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/cron/check-plans", { 
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || "nevux_admin_sync_2026"}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo ejecutar el cron");
      setResult(data as CronResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error imprevisto");
    } finally {
      setRunning(false);
    }
  }

  return (
    <ModalBackdrop onClose={running ? () => {} : onClose}>
      <ModalContent title="Ejecutar cron manualmente" onClose={onClose}>
        {!result && !error && (
          <>
            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl mb-4 flex gap-2 items-start text-xs text-emerald-800">
              <Zap size={18} className="text-[#10B981] shrink-0 mt-0.5" />
              <span>Ejecuta el chequeo diario al instante: marca planes vencidos y envía recordatorios para planes por expirar.</span>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={running} className="flex-1 py-2.5 bg-white text-black border border-gray-200 rounded-xl text-xs font-bold cursor-pointer">Cancelar</button>
              <button type="button" onClick={handleRun} disabled={running} className="flex-1 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white border-none rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1 transition-colors">
                {running ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} Ejecutar ahora
              </button>
            </div>
          </>
        )}

        {result && (
          <>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-2"><CheckCircle2 size={30} className="text-[#10B981]" /></div>
              <h4 className="text-sm font-extrabold text-black mb-1">Cron ejecutado ✓</h4>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <CronStat label="Expirados" value={result.report?.expired ?? 0} color="text-[#dc2626]" bg="bg-red-50" />
              <CronStat label="Emails OK" value={result.report?.remindersSent ?? 0} color="text-[#059669]" bg="bg-emerald-50" />
              <CronStat label="Fallidos" value={result.report?.remindersFailed ?? 0} color="text-[#f59e0b]" bg="bg-amber-50" />
            </div>
            <button type="button" onClick={onClose} className="w-full py-2.5 bg-black text-white border-none rounded-xl font-bold text-xs cursor-pointer">Cerrar</button>
          </>
        )}

        {error && (
          <>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 mb-4 flex gap-2"><XCircle size={18} className="shrink-0" /> Error: {error}</div>
            <button type="button" onClick={onClose} className="w-full py-2.5 bg-black text-white border-none rounded-xl font-bold text-xs cursor-pointer">Cerrar</button>
          </>
        )}
      </ModalContent>
    </ModalBackdrop>
  );
}

function CronStat({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`p-3 rounded-xl text-center ${bg}`}>
      <div className={`text-xl font-black ${color} leading-none mb-1`}>{value}</div>
      <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
  }
