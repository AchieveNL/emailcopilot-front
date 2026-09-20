import { formatDateTime } from "@/lib/helpers";
import TemplateActions from "./TemplateActions";
import type { Template } from "@/lib/types/templates";

interface TemplateRowProps {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function TemplateRow({
  template,
  onEdit,
  onDelete,
  onDuplicate,
}: TemplateRowProps) {
  const isUp = (template.trend ?? "up") === "up";
  const replyRate = template.replyRate ?? 0;
  const usedIn = template.usedIn ?? 0;
  const steps = Array.isArray(template.steps)
    ? template.steps.length
    : typeof template.steps === "number"
      ? template.steps
      : 0;
  const lastUpdated =
    formatDateTime(template.updatedAt || "", false) ||
    formatDateTime(template.createdAt || "", false) ||
    "—";
  const status = template.status ?? "draft";

  return (
    <>
      {/* Desktop Row */}
      <div
        className="hidden lg:grid items-center px-5 py-6 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors"
        style={{
          gridTemplateColumns: "1.5fr 0.5fr 1fr 1fr 0.8fr 0.7fr 0.5fr",
        }}
      >
        <span className="font-semibold truncate pr-4 text-sm text-[#0F172A]">
          {template.name}
        </span>

        <span className="text-sm text-[#0F172A]">{steps}</span>

        <span className="text-sm text-[#59637C]">{lastUpdated}</span>

        <span className="text-sm text-[#59637C]">
          {usedIn} {usedIn <= 1 ? "copilot" : "copilots"}
        </span>

        <span
          className="inline-flex items-center gap-1 text-sm"
          style={{
            color: replyRate === 0 ? "#59637C" : isUp ? "#1d8a68" : "#d9485f",
          }}
        >
          {replyRate}%
          {replyRate > 0 && <span className="text-xs">{isUp ? "↑" : "↓"}</span>}
        </span>

        <span>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={
              status === "in_flight"
                ? {
                    backgroundColor: "#F0F9FF",
                    color: "#0284C7",
                    border: "1px solid #BAE6FD",
                  }
                : {
                    backgroundColor: "#F8FAFC",
                    color: "#64748B",
                    border: "1px solid #E2E8F0",
                  }
            }
          >
            {status === "in_flight" ? "In flight" : "Draft"}
          </span>
        </span>

        <div className="flex items-center">
          <TemplateActions
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        </div>
      </div>

      {/* Mobile Row */}
      <div className="lg:hidden px-4 py-5 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold truncate text-sm text-[#0F172A]">
                {template.name}
              </span>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0"
                style={
                  status === "in_flight"
                    ? {
                        backgroundColor: "#F0F9FF",
                        color: "#0284C7",
                        border: "1px solid #BAE6FD",
                      }
                    : {
                        backgroundColor: "#F8FAFC",
                        color: "#64748B",
                        border: "1px solid #E2E8F0",
                      }
                }
              >
                {status === "in_flight" ? "In flight" : "Draft"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#59637C]">
              <span>{steps} steps</span>
              <span>{lastUpdated}</span>
            </div>
          </div>
          <TemplateActions
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        </div>
      </div>
    </>
  );
}
