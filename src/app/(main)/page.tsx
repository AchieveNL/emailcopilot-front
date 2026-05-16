import Cta from "@/components/homepage/Cta";
import Faqs from "@/components/homepage/Faqs";
import HeroSection from "@/components/homepage/HeroSection";
import HowItWorks from "@/components/homepage/HowItWorks";
import Pricing from "@/components/homepage/Pricing";
import Testimonials from "@/components/homepage/Testimonials";
import TrustedTeams from "@/components/homepage/TrustedTeams";


export default function HomePage() {


  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#fafafa", color: "#0f0f12", overflowX: "hidden" }} className="flex flex-col gap-0 items-center">


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