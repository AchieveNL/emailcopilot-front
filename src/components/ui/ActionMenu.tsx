"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, type LucideIcon } from "lucide-react";

export interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "danger";
  disabled?: boolean;
  onSelect: () => void;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  ariaLabel?: string;
  align?: "left" | "right";
  className?: string;
}

/**
 * Generic kebab ("⋮") menu: a trigger plus a small popover, closing on outside
 * click or Escape. Behaviour mirrors the existing feature menus so the app keeps
 * a single interaction model for row/card actions.
 */
export default function ActionMenu({
  items,
  ariaLabel = "Open actions",
  align = "right",
  className = "",
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSelect(item: ActionMenuItem) {
    if (item.disabled) return;
    setIsOpen(false);
    item.onSelect();
  }

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={containerRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={ariaLabel}
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg`}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => handleSelect(item)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors disabled:opacity-50 ${
                item.variant === "danger"
                  ? "text-red-600 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.icon && <item.icon size={14} />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
