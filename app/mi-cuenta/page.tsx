"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { Loader2, Check, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import NevuxLogo from "@/app/components/landing/NevuxLogo";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  full_name?: string | null;
}

function timeAgo(dateString: string | null | undefined) {
  if (!dateString) return "Desconocido";
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `hace ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
  return "hace instantes";
}

export default function MiCuentaPage() {
  const supabase = createClient();

  const [loadingData, setLoadingData] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/login";
        return;
      }

      setUserData(session.user);
      setEmail(session.user.email || "");

      const { data: prof } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", session.user.id)
        .single();

      if (prof) {
        setProfile(prof as UserProfile);
        setNombre(prof.full_name || "");
      }

      setLoadingData(false);
    }

    loadUser();
  }, [supabase]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      if (!userData?.id) throw new Error("Sesión no válida");

      // 1) Actualizar nombre si cambió
      if (nombre.trim() !== (profile?.full_name || "")) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: nombre.trim() })
          .eq("id", userData.id);

        if (profileError) throw new Error("Error al actualizar el nombre");

        setProfile((prev) => ({
          id: userData.id,
          full_name: nombre.trim(),
          ...prev,
        }));
      }

      // 2) Cambio de contraseña (solo si completó algún campo)
      if (newPassword || confirmPassword || currentPassword) {
        if (!currentPassword) {
          throw new Error("Ingresá tu contraseña actual para confirmar el cambio");
        }
        if (newPassword.length < 8) {
          throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
        }
        if (newPassword !== confirmPassword) {
          throw new Error("Las contraseñas nuevas no coinciden");
        }

        // Verificar contraseña actual volviendo a loguear de forma segura
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email || "",
          password: currentPassword,
        });

        if (signInError) {
          throw new Error("La contraseña actual es incorrecta");
        }

        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          throw new Error(updateError.message || "Error al actualizar la contraseña");
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      setSuccess("¡Cambios guardados correctamente!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Ocurrió un error inesperado";
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNombre(profile?.full_name || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  const fechaCreacion = userData?.created_at
    ? new Date(userData.created_at).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Desconocida";

  const ultimoAcceso = timeAgo(userData?.last_sign_in_at);

  if (loadingData) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <Loader2 size={32} color="#10B981" className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#000000" }}>
      {/* HEADER SIMPLE NEVUX */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <NevuxLogo size="medium" />
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#000000",
            opacity: 0.7,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px 60px" }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#000000",
            margin: "0 0 24px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Mi cuenta
        </h1>

        {/* ALERTAS */}
        {error && (
          <div
            style={{
              background: "#FEE2E2",
              border: "1px solid #dc2626",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#991B1B",
            }}
          >
            <AlertCircle size={18} color="#dc2626" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #10B981",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#059669",
            }}
          >
            <Check size={18} color="#059669" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{success}</span>
          </div>
        )}

        {/* TARJETA 1: INFORMACIÓN PERSONAL */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            marginBottom: 24,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#000000" }}>
              Información personal
            </h2>
          </div>

          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 30 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#000000",
                    marginBottom: 8,
                  }}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 15,
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#000000",
                    background: "#FFFFFF",
                    fontFamily: "inherit",
                    transition: "border-color 0.15s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#000000",
                    marginBottom: 8,
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 15,
                    outline: "none",
                    background: "#F3F4F6",
                    color: "#000000",
                    opacity: 0.75,
                    boxSizing: "border-box",
                    cursor: "not-allowed",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            <div style={{ height: 1, background: "#E5E7EB", margin: "0 -24px 30px -24px" }} />

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: 16, fontWeight: 700, color: "#000000" }}>
                Cambiar contraseña
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: "#000000", opacity: 0.6, lineHeight: 1.5 }}>
                Dejá estos campos vacíos si no querés cambiar tu contraseña.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 30 }}>
              {/* Contraseña actual */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#000000",
                    marginBottom: 8,
                  }}
                >
                  Contraseña actual
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 44px 12px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 15,
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#000000",
                      background: "#FFFFFF",
                      fontFamily: "inherit",
                      transition: "border-color 0.15s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#000000",
                      opacity: 0.5,
                      padding: 0,
                      display: "flex",
                    }}
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Nueva contraseña */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#000000",
                    marginBottom: 8,
                  }}
                >
                  Nueva contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 44px 12px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 15,
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#000000",
                      background: "#FFFFFF",
                      fontFamily: "inherit",
                      transition: "border-color 0.15s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#000000",
                      opacity: 0.5,
                      padding: 0,
                      display: "flex",
                    }}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmar nueva contraseña */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#000000",
                    marginBottom: 8,
                  }}
                >
                  Confirmar nueva contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 44px 12px 14px",
                      borderRadius: 10,
                      border: "1.5px solid #E5E7EB",
                      fontSize: 15,
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#000000",
                      background: "#FFFFFF",
                      fontFamily: "inherit",
                      transition: "border-color 0.15s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#10B981")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#000000",
                      opacity: 0.5,
                      padding: 0,
                      display: "flex",
                    }}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                style={{
                  padding: "12px 24px",
                  background: "#FFFFFF",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#000000",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                  fontFamily: "inherit",
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 28px",
                  background: "#10B981",
                  border: "none",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.75 : 1,
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                }}
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>

        {/* TARJETA 2: INFORMACIÓN DE CUENTA */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            marginBottom: 40,
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#000000" }}>
              Información de cuenta
            </h2>
          </div>

          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontSize: 14, color: "#000000", opacity: 0.6, marginBottom: 4 }}>
                Creada el
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#000000" }}>{fechaCreacion}</div>
            </div>

            <div>
              <div style={{ fontSize: 14, color: "#000000", opacity: 0.6, marginBottom: 4 }}>
                Último acceso
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#000000" }}>{ultimoAcceso}</div>
            </div>
          </div>
        </div>

        {/* CENTRO DE AYUDA */}
        <CentroAyuda />
      </div>
    </div>
  );
    }
