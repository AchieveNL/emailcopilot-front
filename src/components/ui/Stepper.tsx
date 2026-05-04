"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { useCopilotStore, type Step } from "@/store/copilotStore";

const steps = [
  { id: 1, label: "Settings", sub: "Configure your copilot" },
  { id: 2, label: "Email Profile", sub: "Choose who's sending" },
  { id: 3, label: "Scrape Profile", sub: "Choose what to scrape" },
  { id: 4, label: "Launch", sub: "Review and start sending" },
];

export default function Stepper() {
  const { currentStep, setStep } = useCopilotStore();

  const progressWidth = `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-px bg-gray-200 -z-10" />
        {/* Progress line */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-gray-900 -z-10 transition-all duration-500"
          style={{ width: progressWidth }}
        />

        {steps.map((step) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => {
                if (step.id <= currentStep) setStep(step.id as Step);
              }}
              className={clsx(
                "flex flex-col items-start bg-white pr-4 last:pr-0",
                step.id <= currentStep ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    done
                      ? "bg-gray-900 text-white"
                      : active
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  )}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : step.id}
                </div>
                <span
                  className={clsx(
                    "text-sm font-semibold",
                    active ? "text-gray-900" : done ? "text-gray-700" : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              <span className="text-xs text-gray-400 ml-10">{step.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
