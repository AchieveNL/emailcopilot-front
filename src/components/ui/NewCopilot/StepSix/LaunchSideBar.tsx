import {
  Navigation,
  Mail,
  Users,
  FileText,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { useCopilotStore } from "../../../../../store/copilotStore";
import type { NewCopilotContext } from "@/app/dashboard/copilots/new/page";

interface LaunchSideBarProps {
  draftId?: string;
  remoteContext?: NewCopilotContext;
}

export default function LaunchSideBar({
  draftId,
  remoteContext,
}: LaunchSideBarProps) {
  const { copilotData } = useCopilotStore();

  const selectedEmailProfile = remoteContext?.emailAccount?.find(
    (p) => p.id === copilotData.emailAccountId,
  );

  const selectedTemplate = remoteContext?.templates?.find(
    (t) => t.id === copilotData.templateId,
  );

  const formatActiveDays = (days: string[] = []) => {
    if (days.length === 0) return "None";
    if (days.length === 7) return "Mon - Sun";
    if (days.length === 5 && !days.includes("Sat") && !days.includes("Sun"))
      return "Mon - Fri";

    const shortDays = days.map((d) => d.slice(0, 3));
    return shortDays.join(", ");
  };

  return (
    <div className="w-full ">
      <h2 className="text-[15px] font-bold text-gray-900 mb-10">
        Estimated performance
      </h2>

      <div className="flex flex-col gap-8 mt-5">
        {/* Copilot name */}
        <div className="flex items-start gap-6">
          <Navigation size={20} className="text-gray-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-gray-900 mb-1">
              Copilot name
            </p>
            <p className="text-[13px] text-gray-500">
              {copilotData.name || "Private Jet Operators"}
            </p>
          </div>
        </div>

        {/* Email Account */}
        <div className="flex items-start gap-6">
          <Mail size={20} className="text-gray-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-gray-900 mb-1">
              Email Account
            </p>
            <p className="text-[13px] text-gray-500">
              {selectedEmailProfile?.name || "karim@achieve.nl"}
            </p>
          </div>
        </div>

        {/* Target Audience */}
        <div className="flex items-start gap-6">
          <Users size={20} className="text-gray-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-gray-900 mb-1">
              Target Audience
            </p>
            <p className="text-[13px] text-gray-500">
              {copilotData.targetProfile?.industries?.length
                ? copilotData.targetProfile.industries.join(", ")
                : "Private Jet Operators"}
            </p>
          </div>
        </div>

        {/* Email Template */}
        <div className="flex items-start gap-6">
          <FileText size={20} className="text-gray-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-gray-900 mb-1">
              Email Template
            </p>
            <p className="text-[13px] text-gray-500">
              {selectedTemplate?.name || "Book More Appointments"}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-start gap-6">
          <CalendarDays size={20} className="text-gray-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-gray-900 mb-1">
              Flight Schedule
            </p>
            <p className="text-[13px] text-gray-500">
              {copilotData.sendLimit || 30} emails per day,{" "}
              {formatActiveDays(copilotData.settings?.schedule?.activeDays)}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-start gap-6">
          <ShieldCheck size={20} className="text-gray-700 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-gray-900 mb-1">Status</p>
            <p className="text-[13px] text-gray-500">Ready to take-off</p>
          </div>
        </div>
      </div>

      {/* Draft status card */}
      {draftId && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-900 mb-0.5">
            Draft saved
          </p>
          <p className="text-xs text-gray-400">
            Your progress is saved. Come back anytime to finish.
          </p>
        </div>
      )}
    </div>
  );
}
