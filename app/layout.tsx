import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nevux.ar"),
  title: "Nevux · Fichas de producto que venden, para Tiendanube",
  description:
    "Convertimos tus fichas de Tiendanube en páginas que venden: packs, precio por transferencia, urgencia, envío y botón de compra fijo. Sin cambiar de plantilla y sin apps.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Nevux · Fichas de producto que venden, para Tiendanube",
    description:
      "Convertimos tus fichas de Tiendanube en páginas que venden. Sin cambiar de plantilla y sin apps.",
    url: "https://nevux.ar",
    siteName: "Nevux",
    locale: "es_AR",
    type: "website",
    images: [{ url: "/og", secureUrl: "https://nevux.ar/og", type: "image/png", width: 1200, height: 630, alt: "Nevux · Optimización de fichas para Tiendanube" }],
  },
  twitter: { card: "summary_large_image", images: ["/og"] },
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
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />

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
      <body className="bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
  }
