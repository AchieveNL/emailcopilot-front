"use client";
import { useEffect, useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/dist/client/link";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";

function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');


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
          transition: all 0.4s; text-decoration: none; border: 1px solid transparent;
        }
@keyframes gradientFlow {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.btn-cta {
  background: var(--btn-gradient);
  background-size: 200% 200%;
  color: var(--btn-text-color);
}
.btn-cta:hover {
  animation: gradientFlow 2s ease infinite;
  background-image: linear-gradient(
    86.91deg,
    var(--color-primary),
    var(--color-secondary),
    var(--color-light),
    var(--color-primary-dark),
    var(--color-primary)
  );
  background-size: 300% 300%;
  border: 1px solid transparent;
  color: var(--btn-text-color);
}
        .btn-outline {
          background: transparent; color: var(--btn-outline-color);
          border: 1.5px solid var(--btn-outline-color);
        }
        .btn-outline:hover {
         background: var(--btn-gradient); color: #fafafa;
         
          border: 1px solid transparent
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
            .gradient-text {
  @apply bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent;
}
        }
      `}</style>

      {/* ── Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "0 1.5rem",
          transition: "all 0.3s",
          marginBottom: "66px",
          ...(scrolled
            ? {}
            : {
                background: "transparent",
                borderBottom: "1px solid transparent",
              }),
        }}
        className={scrolled ? "nav-blur" : ""}
      >
        <div
          className="max-w-[1100px] mx-auto flex items-center justify-between"
          style={{ height: 64 }}
        >
          <Logo />

          <div
            style={{ display: "flex", gap: 28, alignItems: "center" }}
            className="nav-links"
          >
            {[
              { label: "How it works", href: "#how-it-works" },
              { label: "Testimonials", href: "#testimonials" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQs", href: "#faqs" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: "0.875rem",
                  color: "#52525e",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {l.label}
              </a>
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
          <div
            style={{ alignItems: "center", gap: 12 }}
            className="nav-buttons hidden md:flex"
          >
            <Show when="signed-out">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SignInButton>
                  <button
                    className="btn-main btn-outline "
                    style={{ padding: "9px 20px", fontSize: "0.85rem" }}
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    className="btn-main btn-outline "
                    style={{ padding: "9px 20px", fontSize: "0.85rem" }}
                  >
                    Sign Up
                  </button>
                </SignUpButton>
                <Link
                  href="#pricing"
                  className="btn-main btn-cta "
                  style={{ padding: "9px 20px", fontSize: "0.85rem" }}
                >
                  Get started →
                </Link>
              </div>
            </Show>
            <Show when="signed-in">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <UserButton />
                <Link
                  href="/dashboard"
                  className="btn-main btn-cta"
                  style={{ padding: "9px 20px", fontSize: "0.85rem" }}
                >
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
        <div
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            background: "#fafafa",
            zIndex: 45,
            padding: "1.5rem",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "How it works", href: "#how-it-works" },
              { label: "Testimonials", href: "#testimonials" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQs", href: "#faqs" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: "0.875rem",
                  color: "#52525e",
                  textDecoration: "none",
                  fontWeight: 500,
                  padding: "10px 0",
                }}
              >
                {l.label}
              </a>
            ))}
            <div
              style={{
                borderTop: "1px solid rgba(0,0,0,0.07)",
                paddingTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Show when="signed-out">
                <SignInButton>
                  <button
                    className="btn-main btn-outline"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "10px 20px",
                      fontSize: "0.85rem",
                    }}
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    className="btn-main btn-outline"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "10px 20px",
                      fontSize: "0.85rem",
                    }}
                  >
                    Sign Up
                  </button>
                </SignUpButton>
                <Link
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-main btn-cta"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "10px 20px",
                    fontSize: "0.85rem",
                  }}
                >
                  Get started →
                </Link>
              </Show>
              <Show when="signed-in">
                <UserButton />
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-main btn-cta"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "10px 20px",
                    fontSize: "0.85rem",
                  }}
                >
                  Dashboard →
                </Link>
              </Show>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
