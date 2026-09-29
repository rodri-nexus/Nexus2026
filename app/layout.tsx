import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/supabase-browser";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nevux.ar"),
  title: "Nevux | Multiplicá tus ventas en Tiendanube",
  description: "La plataforma #1 de widgets de conversión e IA para Tiendanube. Aumentá tu ticket promedio con NevuxBot, Vendedor IA y más de 27 widgets.",
  keywords: ["Tiendanube", "e-commerce", "widgets", "conversión", "ventas", "IA", "vendedor virtual", "nevux"],
  authors: [{ name: "Nevux Team" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Nevux | Multiplicá tus ventas en Tiendanube",
    description: "Impulsá tu Tiendanube con IA y widgets de alto impacto.",
    url: "https://nevux.ar",
    siteName: "Nevux",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nevux | Multiplicá tus ventas en Tiendanube",
    description: "IA y widgets para potenciar tu e-commerce.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        {/* NubeSDK para integración oficial con Tiendanube */}
        <Script 
          src="https://d26lpennugtm8s.cloudfront.net/assets/common/js/nube-sdk/js/sdk-1.0.0.js" 
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
        }
