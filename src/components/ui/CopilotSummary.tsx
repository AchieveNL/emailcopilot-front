"use client";

import { Settings, User, Database, Send, CircleCheck, Info } from "lucide-react";
import clsx from "clsx";
import { useCopilotStore } from "@/store/copilotStore";

type RemoteOption = { id: number; name: string };

interface CopilotSummaryProps {
  emailProfiles: RemoteOption[];
  scrapeProfiles: RemoteOption[];
  templates?: RemoteOption[];
}

export default function CopilotSummary({
  emailProfiles,
  scrapeProfiles,
  templates,
}: CopilotSummaryProps) {
  const { copilotData, launched } = useCopilotStore();

  // Find names from IDs
  const emailProfileName = emailProfiles.find((p) => p.id === copilotData.emailProfileId)?.name;
  const scrapeProfileName = scrapeProfiles.find((p) => p.id === copilotData.scrapeProfileId)?.name;

  const items = [
    {
      icon: Settings,
      label: "Settings",
      status: copilotData.name ? "Configured" : "Not configured",
      done: !!copilotData.name,
    },
    {
      icon: User,
      label: "Email Profile",
      status: emailProfileName || "Not selected",
      done: !!emailProfileName,
    },
    {
      icon: Database,
      label: "Scrape Profile",
      status: scrapeProfileName || "Not selected",
      done: !!scrapeProfileName,
    },
    {
      icon: Send,
      label: "Launch",
      status: launched ? "Launched" : "Not started",
      done: launched,
    },
  ];

  return (
    <>
      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-bold mb-1">Copilot Summary</h2>
        <p className="text-xs text-gray-500 mb-5">Review your copilot progress.</p>
        <ul className="space-y-0">
          {items.map((item, i) => (
            <li
              key={item.label}
              className={clsx(
                "flex items-center justify-between py-3.5",
                i < items.length - 1 && "border-b border-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={15} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <span
                className={clsx(
                  "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                  item.done
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Info Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Info size={15} className="text-gray-400" />
          <h2 className="text-base font-bold">About Copilots</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Copilots automate your entire outreach process.
        </p>
        <ul className="space-y-3 text-sm text-gray-600">
          {[
            "Set your copilot settings",
            "Choose an email profile (sender)",
            "Select a scrape profile (Google My Business)",
            "Review and launch your copilot",
          ].map((text) => (
            <li key={text} className="flex items-start gap-2">
              <CircleCheck size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
