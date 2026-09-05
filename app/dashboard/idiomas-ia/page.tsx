"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Globe,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Zap,
  Eye,
  Languages,
  Ticket,
  Check,
  ShieldCheck,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
type SupportedLang = "es" | "pt" | "en";

interface LanguageConfig {
  default_language: SupportedLang;
  auto_detect: boolean;
  enabled_languages: SupportedLang[];
}

interface LanguageOption {
  id: SupportedLang;
  label: string;
  flag: string;
  subtitle: string;
}

interface UserStore {
  store_id: number;
  user_id: string;
}

/* ═══════════════════════════════════════════
   CONSTANTES Y OPCIONES (Regla #9 al inicio)
═══════════════════════════════════════════ */
const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: "es",
    label: "Español",
    flag: "🇦🇷 🇲🇽",
    subtitle: "Ideal para Argentina, México, Colombia y Chile",
  },
  {
    id: "pt",
    label: "Português (Brasil)",
    flag: "🇧🇷",
    subtitle: "Optimizado para tiendas Nuvemshop en Brasil",
  },
  {
    id: "en",
    label: "English",
    flag: "🇺🇸 🇬🇧",
    subtitle: "Para clientes internacionales y ventas globales",
  },
];

const DEMO_TRANSLATIONS: Record<SupportedLang, { banner: string; cuponTitle: string; cuponSub: string; btn: string; badge: string }> = {
  es: {
    banner: "🔥 ¡ENVÍO GRATIS EN COMPRAS MAYORES A $50.000!",
    cuponTitle: "CUPÓN DE BIENVENIDA",
    cuponSub: "Copiá el código para un 15% OFF en tu primera compra",
    btn: "Copiar Código",
    badge: "15% OFF",
  },
  pt: {
    banner: "🔥 ¡FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 250!",
    cuponTitle: "CUPOM DE BOAS-VINDAS",
    cuponSub: "Copie o cupom para 15% OFF na sua primeira compra",
    btn: "Copiar Cupom",
    badge: "15% OFF",
  },
  en: {
    banner: "🔥 FREE SHIPPING ON ORDERS OVER $50!",
    cuponTitle: "WELCOME COUPON",
    cuponSub: "Copy the code for 15% OFF on your first purchase",
    btn: "Copy Code",
    badge: "15% OFF",
  },
};

