import TemplateActions from "./TemplateActions";

type Template = {
  id: number;
  name: string;
  subject: string;
  body: string;
  steps: number;
  lastUpdated: string;
  usedIn: number;
  replyRate: number;
  trend: "up" | "down";
  status: "in_flight" | "draft";
};

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
  const isUp = template.trend === "up";

  return (
    <>
      {/* Desktop Row */}
      <div
        className="hidden lg:grid items-center px-5 py-6 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors"
        style={{
          gridTemplateColumns: "1.5fr 0.5fr 1fr 1fr 0.8fr 0.7fr 0.5fr",
        }}
      >
        <span
          className="font-semibold truncate pr-4 text-sm text-[#0F172A]"
        >
          {template.name}
        </span>

        <span className="text-sm text-[#0F172A]">
          {template.steps}
        </span>

        <span className="text-sm text-[#59637C]">
          {template.lastUpdated}
        </span>

        <span className="text-sm text-[#59637C]">
          {template.usedIn} {template.usedIn <= 1 ? "copilot" : "copilots"}
        </span>

        <span
          className="inline-flex items-center gap-1 text-sm"
          style={{
            color:
              template.replyRate === 0
                ? "#59637C"
                : isUp
                  ? "#1d8a68"
                  : "#d9485f",
          }}
        >
          {template.replyRate}%
          {template.replyRate > 0 && (
            <span className="text-xs">{isUp ? "↑" : "↓"}</span>
          )}
        </span>

        <span>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            style={
              template.status === "in_flight"
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
            {template.status === "in_flight" ? "In flight" : "Draft"}
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
              <span
                className="font-semibold truncate text-sm text-[#0F172A]"
              >
                {template.name}
              </span>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0"
                style={
                  template.status === "in_flight"
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
                {template.status === "in_flight" ? "In flight" : "Draft"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#59637C]">
              <span>{template.steps} steps</span>
              <span>{template.lastUpdated}</span>
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
