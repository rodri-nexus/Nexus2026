import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nevux: {
          green: "#10B981",
          dark: "#0a0a0a",
          card: "#111111",
          border: "#1f1f1f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
