"use client";

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
}

export default function WidgetCatalogClient({
  definitions,
  title,
  chip,
  baseUrl,
  productId,
  target,
}: WidgetCatalogClientProps) {
  const router = useRouter();

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
