import Header from "./components/landing/Header";
import Hero from "./components/landing/Hero";
import FeatureWidgets from "./components/landing/FeatureWidgets";
import CTAFinal from "./components/landing/CTAFinal";
import Footer from "./components/landing/Footer";
import ChatBubble from "./components/landing/ChatBubble";

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
      {/* Header sticky */}
      <Header />

      {/* Secciones principales de alta conversión */}
      <Hero />
      <FeatureWidgets />
      <CTAFinal />

      {/* Footer */}
      <Footer />

      {/* Chat flotante */}
      <ChatBubble />
    </main>
  );
}
