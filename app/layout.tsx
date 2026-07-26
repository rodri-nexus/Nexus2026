import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nevux - Aumenta tu ticket promedio",
  description: "App de Tiendanube para aumentar el ticket promedio de tu tienda online",
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
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "#f9fafb",
          color: "#111827",
        }}
      >
        {children}
      </body>
    </html>
  );
}
