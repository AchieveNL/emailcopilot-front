"use client";

import { ArrowRight, ArrowLeft, CheckCircle2, Mail, FileText } from "lucide-react";
import clsx from "clsx";
import { useCopilotStore } from "@/store/copilotStore";
import type { NewCopilotContext } from "@/app/dashboard/copilots/new/page";

interface Step2EmailProfileProps {
  remoteContext: NewCopilotContext;
}

export default function Step2EmailProfile({ remoteContext }: Step2EmailProfileProps) {
  const { copilotData, updateCopilotData, setStep } = useCopilotStore();

  const canContinue =
    !!copilotData.emailProfileId &&
    !!copilotData.templateId &&
    !remoteContext.loadingOptions;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-1">Email Profile &amp; Template</h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose who&apos;s sending and what to send.
      </p>

      {remoteContext.loadingOptions && (
        <div className="text-center py-8 text-gray-500">Loading options...</div>
      )}

      {!remoteContext.loadingOptions && (
        <>
          {/* ── Email Profile ── */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              Email Profile
            </h3>

            {remoteContext.emailProfiles.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                No email profiles available. Please create one first.
              </p>
            ) : (
              <div className="space-y-3">
                {remoteContext.emailProfiles.map((profile) => {
                  const selected = copilotData.emailProfileId === profile.id;
                  return (
                    <button
                      key={profile.id}
                      onClick={() => updateCopilotData({ emailProfileId: profile.id })}
                      className={clsx(
                        "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                        selected
                          ? "border-gray-900 bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {profile.name}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Mail size={11} />
                            <span>Profile ID: {profile.id}</span>
                          </div>
                        </div>
                      </div>
                      {selected && (
                        <CheckCircle2 size={18} className="text-gray-900 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Template ── */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-gray-400" />
              Email Template
            </h3>

            {remoteContext.templates && remoteContext.templates.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                No templates available. Please create one first.
              </p>
            ) : (
              <div className="space-y-3">
                {(remoteContext.templates ?? []).map((template) => {
                  const selected = copilotData.templateId === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => updateCopilotData({ templateId: template.id })}
                      className={clsx(
                        "w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                        selected
                          ? "border-gray-900 bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <FileText size={16} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Template ID: {template.id}
                          </div>
                        </div>
                      </div>
                      {selected && (
                        <CheckCircle2 size={18} className="text-gray-900 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={() => { if (canContinue) setStep(3); }}
          disabled={!canContinue}
          className={clsx(
            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors",
            canContinue
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Save &amp; Continue <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}