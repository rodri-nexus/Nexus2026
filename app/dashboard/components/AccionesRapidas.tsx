"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, LayoutGrid, Plus, RefreshCw } from "lucide-react";

export default function AccionesRapidas() {
  const [syncing, setSyncing] = useState(false);

  async function handleSync() {
    if (syncing) return;
    setSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSyncing(false);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
      }}
    >
      <h2
        style={{
          margin: "0 0 1.25rem",
          fontSize: "1.15rem",
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.01em",
        }}
      >
        Acciones rápidas
      </h2>

      <div
        style={{
          height: "1px",
          background: "#f3f4f6",
          margin: "0 -1.5rem 1.25rem",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.65rem",
        }}
      >
        <SecondaryButton href="/productos" icon={Package} label="Ver Productos" />
        <SecondaryButton href="/widgets" icon={LayoutGrid} label="Ver Widgets" />
        <SecondaryButton
          href="/widgets/nuevo"
          icon={Plus}
          label="Crear widget"
        />

        <button
          onClick={handleSync}
          disabled={syncing}
          data-tutorial="sync-button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            width: "100%",
            padding: "0.85rem 1.25rem",
            borderRadius: "999px",
            border: "none",
            background: syncing
              ? "linear-gradient(135deg, #a5b4fc, #c4b5fd)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#ffffff",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: syncing ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            if (!syncing) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(99, 102, 241, 0.45)";
            }
          }}
          onMouseLeave={(e) => {
            if (!syncing) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(99, 102, 241, 0.35)";
            }
          }}
        >
          <RefreshCw
            size={16}
            style={{
              animation: syncing ? "spin 1s linear infinite" : "none",
            }}
          />
          <span>
            {syncing ? "Sincronizando..." : "Sincronizar productos"}
          </span>
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.section>
  );
}

interface SecondaryButtonProps {
  href: string;
  icon: typeof Package;
  label: string;
}

function SecondaryButton({ href, icon: Icon, label }: SecondaryButtonProps) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
        width: "100%",
        padding: "0.85rem 1.25rem",
        borderRadius: "999px",
        border: "1.5px solid #e5e7eb",
        background: "#ffffff",
        color: "#6366f1",
        fontSize: "0.9rem",
        fontWeight: 600,
        textDecoration: "none",
        transition: "all 0.15s",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.background =
          "linear-gradient(135deg, rgba(99, 102, 241, 0.04), rgba(139, 92, 246, 0.04))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.background = "#ffffff";
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </Link>
  );
          }
