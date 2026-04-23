"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    href: "/",
    label: "Overview",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/leads",
    label: "Leads",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/emails",
    label: "Emails",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    href: "/scraper",
    label: "Scraper",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <aside style={{
            width: 230,
            position: 'fixed',
            top: 0, left: 0, height: '100%',
            background: '#ffffff',
            borderRight: '1px solid rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
          }}>
            {/* Logo */}
            <div style={{ padding: '1.5rem 1.25rem 1.25rem', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1.12-.45a2 2 0 0 1 2.11.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111118', letterSpacing: '-0.01em' }}>Outreach</div>
                  <div style={{ fontSize: '0.65rem', color: '#a0a0b0', marginTop: 1 }}>Lead generation</div>
                </div>
              </div>
            </div>

            {/* Nav label */}
            <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#a0a0b0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Main menu
              </span>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: '0.25rem 0.75rem' }}>
              {nav.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '0.6rem 0.75rem',
                      borderRadius: 10,
                      marginBottom: 2,
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 400,
                      textDecoration: 'none',
                      color: active ? '#7c3aed' : '#52525e',
                      background: active ? 'rgba(124,58,237,0.07)' : 'transparent',
                      border: active ? '1px solid rgba(124,58,237,0.12)' : '1px solid transparent',
                      transition: 'all 0.15s',
                      position: 'relative',
                    }}
                  >
                    {active && (
                      <span style={{
                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                        width: 3, height: '60%', borderRadius: '0 3px 3px 0',
                        background: '#7c3aed',
                      }} />
                    )}
                    <span style={{ color: active ? '#7c3aed' : '#a0a0b0', marginLeft: 4 }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '0.7rem', color: '#a0a0b0' }}>v1.0.0 · outreach system</div>
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, marginLeft: 230, minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}