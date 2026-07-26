"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { useCopilotStore, type Step } from "@/store/copilotStore";
import {
  SlidersVertical,
  Mail,
  Crosshair,
  FileText,
  CalendarDays,
  Plane,
} from "lucide-react";

const steps = [
  {
    id: 1,
    label: "Setup",
    sub: "Configure your copilot",
    icon: <SlidersVertical size={16} />,
  },
  {
    id: 2,
    label: "Email accounts",
    sub: "Choose who's sending",
    icon: <Mail size={16} />,
  },
  {
    id: 3,
    label: "Target profile",
    sub: "Choose who to reach",
    icon: <Crosshair size={16} />,
  },
  {
    id: 4,
    label: "Email Template",
    sub: "Create you message",
    icon: <FileText size={16} />,
  },
  {
    id: 5,
    label: "Flight Schedule",
    sub: "Choose when to send",
    icon: <CalendarDays size={16} />,
  },
  {
    id: 6,
    label: "Take-off",
    sub: "Review and launch",
    icon: <Plane size={16} />,
  },
];

export default function Stepper() {
  const { currentStep, highestStep, setStep } = useCopilotStore();

  return (
    <div className=" py-6 mb-6">
      <div className="flex items-start justify-between relative">
        {steps.map((step, idx) => {
          const done = highestStep > step.id && currentStep !== step.id;
          const active = currentStep === step.id;
          const isLast = idx === steps.length - 1;

          return (
            <div
              key={step.id}
              className="flex items-start flex-1 last:flex-none"
            >
              <button
                onClick={() => {
                  if (step.id <= highestStep) setStep(step.id as Step);
                }}
                className={clsx(
                  "flex flex-col items-center text-center",
                  step.id <= highestStep ? "cursor-pointer" : "cursor-default",
                )}
              >
                <div className="flex items-center  gap-2">
                  <div
                    className={clsx(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                      active
                        ? "bg-primary text-white border"
                        : "bg-white text-gray-900 border border-gray-200",
                    )}
                  >
                    {step.id}
                  </div>

                  <div
                    className={clsx(
                      "relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all",
                      active
                        ? "bg-primary text-white border"
                        : "bg-white text-gray-900 border border-gray-200",
                    )}
                  >
                    {step.icon}
                    {done && (
                      <div
                        className={clsx(
                          "w-4 h-4 p-1 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all bg-[#70d5b3] absolute -bottom-1 -right-1",
                        )}
                      >
                        <Check size={16} color="white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={clsx(
                    "text-sm font-semibold mt-2 whitespace-nowrap",
                    active
                      ? "text-[var(--color-primary)]"
                      : done
                        ? "text-gray-700"
                        : "text-gray-900",
                  )}
                >
                  {step.label}
                </span>
                <span className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                  {step.sub}
                </span>
              </button>

              {!isLast && (
                <div className="flex-1 h-px bg-gray-200 mt-[18px] mx-3" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
