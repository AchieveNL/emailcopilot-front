import React from "react";
import { Copy, Pencil, Trash2 } from "lucide-react";

export interface TargetAudienceMenuProps {
  id: number;
  onDuplicate?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

function TargetAudienceMenu({
  id,
  onDuplicate,
  onEdit,
  onDelete,
  className = "",
}: TargetAudienceMenuProps) {
  const items: MenuItem[] = [
    {
      key: "duplicate",
      label: "Duplicate",
      icon: <Copy size={15} strokeWidth={1.75} />,
      onClick: () => onDuplicate && onDuplicate(id),
    },
    {
      key: "edit",
      label: "Edit",
      icon: <Pencil size={15} strokeWidth={1.75} />,
      onClick: () => onEdit && onEdit(id),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 size={15} strokeWidth={1.75} />,
      onClick: () => onDelete && onDelete(id),
      variant: "danger",
    },
  ];

  return (
    <div
      role="menu"
      className={`w-40 bg-white absolute top-10 mt-1 right-10 z-20 rounded-lg shadow-lg border border-gray-100 py-1.5 ${className}`}
    >
      {items.map((item) => (
        <button
          key={item.key}
          role="menuitem"
          type="button"
          onClick={item.onClick}
          className={`w-full flex items-center gap-2.5 px-3.5 py-2 font-medium text-[13px] text-left transition-colors ${
            item.variant === "danger"
              ? "text-rose-500 hover:bg-rose-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <span
            className={
              item.variant === "danger" ? "text-rose-400" : "text-gray-400"
            }
          >
            {item.icon}
          </span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default TargetAudienceMenu;
