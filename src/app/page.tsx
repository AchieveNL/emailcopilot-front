"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const FEATURES = [
  {
    icon: "🔍",
    title: "Smart lead scraping",
    desc: "Automatically finds businesses on Google Maps that match your target. Name, email, website — all collected without lifting a finger.",
  },
  {
    icon: "✉️",
    title: "Personalised cold emails",
    desc: "Sends tailored emails from your own inbox, at the right time, with natural delays between each send so it always feels human.",
  },
  {
    icon: "📋",
    title: "Simple pipeline dashboard",
    desc: "Track every lead from first contact to booked meeting. Filter by status, update notes, and see exactly what was sent and when.",
  },
  {
    icon: "⚙️",
    title: "Full control, zero lock-in",
    desc: "Your SMTP, your data, your rules. Set daily limits, schedule scrapes, edit templates — everything from one clean dashboard.",
  },
];

const STEPS = [
  { num: "01", title: "Set your target", desc: "Tell EmailCopilot what kind of businesses to find. A search query is all it takes." },
  { num: "02", title: "We find & contact them", desc: "The system scrapes leads and sends personalised cold emails automatically — every day." },
  { num: "03", title: "You close the meetings", desc: "Replies land in your inbox. Your team qualifies and books. You focus on what matters." },
];

const STATS = [
  { value: "10–50", label: "emails per day" },
  { value: "2×", label: "daily scrape runs" },
  { value: "100%", label: "your own data" },
  { value: "€25", label: "per month" },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
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

        .step-line::after {
          content: '';
          position: absolute;
          top: 28px; left: calc(100% + 1px);
          width: calc(100% - 2px); height: 1px;
          background: repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0, rgba(0,0,0,0.15) 6px, transparent 6px, transparent 12px);
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

        .gradient-text {
          background: linear-gradient(135deg, #0f0f12 0%, #52525e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* mock dashboard preview */
        .mock-bar { height: 8px; border-radius: 99px; background: rgba(0,0,0,0.07); overflow: hidden; }
        .mock-fill { height: 100%; border-radius: 99px; }
      `}</style>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 2rem",
        transition: "all 0.3s",
        ...(scrolled ? {} : { background: "transparent", borderBottom: "1px solid transparent" }),
      }} className={scrolled ? "nav-blur" : ""}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: "#0f0f12",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "0.9rem" }}>✉️</span>
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", color: "#0f0f12", letterSpacing: "-0.01em" }}>
              EmailCopilot
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/dashboard" className="btn-main btn-outline" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
              Sign in
            </Link>
            <Link href="/dashboard" className="btn-main btn-cta" style={{ padding: "9px 20px", fontSize: "0.85rem" }}>
              Get started →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "0 2rem" }}>
          <div className="fade-up" style={{ marginBottom: 24 }}>
            <span className="pill">
              <span className="pill-dot" />
              Now available · €25/month
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

          <div className="fade-up delay-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
            <Link href="/dashboard" className="btn-main btn-cta">
              Start for free
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="#how-it-works" className="btn-main btn-outline">
              See how it works
            </Link>
          </div>

          {/* Mock dashboard preview */}
          <div className="fade-up delay-4 float" style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.09)",
            borderRadius: 20,
            padding: "1.5rem",
            maxWidth: 560,
            margin: "0 auto",
            boxShadow: "0 24px 80px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)",
            textAlign: "left",
          }}>
            {/* Mock header */}
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

            {/* Mock leads */}
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
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
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
      <section style={{ padding: "100px 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p className="section-label" style={{ marginBottom: 12 }}>Features</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0f0f12" }}>
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ fontSize: "1.5rem", marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f0f12", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#52525e" }}>{f.desc}</p>
              </div>
            ))}
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div style={{
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

      {/* ── Pricing ── */}
      <section style={{ padding: "100px 2rem" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <p className="section-label" style={{ marginBottom: 12 }}>Pricing</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "#0f0f12", marginBottom: 48 }}>
            Simple, transparent pricing
          </h2>

          <div style={{
            background: "#fff", border: "1px solid rgba(0,0,0,0.09)",
            borderRadius: 24, padding: "2.5rem",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "3.5rem", color: "#0f0f12", lineHeight: 1 }}>€25</span>
              <span style={{ fontSize: "1rem", color: "#a0a0b0", marginLeft: 4 }}>/month</span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#52525e", marginBottom: 32, lineHeight: 1.6 }}>
              Everything included. No hidden fees, no per-email charges.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, textAlign: "left" }}>
              {[
                "Automated lead scraping (2× daily)",
                "Up to 50 personalised emails/day",
                "Full pipeline dashboard",
                "Unlimited email templates",
                "Your own SMTP — no shared servers",
                "Dedicated support",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#22c55e" strokeWidth={3}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "#0f0f12" }}>{item}</span>
                </div>
              ))}
            </div>

            <Link href="/dashboard" className="btn-main btn-cta" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
              Get started today →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin: "0 2rem 80px",
        background: "#0f0f12",
        borderRadius: 24,
        padding: "80px 2rem",
        textAlign: "center",
        maxWidth: 1000,
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* subtle grid */}
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
            Start for €25/month →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "32px 2rem 48px", borderTop: "1px solid rgba(0,0,0,0.07)", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#0f0f12", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "0.65rem" }}>✉️</span>
          </div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.95rem", color: "#0f0f12" }}>EmailCopilot</span>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#a0a0b0" }}>© 2026 EmailCopilot. All rights reserved.</p>
      </footer>
    </div>
  );
}