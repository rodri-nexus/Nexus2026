"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WidgetDefinition } from "@/types/widgets";
import WidgetCatalog from "./WidgetCatalog";

interface WidgetCatalogClientProps {
  definitions: WidgetDefinition[];
  title: string;
  chip?: React.ReactNode;
  baseUrl: string;
  productId?: number;
  target?: "all";
  selectedType?: string;
}

export default function WidgetCatalogClient({
  definitions,
  title,
  chip,
  baseUrl,
  productId,
  target,
  selectedType,
}: WidgetCatalogClientProps) {
  const router = useRouter();

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
        if (target) params.set("target", target);
        router.push(`${baseUrl}/${match.slug}?${params.toString()}`);
      }
    }
  }, [selectedType, definitions, baseUrl, productId, target, router]);

  function handleSelect(widget: WidgetDefinition) {
    const params = new URLSearchParams();
    if (productId) params.set("product", String(productId));
    if (target) params.set("target", target);
    router.push(`${baseUrl}/${widget.slug}?${params.toString()}`);
  }

  return (
    <WidgetCatalog
      widgets={definitions}
      onSelectWidget={handleSelect}
      title={title}
      chip={chip}
    />
  );
    }
