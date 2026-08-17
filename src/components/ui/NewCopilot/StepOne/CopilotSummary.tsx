import React from "react";
import { Shield } from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";

function CopilotSummary({ draftId }: { draftId?: string }) {
  const { copilotData } = useCopilotStore();
  return (
    <div className="w-full ">
      <h2 className="text-lg font-bold mb-1">Copilot Summary</h2>
      <p className="text-md text-gray-500 mb-5">
        Here’s a summary of your copilot.
      </p>
      <div className="flex flex-col gap-2 ">
        <div className="py-2">
          <p className="block text-sm font-semibold text-gray-900 mb-1.5">
            Copilot Name
          </p>
          <p className="mt-1.5 text-xs text-gray-500">
            {copilotData.name || "Private Jet Operators"}
          </p>
        </div>
        <div className="py-2">
          <p className="block text-sm font-semibold text-gray-900 mb-1.5">
            Description
          </p>
          <p className="mt-1.5 text-xs text-gray-500">
            {copilotData.description ||
              "Book more appointments and generate qualified leads"}
          </p>
        </div>
        <div className="py-2">
          <p className="block text-sm font-semibold text-gray-900 mb-1.5">
            Goal
          </p>
          <p className="mt-1.5 text-xs text-gray-500">
            {copilotData.goal ||
              "Book more appointments and generate qualified leads"}
          </p>
        </div>
        <div className="p-4 mt-5 border border-primary flex gap-2 bg-primary/5 rounded-xl">
          <Shield size={24} className="text-primary" />
          <p className=" text-xs text-gray-700">
            You can edit all settings later at any time.
          </p>
        </div>
      </div>

      {/* Draft status card */}
      {draftId && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 ">
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

export default CopilotSummary;
