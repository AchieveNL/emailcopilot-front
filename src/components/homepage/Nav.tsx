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
          className="container mx-auto flex items-center justify-between"
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
