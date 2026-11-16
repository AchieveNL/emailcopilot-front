"use client";

import { useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Pencil, Copy, Play, Pause, Archive, Trash2, Mail } from "lucide-react";
import { Copilot } from "@/components/layout/features/copilots/CopilotTable";
import Link from "next/link";
import { toast } from "sonner";
import { copilotsApi, flightSchedulesApi } from "@/lib/api";
import { apiErrorMessage } from "@/lib/helpers";
import { currentPlanId, emailQuota, higherTiers } from "@/lib/limits";
import { useBilling } from "@/lib/useBilling";
import { useSetupFeedbackActions } from "@/lib/SetupFeedbackProvider";
import EmailLimitDialog from "@/components/ui/limits/EmailLimitDialog";

export default function CopilotMenu({
  copilot,
  onRefresh,
  onClose,
}: {
  copilot: Copilot;
  onRefresh: () => void;
  onClose?: () => void;
}) {
  const feedback = useSetupFeedbackActions();
  const [runningScrape, setRunningScrape] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [showEmailLimit, setShowEmailLimit] = useState(false);
  const { limits, plans } = useBilling();
  const mailQuota = emailQuota(limits);
  const mailTiers = higherTiers(plans, currentPlanId(limits));
  const showLaunchButton =
    copilot.status !== "running" &&
    copilot.status !== "paused" &&
    copilot.status !== "archived" &&
    copilot.status !== "active" &&
    copilot.status !== "completed";
  const showPauseButton =
    copilot.status === "running" || copilot.status === "active";
  const showResumeButton = copilot.status === "paused";

  const isComplete =
    !!copilot.name?.trim() &&
    copilot.emailAccountId != null &&
    copilot.targetAudienceId != null &&
    copilot.templateId != null &&
    copilot.flightScheduleId != null;

  const missingForTestEmail = [
    copilot.emailAccountId == null && "an email account",
    copilot.templateId == null && "an email template",
  ].filter(Boolean) as string[];

  const canTestEmail = missingForTestEmail.length === 0;
  const testEmailTooltip = canTestEmail
    ? "Send a test email to your connected account"
    : `Add ${missingForTestEmail.join(" and ")} before sending a test email`;

  async function handleTestEmail(event?: MouseEvent<HTMLButtonElement>) {
    if (sendingTest || feedback.isBusy() || (event?.detail ?? 0) > 1) return;
    if (!canTestEmail) {
      toast.error(
        `Add ${missingForTestEmail.join(" and ")} before sending a test email.`,
      );
      return;
    }
    try {
      setSendingTest(true);
      await feedback.testEmail(() => copilot.id, () => {
        toast.success("Test email request accepted. Check your connected inbox.");
      }, async () => {
        if (copilot.flightScheduleId == null) return null;
        // Read the saved schedule through the existing API; no backend changes.
        try {
          const { data } = await flightSchedulesApi.getById(copilot.flightScheduleId);
          if (!data) throw new Error("Missing schedule");
          return data;
        }
        catch { throw new Error("Unable to check sending hours. Please try again before sending a test email."); }
      });
    } catch (error) {
      toast.error(
        apiErrorMessage(error, "Failed to send test email. Please try again."),
      );
    } finally {
      setSendingTest(false);
    }
  }

  async function toggleStatus(next: "active" | "paused") {
    if (next === "active" && !isComplete) return;
    if (next === "active" && mailQuota?.atLimit) {
      setShowEmailLimit(true);
      return;
    }
    try {
      await copilotsApi.updateStatus(copilot.id, next);
      onRefresh();
      onClose?.();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Failed to update status."));
    }
  }

  async function handleRunScrape() {
    if (!isComplete || feedback.isBusy()) return;
    if (mailQuota?.atLimit) {
      setShowEmailLimit(true);
      return;
    }
    try {
      setRunningScrape(true);
      await feedback.launch(async () => {
        await copilotsApi.run(copilot.id);
        return copilot.id;
      }, () => {
        toast.success("Copilot launch request accepted.");
        onRefresh();
        onClose?.();
      });
    } catch (error) {
      toast.error(apiErrorMessage(error, "Failed to run scrape."));
    } finally {
      setRunningScrape(false);
    }
  }

  async function handleArchive() {
    if (!confirm("Archive this copilot?")) return;
    try {
      await copilotsApi.updateStatus(copilot.id, "archived");
      onRefresh();
      onClose?.();
    } catch {
      toast.error("Failed to archive.");
    }
  }

  async function handleDelete() {
    if (!confirm("Permanently delete this copilot? This cannot be undone."))
      return;
    try {
      await copilotsApi.delete(copilot.id);
      onRefresh();
      onClose?.();
    } catch {
      toast.error("Failed to delete.");
    }
  }

  function handleDuplicate() {
    if (
      !confirm(
        `Duplicate "${copilot.name}"? This will create a new draft copy.`,
      )
    )
      return;
    copilotsApi
      .duplicate(copilot.id)
      .then(() => {
        onRefresh();
        toast.success("Copilot duplicated.");
      })
      .catch((error) => {
        toast.error(apiErrorMessage(error, "Failed to duplicate."));
      })
      .finally(() => {
        onClose?.();
      });
  }

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={() => onClose?.()} />
      <div className="absolute right-0 top-0 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-44 py-1 overflow-hidden">
        <Link
          href={`/dashboard/copilots/new?edit=${copilot.id}`}
          onClick={() => onClose?.()}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Pencil size={13} /> Edit
        </Link>
        <button
          onClick={handleDuplicate}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Copy size={13} /> Duplicate
        </button>
        <span className="block" title={testEmailTooltip}>
          <button
            onClick={handleTestEmail}
            aria-disabled={!canTestEmail || sendingTest}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
          >
            <Mail size={13} className={sendingTest ? "animate-pulse" : ""} />
            {sendingTest ? "Sending..." : "Send Test Email"}
          </button>
        </span>
        {showLaunchButton && (
          <span
            className="block"
            title={
              isComplete
                ? undefined
                : "Complete all setup steps before launching"
            }
          >
            <button
              onClick={handleRunScrape}
              disabled={runningScrape || !isComplete}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play
                size={13}
                className={runningScrape ? "animate-pulse" : ""}
              />
              {runningScrape ? "Running..." : "Launch"}
            </button>
          </span>
        )}
        {showPauseButton ? (
          <button
            onClick={() => toggleStatus("paused")}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pause size={13} /> Pause
          </button>
        ) : showResumeButton ? (
          <span
            className="block"
            title={
              isComplete
                ? undefined
                : "Complete all setup steps before resuming"
            }
          >
            <button
              onClick={() => toggleStatus("active")}
              disabled={!isComplete}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={13} /> Resume
            </button>
          </span>
        ) : null}
        {copilot.status !== "archived" && (
          <button
            onClick={handleArchive}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Archive size={13} /> Archive
          </button>
        )}
        <div className="border-t border-gray-100 my-1" />
        <button
          onClick={handleDelete}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>

      {showEmailLimit &&
        createPortal(
          <EmailLimitDialog
            open
            currentPlanId={currentPlanId(limits)}
            used={mailQuota?.used ?? 0}
            max={mailQuota?.max ?? 0}
            resetAt={mailQuota?.resetAt ?? null}
            tiers={mailTiers}
            onClose={() => setShowEmailLimit(false)}
          />,
          document.body,
        )}
    </>
  );
}
