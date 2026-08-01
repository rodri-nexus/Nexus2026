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
};

module.exports = nextConfig;
