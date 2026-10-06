"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { WidgetDefinition } from "@/types/widgets";
import WidgetCatalog from "./WidgetCatalog";

interface WidgetCatalogClientProps {
  definitions: WidgetDefinition[];
  title: string;
  chip?: React.ReactNode;
  baseUrl: string;
  productId?: number;
  categoryId?: string | number;
  target?: "all" | "category" | string;
  selectedType?: string;
}

type Categoria = "todos" | "aov" | "urgencia" | "confianza" | "gamificacion" | "home";

// Helper para clasificar dinámicamente cada widget por su categoría core
function getWidgetCategory(slug: string): Categoria {
  const aov = ["bundle-promociones", "bundle-cantidad", "pack-complementarios", "extras-interruptor", "barra-progreso"];
  const urgencia = ["cuenta-regresiva", "contador-visitas", "mensaje-alerta", "badge-cupon", "banner-deslizante"];
  const gamificacion = ["ruleta-descuentos"];
  const home = ["menu-circulos", "slider-categorias", "slider-video"];

  if (aov.includes(slug)) return "aov";
  if (urgencia.includes(slug)) return "urgencia";
  if (gamificacion.includes(slug)) return "gamificacion";
  if (home.includes(slug)) return "home";
  return "confianza"; // Todo lo demás clasifica en confianza (talles, opiniones, etc)
}

export default function WidgetCatalogClient({
  definitions,
  title,
  chip,
  baseUrl,
  productId,
  categoryId,
  target,
  selectedType,
}: WidgetCatalogClientProps) {
  const router = useRouter();
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("todos");

  // Si se pasó un selectedType (desde el modal), redirigir directamente al editor
  useEffect(() => {
    if (selectedType && definitions.length > 0) {
      const match = definitions.find(
        (d) =>
          d.slug === selectedType ||
          d.id?.toString() === selectedType ||
          d.slug?.includes(selectedType)
      );

      if (match) {
        const params = new URLSearchParams();
        if (productId) params.set("product", String(productId));
        if (categoryId) params.set("category", String(categoryId));
        if (target) params.set("target", target);
        router.push(`${baseUrl}/${match.slug}?${params.toString()}`);
      }
    }
  }, [selectedType, definitions, baseUrl, productId, categoryId, target, router]);

  // Filtrado inteligente para Producto Específico o Categoría Específica
  const widgetsPermitidos = useMemo(() => {
    return definitions.filter((d) => {
      if (productId || categoryId) {
        const esWidgetDeHome = ["menu-circulos", "slider-categorias", "resenas-foto"].includes(d.slug);
        return !esWidgetDeHome; // Ocultar widgets exclusivos de la Home
      }
      return true;
    });
  }, [definitions, productId, categoryId]);

  // Categorías dinámicas para los filtros con contador real
  const categoriasConConteo = useMemo(() => {
    return [
      { id: "todos" as Categoria, label: "✨ Todos", count: widgetsPermitidos.length },
      { id: "aov" as Categoria, label: "💰 Ticket Promedio", count: widgetsPermitidos.filter(w => getWidgetCategory(w.slug) === "aov").length },
      { id: "urgencia" as Categoria, label: "⚡ Urgencia", count: widgetsPermitidos.filter(w => getWidgetCategory(w.slug) === "urgencia").length },
      { id: "confianza" as Categoria, label: "🛡️ Confianza", count: widgetsPermitidos.filter(w => getWidgetCategory(w.slug) === "confianza").length },
      { id: "gamificacion" as Categoria, label: "🎡 Interactivos", count: widgetsPermitidos.filter(w => getWidgetCategory(w.slug) === "gamificacion").length },
      { id: "home" as Categoria, label: "📱 Estilo App", count: widgetsPermitidos.filter(w => getWidgetCategory(w.slug) === "home").length },
    ];
  }, [widgetsPermitidos]);

  // Filtrado final de widgets según la pestaña seleccionada
  const widgetsFiltradosYVisibles = useMemo(() => {
    if (categoriaActiva === "todos") return widgetsPermitidos;
    return widgetsPermitidos.filter((w) => getWidgetCategory(w.slug) === categoriaActiva);
  }, [widgetsPermitidos, categoriaActiva]);

  function handleSelect(widget: WidgetDefinition) {
    const params = new URLSearchParams();
    if (productId) params.set("product", String(productId));
    if (categoryId) params.set("category", String(categoryId));
    if (target) params.set("target", target);
    router.push(`${baseUrl}/${widget.slug}?${params.toString()}`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      {/* Chip de alcance */}
      {chip && <div>{chip}</div>}

      {/* Título de la sección */}
      <h1
        style={{
          margin: "0 0 0.5rem 0",
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#000000",
          letterSpacing: "-0.015em",
          lineHeight: 1.25,
        }}
      >
        {title}
      </h1>

      {/* Selector de categorías horizontal premium con contadores */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          marginBottom: "0.5rem",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {categoriasConConteo.map((cat) => {
          const isSelected = categoriaActiva === cat.id;
          if (cat.count === 0) return null; // No mostrar categoría si no tiene widgets disponibles

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoriaActiva(cat.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.55rem 1rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                border: isSelected ? "1.5px solid #10B981" : "1.5px solid #e5e7eb",
                background: isSelected ? "#ecfdf5" : "#ffffff",
                color: isSelected ? "#059669" : "#4b5563",
                transition: "all 0.15s ease",
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: "0.7rem",
                  background: isSelected ? "#10B981" : "#f3f4f6",
                  color: isSelected ? "#ffffff" : "#6b7280",
                  padding: "1px 6px",
                  borderRadius: "999px",
                  fontWeight: 800,
                }}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Renderizado de la grilla del catálogo con los filtros aplicados */}
      <WidgetCatalog
        widgets={widgetsFiltradosYVisibles}
        onSelectWidget={handleSelect}
        title=""
        chip={null}
      />
    </div>
  );
  }
