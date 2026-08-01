"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, EyeOff, Sparkles, Package, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface WidgetEditorProps {
  definition: any;
  product: any;
  storeId: number | undefined;
  existingWidget: any;
  targetType: "product" | "all";
  targetProductId: number | null;
}

export default function WidgetEditor({
  definition,
  product,
  storeId,
  existingWidget,
  targetType,
  targetProductId,
}: WidgetEditorProps) {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [isActive, setIsActive] = useState(existingWidget?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const schema = definition.config_schema || {};
    const defaults: Record<string, any> = {};
    Object.entries(schema).forEach(([key, field]: [string, any]) => {
      defaults[key] = existingWidget?.config?.[key] ?? field.default ?? "";
    });
    setConfig(defaults);
  }, [definition, existingWidget]);

  const handleSave = async () => {
    if (!storeId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/widgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: storeId,
          widget_slug: definition.slug,
          widget_type: definition.category,
          target_type: targetType,
          target_product_id: targetProductId,
          config,
          is_active: isActive,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const renderInputs = () => {
    const schema = definition.config_schema || {};
    return Object.entries(schema).map(([key, field]: [string, any]) => {
      const label = field.label || key;
      const value = config[key];

      if (field.type === "boolean") {
        return (
          <div key={key} style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
              <div
                onClick={() => setConfig({ ...config, [key]: !value })}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  background: value
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "#374151",
                  position: "relative",
                  transition: "background 0.3s",
                  cursor: "pointer",
                }}
              >
                <motion.div
                  animate={{ x: value ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    position: "absolute",
                    top: "2px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
              <span style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 500 }}>
                {label}
              </span>
            </label>
          </div>
        );
      }

      if (field.type === "number") {
        return (
          <div key={key} style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </label>
            <input
              type="number"
              min={field.min}
              max={field.max}
              value={value}
              onChange={(e) =>
                setConfig({ ...config, [key]: parseInt(e.target.value) || 0 })
              }
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#f1f5f9",
                fontSize: "0.95rem",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        );
      }

      if (field.type === "select") {
        return (
          <div key={key} style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.8rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </label>
            <select
              value={value}
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "#f1f5f9",
                fontSize: "0.95rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {(field.options || []).map((opt: any) => (
                <option key={opt.value || opt} value={opt.value || opt} style={{ background: "#1e293b" }}>
                  {opt.label || opt}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div key={key} style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              display: "block",
              color: "#94a3b8",
              fontSize: "0.8rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
            placeholder={field.placeholder || ""}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#f1f5f9",
              fontSize: "0.95rem",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      );
    });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <style>{`
        @keyframes aurora { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .aurora-box { position: relative; overflow: hidden; }
        .aurora-box::before { content: ''; position: absolute; inset: -2px; background: conic-gradient(from 0deg, transparent, #6366f1, #8b5cf6, #ec4899, transparent); animation: aurora 4s linear infinite; border-radius: inherit; z-index: 0; opacity: 0.5; }
        .aurora-box::after { content: ''; position: absolute; inset: 1px; background: inherit; border-radius: inherit; z-index: 1; }
      `}</style>

      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "#94a3b8",
            fontSize: "0.85rem",
            textDecoration: "none",
            marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc", margin: "0 0 0.5rem" }}
        >
          {definition.name}
        </motion.h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
          {definition.description}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Configuración */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="aurora-box"
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "2rem",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <Sparkles size={18} color="#6366f1" />
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>
                Configuración
              </h2>
            </div>

            {product && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  background: "rgba(99,102,241,0.1)",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                {product.images?.[0]?.src ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    width={40}
                    height={40}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                  />
                ) : (
                  <Package size={20} color="#6366f1" />
                )}
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9" }}>
                    {typeof product.name === "string" ? product.name : product.name?.es}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Producto seleccionado</div>
                </div>
              </div>
            )}

            {renderInputs()}

            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <span style={{ color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 500 }}>Estado</span>
                <div
                  onClick={() => setIsActive(!isActive)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "999px",
                    background: isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                    color: isActive ? "#22c55e" : "#ef4444",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: `1.5px solid ${isActive ? "rgba(34,197,68,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}
                >
                  {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  {isActive ? "Activo" : "Inactivo"}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  borderRadius: "12px",
                  border: "none",
                  background: saved
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: saving ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: saved
                    ? "0 4px 12px rgba(34,197,94,0.35)"
                    : "0 4px 12px rgba(99,102,241,0.35)",
                }}
              >
                {saved ? <Check size={18} /> : <Save size={18} />}
                {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar widget"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Preview con efectos EXCLUSIVOS de productos-relacionados */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Sparkles size={18} color="#8b5cf6" />
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>
              Vista previa
            </h2>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              padding: "2rem",
              border: "1px solid rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Glow ambiental pulsante - EXCLUSIVO */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "300px",
                height: "300px",
                background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                filter: "blur(40px)",
              }}
            />

            <div style={{ position: "relative", zIndex: 2 }}>
              <h3
                style={{
                  margin: "0 0 1.5rem",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#f8fafc",
                  textAlign: "center",
                }}
              >
                {config.title || "Completa tu look"}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                {[1, 2, 3, 4].slice(0, config.max_products || 4).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{
                      y: -8,
                      rotateX: 5,
                      rotateY: i % 2 === 0 ? 5 : -5,
                      transition: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      padding: "1rem",
                      cursor: "pointer",
                      transformStyle: "preserve-3d",
                      perspective: "1000px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100px",
                        background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                        borderRadius: "12px",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Package size={24} color="rgba(255,255,255,0.3)" />
                    </div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0", marginBottom: "0.25rem" }}>
                      Producto {i + 1}
                    </div>
                    {config.show_prices !== false && (
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: config.accent_color || "#6366f1" }}>
                        $12.500
                      </div>
                    )}
                    {config.show_discount_badge && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          right: "0.5rem",
                          padding: "0.2rem 0.5rem",
                          background: "linear-gradient(135deg, #ef4444, #dc2626)",
                          borderRadius: "6px",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          color: "#ffffff",
                        }}
                      >
                        -20%
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
            }
