import Header from "./components/landing/Header";
import Hero from "./components/landing/Hero";
import SocialProof from "./components/landing/SocialProof";
import FeatureBundles from "./components/landing/FeatureBundles";
import FeatureWidgets from "./components/landing/FeatureWidgets";
import FeatureTrust from "./components/landing/FeatureTrust";
import FeatureCustomize from "./components/landing/FeatureCustomize";
import Testimonials from "./components/landing/Testimonials";
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

      {/* Secciones principales */}
      <Hero />
      <SocialProof />
      <FeatureBundles />
      <FeatureWidgets />
      <FeatureTrust />
      <FeatureCustomize />
      <Testimonials />
      <CTAFinal />

      {/* Footer */}
      <Footer />

      {/* Chat flotante */}
      <ChatBubble />
    </main>
  );
      }
