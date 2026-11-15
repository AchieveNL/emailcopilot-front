"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  loading?: boolean;
  confirmDisabled?: boolean;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Small confirmation modal, replacing the browser's native `confirm()`. */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Keep plan",
  tone = "default",
  loading = false,
  confirmDisabled = false,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(onCancel);
  const loadingRef = useRef(loading);
  useEffect(() => {
    cancelRef.current = onCancel;
    loadingRef.current = loading;
  }, [onCancel, loading]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement : null;
    const selector = 'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = () => {
      const elements = [...(dialogRef.current?.querySelectorAll<HTMLElement>(selector) ?? [])]
        .filter((element) => !element.matches(":disabled"));
      return elements.filter((element) => {
        if (!(element instanceof HTMLInputElement) || element.type !== "radio" || !element.name) return true;
        const group = elements.filter((candidate): candidate is HTMLInputElement =>
          candidate instanceof HTMLInputElement && candidate.type === "radio" && candidate.name === element.name);
        return element === (group.find((radio) => radio.checked) ?? group[0]);
      });
    };
    (focusable()[0] ?? dialogRef.current)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (!loadingRef.current) cancelRef.current();
      }
      if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (!first) { event.preventDefault(); return; }
        if (!dialogRef.current?.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
          return;
        }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      const target = previousFocus?.isConnected ? previousFocus : document.querySelector<HTMLElement>("main button, main a[href]");
      target?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={() => !loading && onCancel()}
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed left-1/2 top-1/2 z-120 max-h-[90dvh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="px-6 pt-6">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          {description && (
            <p className="mt-2 text-sm text-gray-500">{description}</p>
          )}
        </div>

        {children && <div className="px-6 pt-5">{children}</div>}

        <div className="flex items-center justify-end gap-3 px-6 py-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
