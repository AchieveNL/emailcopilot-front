"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, ShieldCheck, Trash2, X } from "lucide-react";
import { useEmailAccountStore } from "@/store/emailAccountStore";
import { Loader2 } from "lucide-react";
import { EmailAccount } from "@/lib/types";

interface AccountActionsMenuProps {
  account: EmailAccount;
}

interface MenuItemConfig {
  label: string;
  icon: typeof Pencil;
  onSelect?: (accountId: number) => void;
  variant?: "default" | "danger";
}

function EmailAccountMenu({ account }: AccountActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    deleteAccount,
    verifyAccount,
    verifyingId,
    setEditingAccount,
    setShowModal,
  } = useEmailAccountStore();

  // Close the menu on outside click or Escape.
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

  const items: MenuItemConfig[] = [
    {
      label: "Edit",
      icon: Pencil,
      onSelect: () => {
        setEditingAccount({ ...account });
        setShowModal(true);
      },
    },
    { label: "Verify", icon: ShieldCheck, onSelect: (id) => verifyAccount(id) },
    {
      label: "Delete",
      icon: Trash2,
      onSelect: (id) => deleteAccount(id),
      variant: "danger",
    },
  ];

  function handleSelect(item: MenuItemConfig) {
    setIsOpen(false);
    item.onSelect?.(account.id);
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {verifyingId === account.id ? (
        <div className="flex items-center justify-center w-6 h-6">
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label="Open account actions"
          className="text-gray-300 transition-colors hover:text-gray-500"
        >
          {isOpen ? <X size={18} /> : <MoreVertical size={18} />}
        </button>
      )}

      {isOpen && (
        <div
          role="menu"
          aria-label="Account actions"
          className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {items.map((item) => (
            <Fragment key={item.label}>
              {item.variant === "danger" && (
                <div className="my-1 border-t border-gray-100" />
              )}
              <button
                type="button"
                role="menuitem"
                onClick={() => handleSelect(item)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                  item.variant === "danger"
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon size={13} />
                {item.label}
              </button>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
export default EmailAccountMenu;
