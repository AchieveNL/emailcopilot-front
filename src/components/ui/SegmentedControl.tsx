"use client";

import type { ReactNode } from "react";

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  /** Optional trailing chip, e.g. a "Save 20%" badge. */
  badge?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

/** Pill switcher for two or more mutually exclusive options. */
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 rounded-2xl border border-gray-200 bg-white p-1 ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 rounded-xl border-2 px-8 py-3 text-sm transition-colors ${
              isSelected
                ? "border-light bg-primary/5 text-primary font-bold"
                : "border-transparent text-gray-900 font-semibold hover:bg-gray-50"
            }`}
          >
            {option.label}
            {option.badge}
          </button>
        );
      })}
    </div>
  );
}
