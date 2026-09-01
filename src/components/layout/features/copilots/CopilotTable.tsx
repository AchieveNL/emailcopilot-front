import React from "react";
import {
  CheckCircle2,
  X,
  Clock,
  MoreVertical,
  CircleAlert,
} from "lucide-react";
import CopilotMenu from "@/components/ui/copilots/CopilotMenu";
import { useRouter } from "next/navigation";
import { useCopilotStore, type Step } from "../../../../../store/copilotStore";
import { handleCardProp } from "@/components/ui/copilots/CopilotCard";

/* ------------------------------------------------------------------ */
/* Types — trimmed to the fields this component actually reads.       */
/* Extend these (or pass your real types) as your API grows.          */
/* ------------------------------------------------------------------ */

export interface EmailAccountRef {
  id: number;
  email: string;
  sendName?: string;
  [key: string]: unknown;
}

export interface TargetAudienceRef {
  id: number;
  name: string;
  resultsCount?: number;
  [key: string]: unknown;
}

export interface EmailTemplateRef {
  id: number;
  name: string;
  subject?: string;
  [key: string]: unknown;
}

export interface FlightScheduleRef {
  id: number;
  name: string;
  sendLimit: number;
  sendLimitActive?: boolean;
  [key: string]: unknown;
}

export type CopilotStatus =
  | "active"
  | "paused"
  | "pending"
  | "incomplete"
  | "completed"
  | "draft"
  | string;

export interface Copilot {
  id: number;
  name: string;
  description: string;
  status: CopilotStatus;
  createdAt: string;
  updatedAt: string;
  userId: number;
  emailAccountId: number | null;
  emailAccount?: EmailAccountRef | null;
  targetAudienceId: number | null;
  targetAudience?: TargetAudienceRef | null;
  templateId: number | null;
  template?: EmailTemplateRef | null;
  flightScheduleId: number | null;
  flightSchedule?: FlightScheduleRef | null;
  emailsSent: number;
  emailsOpened: number;
  emailsReplied: number;
  lastRunAt: string | null;
  lastJobId: string | null;
  lastError: string | null;
}

/* ------------------------------------------------------------------ */
/* Workflow step model                                                 */
/* ------------------------------------------------------------------ */

export type WorkflowStepState = "done" | "blocked" | "pending";

export interface WorkflowStep {
  key: string;
  title: string;
  state: WorkflowStepState;
  label: string;
}

export interface OverallStatus {
  label: string;
  variant: "active" | "running" | "completed" | "paused" | "draft" | "archived";
}

