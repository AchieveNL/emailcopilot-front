import {
  Calendar,
  CreditCard,
  FileText,
  LayoutDashboard,
  Mail,
  Send,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label?: string;
  divider?: boolean;
  bold?: boolean;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    bold: true,
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/copilots", label: "Copilots", icon: Send },
      { href: "/dashboard/departure", label: "Departure", icon: Users },
    ],
  },
  {
    label: "Setup",
    divider: true,
    items: [
      {
        href: "/dashboard/email-accounts",
        label: "Email Accounts",
        icon: Mail,
      },
      {
        href: "/dashboard/target-audiences",
        label: "Target Audiences",
        icon: Target,
      },
      {
        href: "/dashboard/templates",
        label: "Email Templates",
        icon: FileText,
      },
      {
        href: "/dashboard/flight-schedule",
        label: "Flight Schedule",
        icon: Calendar,
      },
    ],
  },
  {
    items: [{ href: "/dashboard/billing", label: "Billing", icon: CreditCard }],
  },
];

export function isNavActive(pathname: string, href: string): boolean {
  return (
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`))
  );
}
