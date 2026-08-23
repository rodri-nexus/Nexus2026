"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Loader2, Check, AlertCircle, Eye, EyeOff } from "lucide-react";
import CentroAyuda from "@/app/dashboard/components/CentroAyuda";

// Helper para calcular "hace cuánto tiempo"
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
  
  // Estados de carga y datos
  const [loadingData, setLoadingData] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibilidad de contraseñas
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados de guardado
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserData(session.user);
        setEmail(session.user.email || "");
        
        // Obtener el perfil
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        if (prof) {
          setProfile(prof);
          setNombre(prof.full_name || "");
        }
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
      // 1. Actualizar nombre si cambió
      if (nombre !== profile?.full_name) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: nombre })
          .eq("id", userData.id);
          
        if (profileError) throw new Error("Error al actualizar el nombre");
      }

      // 2. Lógica de cambio de contraseña
      if (newPassword || confirmPassword || currentPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("Las contraseñas nuevas no coinciden");
        }
        if (newPassword.length < 8) {
          throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
        }
        if (!currentPassword) {
          throw new Error("Debés ingresar tu contraseña actual para confirmar el cambio");
        }

        // Verificar la contraseña actual (re-autenticando)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: currentPassword,
        });

        if (signInError) {
          throw new Error("La contraseña actual es incorrecta");
        }

        // Aplicar el cambio de contraseña
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (updateError) {
          throw new Error("Error al actualizar la contraseña");
        }

        // Limpiar campos de contraseña tras el éxito
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      setSuccess("¡Cambios guardados correctamente!");
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Restaurar valores iniciales
    setNombre(profile?.full_name || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  // Formatear fechas para la segunda tarjeta
  const fechaCreacion = userData?.created_at 
    ? new Date(userData.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : "Desconocida";
    
  const ultimoAcceso = timeAgo(userData?.last_sign_in_at);

  if (loadingData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <Loader2 size={32} color="#10B981" className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "1.5rem" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#000000", marginBottom: "24px" }}>
        Mi cuenta
      </h1>

      {/* ALERTAS */}
      {error && (
        <div style={{
          background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "10px",
          padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#991B1B"
        }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: "10px",
          padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#059669"
        }}>
          <Check size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>{success}</span>
        </div>
      )}

      {/* TARJETA 1: INFORMACIÓN PERSONAL & CONTRASEÑA */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        marginBottom: "24px",
        overflow: "hidden"
      }}>
        {/* Header Tarjeta */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#000000" }}>
            Información personal
          </h2>
        </div>

        {/* Body Tarjeta */}
        <div style={{ padding: "24px" }}>
          {/* Nombre y Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
            <div>
              <label style={{ display: "block", fontSize: "15px", color: "#000000", marginBottom: "8px" }}>
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: "1px solid #E5E7EB", fontSize: "15px", outline: "none",
                  transition: "border-color 0.2s", boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#10B981"}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "15px", color: "#000000", marginBottom: "8px" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: "10px",
                  border: "1px solid #E5E7EB", fontSize: "15px", outline: "none",
                  background: "#F3F4F6", color: "#000000", opacity: 0.7,
                  boxSizing: "border-box", cursor: "not-allowed"
                }}
              />
            </div>
          </div>

          <div style={{ height: "1px", background: "#E5E7EB", margin: "0 -24px 30px -24px" }} />

          {/* Sección Contraseña */}
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: 700, color: "#000000" }}>
              Cambiar contraseña
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#000000", opacity: 0.6 }}>
              Dejá estos campos vacíos si no querés cambiar tu contraseña.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
            {/* Contraseña Actual */}
            <div>
              <label style={{ display: "block", fontSize: "15px", color: "#000000", marginBottom: "8px" }}>
                Contraseña actual
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 40px 12px 14px", borderRadius: "10px",
                    border: "1px solid #E5E7EB", fontSize: "15px", outline: "none",
                    transition: "border-color 0.2s", boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#10B981"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#000000", opacity: 0.5
                  }}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label style={{ display: "block", fontSize: "15px", color: "#000000", marginBottom: "8px" }}>
                Nueva contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 40px 12px 14px", borderRadius: "10px",
                    border: "1px solid #E5E7EB", fontSize: "15px", outline: "none",
                    transition: "border-color 0.2s", boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#10B981"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#000000", opacity: 0.5
                  }}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div>
              <label style={{ display: "block", fontSize: "15px", color: "#000000", marginBottom: "8px" }}>
                Confirmar nueva contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 40px 12px 14px", borderRadius: "10px",
                    border: "1px solid #E5E7EB", fontSize: "15px", outline: "none",
                    transition: "border-color 0.2s", boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#10B981"}
                  onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#000000", opacity: 0.5
                  }}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              style={{
                padding: "12px 24px",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "999px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#000000",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.6 : 1,
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
                gap: "8px",
                padding: "12px 28px",
                background: "#10B981",
                border: "none",
                borderRadius: "999px",
                fontSize: "15px",
                fontWeight: 700,
                color: "#FFFFFF",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>

      {/* TARJETA 2: INFORMACIÓN DE CUENTA */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        marginBottom: "40px",
        overflow: "hidden"
      }}>
        {/* Header Tarjeta */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#000000" }}>
            Información de cuenta
          </h2>
        </div>

        {/* Body Tarjeta */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "14px", color: "#000000", opacity: 0.6, marginBottom: "4px" }}>
              Creada el
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#000000" }}>
              {fechaCreacion}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: "14px", color: "#000000", opacity: 0.6, marginBottom: "4px" }}>
              Último acceso
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#000000" }}>
              {ultimoAcceso}
            </div>
          </div>
        </div>
      </div>

      {/* CENTRO DE AYUDA AL FINAL */}
      <CentroAyuda />

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
