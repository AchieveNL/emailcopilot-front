"use client";

import { useState } from "react";
import { Pencil, Copy, Play, Pause, Archive, Trash2 } from "lucide-react";
import { Copilot } from "@/components/layout/features/copilots/CopilotTable";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { copilotsApi } from "@/lib/api";

export default function CopilotMenu({
  copilot,
  onRefresh,
  onClose,
}: {
  copilot: Copilot;
  onRefresh: () => void;
  onClose?: () => void;
}) {
  const [runningScrape, setRunningScrape] = useState(false);
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

  async function toggleStatus(next: "active" | "paused") {
    if (next === "active" && !isComplete) return;
    try {
      await copilotsApi.updateStatus(copilot.id, next);
      onRefresh();
      onClose?.();
    } catch {
      toast.error("Failed to update status.");
    }
  }

  async function handleRunScrape() {
    if (!isComplete) return;
    try {
      setRunningScrape(true);
      await copilotsApi.run(copilot.id);
      onRefresh();
      onClose?.();
    } catch {
      toast.error("Failed to run scrape.");
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
      .catch(() => {
        toast.error("Failed to duplicate.");
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
    </>
  );
}
