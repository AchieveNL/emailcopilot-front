import type { FeedbackOffer } from "./setup-feedback";

export function canPlaceFeedback(document: Document, pathname: string, offer: FeedbackOffer) {
  if (offer.kind === "test-email") {
    return pathname === "/dashboard/copilots/new" &&
      [...document.querySelectorAll<HTMLElement>("[data-setup-feedback-final-step]")]
        .some((element) => element.dataset.setupFeedbackFinalStep === offer.campaignId);
  }
  return pathname === "/dashboard/copilots" &&
    document.querySelector("[data-setup-feedback-copilots]") !== null;
}

/** Existing dashboard modals use either ARIA dialogs or fixed full-screen backdrops. */
export function hasFeedbackBlocker(document: Document): boolean {
  return [...document.querySelectorAll<HTMLElement>(
    '[role="dialog"], [role="alertdialog"], [aria-modal="true"], dialog[open], .fixed.inset-0, [data-sonner-toast], [aria-busy="true"]',
  )].some((element) => {
    if (element.closest("[data-setup-feedback-root]")) return false;
    if (element.dataset.removed === "true") return false;
    const style = document.defaultView?.getComputedStyle(element);
    return element.getClientRects().length > 0 && style?.display !== "none" && style?.visibility !== "hidden";
  });
}
