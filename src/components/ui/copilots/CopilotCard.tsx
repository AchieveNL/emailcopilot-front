import React from "react";
import {
  Building2,
  Send,
  Loader2,
  CheckCircle2,
  Pause,
  Archive,
  AlertCircle,
  MoreVertical,
  X,
} from "lucide-react";
import {
  Copilot,
  OverallStatus,
} from "../../layout/features/copilots/CopilotTable";
import CopilotMenu from "./CopilotMenu";
import { useRouter } from "next/navigation";
import { copilotsApi } from "@/lib/api";
import { toast } from "sonner";

export interface CardContent {
  badgeLabel: string;
  badgeClass: string;
  icon: React.ReactNode;
  subtitle: string;
  buttonLabel: string;
  buttonEnabled: boolean;
}

export const handleCardProp = (status: string) => {
  switch (status.toLocaleLowerCase()) {
    case "draft":
      return {
        badgeLabel: "Ready for Take-off",
        badgeClass: "bg-gray-100 text-gray-500",
        subtitle: "Fully configured and ready to launch",
        progressBarColor: "bg-gray-200",
        buttonLabel: "Take-off",
        buttonEnabled: true,
        icon: <Send size={15} />,
      };
    case "running":
      return {
        badgeLabel: "In Flight",
        badgeClass: "bg-sky-50 text-sky-600",
        progressBarColor: "bg-sky-200",
        subtitle: "Campaign is currently running",
        buttonLabel: "Running",
        buttonEnabled: false,
        icon: <Loader2 size={15} className="animate-spin" />,
      };
    case "completed":
      return {
        badgeLabel: "completed",
        badgeClass: "bg-success/5 text-success",
        progressBarColor: "bg-success",
        subtitle: "Campaign has finished running",
        buttonLabel: "View Details",
        buttonEnabled: true,
        icon: <CheckCircle2 size={15} />,
      };
    case "active":
      return {
        badgeLabel: "scheduled",
        badgeClass: "bg-primary/5 text-primary",
        progressBarColor: "bg-primary",
        subtitle: "Campaign is currently active",
        buttonLabel: "View Details",
        buttonEnabled: true,
        icon: <Send size={15} />,
      };
    case "paused":
      return {
        badgeLabel: "paused",
        badgeClass: "bg-error/5 text-error",
        progressBarColor: "bg-error",
        subtitle: "Campaign is currently paused",
        buttonLabel: "Resume",
        buttonEnabled: true,
        icon: <Pause size={15} />,
      };
    case "archived":
      return {
        badgeLabel: "archived",
        badgeClass: "bg-gray-100 text-gray-400",
        progressBarColor: "bg-gray-200",
        subtitle: "Campaign is archived",
        buttonLabel: "View Details",
        buttonEnabled: true,
        icon: <Archive size={15} />,
      };
    default:
      return {
        badgeLabel: status,
        badgeClass: "bg-gray-100 text-gray-400",
        progressBarColor: "bg-gray-200",
        subtitle: "No further action available right now",
        buttonLabel: status,
        buttonEnabled: false,
        icon: <AlertCircle size={15} />,
      };
  }
};

/* ------------------------------------------------------------------ *
 * Progress: emailsSent vs targetAudience.resultsCount
 * ------------------------------------------------------------------ */

function computeProgress(copilot: Copilot): { percent: number; total: number } {
  const total =
    (copilot.targetAudience as { resultsCount?: number } | null)
      ?.resultsCount ?? 0;
  if (total <= 0) return { percent: 0, total: 0 };
  const percent = Math.min(100, Math.round((copilot.emailsSent / total) * 100));
  return { percent, total };
}

/* ------------------------------------------------------------------ */
/* Card                                                                 */
/* ------------------------------------------------------------------ */

export interface CopilotCardProps {
  copilot: Copilot;
  computeStatus?: (copilot: Copilot) => OverallStatus;
  computeCardContent?: (copilot: Copilot, status: OverallStatus) => CardContent;
  onTakeOff?: (copilot: Copilot) => void;
  onActionsClick: () => void;
  showMenu?: boolean;
  onMenuClose?: () => void;
  onRefresh?: () => void;
  className?: string;
}

function CopilotCard({
  copilot,

  onTakeOff,
  onActionsClick,
  showMenu = false,
  onMenuClose,
  onRefresh,
  className = "",
}: CopilotCardProps) {
  const { percent, total } = computeProgress(copilot);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const handleResume = async () => {
    setIsLoading(true);
    try {
      await copilotsApi.run(copilot.id);

      toast.success("Copilot resumed successfully.");
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error("Error resuming copilot. Please try again.");
      console.error("Error resuming copilot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionButton = (copilot: Copilot) => {
    switch (copilot.status.toLocaleLowerCase()) {
      case "paused":
        return {
          action: () => handleResume(),
          label: "resume",
        };
      case "draft":
        return {
          action: () =>
            router.push(`/dashboard/copilots/new?edit=${copilot.id}`),
          label: "Edit",
        };
      default:
        return {
          action: () => router.push(`/dashboard/departure`),
          label: "View Details",
        };
    }
  };

  const { action, label } = handleActionButton(copilot);

  return (
    <div
      className={`flex   w-full flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 relative ${className}`}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-[15px] font-semibold text-gray-900">
          {copilot.name}
        </h3>
        <button
          type="button"
          onClick={onActionsClick}
          aria-label="Copilot actions"
          className="text-gray-300 transition-colors hover:text-gray-500"
        >
          {showMenu ? <X size={18} /> : <MoreVertical size={18} />}
        </button>
      </div>

      <span
        className={`inline-flex w-fit items-center rounded-md px-3 py-2 text-[12px] font-medium ${handleCardProp(copilot.status).badgeClass}`}
      >
        {handleCardProp(copilot.status).badgeLabel}
      </span>

      <p className="text-[13px] leading-snug text-gray-500">
        {handleCardProp(copilot.status).subtitle}
      </p>

      <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
        <Building2 size={14} className="text-gray-400" />
        {copilot?.targetAudience?.resultsCount ?? 0} companies
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${handleCardProp(copilot.status).progressBarColor} `}
            style={{
              width:
                copilot.targetAudience?.resultsCount === 0
                  ? "0%"
                  : `${(copilot.emailsSent * 100) / (copilot.targetAudience?.resultsCount ?? 1)}%`,
            }}
          />
        </div>
        <span className="text-[11px] text-gray-400">
          {copilot.emailsSent.toLocaleString("en-US")}
          {total > 0 ? ` / ${total.toLocaleString("en-US")} sent` : " sent"}
        </span>
      </div>

      <button
        type="button"
        // disabled={!handleCardProp(copilot.status).buttonEnabled}
        onClick={action}
        className={`mt-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-[14px] font-medium transition-colors border ${"cursor-pointer border-primary text-primary bg-white hover:bg-primary hover:text-white"}`}
      >
        {!isLoading && handleCardProp(copilot.status).icon}

        <span>{isLoading ? "Loading..." : label}</span>
      </button>
      {showMenu && (
        <div className="absolute right-4 top-12 z-20">
          <CopilotMenu
            copilot={copilot}
            onRefresh={onRefresh || (() => {})}
            onClose={onMenuClose || (() => {})}
          />
        </div>
      )}
    </div>
  );
}

export default CopilotCard;