export function defaultComputeSteps(copilot: Copilot): WorkflowStep[] {
  return [
    {
      key: "setup",
      title: "Setup",
      state: copilot.name ? "done" : "blocked",
      label: copilot.name ? "Configured" : "Incomplete",
    },
    {
      key: "email-account",
      title: "Email Account",
      state: copilot.emailAccountId ? "done" : "blocked",
      label: copilot.emailAccountId ? "Selected" : "Not selected",
    },
    {
      key: "target-audience",
      title: "Target Audience",
      state: copilot.targetAudienceId ? "done" : "blocked",
      label: copilot.targetAudienceId ? "Selected" : "Not selected",
    },
    {
      key: "email-templates",
      title: "Email Templates",
      state: copilot.templateId ? "done" : "blocked",
      label: copilot.templateId ? "Selected" : "Not selected",
    },
    {
      key: "flight-schedule",
      title: "Flight Schedule",
      state: copilot.flightScheduleId ? "done" : "blocked",
      label: copilot.flightScheduleId
        ? copilot.lastRunAt
          ? "Selected"
          : "Scheduled"
        : "Not selected",
    },
    {
      key: "take-off",
      title: "Take-off",
      ...(() => {
        switch (copilot.status) {
          case "completed":
            return { state: "done" as const, label: "Completed" };
          case "active":
            return { state: "done" as const, label: "Active" };
          case "running":
            return { state: "done" as const, label: "Running" };
          case "pending":
            return { state: "pending" as const, label: "Pending" };
          case "paused":
            return { state: "blocked" as const, label: "Paused" };
          case "archived":
            return { state: "blocked" as const, label: "Archived" };
          case "draft":
            return { state: "pending" as const, label: "draft" };
          default:
            return { state: "pending" as const, label: "Pending" };
        }
      })(),
    },
  ];
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-[12px] font-medium whitespace-nowrap ${handleCardProp(status).badgeClass}`}
    >
      {status}
    </span>
  );
}

const STEP_LABEL_CLASSES: Record<WorkflowStepState, string> = {
  done: "text-emerald-500",
  blocked: "text-rose-500",
  pending: "text-amber-500",
};

function StepIcon({ state }: { state: WorkflowStepState }) {
  if (state === "done")
    return <CheckCircle2 size={13} className="text-emerald-500" />;
  if (state === "blocked")
    return <CircleAlert size={13} className="text-rose-500" />;
  return <Clock size={13} className="text-amber-500" />;
}

function StepColumn({
  step,
  index,
  copilotId,
}: {
  step: WorkflowStep;
  index: number;
  copilotId: string | number;
}) {
  const router = useRouter();
  const { setStep } = useCopilotStore();
  return (
    <div
      onClick={() => (
        setStep((index + 1) as Step),
        router.push(`/dashboard/copilots/new?edit=${copilotId}`)
      )}
      className="flex min-w-26 group hover:bg-primary/5 flex-col gap-1 border border-gray-100 hover:border-primary rounded-lg px-2 py-1"
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`flex h-4 w-4 border border-gray-300 text-gray-400 group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white shrink-0 items-center justify-center rounded-full text-[10px] font-medium 
         
          }`}
        >
          {index + 1}
        </span>
        <span className="text-[12px] font-medium group-hover:text-primary text-gray-700 whitespace-nowrap">
          {step.title}
        </span>
      </div>
      <div className="flex items-center gap-1 ">
        <StepIcon state={step.state} />
        <span
          className={`text-[12px] whitespace-nowrap ${STEP_LABEL_CLASSES[step.state]}`}
        >
          {step.label}
        </span>
      </div>
    </div>
  );
}

function WorkflowStepper({
  steps,
  copilotId,
}: {
  steps: WorkflowStep[];
  copilotId: string | number;
}) {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          {index > 0 && (
            <div
              className=" h-px w-4 shrink-0 bg-gray-200 "
              aria-hidden="true"
            />
          )}
          <StepColumn step={step} index={index} copilotId={copilotId} />
        </React.Fragment>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export interface CopilotTableProps {
  copilots: Copilot[];
  /** Override the default per-step logic (e.g. to match your real business rules). */
  computeSteps?: (copilot: Copilot) => WorkflowStep[];
  /** Override the default overall-status badge logic. */
  computeStatus?: (copilot: Copilot) => OverallStatus;
  /** Called when the row's actions (···) button is clicked. */
  onActionsClick?: (copilot: Copilot) => void;
  /** Called when menu actions require a refresh (e.g., delete, archive, status change). */
  onRefresh?: () => void;
  className?: string;
}

function CopilotTable({
  copilots = [],
  computeSteps = defaultComputeSteps,
  // computeStatus = defaultComputeStatus,
  onActionsClick,
  onRefresh,
  className = "",
}: CopilotTableProps) {
  const [menuCopilotId, setMenuCopilotId] = React.useState<number | null>(null);
  if (!copilots || copilots.length === 0) {
    return (
      <div className="w-full relative rounded-lg border border-gray-100 bg-white">
        <div className="py-16 text-center text-sm text-gray-400">
          No copilots yet.
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-lg bg-white ${className}`}>
      <div className="overflow-x-auto min-h-105">
        <table className="w-full min-w-225 border-collapse ">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="whitespace-nowrap px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Copilots
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Workflow Status
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Send
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Status
              </th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className=" relative">
            {copilots.map((copilot) => {
              const steps = computeSteps(copilot);

              const sendLimit = copilot.flightSchedule?.sendLimit;

              return (
                <tr
                  key={copilot.id}
                  className="border-b  max-h-16 border-gray-50 align-top last:border-b-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-4 align-middle">
                    <div className="max-w-55">
                      <p className="text-[14px] font-medium text-gray-900">
                        {copilot.name}
                      </p>
                      {copilot.description && (
                        <p className="mt-0.5 line-clamp-2 font-light text-[12px] text-gray-500">
                          {copilot.description}
                        </p>
                      )}
                      {copilot.emailAccount?.email && (
                        <p className="mt-1 text-[12px] text-blue-500">
                          {copilot.emailAccount.email}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6  py-4 align-middle">
                    <WorkflowStepper steps={steps} copilotId={copilot.id} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-[14px] align-middle text-gray-700">
                    {copilot.emailsSent}/{copilot?.targetAudience?.resultsCount ?? 0}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 align-middle">
                    <StatusBadge status={copilot.status} />
                  </td>
                  <td className="px-4 py-4 text-right align-middle">
                    <button
                      type="button"
                      onClick={() =>
                        setMenuCopilotId(
                          menuCopilotId === copilot.id ? null : copilot.id,
                        )
                      }
                      className="text-gray-300 transition-colors hover:text-gray-500"
                      aria-label="Copilot actions"
                    >
                      {menuCopilotId === copilot.id ? (
                        <X size={18} />
                      ) : (
                        <MoreVertical size={18} />
                      )}
                    </button>
                    {menuCopilotId === copilot.id && (
                      <div className="absolute right-10 top-8 z-20">
                        <CopilotMenu
                          copilot={copilot}
                          onRefresh={onRefresh || (() => {})}
                          onClose={() => setMenuCopilotId(null)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CopilotTable;
