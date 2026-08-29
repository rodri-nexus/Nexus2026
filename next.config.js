/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.tiendanube.com",
      },
      {
        protocol: "https",
        hostname: "**.mitiendanube.com",
      },
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Forzar a todas las tiendas y navegadores a descargar siempre la última versión del widget
        source: "/nevux-widget.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
