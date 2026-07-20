import React from "react";
import { Mail, ChevronRight } from "lucide-react";

export default function EmailTemplateSidbar() {
  const stepsList = [
    {
      id: 1,
      title: "Step 1 - Initial Email",
      desc: "A personalized cold email",
    },
    // {
    //   id: 2,
    //   title: "Step 2 - Follow-up 1",
    //   desc: "Send 2 days after no reply",
    // },
    // {
    //   id: 3,
    //   title: "Step 3 - Follow-up 2",
    //   desc: "Send 4 days after no reply",
    // },
    // {
    //   id: 4,
    //   title: "Step 4 - Follow-up 3",
    //   desc: "Send 6 days after no reply",
    // },
  ];
  return (
    <div className="col-span-1 space-y-5 h-fit bg-white border border-gray-200 rounded-xl p-4 ">
      <h2 className="text-lg font-bold mb-1">Template summary</h2>
      <p className="text-xs text-primary mb-5">1-Step sequence</p>

      <div className="flex flex-col gap-3 mt-10">
        {stepsList.map((step) => (
          <button
            type="button"
            key={step.id}
            className={`flex items-center justify-between  transition-all text-left group ${"border-slate-100 hover:border-slate-200 bg-white"}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 `}>
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className={`text-xs font-bold ${"text-slate-700"}`}>
                  {step.title}
                </div>
                <div className="text-xs text-slate-500 mt-2">{step.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
