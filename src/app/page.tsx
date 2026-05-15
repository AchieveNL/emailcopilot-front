"use client";

import Cta from "@/components/homepage/Cta";
import Faqs from "@/components/homepage/Faqs";
import Footer from "@/components/homepage/Footer";
import HeroSection from "@/components/homepage/HeroSection";
import HowItWorks from "@/components/homepage/HowItWorks";
import Logo from "@/components/homepage/Logo";
import Pricing from "@/components/homepage/Pricing";
import Testimonials from "@/components/homepage/Testimonials";
import TrustedTeams from "@/components/homepage/TrustedTeams";
import { FAQS, FEATURES, PLANS, STATS, STEPS, TESTIMONIALS, } from "@/store/hompageData";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Plus, Check, X, Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";


export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);




  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

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