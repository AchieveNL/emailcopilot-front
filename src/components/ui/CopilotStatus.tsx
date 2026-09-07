"use client";

import type { CopilotStatusType } from "@/store/copilotStore";


function CopilotStatus({
  status,
  isSmall = false,
}: {
  status: CopilotStatusType;
  isSmall?: boolean;
}) {
  const handleCardProp = (status: string) => {
    switch (status.toLocaleLowerCase()) {
      case "draft":
        return {
          badgeLabel: "Draft",
          badgeClass: "bg-gray-100 text-gray-500",
        };
      case "running":
        return {
          badgeLabel: "In Flight",
          badgeClass: "bg-sky-50 text-sky-600",
        };
      case "completed":
        return {
          badgeLabel: "Completed",
          badgeClass: "bg-success/5 text-success",
        };
      case "active":
        return {
          badgeLabel: "Scheduled",
          badgeClass: "bg-primary/5 text-primary",
        };
      case "paused":
        return {
          badgeLabel: "Paused",
          badgeClass: "bg-error/5 text-error",
        };
      case "archived":
        return {
          badgeLabel: "Archived",
          badgeClass: "bg-gray-100 text-gray-400",
        };
      default:
        return {
          badgeLabel: status,
          badgeClass: "bg-gray-100 text-gray-400",
        };
    }
  };

  return (
    <span
      className={`inline-flex w-fit items-center rounded-md   font-medium ${isSmall ? "text-[10px] px-2 py-1" : "text-[12px] px-3 py-2"} ${handleCardProp(status).badgeClass}`}
    >
      {handleCardProp(status).badgeLabel}
    </span>
  );
}

export default CopilotStatus;
