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
    // Motor y líneas de clientes: cache de 5 minutos, así apagar o cambiar un cliente se aplica rápido
    const cache = [{ key: "Cache-Control", value: "public, max-age=300, must-revalidate" }];
    return [
      { source: "/nevux.js", headers: cache },
      { source: "/c/:cliente*", headers: cache },
    ];
  },
};

module.exports = nextConfig;
