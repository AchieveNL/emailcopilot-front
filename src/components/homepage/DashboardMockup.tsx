"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  BarChart3,
  Bot,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  Mail,
  MoveRight,
  Plus,
  Send,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Marketing mock-up of the dashboard used in the homepage hero.
 * Rendered in code (not a PNG) so it stays sharp and matches the real app.
 * All numbers and names are demo data.
 */

const BASE_WIDTH = 1110;
const BASE_HEIGHT = 690;

type NavEntry = { icon: LucideIcon; label: string; active?: boolean; bold?: boolean };

const NAV_MAIN: NavEntry[] = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Send, label: "Copilots", bold: true },
  { icon: Users, label: "Departure", bold: true },
];

const NAV_SETUP: NavEntry[] = [
  { icon: Mail, label: "Email Accounts" },
  { icon: Target, label: "Target Audiences" },
  { icon: FileText, label: "Email Templates" },
  { icon: Calendar, label: "Flight Schedule" },
];

const STATS: {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: number;
  green?: boolean;
}[] = [
  { icon: Send, label: "Emails Sent", value: "1,482", change: 28 },
  { icon: BarChart3, label: "Replies", value: "186", change: 32, green: true },
  { icon: Users, label: "Reply Rate", value: "12.6%", change: 4 },
  { icon: Bot, label: "Copilots", value: "4" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SENT = [168, 204, 231, 196, 248, 219, 216];
const REPLIES = [19, 27, 31, 24, 38, 26, 21];

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Paused: "bg-orange-50 text-orange-700",
  Replied: "bg-emerald-50 text-emerald-700",
  Opened: "bg-violet-50 text-violet-700",
  Sent: "bg-blue-50 text-blue-700",
};

const COPILOTS = [
  { name: "SaaS Founders – Netherlands", sent: 512, status: "Active" },
  { name: "Marketing Agencies – US", sent: 408, status: "Active" },
  { name: "E-commerce Brands – UK", sent: 562, status: "Paused" },
  { name: "Dental Clinics – Belgium", sent: 231, status: "Active" },
];

const DEPARTURES = [
  { name: "Bloom Agency", city: "Amsterdam", status: "Replied" },
  { name: "Northwind Studio", city: "Rotterdam", status: "Opened" },
  { name: "Pureform", city: "Utrecht", status: "Sent" },
  { name: "ScaleStack", city: "Eindhoven", status: "Replied" },
];

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function NavItem({ icon: Icon, label, active, bold }: NavEntry) {
  return (
    <div
      className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] ${
        active
          ? "bg-blue-600/5 font-semibold text-blue-600"
          : bold
            ? "font-semibold text-gray-900"
            : "font-medium text-gray-700"
      }`}
    >
      <Icon size={17} className={active ? "text-blue-600" : "text-gray-400"} />
      <span>{label}</span>
    </div>
  );
}

function ActivityChart() {
  const W = 820;
  const H = 150;
  const left = 30;
  const bottom = 22;
  const barWidth = 44;
  const step = (W - left - 10) / DAYS.length;
  const plot = H - bottom - 10;
  const y = (value: number, max: number) => H - bottom - (value / max) * plot;

  const points = REPLIES.map((r, i) => ({
    x: left + step * i + step / 2,
    y: y(r, 45),
  }));

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <defs>
        <linearGradient id="mockBars" x1="0" y1="1" x2="0" y2="0">
          <stop stopColor="#2563eb" stopOpacity="0.85" />
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {[0, 100, 200].map((v) => (
        <g key={v}>
          <line x1={left} x2={W - 10} y1={y(v, 260)} y2={y(v, 260)} stroke="#f1f2f4" />
          <text x={left - 6} y={y(v, 260) + 3} textAnchor="end" fontSize="10" fill="#9ca3af">
            {v}
          </text>
        </g>
      ))}
      {SENT.map((s, i) => {
        const x = left + step * i + (step - barWidth) / 2;
        return (
          <g key={DAYS[i]}>
            <rect
              x={x}
              y={y(s, 260)}
              width={barWidth}
              height={(s / 260) * plot}
              rx="5"
              fill="url(#mockBars)"
            />
            <text x={x + barWidth / 2} y={H - 6} textAnchor="middle" fontSize="10" fill="#9ca3af">
              {DAYS[i]}
            </text>
          </g>
        );
      })}
      <path
        d={"M" + points.map((p) => `${p.x},${p.y}`).join(" L")}
        fill="none"
        stroke="#1d8a68"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#1d8a68" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default function DashboardMockup() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / BASE_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ aspectRatio: `${BASE_WIDTH} / ${BASE_HEIGHT}` }}
      role="img"
      aria-label="EmailCopilot dashboard"
    >
      <div
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          perspective: "2200px",
        }}
      >
        <div
          className="flex h-full w-full overflow-hidden rounded-[18px] border-[3px] border-white bg-gray-50 outline outline-1 outline-gray-200 text-gray-900 select-none"
          style={{
            transform: "rotateY(-9deg) rotateX(5deg) rotateZ(-1deg)",
            // Stacked hard shadows give the card a visible edge (slab look),
            // matching the 3D inbox card. No soft drop shadow behind it.
            boxShadow: [
              "1px 1px 0 #eceef4",
              "2px 2px 0 #e8ebf2",
              "3px 3px 0 #e5e8f0",
              "4px 4px 0 #e2e5ee",
              "5px 5px 0 #dfe3ec",
              "6px 6px 0 #dce0ea",
              "7px 7px 0 #d9dde8",
              "8px 8px 0 #d6dae6",
            ].join(", "),
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          {/* Sidebar */}
          <div className="flex w-[210px] flex-col justify-between border-r border-gray-200 bg-white">
            <div>
              <div className="border-b border-gray-200 px-[18px] pb-4 pt-[18px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/EmailcopilotLogo.svg" alt="" className="h-6 w-auto" />
              </div>
              <div className="px-2.5 py-2">
                {NAV_MAIN.map((item) => (
                  <NavItem key={item.label} {...item} />
                ))}
                <div className="mx-1 my-2 border-t border-gray-200" />
                <div className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400">
                  Setup
                </div>
                {NAV_SETUP.map((item) => (
                  <NavItem key={item.label} {...item} />
                ))}
                <div className="mx-1 my-2 border-t border-gray-200" />
                <NavItem icon={CreditCard} label="Billing" />
              </div>
            </div>
            <div className="m-2.5 flex items-center gap-2.5 rounded-[10px] border border-gray-200 p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-cyan-500 text-xs font-bold text-white">
                SJ
              </div>
              <div>
                <div className="text-[12.5px] font-semibold">Sarah Jansen</div>
                <div className="text-[11px] font-semibold text-blue-600">Business Class</div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 overflow-hidden px-6 py-[22px]">
            <div className="mb-[18px] flex items-center justify-between">
              <div>
                <div className="text-[21px] font-bold">Welcome back!</div>
                <div className="mt-0.5 text-[12.5px] text-gray-500">
                  Here&apos;s what&apos;s happening with your outreach today
                </div>
              </div>
              <div className="btn-cta flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 text-[12.5px] font-semibold text-white">
                <Plus size={15} strokeWidth={2.5} />
                Create New Copilot
              </div>
            </div>

            {/* Stat cards */}
            <div className="mb-3.5 grid grid-cols-4 gap-[13px]">
              {STATS.map(({ icon: Icon, label, value, change, green }) => (
                <div key={label} className="rounded-[10px] border border-gray-200 bg-white p-3.5">
                  <div className="flex items-center gap-[11px]">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-md ${
                        green ? "bg-emerald-700/5 text-emerald-700" : "bg-blue-600/5 text-blue-600"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{label}</div>
                      <div className="text-[19px] font-bold">{value}</div>
                    </div>
                  </div>
                  {change !== undefined ? (
                    <div className="mt-3.5 flex items-center gap-1 text-[10.5px]">
                      <ArrowUp size={13} strokeWidth={2.5} className="text-emerald-500" />
                      <b className="text-emerald-500">{change}%</b>
                      <span className="text-gray-500">vs Nov 10 – Nov 16</span>
                    </div>
                  ) : (
                    <div className="mt-3.5 flex items-center justify-end gap-1 text-[11.5px] font-medium text-blue-600">
                      View All <MoveRight size={13} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="mb-3.5 rounded-[10px] border border-gray-200 bg-white px-4 py-3.5">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="text-[14.5px] font-bold">Outreach activity</div>
                <div className="flex items-center gap-3.5 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <i className="inline-block h-[9px] w-[9px] rounded-[3px] bg-blue-600" />
                    Emails sent
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="inline-block h-[9px] w-[9px] rounded-[3px] bg-emerald-700" />
                    Replies
                  </span>
                  <span className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 font-medium text-gray-900">
                    Last 7 days <ChevronDown size={12} />
                  </span>
                </div>
              </div>
              <ActivityChart />
            </div>

            {/* Bottom cards */}
            <div className="grid grid-cols-2 gap-[13px]">
              <div className="rounded-[10px] border border-gray-200 bg-white px-4 py-3.5">
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-[14.5px] font-bold">Copilots</div>
                  <div className="text-[11.5px] font-medium text-blue-600">View all</div>
                </div>
                {COPILOTS.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-3 border-t border-gray-100 py-[7px] text-xs first-of-type:border-t-0"
                  >
                    <span className="flex-1 font-semibold">{c.name}</span>
                    <span className="font-semibold text-blue-600">{c.sent}</span>
                    <StatusPill status={c.status} />
                  </div>
                ))}
              </div>
              <div className="rounded-[10px] border border-gray-200 bg-white px-4 py-3.5">
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-[14.5px] font-bold">Departure</div>
                  <div className="text-[11.5px] font-medium text-blue-600">View all</div>
                </div>
                {DEPARTURES.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-3 border-t border-gray-100 py-[5px] text-xs first-of-type:border-t-0"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{d.name}</div>
                      <div className="text-[10.5px] text-gray-400">{d.city}</div>
                    </div>
                    <StatusPill status={d.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
