"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Send,
  LayoutDashboard,
  Mail,
  Database,
  FileText,
  Settings,
  Plug,
  CreditCard,
  Crown,
  ChevronDown,
  Plus,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/copilots", label: "Copilots", icon: Send },
  { href: "/email-profiles", label: "Email Profiles", icon: Mail, badge: 3 },
  { href: "/scrape-profiles", label: "Scrape Profiles", icon: Database, badge: 4 },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
  /* { href: "/integrations", label: "Integrations", icon: Plug }, */
  { href: "/billing", label: "Billing", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full flex-shrink-0">
      <div>
        {/* Logo */}
        <div className="px-6 py-5 flex items-center gap-3">
          <Send size={20} className="text-gray-900" />
          <span className="text-xl font-bold tracking-tight">Emailcopilot.io</span>
        </div>

        {/* Create Button */}
        <div className="px-4 mb-4">
          <Link
            href="/copilots/new"
            className="w-full bg-gray-900 text-white rounded-lg py-2.5 px-4 font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors text-sm"
          >
            <Plus size={15} />
            Create New Copilot
          </Link>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-gray-100 text-gray-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={active ? "text-gray-800" : "text-gray-400"} />
                  <span className="font-medium">{label}</span>
                </div>
                {badge && (
                  <span className="bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-3">
        {/* Plan Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown size={14} className="text-gray-700" />
            <span className="font-bold text-sm">Starter Plan</span>
          </div>
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-1.5">
              <span className="font-bold text-gray-900">3,249</span> / 10,000 emails used
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: "32%" }} />
            </div>
          </div>
          <button className="w-full bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Upgrade Plan
          </button>
        </div>

        {/* User */}
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
              JD
            </div>
            <div>
              <div className="text-sm font-bold leading-none mb-1">John Doe</div>
              <div className="text-xs text-gray-500 leading-none">john@company.com</div>
            </div>
          </div>
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      </div>
    </aside>
  );
}
