import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Copy, Edit2, Trash2, MoreVertical, X } from "lucide-react";

interface TemplateActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function TemplateActions({
  onEdit,
  onDelete,
  onDuplicate,
}: TemplateActionsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const clickedButton = ref.current?.contains(e.target as Node);
      const clickedMenu = menuRef.current?.contains(e.target as Node);
      if (!clickedButton && !clickedMenu) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleToggle() {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
          top: rect.bottom + 4,
          left: rect.right - 176,
        });
    }
    setOpen(!open);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Template actions"
        className="text-gray-300 transition-colors hover:text-gray-500"
      >
        {open ? <X size={18} /> : <MoreVertical size={18} />}
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] py-1 overflow-hidden"
            style={{ top: position.top, left: position.left }}
          >
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onDuplicate();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy size={13} />
              Duplicate
            </button>
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onEdit();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={13} />
              Edit
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onDelete();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