const DEFAULT_CONFIG: LanguageConfig = {
  default_language: "es",
  auto_detect: true,
  enabled_languages: ["es", "pt", "en"],
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: SIMULADOR MULTILINGÜE
═══════════════════════════════════════════ */
function MultiLanguageSimulatorPreview({
  selectedTab,
  onTabChange,
}: {
  selectedTab: SupportedLang;
  onTabChange: (lang: SupportedLang) => void;
}) {
  const content = DEMO_TRANSLATIONS[selectedTab];

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "20px",
        padding: "1.5rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Eye size={14} color="#10B981" />
          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#059669", textTransform: "uppercase" }}>
            Simulador de Traducción en Vivo
          </span>
        </div>

        {/* Pestañas de Idioma */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "#f3f4f6",
            padding: "3px",
            borderRadius: "8px",
          }}
        >
          {(["es", "pt", "en"] as SupportedLang[]).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => onTabChange(lang)}
              style={{
                padding: "0.25rem 0.6rem",
                borderRadius: "6px",
                border: "none",
                background: selectedTab === lang ? "#ffffff" : "transparent",
                color: selectedTab === lang ? "#000000" : "#6b7280",
                fontSize: "0.72rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: selectedTab === lang ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                textTransform: "uppercase",
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Banner traducido */}
        <div
          style={{
            background: "#10B981",
            color: "#ffffff",
            padding: "0.65rem 1rem",
            borderRadius: "10px",
            fontSize: "0.82rem",
            fontWeight: 800,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
          }}
        >
          {content.banner}
        </div>

        {/* Badge Cupón traducido */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px dashed #10B981",
            borderRadius: "12px",
            padding: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Ticket size={16} color="#10B981" />
              <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>{content.cuponTitle}</span>
            </div>
            <span style={{ background: "#ecfdf5", color: "#059669", fontSize: "0.7rem", fontWeight: 800, padding: "2px 7px", borderRadius: "999px" }}>
              {content.badge}
            </span>
          </div>

          <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.78rem", color: "#6b7280" }}>
            {content.cuponSub}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "0.4rem 0.6rem 0.4rem 0.8rem",
            }}
          >
            <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "0.9rem" }}>
              PROMO15
            </span>
            <button
              type="button"
              style={{
                background: "#10B981",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.35rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {content.btn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function IdiomasIaPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [config, setConfig] = useState<LanguageConfig>(DEFAULT_CONFIG);
  const [simTab, setSimTab] = useState<SupportedLang>("es");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Cargar usuario y configuración previa
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          setUserEmail(user.email || "");

          const { data: storeData } = await supabase
            .from("stores")
            .select("store_id, user_id")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .maybeSingle();

          if (storeData && isMounted) {
            setStore(storeData);

            const res = await fetch(`/api/ai/languages?store_id=${storeData.store_id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.settings) {
                setConfig({
                  default_language: data.settings.default_language || "es",
                  auto_detect: data.settings.auto_detect ?? true,
                  enabled_languages: data.settings.enabled_languages || ["es", "pt", "en"],
                });
                setSimTab(data.settings.default_language || "es");
              }
            }
          }
        }
      } catch (err) {
        console.error("Error inicializando multi-idioma:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleLanguage = (lang: SupportedLang) => {
    if (lang === config.default_language) return; // No se puede deshabilitar el idioma por defecto

    setConfig((prev) => {
      const exists = prev.enabled_languages.includes(lang);
      const updated = exists
        ? prev.enabled_languages.filter((l) => l !== lang)
        : [...prev.enabled_languages, lang];
      return { ...prev, enabled_languages: updated };
    });
  };

  const handleSaveOnly = async () => {
    if (!store) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: store.store_id,
          ...config,
          translate_all_widgets: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setFeedback({
        type: "success",
        message: "¡Ajustes de idioma guardados con éxito!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleTranslateAll = async () => {
    if (!store) return;
    setTranslating(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: store.store_id,
          ...config,
          translate_all_widgets: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al traducir");

      setFeedback({
        type: "success",
        message: data.message || "¡Todos los widgets han sido traducidos automáticamente con IA!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setFeedback({ type: "error", message: msg });
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#000000",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <DashboardHeader email={userEmail} onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.25rem 4rem",
          boxSizing: "border-box",
        }}
      >
        {/* BREADCRUMB */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#6b7280",
              textDecoration: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              transition: "all 0.15s ease",
            }}
          >
            <ArrowLeft size={15} />
            Volver al Dashboard
          </Link>
        </div>

        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: "2rem" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.35rem 0.85rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              color: "#059669",
              fontWeight: 800,
              marginBottom: "0.6rem",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Globe size={13} color="#10B981" />
            Traducción Neuronal Inteligente
          </div>

          <h1
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "1.85rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#000000",
            }}
          >
            Multi-Idioma Automático con IA
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            Mostrá tus widgets automáticamente en Español, Portugués (Nuvemshop Brasil) o Inglés según el país de cada comprador.
          </p>
        </motion.div>

        {/* FEEDBACK TOAST */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "0.9rem 1.25rem",
                borderRadius: "12px",
                background: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
                color: feedback.type === "success" ? "#065f46" : "#991b1b",
                border: `1px solid ${feedback.type === "success" ? "#a7f3d0" : "#fecaca"}`,
                fontSize: "0.88rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
              }}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 size={18} color="#059669" />
              ) : (
                <AlertCircle size={18} color="#dc2626" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "4rem 1rem",
              gap: "0.85rem",
            }}
          >
            <Loader2 size={32} color="#10B981" className="animate-spin" />
            <span style={{ fontSize: "0.9rem", color: "#6b7280", fontWeight: 600 }}>
              Cargando motor de idiomas...
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* DETECCIÓN AUTOMÁTICA SWITCH */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#111827" }}>
                    Detección Automática por Navegador
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                    Detecta el idioma del cliente y adapta los textos al instante
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfig((prev) => ({ ...prev, auto_detect: !prev.auto_detect }))}
                  style={{
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    background: config.auto_detect ? "#10B981" : "#e5e7eb",
                    position: "relative",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "3px",
                      left: config.auto_detect ? "25px" : "3px",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      transition: "all 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </button>
              </div>

              {/* SELECTOR DE IDIOMA POR DEFECTO */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", marginBottom: "0.3rem" }}>
                  Idioma Base de la Tienda
                </div>
                <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.78rem", color: "#6b7280" }}>
                  Idioma principal que se mostrará si no se detecta otra preferencia:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const isSelected = config.default_language === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setConfig((prev) => ({
                            ...prev,
                            default_language: opt.id,
                            enabled_languages: Array.from(new Set([...prev.enabled_languages, opt.id])),
                          }));
                          setSimTab(opt.id);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          borderRadius: "12px",
                          border: isSelected ? "2px solid #10B981" : "1px solid #e5e7eb",
                          background: isSelected ? "#ecfdf5" : "#ffffff",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{ fontSize: "1.2rem" }}>{opt.flag}</span>
                          <div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#111827" }}>
                              {opt.label}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{opt.subtitle}</div>
                          </div>
                        </div>

                        {isSelected && <Check size={16} color="#059669" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* IDIOMAS HABILITADOS */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", marginBottom: "0.3rem" }}>
                  Idiomas Habilitados para Traducción
                </div>
                <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.78rem", color: "#6b7280" }}>
                  Marcá los idiomas a los que la IA traducirá tus widgets automáticamente:
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const isEnabled = config.enabled_languages.includes(opt.id);
                    const isDefault = config.default_language === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleLanguage(opt.id)}
                        disabled={isDefault}
                        style={{
                          padding: "0.5rem 0.85rem",
                          borderRadius: "999px",
                          border: isEnabled ? "1.5px solid #10B981" : "1.5px solid #e5e7eb",
                          background: isEnabled ? "#ecfdf5" : "#ffffff",
                          color: isEnabled ? "#059669" : "#6b7280",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: isDefault ? "default" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                        {isDefault && <span style={{ fontSize: "0.65rem", opacity: 0.6 }}>(Base)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={handleTranslateAll}
                  disabled={translating || saving}
                  style={{
                    width: "100%",
                    padding: "0.95rem",
                    borderRadius: "12px",
                    border: "none",
                    background: "#10B981",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.92rem",
                    cursor: translating || saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                  }}
                >
                  {translating ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Traduciendo widgets con IA...
                    </>
                  ) : (
                    <>
                      <Zap size={18} />
                      Traducir y Sincronizar con IA (1 Clic)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveOnly}
                  disabled={translating || saving}
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "12px",
                    border: "1.5px solid #e5e7eb",
                    background: "#ffffff",
                    color: "#374151",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: translating || saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Save size={16} />
                  Guardar Ajustes
                </button>
              </div>
            </div>

            {/* COLUMNA DERECHA: SIMULADOR VISUAL */}
            <div style={{ position: "sticky", top: "2rem" }}>
              <MultiLanguageSimulatorPreview
                selectedTab={simTab}
                onTabChange={(lang) => setSimTab(lang)}
              />
            </div>
          </div>
        )}

        {/* CENTRO DE AYUDA */}
        <div style={{ marginTop: "3rem" }}>
          <CentroAyuda />
        </div>
      </main>
    </div>
  );
}
