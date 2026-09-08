"use client";

import Link from "next/link";
import {
  Bot,
  Mail,
  Target,
  FileText,
  CalendarDays,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

interface QuickStartItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const quickStartItems: QuickStartItem[] = [
  { label: "Create a copilot", href: "/dashboard/copilots/new", icon: Bot },
  {
    label: "Add email account",
    href: "/dashboard/email-accounts?new=true",
    icon: Mail,
  },
  {
    label: "Create a target audience",
    href: "/dashboard/target-audiences?new=true",
    icon: Target,
  },
  {
    label: "Create an email template",
    href: "/dashboard/templates?new=true",
    icon: FileText,
  },
  {
    label: "Create a flight schedule",
    href: "/dashboard/flight-schedule?new=true",
    icon: CalendarDays,
  },
];

export default function QuickStart() {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5  w-full col-span-1 lg:col-span-2 xl:col-span-1 ">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Quick start</h2>

      <ul className="">
        {quickStartItems.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <Link
              href={href}
              className="flex items-center justify-between py-2 group"
            >
              <span className="flex items-center gap-3">
                <Icon
                  size={18}
                  className="text-primary/90 group-hover:text-primary transition-colors"
                />
                <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {label}
                </span>
              </span>

              <ChevronRight
                size={16}
                className="text-gray-800 group-hover:text-gray-900 transition-colors"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
