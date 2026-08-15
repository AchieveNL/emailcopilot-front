"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    Send,
    LayoutDashboard,
    Mail,
    Database,
    FileText,
    Settings,
    Plug,
    CreditCard,
    Crown,
    Plus,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/copilots", label: "Copilots", icon: Send },
    { href: "/dashboard/email-profiles", label: "Email Profiles", icon: Mail, badge: 3 },
    { href: "/dashboard/scrape-profiles", label: "Target Audiences", icon: Database, badge: 4 },
    { href: "/dashboard/templates", label: "Templates", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button - Only visible on mobile */}
            <button
                onClick={toggleMenu}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div>
                    {/* Logo */}
                    <div className="px-6 py-5 flex items-center gap-3 mt-12">
                        <Send size={20} className="text-gray-900" />
                        <span className="text-xl font-bold tracking-tight">Emailcopilot.io</span>
                    </div>

                    {/* Create Button */}
                    <div className="px-4 mb-4">
                        <Link
                            href="/dashboard/copilots/new"
                            onClick={closeMenu}
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
                                    onClick={closeMenu}
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

                {/* Plan Card */}
                <div className="p-4 space-y-3">
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
                    </div>
                    <Link
                        href="/dashboard/billing"
                        onClick={closeMenu}
                        className="w-full bg-gray-900 text-white rounded-lg py-2 px-4 font-medium text-center text-sm hover:bg-gray-700 transition-colors"
                    >
                        Upgrade Plan
                    </Link>
                </div>
            </div>
        </>
    );
}
