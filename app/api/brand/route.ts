// app/api/brand/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface BrandPayload {
  store_id: number;
  primary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  border_radius?: "recto" | "suave" | "redondo";
  preset_name?: string;
  sync_all_widgets?: boolean;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/* ═══════════════════════════════════════════
   HELPER PARA ARMONIZAR WIDGETS SEGÚN SLUG
   (Regla #9 al inicio antes del endpoint)
═══════════════════════════════════════════ */
function applyBrandColorsToConfig(
  slug: string,
  currentConfig: Record<string, unknown>,
  brand: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    radiusNum: number;
  }
): Record<string, unknown> {
  const updated = { ...currentConfig };

  switch (slug) {
    case "cuenta-regresiva":
      updated.colorClockBg = brand.primary;
      updated.colorWidgetBg = brand.background;
      updated.colorTitle = brand.text;
      updated.colorSubtitle = brand.accent;
      updated.borderRadiusWidget = brand.radiusNum;
      break;

    case "banner-deslizante":
      updated.colorFondo = brand.primary;
      updated.colorTexto = brand.background === "#ffffff" ? "#ffffff" : brand.text;
      break;

    case "badge-cupon":
      updated.bgColor = brand.background;
      updated.borderColor = brand.primary;
      updated.textColor = brand.text;
      updated.botonBgColor = brand.primary;
      updated.badgeBgColor = brand.background;
      updated.badgeTextColor = brand.primary;
      updated.bordesRedondeados = brand.radiusNum;
      break;

    case "ruleta-descuentos":
      updated.colorBoton = brand.primary;
      updated.colorRuletaPrincipal = brand.primary;
      updated.colorRuletaSecundario = brand.accent;
      updated.colorFondoModal = brand.background;
      updated.colorTexto = brand.text;
      break;

    case "barra-progreso":
      updated.colorBarraLlena = brand.primary;
      updated.colorMonto = brand.primary;
      updated.colorFondo = brand.background;
      updated.colorTexto = brand.text;
      updated.colorObjetivos = brand.text;
      updated.bordesRedondeados = brand.radiusNum;
      break;

    case "mensaje-garantia":
      updated.colorFondo = brand.background;
      updated.colorTexto = brand.text;
      updated.colorTitulo = brand.text;
      updated.colorBorde = brand.primary;
      updated.bordesRedondeados = brand.radiusNum;
      break;

    case "resenas-clientes":
      updated.colorBotones = brand.primary;
      updated.colorTitulo = brand.text;
      updated.colorNombre = brand.text;
      updated.colorFondo = brand.background;
      break;

    default:
      // Adaptación universal para otros widgets
      if ("colorFondo" in updated) updated.colorFondo = brand.background;
      if ("colorTexto" in updated) updated.colorTexto = brand.text;
      if ("colorBoton" in updated) updated.colorBoton = brand.primary;
      if ("botonBgColor" in updated) updated.botonBgColor = brand.primary;
      if ("colorBorde" in updated) updated.colorBorde = brand.primary;
      if ("bordesRedondeados" in updated) updated.bordesRedondeados = brand.radiusNum;
      break;
  }

  return updated;
}

/* ═══════════════════════════════════════════
   ENDPOINT GET: LEER CONFIGURACIÓN DE MARCA
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("store_id");

    if (!storeIdParam) {
      return jsonResponse({ error: "Falta store_id obligatorio" }, 400);
    }

    const storeId = parseInt(storeIdParam, 10);

    const { data: brandSettings, error } = await supabase
      .from("store_brand_settings")
      .select("*")
      .eq("user_id", user.id)
      .eq("store_id", storeId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return jsonResponse({
      brand: brandSettings || {
        primary_color: "#10B981",
        accent_color: "#059669",
        background_color: "#ffffff",
        text_color: "#111827",
        border_radius: "suave",
        preset_name: "Nevux Esmeralda",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
}

/* ═══════════════════════════════════════════
   ENDPOINT POST: GUARDAR Y SINCRONIZAR MARCA
═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonResponse({ error: "No autorizado" }, 401);
    }

    const body: BrandPayload = await req.json().catch(() => ({}));
    const {
      store_id,
      primary_color,
      accent_color,
      background_color,
      text_color,
      border_radius = "suave",
      preset_name = "Personalizado",
      sync_all_widgets = false,
    } = body;

    if (!store_id || !primary_color || !accent_color || !background_color || !text_color) {
      return jsonResponse(
        { error: "Faltan parámetros obligatorios de paleta de colores" },
        400
      );
    }

    // 1. Validar que la tienda pertenezca al comerciante
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, store_id")
      .eq("user_id", user.id)
      .eq("store_id", store_id)
      .eq("is_active", true)
      .single();

    if (storeError || !store) {
      return jsonResponse({ error: "Tienda no autorizada o no encontrada" }, 403);
    }

    const nowIso = new Date().toISOString();

    // 2. Guardar o actualizar la configuración de marca en Supabase
    const { data: savedBrand, error: brandSaveError } = await supabase
      .from("store_brand_settings")
      .upsert(
        {
          user_id: user.id,
          store_id,
          primary_color,
          accent_color,
          background_color,
          text_color,
          border_radius,
          preset_name,
          updated_at: nowIso,
        },
        { onConflict: "store_id" }
      )
      .select()
      .single();

    if (brandSaveError) {
      throw brandSaveError;
    }

    let widgetsUpdatedCount = 0;

    // 3. Si se solicitó sincronizar todos los widgets existentes
    if (sync_all_widgets) {
      const radiusNumber = border_radius === "recto" ? 0 : border_radius === "redondo" ? 20 : 10;

      const { data: widgets, error: widgetsErr } = await supabase
        .from("widgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("store_id", store_id);

      if (!widgetsErr && widgets && widgets.length > 0) {
        for (const widget of widgets) {
          const currentCfg =
            typeof widget.config === "object" && widget.config !== null
              ? (widget.config as Record<string, unknown>)
              : {};

          const updatedCfg = applyBrandColorsToConfig(widget.widget_slug, currentCfg, {
            primary: primary_color,
            accent: accent_color,
            background: background_color,
            text: text_color,
            radiusNum: radiusNumber,
          });

          await supabase
            .from("widgets")
            .update({
              config: updatedCfg,
              updated_at: nowIso,
            })
            .eq("id", widget.id)
            .eq("user_id", user.id);

          widgetsUpdatedCount++;
        }
      }
    }

    return jsonResponse({
      success: true,
      brand: savedBrand,
      widgetsUpdatedCount,
      message: sync_all_widgets
        ? `Identidad guardada y sincronizada exitosamente en ${widgetsUpdatedCount} widgets`
        : "Identidad de marca guardada exitosamente",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    return jsonResponse({ error: msg }, 500);
  }
  }
