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
    // Motor: cache de 5 minutos, así una mejora llega rápido a todas las tiendas.
    // Las líneas de cada cliente (/c/<cliente>.js) las arma app/c/[archivo]/route.ts con su propio cache.
    const cache = [{ key: "Cache-Control", value: "public, max-age=300, must-revalidate" }];
    return [{ source: "/nevux.js", headers: cache }];
  },
};

module.exports = nextConfig;
