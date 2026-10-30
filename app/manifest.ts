import type { MetadataRoute } from "next";

// Nombre e íconos de Nevux cuando se guarda nevux.ar en la pantalla de inicio del celular
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nevux",
    short_name: "Nevux",
    description: "Fichas de producto que venden, para Tiendanube.",
    start_url: "/",
    display: "standalone",
    background_color: "#07080a",
    theme_color: "#07080a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
