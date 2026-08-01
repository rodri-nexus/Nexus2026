"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";

export default function WidgetsEditarPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const target = searchParams.get("target");

  const backUrl = productId
    ? `/widgets/nuevo/producto/${productId}`
    : target === "all"
    ? "/widgets/nuevo/todos"
    : "/dashboard";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "2rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "3rem 2rem",
          border: "1.5px solid #f3f4f6",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <Construction size={28} color="#6366f1" />
        </div>

        <h2
          style={{
            margin: "0 0 0.5rem 0",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Editor de widget
        </h2>
        <p
          style={{
            margin: "0 0 1.5rem 0",
            fontSize: "0.9rem",
            color: "#6b7280",
            lineHeight: 1.5,
          }}
        >
          Acá vas a poder configurar el widget paso a paso. <br />
          Todavía estamos construyendo esta parte.
        </p>

        <Link
          href={backUrl}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.65rem 1.25rem",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "#ffffff",
            borderRadius: "999px",
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(99, 102, 241, 0.25)",
          }}
        >
          <ArrowLeft size={16} />
          Volver
        </Link>
      </motion.div>
    </div>
  );
          }
