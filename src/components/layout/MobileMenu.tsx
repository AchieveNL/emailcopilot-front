"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import UserCard from "../ui/UserCard";
import { usePathname } from "next/navigation";
import Logo from "../homepage/Logo";
import {
  Menu,
  X,
  Send,
  LayoutDashboard,
  Mail,
  FileText,
  Users,
  Target,
  CreditCard,
  Plus,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/copilots", label: "Copilots", icon: Send },
  { href: "/dashboard/email-accounts", label: "Email Accounts", icon: Mail },
  {
    href: "/dashboard/target-audiences",
    label: "Target Audiences",
    icon: Target,
  },
  { href: "/dashboard/templates", label: "Email Templates", icon: FileText },
  { href: "/dashboard/departure", label: "Departure", icon: Users },
  /* { href: "/dashboard/settings", label: "Settings", icon: Settings }, */
  /* { href: "/dashboard/integrations", label: "Integrations", icon: Plug }, */
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden absolute top-4 right-4 z-50 p-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={clsx(
          "md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div>
          {/* Logo */}
          <Logo />

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
      </div>
    </div>
  );
}
