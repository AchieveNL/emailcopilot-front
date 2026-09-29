"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Ban, Printer, Trash2, MoreVertical, X } from "lucide-react";
import { toast } from "sonner";
import { leadsApi } from "@/lib/api";
import type { Lead } from "@/lib/types";

interface LeadMenuProps {
  lead: Lead;
  onDeleted: (id: number) => void;
  onSuppressed: (id: number) => void;
}

function escapeCsvCell(value: string | null | undefined): string {
  const text = value ?? "";
  return `"${text.replace(/"/g, '""')}"`;
}

function exportLeadCsv(lead: Lead) {
  const headers = [
    "Copilot",
    "Company",
    "Email",
    "Phone",
    "Website",
    "Address",
    "Target Audience",
    "Status",
    "Departured At",
  ];
  const row = [
    lead.copilotName,
    lead.companyName,
    lead.email,
    lead.phone,
    lead.website,
    lead.address,
    lead.sourceQuery,
    lead.status,
    lead.sentAt,
  ];
  const csv = [headers, row.map(escapeCsvCell).join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lead-${lead.id}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function LeadMenu({
  lead,
  onDeleted,
  onSuppressed,
}: LeadMenuProps) {
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
  }, [open ]);

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

  async function handleNeverEmailAgain() {
    try {
      await leadsApi.updateDoNotContact(lead.id, true);
      onSuppressed(lead.id);
      toast.success(`You will never email ${lead.email} again.`);
    } catch {
      toast.error("Failed to update lead.");
    } finally {
      setOpen(false);
    }
  }

  function handleExport() {
    exportLeadCsv(lead);
    toast.success("Lead exported as CSV.");
    setOpen(false);
  }

  function handleDelete() {
    if (!confirm(`Delete ${lead.email}? It will reappear on refresh.`)) return;
    onDeleted(lead.id);
    toast.success("Lead removed from view.");
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Lead actions"
        className="text-gray-300 transition-colors hover:text-gray-500"
      >
        {open ? <X size={18} /> : <MoreVertical size={18} />}
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] py-1 overflow-hidden"
            style={{ top: position.top, left: position.left }}
          >
            <button
              role="menuitem"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleNeverEmailAgain();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Ban size={13} />
              Never Email Again
            </button>
            <button
              role="menuitem"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleExport();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Printer size={13} />
              Export
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              role="menuitem"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleDelete();
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
