export interface WidgetDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: WidgetCategory;
  icon: string;
  config_schema: Record<string, unknown>;
  is_active: boolean;
}

export type WidgetCategory =
  | "conversion"
  | "multimedia"
  | "urgency"
  | "trust"
  | "popup"
  | "description";

export const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  conversion: "Conversión",
  multimedia: "Multimedia",
  urgency: "Urgencia",
  trust: "Confianza",
  popup: "Popups",
  description: "Descripción",
};

export const CATEGORY_ICONS: Record<WidgetCategory, string> = {
  conversion: "TrendingUp",
  multimedia: "Play",
  urgency: "Clock",
  trust: "Shield",
  popup: "Mail",
  description: "Type",
};

export interface WidgetInstance {
  id: string;
  user_id: string;
  store_id: number;
  widget_slug: string;
  widget_type: WidgetCategory;
  target_type: "product" | "all";
  target_product_id?: number | null;
  config: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TiendanubeProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  variants: Array<{
    id: number;
    price: string;
    promotional_price?: string | null;
    stock?: number | null;
  }>;
  images: Array<{
    id: number;
    src: string;
  }>;
  }
