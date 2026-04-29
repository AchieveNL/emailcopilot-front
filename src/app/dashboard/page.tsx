"use client";

import { useEffect, useState } from "react";
import { leadsApi, schedulerApi } from "@/lib/api";
import type { LeadStats } from "@/lib/types";
import Link from "next/link";

export default function OverviewPage() {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [scheduler, setScheduler] = useState<{
    sendJob: { active: boolean };
    scrapeJobAM: { active: boolean };
    scrapeJobPM: { active: boolean };
  } | null>(null);
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState("");




  useEffect(() => {
    leadsApi.stats().then(setStats).catch(console.error);
    schedulerApi.status().then(setScheduler).catch(console.error);
  }, []);

  async function handleSendNow() {
    setSending(true);
    setSendMsg("");
    try {
      await schedulerApi.sendNow();
      setSendMsg("Send job triggered — check server logs.");
    } catch {
      setSendMsg("Failed to trigger.");
    } finally {
      setSending(false);
    }
  }
  const statCards = [
    {
      label: "Total leads",
      value: stats?.total ?? "—",
      icon: "👥",
      color: "#8b5cf6",
      glow: "rgba(139,92,246,0.15)",
      delta: null,
    },
    {
      label: "Replied",
      value: stats?.replied ?? "—",
      icon: "💬",
      color: "#059669",
      glow: "rgba(5,150,105,0.12)",
      delta: stats && stats.sent > 0 ? `${Math.round((stats.replied / stats.sent) * 100)}% reply rate` : null,
    },
    {
      label: "Emails sent",
      value: stats?.sent ?? "—",
      icon: "📨",
      color: "#2563eb",
      glow: "rgba(37,99,235,0.12)",
      delta: null,
    },
    {
      label: "New leads",
      value: stats?.new ?? "—",
      icon: "✨",
      color: "#d97706",
      glow: "rgba(217,119,6,0.12)",
      delta: "Ready to email",
    },
  ];

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
          Here is today&apos;s pipeline overview
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((s) => (
          <div key={s.label} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Glow blob */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: s.glow, filter: 'blur(20px)', pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{s.label}</span>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: s.glow, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.875rem',
              }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {s.value}
            </div>
            {s.delta && (
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 6 }}>{s.delta}</div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Scheduler status */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2>Scheduler status</h2>
            <span style={{
              fontSize: '0.65rem', fontWeight: 600,
              color: '#059669', background: 'rgba(5,150,105,0.1)',
              padding: '2px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>Live</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: "AM scrape job", key: "scrapeJobAM" as const },
              { label: "PM scrape job", key: "scrapeJobPM" as const },
              { label: "Daily send job", key: "sendJob" as const },
            ].map(({ label, key }) => {
              const active = scheduler?.[key]?.active ?? false;
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem', borderRadius: 10, background: 'var(--color-bg-elevated)'
                }}>
                  <span style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 500,
                    color: active ? '#059669' : 'var(--color-text-muted)'
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: active ? '#059669' : 'var(--color-text-muted)',
                      boxShadow: active ? '0 0 6px rgba(5,150,105,0.5)' : 'none'
                    }} />
                    {active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <h2 style={{ marginBottom: '1.25rem' }}>Quick actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleSendNow} disabled={sending} className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="m22 2-7 20-4-9-9-4 20-7z" />
              </svg>
              {sending ? "Triggering..." : "Send emails now"}
            </button>
            <Link href="/scraper" className="btn btn-secondary" style={{ justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              Run scrape job
            </Link>
            <Link href="/leads?status=replied" className="btn btn-secondary" style={{ justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              View replies
            </Link>
          </div>
          {sendMsg && (
            <p style={{ marginTop: 12, fontSize: '0.75rem', color: '#059669' }}>{sendMsg}</p>
          )}
        </div>

        {/* Pipeline breakdown */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ marginBottom: '1.25rem' }}>Pipeline breakdown</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: "New", value: stats?.new ?? 0, color: '#94a3b8', total: stats?.total || 1 },
              { label: "Queued", value: stats?.queued ?? 0, color: '#d97706', total: stats?.total || 1 },
              { label: "Sent", value: stats?.sent ?? 0, color: '#2563eb', total: stats?.total || 1 },
              { label: "Replied", value: stats?.replied ?? 0, color: '#059669', total: stats?.total || 1 },
              { label: "Disqualified", value: stats?.disqualified ?? 0, color: '#dc2626', total: stats?.total || 1 },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.label}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.color }}>{s.value}</span>
                </div>
                <div style={{ height: 4, borderRadius: 99, background: 'var(--color-bg-elevated)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    background: s.color,
                    width: `${Math.min(100, (Number(s.value) / s.total) * 100)}%`,
                    transition: 'width 0.8s ease',
                    boxShadow: `0 0 6px ${s.color}`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}