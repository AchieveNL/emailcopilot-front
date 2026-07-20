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
  AlertTriangle,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { UserButton, useUser } from "@clerk/nextjs";
import { useBilling } from "@/lib/useBilling";
import UserCard from "../ui/UserCard";
import Logo from "../homepage/Logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/copilots", label: "Copilots", icon: Send },
  { href: "/dashboard/email-accounts", label: "Email Accounts", icon: Mail },
  {
    href: "/dashboard/target-audiences",
    label: "Target Audiences",
    icon: Database,
  },
  { href: "/dashboard/templates", label: "Email templates", icon: FileText },
  { href: "/dashboard/departured", label: "Departured", icon: Users },
  /* { href: "/dashboard/settings", label: "Settings", icon: Settings }, */
  /* { href: "/dashboard/integrations", label: "Integrations", icon: Plug }, */
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  //get user from Clerk to show in sidebar
  const { user } = useUser();
  console.log("User in Sidebar:", user); // Debugging line to check user object
  console.log("pathname in Sidebar:", pathname); // Debugging line to check pathname value
  const { limits } = useBilling();
  console.log("Limits in Sidebar:", limits); // Debugging line to check limits value
  return (
    <>
      {!limits ? (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full flex-shrink-0">
          <div>
            {/* Logo */}
            <Logo />

            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <AlertTriangle size={48} className="mb-4" />
              <p className="text-center">
                No active subscription found. Please choose a plan to access the
                dashboard.
              </p>
              <Link
                href={"/dashboard/billing"}
                className="mt-4 inline-block bg-gray-900 text-white rounded-lg py-2 px-4 font-medium hover:bg-gray-700 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
          <UserCard user={user} isActive={false} />
        </aside>
      ) : (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full flex-shrink-0">
          <div>
            {/* Logo */}

            <Logo />
            <hr className="w-full border-gray-200 mb-6" />

            {/* Create Button */}
            {/* <div className="px-4 mb-4">
              <Link
                href="/dashboard/copilots/new"
                className="w-full bg-gray-900 text-white rounded-lg py-2.5 px-4 font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors text-sm"
              >
                <Plus size={15} />
                Create New Copilot
              </Link>
            </div> */}

            {/* Nav */}
            <nav className="px-3 space-y-0.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active =
                  href === "/dashboard"
                    ? pathname === href
                    : pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={16}
                        className={active ? "text-primary" : "text-gray-400"}
                      />
                      <span className="font-medium">{label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <UserCard user={user} isActive={true} />
        </aside>
      )}
    </>
  );
}
