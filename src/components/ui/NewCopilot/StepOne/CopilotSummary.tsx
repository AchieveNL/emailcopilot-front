// "use client";

// import { Settings, User, Database, Send, FileText, CircleCheck, Info } from "lucide-react";
// import clsx from "clsx";
// import { useCopilotStore } from "@/store/copilotStore";

// type RemoteOption = { id: number; name: string };

// interface CopilotSummaryProps {
//   emailProfiles: RemoteOption[];
//   scrapeProfiles: RemoteOption[];
//   templates?: RemoteOption[];
// }

// export default function CopilotSummary({
//   emailProfiles,
//   scrapeProfiles,
//   templates,
// }: CopilotSummaryProps) {
//   const { copilotData, launched } = useCopilotStore();

//   const emailProfileName = emailProfiles.find(
//     (p) => p.id === copilotData.emailProfileId
//   )?.name;
//   const scrapeProfileName = scrapeProfiles.find(
//     (p) => p.id === copilotData.scrapeProfileId
//   )?.name;
//   const templateName = templates?.find(
//     (t) => t.id === copilotData.templateId
//   )?.name;

//   const items = [
//     {
//       icon: Settings,
//       label: "Settings",
//       status: copilotData.name ? "Configured" : "Not configured",
//       done: !!copilotData.name,
//     },
//     {
//       icon: User,
//       label: "Email Profile",
//       status: emailProfileName || "Not selected",
//       done: !!emailProfileName,
//     },
//     {
//       icon: FileText,
//       label: "Template",
//       status: templateName || "Not selected",
//       done: !!templateName,
//     },
//     {
//       icon: Database,
//       label: "Scrape Profile",
//       status: scrapeProfileName || "Not selected",
//       done: !!scrapeProfileName,
//     },
//     {
//       icon: Send,
//       label: "Launch",
//       status: launched ? "Launched" : "Not started",
//       done: launched,
//     },
//   ];

//   return (
//     <>
//       {/* Summary Card */}
//       <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//         <h2 className="text-base font-bold mb-1">Copilot Summary</h2>
//         <p className="text-xs text-gray-500 mb-5">Review your copilot progress.</p>
//         <ul className="space-y-0">
//           {items.map((item, i) => (
//             <li
//               key={item.label}
//               className={clsx(
//                 "flex items-center justify-between py-3.5",
//                 i < items.length - 1 && "border-b border-gray-100"
//               )}
//             >
//               <div className="flex items-center gap-3">
//                 <item.icon size={15} className="text-gray-400" />
//                 <span className="text-sm font-medium text-gray-700">{item.label}</span>
//               </div>
//               <span
//                 className={clsx(
//                   "text-xs font-semibold px-2.5 py-0.5 rounded-full",
//                   item.done
//                     ? "bg-green-100 text-green-700"
//                     : "bg-gray-100 text-gray-500"
//                 )}
//               >
//                 {item.status}
//               </span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Info Card */}
//       <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//         <div className="flex items-center gap-2 mb-2">
//           <Info size={15} className="text-gray-400" />
//           <h2 className="text-base font-bold">About Copilots</h2>
//         </div>
//         <p className="text-sm text-gray-600 mb-4">
//           Copilots automate your entire outreach process.
//         </p>
//         <ul className="space-y-3 text-sm text-gray-600">
//           {[
//             "Set your copilot settings",
//             "Choose an email profile (sender) and template",
//             "Select a scrape profile (Google My Business)",
//             "Review and launch your copilot",
//           ].map((text) => (
//             <li key={text} className="flex items-start gap-2">
//               <CircleCheck size={15} className="text-gray-400 mt-0.5 flex-shrink-0" />
//               <span>{text}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </>
//   );
// }

import React from "react";
import { Shield } from "lucide-react";
import { useCopilotStore } from "@/store/copilotStore";

function CopilotSummary({ draftId }: { draftId?: string }) {
  const { copilotData } = useCopilotStore();
  return (
    <div className="col-span-1 space-y-5 h-fit bg-white border border-gray-200 rounded-xl p-4 ">
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
