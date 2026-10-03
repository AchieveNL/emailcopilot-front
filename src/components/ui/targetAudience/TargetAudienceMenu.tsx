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
      icon: <Copy size={13} />,
      onClick: () => onDuplicate && onDuplicate(id),
    },
    {
      key: "edit",
      label: "Edit",
      icon: <Pencil size={13} />,
      onClick: () => onEdit && onEdit(id),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 size={13} />,
      onClick: () => onDelete && onDelete(id),
      variant: "danger",
    },
  ];

  return (
    <div
      role="menu"
      className={`w-44 bg-white absolute top-10 mt-1 right-10 z-20 rounded-xl shadow-lg border border-gray-200 py-1 overflow-hidden ${className}`}
    >
      {items.map((item) => (
        <React.Fragment key={item.key}>
          {item.variant === "danger" && (
            <div className="my-1 border-t border-gray-100" />
          )}
          <button
            role="menuitem"
            type="button"
            onClick={item.onClick}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
              item.variant === "danger"
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

export default TargetAudienceMenu;
