"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mic,
  MicOff,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Eye,
  Radio,
  Volume2,
  VolumeX,
} from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import SideMenu from "../components/SideMenu";
import CentroAyuda from "../components/CentroAyuda";
import { createClient } from "@/lib/supabase-browser";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
type VoicePosition = "bottom-right" | "bottom-left" | "floating-center";
type VoiceLang = "es-AR" | "pt-BR" | "en-US";

interface VoiceSettings {
  is_active: boolean;
  position: VoicePosition;
  button_color: string;
  listening_text: string;
  placeholder_text: string;
  language: VoiceLang;
}

interface UserStore {
  store_id: number;
  user_id: string;
}

/* ═══════════════════════════════════════════
   DEFAULTS (Regla #9 al inicio)
═══════════════════════════════════════════ */
const DEFAULT_SETTINGS: VoiceSettings = {
  is_active: true,
  position: "bottom-right",
  button_color: "#10B981",
  listening_text: "Escuchando... Decí lo que buscás",
  placeholder_text: "Buscá por voz en la tienda...",
  language: "es-AR",
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTE: PROBADOR DE MICRÓFONO EN VIVO
═══════════════════════════════════════════ */
function VoiceInteractiveTester({
  settings,
}: {
  settings: VoiceSettings;
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [browserSupported, setBrowserSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    // Comprobar compatibilidad con Web Speech API
    const windowObj = typeof window !== "undefined" ? (window as unknown as Record<string, unknown>) : {};
    const SpeechRecognition =
      windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupported(false);
    }
  }, []);

  const startListening = () => {
    setErrorMessage(null);
    setTranscript("");

    const windowObj = typeof window !== "undefined" ? (window as unknown as Record<string, unknown>) : {};
    const SpeechRecClass =
      (windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition) as
        | { new (): { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; onresult: (e: unknown) => void; onerror: (e: unknown) => void; onend: () => void } }
        | undefined;

    if (!SpeechRecClass) {
      setBrowserSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecClass();
      recognition.lang = settings.language;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: unknown) => {
        const ev = event as { results: { [key: number]: { [key: number]: { transcript: string } } } };
        const text = ev.results[0][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: unknown) => {
        const ev = event as { error: string };
        console.warn("Speech recognition error:", ev.error);
        if (ev.error === "not-allowed") {
          setErrorMessage("Permiso de micrófono denegado. Permitilo en tu navegador.");
        } else {
          setErrorMessage("No se detectó audio o el micrófono se apagó.");
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      console.error("Error iniciando micrófono:", err);
      setErrorMessage("No se pudo iniciar el micrófono en este dispositivo.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      const rec = recognitionRef.current as { stop: () => void };
      rec.stop();
    }
    setIsListening(false);
  };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "20px",
        padding: "1.75rem",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          fontSize: "0.75rem",
          fontWeight: 800,
          color: "#059669",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: "1.25rem",
        }}
      >
        <Eye size={14} />
        Simulador Interactivo de Voz
      </div>

      {/* Círculo Animado de Micrófono */}
      <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 1.5rem" }}>
        {isListening && (
          <>
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.15, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "50%",
                background: settings.button_color,
                zIndex: 0,
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0.05, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.6, delay: 0.3, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "50%",
                background: settings.button_color,
                zIndex: 0,
              }}
            />
          </>
        )}

        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "none",
            background: settings.button_color,
            color: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: `0 8px 24px ${settings.button_color}60`,
            transition: "all 0.2s ease",
          }}
        >
          {isListening ? (
            <Mic size={40} className="animate-pulse" />
          ) : (
            <Mic size={36} />
          )}
          <span style={{ fontSize: "0.68rem", fontWeight: 800, marginTop: "4px", textTransform: "uppercase" }}>
            {isListening ? "Detener" : "Tocar y Hablar"}
          </span>
        </button>
      </div>

      {/* Estado del Micrófono */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: isListening ? settings.button_color : "#111827" }}>
          {isListening ? settings.listening_text : "Tocá el botón para probar la voz"}
        </div>
        <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "3px" }}>
          Decí por ejemplo: <i>"Zapatillas negras"</i> o <i>"Vestido floreado"</i>
        </div>
      </div>

      {/* Caja de Transcripción */}
      <div
        style={{
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "1rem",
          minHeight: "70px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>
          Texto detectado por la IA:
        </span>
        <div
          style={{
            fontSize: "1.05rem",
            fontWeight: 800,
            color: transcript ? "#111827" : "#9ca3af",
            fontStyle: transcript ? "normal" : "italic",
          }}
        >
          {transcript ? `"${transcript}"` : "Esperando que hables..."}
        </div>
      </div>

      {/* Mensaje de Error / Permiso */}
      {errorMessage && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.65rem 0.85rem",
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "0.78rem",
            fontWeight: 600,
          }}
        >
          {errorMessage}
        </div>
      )}

      {!browserSupported && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.65rem 0.85rem",
            background: "#fffbeb",
            color: "#92400e",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            fontSize: "0.78rem",
          }}
        >
          Tu navegador actual no soporta reconocimiento de voz nativo. En Chrome, Safari móvil y navegadores modernos funciona 100% de forma automática.
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════ */
export default function BusquedaVozPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [store, setStore] = useState<UserStore | null>(null);
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

            const res = await fetch(`/api/ai/voice-search?store_id=${storeData.store_id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.settings) {
                setSettings({
                  is_active: data.settings.is_active ?? true,
                  position: data.settings.position || "bottom-right",
                  button_color: data.settings.button_color || "#10B981",
                  listening_text: data.settings.listening_text || DEFAULT_SETTINGS.listening_text,
                  placeholder_text: data.settings.placeholder_text || DEFAULT_SETTINGS.placeholder_text,
                  language: data.settings.language || "es-AR",
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error inicializando búsqueda por voz:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!store) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/ai/voice-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_id: store.store_id,
          ...settings,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setFeedback({
        type: "success",
        message: "¡Configuración de Búsqueda por Voz guardada con éxito!",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSaving(false);
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
            <Mic size={13} color="#10B981" />
            Voz & Búsqueda Móvil
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
            Búsqueda por Voz en la Tienda
          </h1>
          <p style={{ margin: 0, fontSize: "0.95rem", color: "#6b7280", lineHeight: 1.5 }}>
            Permití que tus visitantes encuentren productos hablando naturalmente desde su celular sin escribir en teclados pequeños.
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
              Cargando ajustes de voz...
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
            {/* COLUMNA IZQUIERDA: CONFIGURADOR */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* SWITCH ACTIVO */}
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
                    Micrófono Activo en la Tienda
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: "2px" }}>
                    Muestra el botón de búsqueda por voz para los compradores
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, is_active: !prev.is_active }))}
                  style={{
                    width: "48px",
                    height: "26px",
                    borderRadius: "999px",
                    background: settings.is_active ? "#10B981" : "#e5e7eb",
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
                      left: settings.is_active ? "25px" : "3px",
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

              {/* POSICIÓN EN PANTALLA */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827", marginBottom: "0.3rem" }}>
                  Posición del Botón Flotante
                </div>
                <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.78rem", color: "#6b7280" }}>
                  Elegí dónde ubicar el micrófono para que sea cómodo con el pulgar:
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                  {[
                    { id: "bottom-right" as const, label: "Inferior Derecha" },
                    { id: "bottom-left" as const, label: "Inferior Izquierda" },
                    { id: "floating-center" as const, label: "Barra Flotante" },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, position: pos.id }))}
                      style={{
                        padding: "0.65rem 0.4rem",
                        borderRadius: "10px",
                        border: settings.position === pos.id ? "2px solid #10B981" : "1px solid #e5e7eb",
                        background: settings.position === pos.id ? "#ecfdf5" : "#ffffff",
                        color: settings.position === pos.id ? "#059669" : "#374151",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLOR DEL MICRÓFONO */}
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
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#111827" }}>
                    Color del Botón y Ondas
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                    Personalizá el tono del micrófono
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="color"
                    value={settings.button_color}
                    onChange={(e) => setSettings((prev) => ({ ...prev, button_color: e.target.value }))}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      cursor: "pointer",
                      padding: 2,
                    }}
                  />
                  <span style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700 }}>
                    {settings.button_color.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* TEXTOS Y MENSAJES */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Texto mientras escucha
                  </label>
                  <input
                    type="text"
                    value={settings.listening_text}
                    onChange={(e) => setSettings((prev) => ({ ...prev, listening_text: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "0.85rem",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                    Dialecto / Idioma de Reconocimiento
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value as VoiceLang }))}
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "0.85rem",
                      background: "#ffffff",
                      cursor: "pointer",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                    }}
                  >
                    <option value="es-AR">🇦🇷 Español (Argentina / LATAM)</option>
                    <option value="pt-BR">🇧🇷 Português (Brasil - Nuvemshop)</option>
                    <option value="en-US">🇺🇸 English (US / Global)</option>
                  </select>
                </div>
              </div>

              {/* BOTÓN GUARDAR */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "0.95rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "#10B981",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: "0.92rem",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                }}
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Guardar Configuración de Voz
                  </>
                )}
              </button>
            </div>

            {/* COLUMNA DERECHA: PROBADOR EN VIVO */}
            <div style={{ position: "sticky", top: "2rem" }}>
              <VoiceInteractiveTester settings={settings} />
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
