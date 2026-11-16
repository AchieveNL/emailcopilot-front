/** Copilot badge colors from the screen-specific Brandbook references in figma.md. */
export function getCopilotStatusAppearance(status: string) {
  switch (status.toLowerCase()) {
    case "draft":
      return {
        label: "Draft",
        badgeClass: "bg-[#F5F7FF] text-[#64748B]",
        dotClassName: "bg-[#64748B]",
      };
    case "running":
      return {
        label: "In Flight",
        badgeClass: "bg-[#F5F7FF] text-primary",
        dotClassName: "bg-primary",
      };
    case "completed":
      return {
        label: "Completed",
        badgeClass: "bg-[#E3FCEF] text-success",
        dotClassName: "bg-success",
      };
    case "active":
      return {
        label: "Scheduled",
        badgeClass: "bg-[#FFF4E9] text-warning",
        dotClassName: "bg-warning",
      };
    case "paused":
      return {
        label: "Paused",
        badgeClass: "bg-[#FFF6F7] text-error",
        dotClassName: "bg-error",
      };
    // The cached design contains conflicting Archived examples; retain its current colors.
    case "archived":
      return {
        label: "Archived",
        badgeClass: "bg-gray-100 text-gray-400",
        dotClassName: "bg-gray-400",
      };
    default:
      return {
        label: status,
        badgeClass: "bg-gray-100 text-gray-400",
        dotClassName: "bg-gray-400",
      };
  }
}
