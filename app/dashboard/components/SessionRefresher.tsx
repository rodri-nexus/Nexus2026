"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";

/**
 * SessionRefresher — componente invisible que mantiene viva la sesión de Supabase.
 *
 * Qué hace:
 * 1. Refresca el token cada 10 minutos (antes de que expire, que es a la hora)
 * 2. Cuando el usuario vuelve a la pestaña, valida la sesión
 * 3. Si detecta que la sesión murió, recarga la página automáticamente
 *
 * Esto evita el bug donde la UI queda "trabada" porque el token expiró silenciosamente.
 */
export default function SessionRefresher() {
  const supabase = createClient();
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    // Función que valida y refresca la sesión
    const validateSession = async () => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          // Sesión perdida — recargamos para que redirija al login
          console.warn("[SessionRefresher] Sesión perdida, recargando...");
          window.location.reload();
          return;
        }

        // Si el token expira en menos de 5 minutos, refrescamos
        const expiresAt = session.expires_at ?? 0;
        const now = Math.floor(Date.now() / 1000);
        const secondsUntilExpiry = expiresAt - now;

        if (secondsUntilExpiry < 300) {
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.warn(
              "[SessionRefresher] Error al refrescar, recargando...",
              refreshError
            );
            window.location.reload();
          }
        }
      } catch (err) {
        console.error("[SessionRefresher] Error inesperado:", err);
      } finally {
        isRefreshingRef.current = false;
      }
    };

    // 1. Intervalo cada 10 minutos
    const interval = setInterval(validateSession, 10 * 60 * 1000);

    // 2. Cuando el usuario vuelve a la pestaña
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        validateSession();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. Cuando la ventana recupera el foco
    const handleFocus = () => {
      validateSession();
    };
    window.addEventListener("focus", handleFocus);

    // Validación inicial al montar
    validateSession();

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [supabase]);

  // No renderiza nada — es un componente invisible
  return null;
            }
