import React from "react";
import { ArrowRight } from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";
import type { Step } from "@/store/copilotStore";
function StepsActions({
  step,
  canContinue,
}: {
  step: Step;
  canContinue: boolean;
}) {
  const { copilotData, setStep } = useCopilotStore();
  return (
    <div className="pt-5 flex justify-end w-full border-t border-gray-200 mt-12 mb-4">
      <button
        onClick={() => {
          if (!copilotData.name.trim()) return;
          setStep(step);
        }}
        disabled={canContinue}
        className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary-hover active:bg-primary-active transition-colors"
      >
        Save &amp; Continue <ArrowRight size={15} />
      </button>
    </div>
  );
}

export default StepsActions;
