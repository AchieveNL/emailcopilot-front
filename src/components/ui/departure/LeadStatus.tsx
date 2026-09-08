"use client";
type LeadStatusType = "new" | "sent" | "replied" | "failed";

function LeadStatus({
  status,
  isSmall,
}: {
  status: string | LeadStatusType;
  isSmall?: boolean;
}) {
  const handleStatusStyles = (status: string) => {
    switch (status) {
      case "sent":
        return {
          text: "text-success",
          bg: "bg-success/5",
        };

      case "failed":
        return {
          text: "text-error",
          bg: "bg-error/5",
        };

      case "new":
        return {
          text: "text-primary",
          bg: "bg-primary/5",
        };

      default:
        return {
          text: "text-gray-900",
          bg: "bg-gray-100",
        };
    }
  };
  return (
    <div
      className={`w-fit px-3 py-1 rounded-lg ${handleStatusStyles(status).bg} ${isSmall ? "px-2 py-0.5" : ""}`}
    >
      <div
        className={`font-semibold line-clamp-1 capitalize ${isSmall ? "text-xs" : "text-sm"} ${handleStatusStyles(status).text}`}
      >
        {status || "Sent"}
      </div>
    </div>
  );
}

export default LeadStatus;
