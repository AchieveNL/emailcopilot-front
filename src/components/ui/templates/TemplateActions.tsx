import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Copy, Edit2, Trash2, MoreVertical } from "lucide-react";

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
        left: rect.right - 192,
      });
    }
    setOpen(!open);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
      >
        <MoreVertical size={16} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-[9999] py-1.5"
            style={{ top: position.top, left: position.left }}
          >
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onDuplicate();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#0F172A] hover:bg-gray-50 transition-colors"
            >
              <Copy size={16} className="text-[#59637C]" />
              Duplicate
            </button>
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onEdit();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#0F172A] hover:bg-gray-50 transition-colors"
            >
              <Edit2 size={16} className="text-[#59637C]" />
              Edit
            </button>
            <div className="my-1 border-t border-[#E2E8F0]" />
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                onDelete();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#d9485f] hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
