// app/page.tsx
import Header from "./components/landing/Header";
import Hero from "./components/landing/Hero";
import FeatureWidgets from "./components/landing/FeatureWidgets";
import FeatureCustomize from "./components/landing/FeatureCustomize";
import CTAFinal from "./components/landing/CTAFinal";
import Footer from "./components/landing/Footer";
import ChatBubble from "./components/landing/ChatBubble";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#000000",
      }}
    >
      {/* Header sticky de navegación */}
      <Header />

      {/* 1. Hero: Suite de Conversión & IA */}
      <Hero />

      {/* 2. Los 27 Widgets + Herramientas Pro & IA */}
      <FeatureWidgets />

      {/* 3. Motor de Estilo de Marca Sincronizado en Vivo */}
      <FeatureCustomize />

      {/* 4. Cierre de Alta Conversión & ROI Tracker */}
      <CTAFinal />

      {/* Footer corporativo */}
      <Footer />

      {/* Burbuja flotante de atención */}
      <ChatBubble />
    </main>
  );
      }
