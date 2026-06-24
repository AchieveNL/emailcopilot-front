"use client";

import { CheckCircle, ChevronRight, Zap, Inbox } from "lucide-react";

import Image from "next/image";
import { useCopilotStore } from "@/store/copilotStore";
import type { NewCopilotContext } from "@/app/dashboard/copilots/new/page";
import StepsActions from "../StepsActions";

interface Step2EmailProfileProps {
  remoteContext: NewCopilotContext;
}

export default function Step2EmailProfile({
  remoteContext,
}: Step2EmailProfileProps) {
  const { copilotData } = useCopilotStore();

  const canContinue =
    !!copilotData.emailProfileId &&
    !!copilotData.templateId &&
    !remoteContext.loadingOptions;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Connect your email account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose the email account your copilot will use to send emails.
          </p>
        </div>

        {/* Recommended section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-800 mb-3">
            Recommended
          </h3>

          <div className="space-y-3">
            {/* Connect with Gmail - highlighted */}
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 p-5 rounded-xl border border-primary bg-primary-light transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <Image src="/gmail.svg" alt="Gmail" width={40} height={40} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      Connect with Gmail
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle size={8} /> Recommended
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-medium text-primary bg-primary/10  px-2 py-0.5 rounded-full">
                      <Zap size={8} /> Easy setup
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your Gmail account with OAuth in a few clicks.
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0" />
            </button>

            {/* Connect with Outlook */}
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary-light transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/outlook.svg"
                  alt="Outlook"
                  width={40}
                  height={40}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      Connect with Outlook
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle size={8} /> Recommended
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-medium text-primary bg-primary/10  px-2 py-0.5 rounded-full">
                      <Zap size={8} /> Easy setup
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your Outlook account with OAuth in a few clicks.
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-semibold text-gray-800">
              Other options
            </span>
          </div>
        </div>

        {/* Connect other provider */}
        <button
          type="button"
          className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary-light transition-colors text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0">
              <Inbox size={18} className="text-gray-500" />
            </div>
            <div>
              <span className="font-semibold text-sm text-gray-900">
                Connect other email provider
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Use SMTP / IMAP to connect any email provider.
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 shrink-0" />
        </button>
      </div>
      <StepsActions step={3} canContinue={false} />
    </>
  );
}
