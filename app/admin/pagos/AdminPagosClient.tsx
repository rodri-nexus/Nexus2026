"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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

/* ═══════════════════════════════════════════
   1. TIPOS E INTERFACES (Regla #9 al INICIO)
   ═══════════════════════════════════════════ */
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  iconColor: string;
  iconBg: string;
  highlight?: boolean;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
  urgent?: boolean;
}

interface PaymentCardProps {
  payment: PaymentWithUser;
  onViewReceipt: () => void;
  onApprove: () => void;
  onReject: () => void;
}

interface ModalBackdropProps {
  children: React.ReactNode;
  onClose: () => void;
}

interface ModalContentProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  large?: boolean;
}

interface ReceiptModalProps {
  payment: PaymentWithUser;
  onClose: () => void;
}

interface ApproveModalProps {
  payment: PaymentWithUser;
  onClose: () => void;
  onSuccess: () => void;
}

interface RejectModalProps {
  payment: PaymentWithUser;
  onClose: () => void;
  onSuccess: () => void;
}

interface CronModalProps {
  onClose: () => void;
}

/* ═══════════════════════════════════════════
   2. HELPERS GLOBALES (Regla #9)
   ═══════════════════════════════════════════ */
function buildApprovedEmailMailto(customerEmail: string, amount: number, newPlanEndISO: string): string {
  const formattedAmount = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
  const endDate = new Date(newPlanEndISO).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const subject = "✅ Tu plan Nevux está activo";
  const body = `¡Hola!\n\nConfirmamos que recibimos tu pago de ${formattedAmount} y tu plan Nevux ya está ACTIVO. 🎉\n\n📅 Tu plan está activo hasta el ${endDate}.\n\nYa podés volver a tu dashboard y configurar tus widgets premium.\n\n👉 Volvé a tu dashboard: https://nevux.ar/dashboard\n\nGracias por confiar en Nevux 🚀`;
  return `mailto:${encodeURIComponent(customerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildRejectedEmailMailto(customerEmail: string, reason: string): string {
  const subject = "❌ Problema con tu comprobante Nevux";
  const body = `¡Hola!\n\nRecibimos tu comprobante de pago, pero lamentablemente NO pudimos aprobarlo.\n\n📝 Motivo del rechazo:\n${reason}\n\nPodés volver a subir un nuevo comprobante desde tu panel.\n\n👉 Subir nuevo comprobante: https://nevux.ar/plan/pagar\n\nGracias por confiar en Nevux 🚀`;
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

/* ═══════════════════════════════════════════
   3. SUB-COMPONENTES AUXILIARES (Regla #9)
   ═══════════════════════════════════════════ */
function StatCard({
  icon,
  label,
  value,
  iconColor,
  iconBg,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: highlight ? "2px solid #f59e0b" : "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        boxShadow: highlight ? "0 4px 12px rgba(245, 158, 11, 0.15)" : "0 1px 3px rgba(0,0,0,0.03)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: typeof value === "string" ? 18 : 22,
          fontWeight: 900,
          color: highlight ? "#d97706" : "#111827",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  count,
  urgent = false,
}: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 999,
        border: active ? "1.5px solid #111827" : "1.5px solid #e5e7eb",
        background: active ? "#111827" : "#ffffff",
        color: active ? "#ffffff" : "#374151",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 0.15s ease",
        fontFamily: "inherit",
      }}
    >
      <span>{children}</span>
      {count > 0 && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            padding: "2px 7px",
            borderRadius: 999,
            background: active ? "#ffffff" : urgent ? "#f59e0b" : "#f3f4f6",
            color: active ? "#111827" : urgent ? "#ffffff" : "#4b5563",
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function PaymentCard({
  payment,
  onViewReceipt,
  onApprove,
  onReject,
}: PaymentCardProps) {
  const isPending = payment.status === "pending";
  const isApproved = payment.status === "approved";

  const badgeBg = isPending ? "#fef3c7" : isApproved ? "#d1fae5" : "#fee2e2";
  const badgeColor = isPending ? "#b45309" : isApproved ? "#047857" : "#b91c1c";
  const cardBorder = isPending ? "1.5px solid #fde68a" : isApproved ? "1px solid #a7f3d0" : "1px solid #fecaca";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 18,
        border: cardBorder,
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              background: badgeBg,
              color: badgeColor,
            }}
          >
            {isPending ? "Pendiente" : isApproved ? "Aprobado" : "Rechazado"}
          </span>
          <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>
            {new Date(payment.created_at).toLocaleString("es-AR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 14, letterSpacing: "-0.02em" }}>
          ${payment.amount.toLocaleString("es-AR")}
        </div>

        <div
          style={{
            background: "#f9fafb",
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 12,
            border: "1px solid #f3f4f6",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <span style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
              <User size={12} /> Cliente
            </span>
            <b style={{ color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
              {payment.user_email}
            </b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <span style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
              <Store size={12} /> Tienda
            </span>
            <b style={{ color: "#111827" }}>#{payment.store_id}</b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <span style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={12} /> Meses Activo
            </span>
            <b style={{ color: "#111827" }}>{payment.store_months_active ?? 1} mes(es)</b>
          </div>
          {payment.transfer_reference && (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                <Copy size={12} /> Ref.
              </span>
              <b style={{ color: "#111827", fontFamily: "monospace" }}>{payment.transfer_reference}</b>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {payment.receipt_url && (
          <button
            type="button"
            onClick={onViewReceipt}
            style={{
              flex: 1,
              minWidth: 120,
              padding: "10px 12px",
              background: "#111827",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontFamily: "inherit",
            }}
          >
            <Eye size={14} /> Ver Comprobante
          </button>
        )}
        {isPending && (
          <>
            <button
              type="button"
              onClick={onApprove}
              style={{
                padding: "10px 14px",
                background: "#10B981",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "inherit",
              }}
            >
              <Check size={14} /> Aprobar
            </button>
            <button
              type="button"
              onClick={onReject}
              style={{
                padding: "10px 14px",
                background: "#ffffff",
                color: "#dc2626",
                border: "1px solid #fecaca",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "inherit",
              }}
            >
              <X size={14} /> Rechazar
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function ModalBackdrop({ children, onClose }: ModalBackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      {children}
    </motion.div>
  );
}

function ModalContent({ children, title, onClose, large = false }: ModalContentProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 10 }}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: 20,
        width: "100%",
        maxWidth: large ? 600 : 440,
        maxHeight: "85vh",
        overflowY: "auto",
        boxSizing: "border-box",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 12,
          marginBottom: 16,
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#111827" }}>{title}</h3>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "none",
            background: "#f3f4f6",
            color: "#111827",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   4. MODALES ESPECÍFICOS (Regla #9)
   ═══════════════════════════════════════════ */
function ReceiptModal({ payment, onClose }: ReceiptModalProps) {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

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
        if (isMounted) setUrl(data.url);
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : "Error imprevisto");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUrl();

    return () => {
      isMounted = false;
    };
  }, [payment.id]);

  const isPdf = url?.toLowerCase().includes(".pdf");

  return (
    <ModalBackdrop onClose={onClose}>
      <ModalContent title="Comprobante de pago" onClose={onClose} large>
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Loader2 size={32} style={{ margin: "0 auto 12px", color: "#10B981" }} className="animate-spin" />
            <p style={{ fontSize: 13, color: "#6b7280" }}>Cargando comprobante...</p>
          </div>
        )}
        {error && (
          <div style={{ padding: 12, background: "#fee2e2", color: "#991b1b", borderRadius: 10, fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}
        {url && !loading && (
          <div style={{ textAlign: "center" }}>
            {isPdf ? (
              <div style={{ padding: "20px 0" }}>
                <FileText size={56} style={{ color: "#10B981", marginBottom: 12 }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 16 }}>Comprobante en formato PDF</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 18px",
                    background: "#10B981",
                    color: "#ffffff",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={14} /> Abrir PDF
                </a>
              </div>
            ) : (
              <img
                src={url}
                alt="Comprobante"
                style={{
                  width: "100%",
                  maxHeight: "60vh",
                  objectFit: "contain",
                  borderRadius: 12,
                  background: "#f9fafb",
                }}
              />
            )}
            <div style={{ marginTop: 14 }}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  color: "#10B981",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <ExternalLink size={13} /> Abrir en pestaña nueva
              </a>
            </div>
          </div>
        )}
      </ModalContent>
    </ModalBackdrop>
  );
}

function ApproveModal({ payment, onClose, onSuccess }: ApproveModalProps) {
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
      if (!res.ok) throw new Error(data.error || "Error al aprobar");
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
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#ecfdf5",
                color: "#10B981",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h4 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: "#111827" }}>Plan activado con éxito</h4>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
              Vence el {new Date(successData.newPlanEnd).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          <div style={{ background: "#f9fafb", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13 }}>
            <div><b>Cliente:</b> {payment.user_email}</div>
            <div style={{ marginTop: 4 }}><b>Monto:</b> ${payment.amount.toLocaleString("es-AR")}</div>
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 13 }}>
            <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#065f46" }}>
              📧 Enviale el email de confirmación redactado automáticamente:
            </p>
            <a
              href={mailtoLink}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px",
                background: "#10B981",
                color: "#ffffff",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              <Mail size={16} /> Enviar email al cliente
            </a>
          </div>

          <button
            type="button"
            onClick={onSuccess}
            style={{
              width: "100%",
              padding: 10,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </ModalContent>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={submitting ? () => {} : onClose}>
      <ModalContent title="Aprobar pago" onClose={onClose}>
        <div style={{ background: "#ecfdf5", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, color: "#065f46", display: "flex", gap: 8 }}>
          <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>Se va a activar el plan del cliente por <b>30 días</b>. El usuario podrá usar todos los widgets inmediatamente.</span>
        </div>

        <div style={{ background: "#f9fafb", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
          <div><b>Cliente:</b> {payment.user_email}</div>
          <div><b>Monto:</b> ${payment.amount.toLocaleString("es-AR")}</div>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas internas (opcional)..."
          disabled={submitting}
          style={{
            width: "100%",
            minHeight: 80,
            padding: 12,
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            fontSize: 14,
            fontFamily: "inherit",
            boxSizing: "border-box",
            outline: "none",
          }}
        />

        {error && <div style={{ marginTop: 10, padding: 10, background: "#fee2e2", color: "#dc2626", borderRadius: 8, fontSize: 12 }}>⚠️ {error}</div>}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: 10,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={submitting}
            style={{
              flex: 1,
              padding: 10,
              background: "#10B981",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Aprobar pago
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

function RejectModal({ payment, onClose, onSuccess }: RejectModalProps) {
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
      if (!res.ok) throw new Error(data.error || "Error al rechazar");
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
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#fee2e2",
                color: "#dc2626",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <XCircle size={36} />
            </div>
            <h4 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: "#111827" }}>Pago rechazado</h4>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>El cliente puede subir otro comprobante.</p>
          </div>

          <div style={{ background: "#f9fafb", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13 }}>
            <div><b>Cliente:</b> {payment.user_email}</div>
            <div style={{ marginTop: 4 }}><b>Razón:</b> {successReason}</div>
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: 12, padding: 14, marginBottom: 16, fontSize: 13 }}>
            <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#065f46" }}>
              📧 Enviale el email de rechazo redactado automáticamente:
            </p>
            <a
              href={mailtoLink}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "10px",
                background: "#10B981",
                color: "#ffffff",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              <Mail size={16} /> Enviar email al cliente
            </a>
          </div>

          <button
            type="button"
            onClick={onSuccess}
            style={{
              width: "100%",
              padding: 10,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </ModalContent>
      </ModalBackdrop>
    );
  }

  return (
    <ModalBackdrop onClose={submitting ? () => {} : onClose}>
      <ModalContent title="Rechazar pago" onClose={onClose}>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, color: "#991b1b", display: "flex", gap: 8 }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>El cliente verá la razón del rechazo de inmediato y podrá volver a cargar un comprobante.</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {["Comprobante ilegible", "Monto no coincide", "Transferencia no encontrada", "Comprobante duplicado"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                border: reason === r ? "1.5px solid #10B981" : "1px solid #e5e7eb",
                background: reason === r ? "#ecfdf5" : "#ffffff",
                color: reason === r ? "#059669" : "#374151",
                cursor: "pointer",
              }}
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
          style={{
            width: "100%",
            minHeight: 90,
            padding: 12,
            borderRadius: 10,
            border: "1.5px solid #e5e7eb",
            fontSize: 14,
            fontFamily: "inherit",
            boxSizing: "border-box",
            outline: "none",
          }}
        />

        {error && <div style={{ marginTop: 10, padding: 10, background: "#fee2e2", color: "#dc2626", borderRadius: 8, fontSize: 12 }}>⚠️ {error}</div>}

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            style={{
              flex: 1,
              padding: 10,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={submitting || reason.trim().length < 3}
            style={{
              flex: 1,
              padding: 10,
              background: submitting || reason.trim().length < 3 ? "#e5e7eb" : "#dc2626",
              color: submitting || reason.trim().length < 3 ? "#9ca3af" : "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 800,
              cursor: submitting || reason.trim().length < 3 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Rechazar pago
          </button>
        </div>
      </ModalContent>
    </ModalBackdrop>
  );
}

function CronModal({ onClose }: CronModalProps) {
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
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || "nevux_admin_sync_2026"}`,
        },
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
            <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, color: "#065f46", display: "flex", gap: 8 }}>
              <Zap size={18} style={{ color: "#10B981", flexShrink: 0, marginTop: 2 }} />
              <span>Ejecuta el chequeo diario al instante: marca planes vencidos y envía recordatorios para planes por expirar.</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={onClose}
                disabled={running}
                style={{
                  flex: 1,
                  padding: 10,
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                style={{
                  flex: 1,
                  padding: 10,
                  background: "#10B981",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                {running ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} Ejecutar ahora
              </button>
            </div>
          </>
        )}

        {result && (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#ecfdf5", color: "#10B981", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <CheckCircle2 size={30} />
              </div>
              <h4 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800, color: "#111827" }}>Cron ejecutado ✓</h4>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              <div style={{ background: "#fef2f2", padding: 10, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#dc2626" }}>{result.report?.expired ?? 0}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Expirados</div>
              </div>
              <div style={{ background: "#ecfdf5", padding: 10, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#059669" }}>{result.report?.remindersSent ?? 0}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Emails OK</div>
              </div>
              <div style={{ background: "#fef3c7", padding: 10, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#b45309" }}>{result.report?.remindersFailed ?? 0}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Fallidos</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "100%",
                padding: 10,
                background: "#111827",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </>
        )}

        {error && (
          <>
            <div style={{ padding: 12, background: "#fee2e2", color: "#dc2626", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              ⚠️ Error: {error}
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "100%",
                padding: 10,
                background: "#111827",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
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

/* ═══════════════════════════════════════════
   5. COMPONENTE PRINCIPAL (AdminPagosClient)
   ═══════════════════════════════════════════ */
export default function AdminPagosClient({ adminEmail, payments, stats }: AdminPagosClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterKey>("all");

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
    <div style={{ minHeight: "100vh", background: "#f9fafb", color: "#000000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* HEADER STICKY */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NevuxLogo size="small" />
          <span
            style={{
              padding: "2px 6px",
              background: "#111827",
              color: "#ffffff",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.05em",
            }}
          >
            ADMIN
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowCronModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Zap size={14} color="#10B981" /> Cron
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 60px", boxSizing: "border-box" }}>
        {/* TÍTULO */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px", letterSpacing: "-0.02em", color: "#111827" }}>
            Panel de pagos
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280", lineHeight: 1.4 }}>
            Aprobá o rechazá los comprobantes de transferencia de los comercios de Nevux.
          </p>
        </div>

        {/* STATS GRID AUTOADAPTABLE */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <StatCard
            icon={<Clock size={16} />}
            label="Pendientes"
            value={stats.pending}
            iconColor="#d97706"
            iconBg="#fef3c7"
            highlight={stats.pending > 0}
          />
          <StatCard
            icon={<CheckCircle2 size={16} />}
            label="Aprobados"
            value={stats.approved}
            iconColor="#059669"
            iconBg="#d1fae5"
          />
          <StatCard
            icon={<XCircle size={16} />}
            label="Rechazados"
            value={stats.rejected}
            iconColor="#dc2626"
            iconBg="#fee2e2"
          />
          <StatCard
            icon={<DollarSign size={16} />}
            label="Ingresos"
            value={`$${stats.totalRevenue.toLocaleString("es-AR")}`}
            iconColor="#10B981"
            iconBg="#ecfdf5"
          />
        </div>

        {/* TABS CON SCROLL HORIZONTAL */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} count={stats.pending} urgent={stats.pending > 0}>
            Pendientes
          </TabButton>
          <TabButton active={activeTab === "approved"} onClick={() => setActiveTab("approved")} count={stats.approved}>
            Aprobados
          </TabButton>
          <TabButton active={activeTab === "rejected"} onClick={() => setActiveTab("rejected")} count={stats.rejected}>
            Rechazados
          </TabButton>
          <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")} count={payments.length}>
            Todos
          </TabButton>
        </div>

        {/* CARD DE FILTROS */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          {/* BUSCADOR */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Search size={16} color="#9ca3af" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por email del cliente..."
              style={{
                width: "100%",
                padding: "10px 36px 10px 36px",
                borderRadius: 10,
                border: searchQuery ? "1.5px solid #10B981" : "1.5px solid #e5e7eb",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#111827",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* FILTROS POR FECHA */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4, marginRight: 4 }}>
              <Filter size={12} /> Fecha:
            </span>
            {(["all", "today", "7days", "30days", "thisMonth"] as DateFilterKey[]).map((f) => {
              const act = dateFilter === f;
              const label = f === "all" ? "Todas" : f === "today" ? "Hoy" : f === "7days" ? "7 días" : f === "30days" ? "30 días" : "Este mes";
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setDateFilter(f)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    border: act ? "1.5px solid #10B981" : "1px solid #e5e7eb",
                    background: act ? "#10B981" : "#ffffff",
                    color: act ? "#ffffff" : "#374151",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* BOTONES LIMPIAR Y EXPORTAR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid #f3f4f6", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              Mostrando <b>{filteredPayments.length}</b> pagos
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {(searchQuery || dateFilter !== "all") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "6px 12px",
                    background: "none",
                    border: "1px solid #a7f3d0",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#10B981",
                    cursor: "pointer",
                  }}
                >
                  <RotateCcw size={12} /> Limpiar
                </button>
              )}
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={filteredPayments.length === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 14px",
                  background: filteredPayments.length > 0 ? "#111827" : "#f3f4f6",
                  color: filteredPayments.length > 0 ? "#ffffff" : "#9ca3af",
                  border: "none",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: filteredPayments.length > 0 ? "pointer" : "not-allowed",
                }}
              >
                <Download size={12} /> Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* LISTA DE TARJETAS */}
        {filteredPayments.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: "40px 20px",
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <AlertCircle size={40} style={{ margin: "0 auto 12px", color: "#d1d5db" }} />
            <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
              Sin pagos registrados
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
              No hay comprobantes para mostrar en esta lista.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {filteredPayments.map((p) => (
              <PaymentCard
                key={p.id}
                payment={p}
                onViewReceipt={() => setViewingReceipt(p)}
                onApprove={() => setApprovingPayment(p)}
                onReject={() => setRejectingPayment(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* MODALES ANIDADOS */}
      <AnimatePresence>
        {viewingReceipt && <ReceiptModal payment={viewingReceipt} onClose={() => setViewingReceipt(null)} />}
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
        {showCronModal && <CronModal onClose={() => setShowCronModal(false)} />}
      </AnimatePresence>
    </div>
  );
  }
