import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nevux.ar"),
  title: "Nevux - Aumenta tu ticket promedio",
  description:
    "App de Tiendanube para aumentar el ticket promedio de tu tienda online",
  openGraph: {
    title: "Nevux - Aumenta tu ticket promedio",
    description: "App de Tiendanube para aumentar el ticket promedio de tu tienda online",
    url: "https://nevux.ar",
    siteName: "Nevux",
    locale: "es_AR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#10B981",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "#f9fafb",
          color: "#000000",
        }}
      >
        {children}
      </body>
    </html>
  );
}
