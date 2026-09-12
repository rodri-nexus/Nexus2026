// app/api/campaigns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/* ═══════════════════════════════════════════
   TIPOS E INTERFACES (Regla #9 al inicio)
═══════════════════════════════════════════ */
interface CampaignPreset {
  slug: string;
  name: string;
  tagline: string;
  themeColor: string;
  accentColor: string;
  defaultBadge: string;
  emoji: string;
}

const CAMPAIGN_PRESETS: Record<string, CampaignPreset> = {
  "black-friday": {
    slug: "black-friday",
    name: "Black Friday",
    tagline: "Estética Dark & Gold de alto impacto para compras masivas.",
    themeColor: "#111827",
    accentColor: "#F59E0B",
    defaultBadge: "🔥 BLACK FRIDAY",
    emoji: "🔥",
  },
  "hot-sale": {
    slug: "hot-sale",
    name: "Hot Sale",
    tagline: "Urgencia extrema y velocidad de compra estilo Hot Sale.",
    themeColor: "#0F172A",
    accentColor: "#EF4444",
    defaultBadge: "⚡ HOT SALE",
    emoji: "⚡",
  },
  "cyber-monday": {
    slug: "cyber-monday",
    name: "Cyber Monday",
    tagline: "Diseño tecnológico y moderno para liquidación digital.",
    themeColor: "#090D16",
    accentColor: "#3B82F6",
    defaultBadge: "🚀 CYBER MONDAY",
    emoji: "🚀",
  },
  "navidad": {
    slug: "navidad",
    name: "Navidad & Reyes",
    tagline: "Ambiente festivo y elegante enfocado en compra de regalos.",
    themeColor: "#064E3B",
    accentColor: "#EF4444",
    defaultBadge: "🎄 ESPECIAL NAVIDAD",
    emoji: "🎄",
  },
  "san-valentin": {
    slug: "san-valentin",
    name: "San Valentín",
    tagline: "Diseño pasional ideal para packs dúo y regalos de pareja.",
    themeColor: "#831843",
    accentColor: "#F43F5E",
    defaultBadge: "💘 SAN VALENTÍN",
    emoji: "💘",
  },
  "dia-madre-padre": {
    slug: "dia-madre-padre",
    name: "Día de la Madre / Padre",
    tagline: "Confianza y ternura para el regalo familiar perfecto.",
    themeColor: "#312E81",
    accentColor: "#10B981",
    defaultBadge: "🎁 REGALO ESPECIAL",
    emoji: "🎁",
  },
  "liquidacion": {
    slug: "liquidacion",
    name: "Liquidación Total / Sale",
    tagline: "Descuentos agresivos para vaciar stock y fin de temporada.",
    themeColor: "#7F1D1D",
    accentColor: "#FBBF24",
    defaultBadge: "🏷️ SALE FINAL",
    emoji: "🏷️",
  },
};

/* ═══════════════════════════════════════════
   ENDPOINT GET: CONSULTAR SKIN DE CAMPAÑA
═══════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("store_id");

    let storeId: number | null = null;

    if (storeIdParam) {
      storeId = parseInt(storeIdParam, 10);
    } else {
      // Si no viene en query, buscamos por el usuario autenticado
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
      }

      const { data: storeRow } = await supabaseAdmin
        .from("stores")
        .select("store_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (storeRow) {
        storeId = storeRow.store_id;
      }
    }

    if (!storeId) {
      return NextResponse.json({ error: "store_id no encontrado" }, { status: 400 });
    }

    const { data: campaignData, error } = await supabaseAdmin
      .from("store_campaign_settings")
      .select("*")
      .eq("store_id", storeId)
      .maybeSingle();

    if (error) {
      console.error("[Campaign GET Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const defaultPreset = CAMPAIGN_PRESETS["black-friday"];

    return NextResponse.json({
      campaign: campaignData || {
        store_id: storeId,
        is_active: false,
        campaign_slug: "black-friday",
        custom_badge_text: defaultPreset.defaultBadge,
        theme_color: defaultPreset.themeColor,
        accent_color: defaultPreset.accentColor,
      },
      presets: CAMPAIGN_PRESETS,
    });
  } catch (err: any) {
    console.error("[Campaign GET Exception]:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

/* ═══════════════════════════════════════════
   ENDPOINT POST: GUARDAR O ACTUALIZAR SKIN
═══════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      store_id,
      is_active,
      campaign_slug,
      custom_badge_text,
      theme_color,
      accent_color,
    } = body;

    if (!store_id) {
      return NextResponse.json({ error: "store_id es requerido" }, { status: 400 });
    }

    // Validar que el slug exista en presets o usar default
    const preset = CAMPAIGN_PRESETS[campaign_slug] || CAMPAIGN_PRESETS["black-friday"];

    const payload = {
      store_id: Number(store_id),
      user_id: user.id,
      is_active: Boolean(is_active),
      campaign_slug: preset.slug,
      custom_badge_text: typeof custom_badge_text === "string" && custom_badge_text.trim() !== ""
        ? custom_badge_text.trim()
        : preset.defaultBadge,
      theme_color: theme_color || preset.themeColor,
      accent_color: accent_color || preset.accentColor,
      updated_at: new Date().toISOString(),
    };

    const { data: savedData, error: upsertError } = await supabaseAdmin
      .from("store_campaign_settings")
      .upsert(payload, { onConflict: "store_id" })
      .select()
      .single();

    if (upsertError) {
      console.error("[Campaign Upsert Error]:", upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      campaign: savedData,
    });
  } catch (err: any) {
    console.error("[Campaign POST Exception]:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
       }
