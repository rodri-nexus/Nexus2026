"use client";

import Image from "next/image";
import { Package } from "lucide-react";

interface ProductChipProps {
  name: string;
  image?: string;
}

export default function ProductChip({ name, image }: ProductChipProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.4rem 0.85rem 0.4rem 0.4rem",
        background: "#ffffff",
        border: "1.5px solid #e5e7eb",
        borderRadius: "10px",
        fontSize: "0.85rem",
        fontWeight: 500,
        color: "#374151",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          background: "#f3f4f6",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {image ? (
          <Image src={image} alt={name} fill style={{ objectFit: "cover" }} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Package size={14} color="#9ca3af" />
          </div>
        )}
      </div>
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </span>
    </div>
  );
            }
