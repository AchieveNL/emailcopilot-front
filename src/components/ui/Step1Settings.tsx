"use client";

import { ArrowRight } from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";

export default function Step1Settings() {
  const { copilotData, updateCopilotData, updateSettings, setStep } =
    useCopilotStore();

  const handleSubmit = () => {
    if (!copilotData.name.trim()) return;
    setStep(2);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 ">
      <h2 className="text-lg font-bold mb-1">Setup Your Copilot</h2>
      <p className="text-sm text-gray-500 mb-12">
        Give your Copilot a name and describe its purpose.
      </p>

      <div className="space-y-10">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-1.5"
              htmlFor="name"
            >
              Copilot Name
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              Internal name to identify your copilot.
            </p>
          </div>
          <div className="md:col-span-2">
            <input
              id="name"
              type="text"
              value={copilotData.name}
              onChange={(e) => updateCopilotData({ name: e.target.value })}
              placeholder="Private Jet Operators"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-1.5"
              htmlFor="desc"
            >
              Description{" "}
            </label>
            <p className="mt-1.5 text-xs text-gray-500">
              Describe what this copilot does and who it’s for.
            </p>
          </div>
          <div className="md:col-span-2">
            <textarea
              id="desc"
              rows={3}
              value={copilotData.description}
              onChange={(e) =>
                updateCopilotData({ description: e.target.value })
              }
              placeholder="Reach out to private jet operators in Amsterdam and introduce our services"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Goal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
          <div>
            <label
              className="block text-sm font-semibold text-gray-900 mb-1.5"
              htmlFor="goal"
            >
              Goal
            </label>

            <p className="mt-1.5 text-xs text-gray-500">
              What is the main goal of this copilot?
            </p>
          </div>

          <div className="md:col-span-2">
            <textarea
              id="goal"
              rows={3}
              value={copilotData.goal}
              onChange={(e) => updateCopilotData({ goal: e.target.value })}
              placeholder="Book more appointments and generate qualified leads"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <hr className="w-full border-gray-200 mt-12 mb-4" />
        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary-hover active:bg-primary-active transition-colors"
          >
            Save &amp; Continue <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
