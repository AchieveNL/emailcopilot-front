"use client";

import { useEffect } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

interface TestEmailGateModalProps {
  open: boolean;
  sending: boolean;
  onSend: () => void;
  onCancel: () => void;
}

/** Pre-launch gate: forces a test email before the copilot can take off. */
export default function TestEmailGateModal({
  open,
  sending,
  onSend,
  onCancel,
}: TestEmailGateModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !sending) onCancel();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, sending, onCancel]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={() => !sending && onCancel()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="test-email-gate-title"
        className="fixed left-1/2 top-1/2 z-120 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="px-6 pt-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail size={18} />
            </span>
            <h2
              id="test-email-gate-title"
              className="text-lg font-bold text-gray-900"
            >
              Send a test email first
            </h2>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Send one to yourself so you know the template and your sending
            account actually work. Once it lands, you can launch.
          </p>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
            <p className="text-xs leading-relaxed text-emerald-700">
              <span className="font-semibold">Test emails are free.</span>{" "}
              They don&apos;t count toward your monthly email limit, and they
              never show up on your bill.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={sending}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={sending}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {sending && <Loader2 size={14} className="animate-spin" />}
            {sending ? "Sending..." : "Send test email"}
          </button>
        </div>
      </div>
    </>
  );
}
