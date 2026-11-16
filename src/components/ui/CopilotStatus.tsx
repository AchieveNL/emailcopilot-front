"use client";

import type { CopilotStatusType } from "@/store/copilotStore";
import { getCopilotStatusAppearance } from "@/lib/copilot-status-appearance";

function CopilotStatus({
  status,
  isSmall = false,
}: {
  status: CopilotStatusType;
  isSmall?: boolean;
}) {
  const { label, badgeClass } = getCopilotStatusAppearance(status);

  return (
    <span
      className={`inline-flex w-fit items-center rounded-md   font-medium ${isSmall ? "text-[10px] px-2 py-1" : "text-[12px] px-3 py-2"} ${badgeClass}`}
    >
      {label}
    </span>
  );
}

export default CopilotStatus;
