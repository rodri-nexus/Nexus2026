import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Lo que muestran WhatsApp, Instagram, Facebook y Google al compartir o buscar nevux.ar.
// La imagen es un archivo fijo (public/compartir.jpg, ver scripts/compartir/): WhatsApp descarta las imágenes que tardan en generarse.
const TITULO = "Nevux | No te faltan visitas. Te faltan ventas.";
const DESCRIPCION =
  "Convertimos las fichas de tu Tiendanube en páginas que venden. Análisis gratis de tu tienda por WhatsApp. Sin apps y sin cambiar de plantilla.";
const IMAGEN = {
  url: "https://nevux.ar/compartir.jpg",
  secureUrl: "https://nevux.ar/compartir.jpg",
  type: "image/jpeg",
  width: 1200,
  height: 630,
  alt: "Nevux · No te faltan visitas. Te faltan ventas.",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nevux.ar"),
  title: TITULO,
  description: DESCRIPCION,
  applicationName: "Nevux",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: ["/icon-192.png"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: "https://nevux.ar",
    siteName: "Nevux",
    locale: "es_AR",
    type: "website",
    images: [IMAGEN],
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION, images: [IMAGEN.url] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HTK0Y1WNRZ"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HTK0Y1WNRZ');
        `,
          }}
        />

        {/* Facebook Pixel. Sin el <noscript> de respaldo: React lo renderiza igual y la imagen
            sumaba un segundo PageView en cada carga. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1814965146452140');
          fbq('track', 'PageView');
        `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
  }
