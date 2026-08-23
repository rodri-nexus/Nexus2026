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
        background: "#ecfdf5",
        border: "1.5px solid #a7f3d0",
        borderRadius: "10px",
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "#10B981",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          background: "#ffffff",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image ? (
          <Image src={image} alt={name} fill style={{ objectFit: "cover" }} />
        ) : (
          <Package size={14} color="#10B981" />
        )}
      </div>
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: "#000000",
        }}
      >
        {name}
      </span>
    </div>
  );
            }
