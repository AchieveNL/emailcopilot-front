"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actionLabel: string;
  mobileActionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function DashboardHeader({
  title,
  description,
  actionLabel,
  mobileActionLabel = "Add",

  onAction,
}: DashboardHeaderProps) {
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

      <button
        onClick={onAction}
        className="flex shrink-0 fixed right-6 bottom-6 md:static items-center gap-2 btn-cta text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        <Plus size={18} />

        {/* Large */}
        <span className="hidden lg:inline">{actionLabel}</span>
      </button>
    </div>
  );
}
