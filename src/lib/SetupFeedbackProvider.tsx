"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { copilotsApi } from "./api";
import { setupFeedbackApi } from "./setup-feedback-api";
import { canPlaceFeedback, hasFeedbackBlocker } from "./setup-feedback-dialogs";
import { SetupFeedbackController, type FeedbackState, type FeedbackTransport } from "./setup-feedback";
import SetupFeedbackDialog from "@/components/ui/feedback/SetupFeedbackDialog";

const FeedbackContext = createContext<SetupFeedbackController | null>(null);

export function SetupFeedbackHost({ userId, pathname, children, enabled = true, transport = setupFeedbackApi }: {
  userId: string;
  pathname: string;
  children: ReactNode;
  enabled?: boolean;
  transport?: FeedbackTransport;
}) {
  const [controller] = useState(() => new SetupFeedbackController(transport));
  const snapshot = useSyncExternalStore(controller.subscribe, controller.snapshot, controller.snapshot);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dismissError, setDismissError] = useState<string | null>(null);
  const closingRef = useRef(false);
  const ownSubmission = useRef(false);
  const pendingId = snapshot.pending?.offerId;
  const submittedAt = snapshot.progress?.submittedAt;
  const snoozed = snapshot.progress?.snoozed;

  useEffect(() => {
    controller.activate();
    const refresh = () => { void controller.refresh(); };
    window.addEventListener("focus", refresh);
    return () => { controller.deactivate(); window.removeEventListener("focus", refresh); };
  }, [controller]);

  useEffect(() => {
    if (!open) return;
    // Account-level submission or snooze in another browser closes this form.
    const interval = setInterval(() => { void controller.refresh(); }, 15000);
    return () => clearInterval(interval);
  }, [controller, open]);

  useEffect(() => {
    if (open && (snapshot.progress?.snoozed || (snapshot.progress?.submittedAt && !ownSubmission.current))) setOpen(false);
  }, [open, snapshot.progress]);

  useEffect(() => {
    if (!enabled || open || !snapshot.available || snapshot.busy || !pendingId || submittedAt || snoozed) return;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    let claiming = false;
    const ready = () => {
      const current = controller.snapshot();
      return !current.busy && current.available && current.pending !== null &&
        document.visibilityState === "visible" && canPlaceFeedback(document, pathname, current.pending) && !hasFeedbackBlocker(document);
    };
    const check = () => {
      clearTimeout(timer);
      if (cancelled || claiming || !ready()) return;
      timer = setTimeout(async () => {
        if (cancelled || claiming || !ready()) return;
        claiming = true;
        try {
          const claimed = await controller.claimPrompt();
          if (!cancelled && claimed && ready()) {
            ownSubmission.current = false;
            setDismissError(null);
            setOpen(true);
          }
        } finally {
          claiming = false;
          // A dialog may have opened while the claim request was in flight.
          // Keep the claimed offer pending and check again when it closes.
          if (!cancelled && !ready()) check();
        }
      }, 500);
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true,
      attributeFilter: ["class", "hidden", "open", "aria-hidden", "aria-busy", "data-visible", "data-removed", "data-state"],
    });
    document.addEventListener("visibilitychange", check);
    check();
    return () => { cancelled = true; clearTimeout(timer); observer.disconnect(); document.removeEventListener("visibilitychange", check); };
  // Claiming updates revision/claimed state. Those updates must not cancel the
  // request that is about to open this same offer.
  }, [controller, enabled, open, pathname, snapshot.available, snapshot.busy, pendingId, submittedAt, snoozed]);

  const dismiss = async () => {
    if (closingRef.current) return;
    if (controller.snapshot().progress?.submittedAt) { setOpen(false); return; }
    closingRef.current = true;
    setClosing(true);
    setDismissError(null);
    try { await controller.snooze(); setOpen(false); }
    catch { setDismissError("We couldn’t save your reminder. Please try again."); }
    finally { closingRef.current = false; setClosing(false); }
  };

  return (
    <FeedbackContext.Provider value={controller}>
      {children}
      {enabled && open && (
        <div key={userId} data-setup-feedback-root className="fixed inset-0 z-[200]">
          <SetupFeedbackDialog
            submit={transport.submit}
            closing={closing}
            dismissError={dismissError}
            onDismiss={() => { void dismiss(); }}
            onSubmitted={(state: FeedbackState) => { ownSubmission.current = true; controller.submitted(state); }}
          />
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function SetupFeedbackProvider({ children }: { children: ReactNode }) {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  if (!isLoaded || !isSignedIn || !userId) return null;
  return <SetupFeedbackHost key={userId} userId={userId} pathname={pathname}>{children}</SetupFeedbackHost>;
}

export function useSetupFeedbackActions() {
  const controller = useContext(FeedbackContext);
  const actions = useMemo(() => controller ? {
    isBusy: controller.isBusy,
    testEmail: (prepare: () => Promise<number> | number, onAccepted: () => void) => controller.testEmail(prepare, copilotsApi.testEmail, onAccepted),
    launch: (operation: () => Promise<number | string>, onAccepted: (id: number | string) => void) => controller.launch(operation, onAccepted),
  } : null, [controller]);
  if (!actions) throw new Error("Setup feedback actions require the authenticated dashboard provider");
  return actions;
}
