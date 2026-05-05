"use client";

import Logo from "@/components/homepage/Logo";
import { FAQS, FEATURES, PLANS, STATS, STEPS, TESTIMONIALS, } from "@/store/hompageData";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ChevronRight, Plus, Check, X, Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";


export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#fafafa", color: "#0f0f12", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-blur {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(250,250,250,0.85);
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }

        .btn-main {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 12px;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s; text-decoration: none; border: none;
        }
        .btn-cta {
          background: #0f0f12; color: #fafafa;
          box-shadow: 0 4px 24px rgba(0,0,0,0.15);
        }
        .btn-cta:hover {
          background: #1a1a22;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          transform: translateY(-1px);
        }
        .btn-outline {
          background: transparent; color: #0f0f12;
          border: 1.5px solid rgba(0,0,0,0.15);
        }
        .btn-outline:hover {
          background: rgba(0,0,0,0.04);
          border-color: rgba(0,0,0,0.25);
        }

        .feature-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 18px;
          padding: 2rem;
          transition: all 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .feature-card:hover {
          border-color: rgba(0,0,0,0.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float { animation: float 4s ease-in-out infinite; }

        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08);
          border-radius: 99px; padding: 4px 12px;
          font-size: 0.75rem; font-weight: 500; color: #52525e;
        }
        .pill-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .stat-card {
          text-align: center;
          padding: 2rem 1.5rem;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }

        .section-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a0a0b0;
        }

        .mock-bar { height: 8px; border-radius: 99px; background: rgba(0,0,0,0.07); overflow: hidden; }
        .mock-fill { height: 100%; border-radius: 99px; }

        /* FAQ */
        .faq-item {
          border-bottom: 1px solid rgba(0,0,0,0.07);
          cursor: pointer;
        }
        .faq-item:last-child { border-bottom: none; }
        .faq-answer {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.25s ease;
        }

        /* Integration card */
        .int-card {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 1.4rem 1rem;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 16px;
          transition: all 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }
        .int-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          border-color: rgba(0,0,0,0.12);
        }

        /* Testimonial card */
        .testi-card {
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        /* Pricing card */
        .plan-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          display: flex; flex-direction: column; gap: 0;
        }
        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1);
        }
        .plan-card.highlight {
          background: #0f0f12; color: #fafafa;
          border-color: #0f0f12;
          box-shadow: 0 8px 40px rgba(0,0,0,0.25);
        }

        /* scroll ticker */
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex; gap: 48px; align-items: center;
          animation: ticker 24s linear infinite;
          width: max-content;
        }
        .ticker-track:hover { animation-play-state: paused; }

        /* comparison table */
        .compare-row { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0; }
        .compare-cell {
          padding: 14px 16px;
          font-size: 0.875rem;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex; align-items: center;
        }

        /* Mobile Menu */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #0f0f12;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: block;
          }

          .nav-buttons {
            gap: 8px !important;
          }

          .btn-main {
            padding: 10px 16px;
            font-size: 0.8rem;
          }

          /* Hero section */
          .hero-buttons {
            flex-direction: column;
            gap: 8px;
          }

          .hero-buttons .btn-main {
            width: 100%;
            justify-content: center;
          }

          /* Stats grid */
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }

          .stat-card {
            padding: 1.5rem 1rem !important;
          }

          /* Features grid */
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          /* Steps grid */
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .step-connector {
            display: none !important;
          }

          /* Testimonials */
          .testimonial-card {
            flex-direction: column !important;
            gap: 16px !important;
            padding: 1.5rem !important;
          }

          .quote-icon {
            display: none;
          }

          /* Comparison table */
          .compare-row {
            grid-template-columns: 1fr !important;
          }

          .compare-cell {
            padding: 10px 12px !important;
            font-size: 0.8rem !important;
            justify-content: space-between !important;
          }

          /* Pricing grid */
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          .plan-card {
            padding: 1.5rem !important;
          }

          /* Sections */
          section {
            padding: 60px 1rem !important;
          }

          .hero-section {
            padding-top: 100px !important;
            padding-bottom: 60px !important;
          }

          .cta-section {
            margin: 0 1rem 60px !important;
            padding: 50px 1.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .btn-main {
            padding: 9px 14px;
            font-size: 0.75rem;
          }

          .mock-preview {
            padding: 1rem !important;
          }

          .feature-card {
            padding: 1.5rem !important;
          }

          .plan-card {
            padding: 1.2rem !important;
          }

          section {
            padding: 50px 1rem !important;
          }

          .hero-section {
            padding-top: 80px !important;
          }
        }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 1.5rem",
        transition: "all 0.3s",
        ...(scrolled ? {} : { background: "transparent", borderBottom: "1px solid transparent" }),
      }} className={scrolled ? "nav-blur" : ""}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <Logo />

          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-links">
            {[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
            ].map((l) => (
              <a key={l.label} href={l.href} style={{ fontSize: "0.875rem", color: "#52525e", textDecoration: "none", fontWeight: 500 }}>{l.label}</a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ zIndex: 51 }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Auth Buttons */}
          <div style={{ alignItems: "center", gap: 12 }} className="nav-buttons hidden md:flex">
            <Show when="signed-out">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SignInButton>
                  <button className="btn-main btn-outline" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="btn-main btn-outline" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
                    Sign Up
                  </button>
                </SignUpButton>
                <Link href="#pricing" className="btn-main btn-cta" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
                  Get started →
                </Link>
              </div>
            </Show>
            <Show when="signed-in">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <UserButton />
                <Link href="/dashboard" className="btn-main btn-cta" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
                  Dashboard →
                </Link>
              </div>
            </Show>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
            top: 64,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          background: "#fafafa",
          zIndex: 45,
          padding: "1.5rem",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "0.875rem", color: "#52525e", textDecoration: "none", fontWeight: 500, padding: "10px 0" }}
              >
                {l.label}
              </a>
            ))}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <Show when="signed-out">
                <SignInButton>
                  <button className="btn-main btn-outline" style={{ width: "100%", justifyContent: "center", padding: "10px 20px", fontSize: "0.85rem" }}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="btn-main btn-outline" style={{ width: "100%", justifyContent: "center", padding: "10px 20px", fontSize: "0.85rem" }}>
                    Sign Up
                  </button>
                </SignUpButton>
                <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="btn-main btn-cta" style={{ width: "100%", justifyContent: "center", padding: "10px 20px", fontSize: "0.85rem" }}>
                  Get started →
                </Link>
              </Show>
              <Show when="signed-in">
                <UserButton />
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-main btn-cta" style={{ width: "100%", justifyContent: "center", padding: "10px 20px", fontSize: "0.85rem" }}>
                  Dashboard →
                </Link>
              </Show>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: "center", position: "relative", overflow: "hidden" }} className="hero-section">
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "0 1.5rem" }}>
          <div className="fade-up" style={{ marginBottom: 24 }}>
            <span className="pill">
              <span className="pill-dot" />
              Starting at €9/month
            </span>
          </div>

          <h1 className="fade-up delay-1" style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#0f0f12",
            marginBottom: 24,
          }}>
            Your outbound sales,<br />
            <em style={{ fontStyle: "italic", color: "#52525e" }}>on autopilot</em>
          </h1>

          <p className="fade-up delay-2" style={{
            fontSize: "1.1rem", lineHeight: 1.7,
            color: "#52525e", marginBottom: 40, maxWidth: 520, margin: "0 auto 40px",
          }}>
            EmailCopilot finds your ideal clients, sends personalised cold emails, and hands warm replies straight to your team — every single day.
          </p>

          <div className="fade-up delay-3 hero-buttons" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <Link href="/dashboard" className="btn-main btn-cta">
              Start for free
              <ChevronRight size={14} />
            </Link>
            <Link href="#how-it-works" className="btn-main btn-outline">
              See how it works
            </Link>
          </div>

          {/* Mock dashboard preview */}
          <div className="fade-up delay-4 float mock-preview" style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.09)",
            borderRadius: 20,
            padding: "1.5rem",
            maxWidth: 560,
            margin: "0 auto",
            boxShadow: "0 24px 80px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)",
            textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#a0a0b0", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>Today&apos;s pipeline</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f0f12" }}>8 emails queued</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["#22c55e", "#3b82f6", "#f59e0b"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
            </div>

            {[
              { name: "Tandarts De Vries", status: "Replied", statusColor: "#22c55e", statusBg: "rgba(34,197,94,0.1)", bar: 90 },
              { name: "Studio Bloom Amsterdam", status: "Sent", statusColor: "#3b82f6", statusBg: "rgba(59,130,246,0.1)", bar: 60 },
              { name: "Garage Hendriks", status: "New", statusColor: "#a0a0b0", statusBg: "rgba(160,160,176,0.1)", bar: 30 },
            ].map((lead) => (
              <div key={lead.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: 10,
                background: "rgba(0,0,0,0.02)", marginBottom: 8, gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f0f12", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {lead.name}
                  </div>
                  <div className="mock-bar" style={{ width: "100%" }}>
                    <div className="mock-fill" style={{ width: `${lead.bar}%`, background: lead.statusColor, opacity: 0.6 }} />
                  </div>
                </div>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 600, whiteSpace: "nowrap",
                  color: lead.statusColor, background: lead.statusBg,
                  padding: "3px 10px", borderRadius: 99,
                }}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "60px 2rem", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", color: "#0f0f12", marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#a0a0b0", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ padding: "100px 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Features</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0f0f12" }}>
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="features-grid">
            {FEATURES.map((f) => {
              const IconComponent = f.icon;
              return (
                <div key={f.title} className="feature-card">
                  <div style={{ marginBottom: 14 }}>
                    <IconComponent size={28} color="#0f0f12" strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f0f12", marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#52525e" }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: "100px 2rem", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>How it works</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0f0f12" }}>
              Three steps to more meetings
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div className="step-connector" style={{
                    position: "absolute", top: 20, left: "calc(100% - 16px)",
                    width: "calc(100% - 32px)", height: 1, zIndex: 0,
                    backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0, rgba(0,0,0,0.15) 6px, transparent 6px, transparent 12px)",
                  }} />
                )}
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#0f0f12", color: "#fafafa",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1rem", marginBottom: 20, position: "relative", zIndex: 1,
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f0f12", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#52525e" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: "100px 2rem", background: "#fafafa", overflow: "hidden" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Testimonials</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0f0f12" }}>
              Loved by sales teams
            </h2>
          </div>

          {/* Active testimonial */}
          <div style={{ position: "relative", minHeight: 200 }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="testimonial-card"
                style={{
                  position: i === activeTestimonial ? "relative" : "absolute",
                  top: 0, left: 0, right: 0,
                  opacity: i === activeTestimonial ? 1 : 0,
                  transform: i === activeTestimonial ? "translateY(0)" : "translateY(16px)",
                  transition: "all 0.5s ease",
                  pointerEvents: i === activeTestimonial ? "auto" : "none",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 24,
                  padding: "2.5rem",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
                  display: "flex", alignItems: "flex-start", gap: 28,
                }}
              >
                <div className="quote-icon" style={{ fontSize: "3rem", color: "rgba(0,0,0,0.08)", lineHeight: 1, fontFamily: "Georgia, serif", flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "#0f0f12", marginBottom: 24, fontStyle: "italic" }}>
                    {t.quote}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: t.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "0.8rem", fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f0f12" }}>{t.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: i === activeTestimonial ? 24 : 8,
                  height: 8, borderRadius: 99,
                  background: i === activeTestimonial ? "#0f0f12" : "rgba(0,0,0,0.15)",
                  border: "none", cursor: "pointer",
                  transition: "all 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      </section>



      {/* ── Comparison ── */}
      <section style={{ padding: "100px 2rem", background: "#fafafa" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Why EmailCopilot</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0f0f12" }}>
              The smarter alternative
            </h2>
          </div>

          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {/* Header */}
            <div className="compare-row" style={{ background: "#0f0f12" }}>
              <div className="compare-cell" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Feature</div>
              <div className="compare-cell" style={{ color: "#fafafa", fontWeight: 700, fontSize: "0.875rem", justifyContent: "center" }}>EmailCopilot</div>
              <div className="compare-cell" style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "0.875rem", justifyContent: "center" }}>Typical tools</div>
            </div>
            {[
              ["Lead scraping built-in", true, false],
              ["Your own SMTP domain", true, false],
              ["No per-email fees", true, false],
              ["Simple one-page dashboard", true, false],
              ["Starts at €9/month", true, false],
              ["Warm reply routing", true, true],
            ].map(([label, us, them]) => (
              <div key={label as string} className="compare-row">
                <div className="compare-cell" style={{ fontWeight: 500, color: "#0f0f12" }}>{label as string}</div>
                <div className="compare-cell" style={{ justifyContent: "center" }}>
                  {us ? (
                    <Check size={18} color="#22c55e" strokeWidth={2} />
                  ) : (
                    <X size={18} color="#e5e7eb" strokeWidth={2} />
                  )}
                </div>
                <div className="compare-cell" style={{ justifyContent: "center" }}>
                  {them ? (
                    <Check size={18} color="#22c55e" strokeWidth={2} />
                  ) : (
                    <X size={18} color="#d1d5db" strokeWidth={2} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: "100px 2rem", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.07)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Pricing</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0f0f12" }}>
              Simple, transparent pricing
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="pricing-grid">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`plan-card${plan.highlight ? " highlight" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem", color: plan.highlight ? "#fafafa" : "#0f0f12" }}>{plan.name}</span>
                  {plan.tag && (
                    <span style={{
                      fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em",
                      background: "#22c55e", color: "#fff",
                      padding: "3px 10px", borderRadius: 99,
                    }}>{plan.tag}</span>
                  )}
                </div>

                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "3rem", lineHeight: 1, color: plan.highlight ? "#fafafa" : "#0f0f12" }}>{plan.price}</span>
                  <span style={{ fontSize: "0.9rem", color: plan.highlight ? "rgba(255,255,255,0.5)" : "#a0a0b0", marginLeft: 4 }}>/month</span>
                </div>

                <div style={{
                  display: "inline-block",
                  fontSize: "0.75rem", fontWeight: 600,
                  background: plan.highlight ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                  color: plan.highlight ? "rgba(255,255,255,0.7)" : "#52525e",
                  padding: "4px 10px", borderRadius: 99, marginBottom: 28,
                }}>
                  {plan.volume}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, flex: 1 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: plan.highlight ? "rgba(255,255,255,0.15)" : "rgba(34,197,94,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Check size={10} color={plan.highlight ? "#fff" : "#22c55e"} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: "0.85rem", color: plan.highlight ? "rgba(255,255,255,0.8)" : "#0f0f12" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/dashboard" className="btn-main" style={{
                  width: "100%", justifyContent: "center", padding: "13px",
                  background: plan.highlight ? "#fafafa" : "#0f0f12",
                  color: plan.highlight ? "#0f0f12" : "#fafafa",
                }}>
                  {plan.cta} →
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#a0a0b0", marginTop: 28 }}>
            All plans include a free trial · No credit card required
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "100px 2rem", background: "#fafafa" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>FAQ</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0f0f12" }}>
              Common questions
            </h2>
          </div>

          <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "20px 24px", gap: 16,
                }}>
                  <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#0f0f12" }}>{faq.q}</span>
                  <div style={{
                    width: 28, height: 28, borderRadius: 99,
                    background: openFaq === i ? "#0f0f12" : "rgba(0,0,0,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s",
                  }}>
                    <Plus size={12} color={openFaq === i ? "#fff" : "#0f0f12"} strokeWidth={2.5}
                      style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                  </div>
                </div>
                <div className="faq-answer" style={{
                  maxHeight: openFaq === i ? "200px" : "0px",
                  opacity: openFaq === i ? 1 : 0,
                }}>
                  <p style={{ padding: "0 24px 20px", fontSize: "0.875rem", lineHeight: 1.7, color: "#52525e" }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin: "0 1.5rem 80px",
        background: "#0f0f12",
        borderRadius: 24,
        padding: "80px 2rem",
        textAlign: "center",
        maxWidth: 1000,
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
        overflow: "hidden",
      }} className="cta-section">
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 400, color: "#fafafa",
            letterSpacing: "-0.02em", marginBottom: 16,
          }}>
            Ready to fill your calendar?
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", marginBottom: 36 }}>
            Join businesses already using EmailCopilot to generate consistent meetings.
          </p>
          <Link href="/dashboard" className="btn-main" style={{
            background: "#fafafa", color: "#0f0f12",
            padding: "14px 32px", fontWeight: 700,
            boxShadow: "0 4px 24px rgba(255,255,255,0.1)",
          }}>
            Start for €9/month →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "48px 2rem 48px", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 32, marginBottom: 10 }}>
            <div>
              <Logo />
              <p style={{ fontSize: "0.82rem", color: "#a0a0b0", maxWidth: 220, lineHeight: 1.6 }}>Automated outbound that books meetings while you sleep.</p>
            </div>

            <p style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>© 2026 EmailCopilot. All rights reserved.</p>
          </div>

        </div>
      </footer>
    </div>
  );
}