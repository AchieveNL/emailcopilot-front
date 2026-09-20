"use client";

import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actionLabel: string;
  mobileActionLabel?: string;
  actionHref?: string;
  actionIcon?: LucideIcon;
  actionVariant?: "primary" | "outline";
  onAction?: () => void;
  showAction?: boolean;
}

export default function DashboardHeader({
  title,
  description,
  actionLabel,
  mobileActionLabel = "Add",
  showAction = true,
  actionHref,
  actionIcon: ActionIcon = Plus,
  actionVariant = "primary",

  onAction,
}: DashboardHeaderProps) {
  // The primary variant floats above the content on mobile; the outline variant is a
  // secondary affordance and stays inline in the header at every size.
  const actionClassName =
    actionVariant === "outline"
      ? "flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
      : "flex shrink-0 fixed right-6 bottom-6 md:static items-center gap-2 btn-cta z-41 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 transition-colors";

  const actionContent = (
    <>
      <ActionIcon size={18} />

      {/* Large */}
      <span className="text-[10px] lg:text-sm">{actionLabel}</span>
    </>
  );

  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      {/* Title */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {title}
        </h1>

        {description && (
          <p className="text-gray-500 text-xs sm:text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {showAction &&
        (actionHref ? (
          <Link href={actionHref} onClick={onAction} className={actionClassName}>
            {actionContent}
          </Link>
        ) : (
          <button onClick={onAction} className={actionClassName}>
            {actionContent}
          </button>
        ))}
    </div>
  );
}
