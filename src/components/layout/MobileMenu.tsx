"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import UserCard from "../ui/UserCard";
import { usePathname } from "next/navigation";
import Logo from "../homepage/Logo";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { isNavActive, navGroups } from "@/lib/nav-items";

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
    <div className="z-120 relative">
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-5 right-0 z-50 p-2 bg-primary text-white rounded-s-lg hover:bg-primary/80 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
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
          <hr className="w-full border-gray-200 mb-2" />

          {/* Nav */}
          <nav>
            {navGroups.map((group, index) => {
              const nextGroup = navGroups[index + 1];
              const gapBelow =
                !nextGroup || nextGroup.divider || Boolean(nextGroup.label);
              return (
                <div key={group.label ?? index}>
                  {group.divider && (
                    <hr className="mx-3 border-t-[0.5px] border-gray-200" />
                  )}
                  <div
                    className={clsx(
                      "px-3",
                      group.divider || group.label ? "pt-3" : "pt-1",
                      gapBelow && "pb-3",
                    )}
                  >
                    {group.label && (
                      <div className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                        {group.label}
                      </div>
                    )}
                    <div className="space-y-1">
                      {group.items.map(({ href, label, icon: Icon }) => {
                        const isActive = isNavActive(pathname, href);
                        return (
                          <Link
                            key={href}
                            href={href}
                            onClick={closeMenu}
                            className={clsx(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                              group.bold ? "font-semibold" : "font-medium",
                              isActive
                                ? "bg-primary/5 text-primary"
                                : group.bold
                                  ? "text-gray-900 hover:bg-gray-50"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                            )}
                          >
                            <Icon
                              size={18}
                              className={
                                isActive ? "text-primary" : "text-gray-400"
                              }
                            />
                            <span>{label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        <UserCard
          user={user}
          isActive={true}
          onpress={() => setIsOpen(false)}
        />
      </div>
    </div>
  );
}
