import Cta from "@/components/homepage/Cta";
import Faqs from "@/components/homepage/Faqs";
import HeroSection from "@/components/homepage/HeroSection";
import HowItWorks from "@/components/homepage/HowItWorks";
import Pricing from "@/components/homepage/Pricing";
import Testimonials from "@/components/homepage/Testimonials";
import TrustedTeams from "@/components/homepage/TrustedTeams";
import Ribbons from "@/components/homepage/Ribbons";

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "#fafafa",
        color: "#0f0f12",
        overflowX: "hidden",
      }}
      className="flex flex-col gap-0 items-center relative"
    >
      <div className="fixed inset-0 pointer-events-none z-9999">
        <Ribbons
          colors={["#4f46e5", "#2563eb", "#06b6d4"]}
          singleLineGradient={true}
          baseSpring={0.03}
          baseFriction={0.9}
          baseThickness={24}
          pointCount={40}
          speedMultiplier={0.5}
          enableFade={true}
        />
      </div>

      {/* ── Hero ── */}
      <HeroSection />
      <TrustedTeams />
      <HowItWorks />

      {/* ── Testimonials ── */}

      <Testimonials />

      {/* ── Pricing ── */}
      <Pricing />

      {/* ── FAQ ── */}
      <Faqs />

      {/* ── CTA ── */}
      <Cta />
    </div>
  );
}
