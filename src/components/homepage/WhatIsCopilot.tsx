import React from "react";
import { Crosshair, SlidersHorizontal, Mail } from "lucide-react";

const STEPS = [
  {
    title: "You set it up",
    text: "Your target, your message, your sending pace.",
  },
  {
    title: "You press send",
    text: "Your Copilot finds the matching companies and starts sending.",
  },
  {
    title: "Replies come to you",
    text: "Emails go out from your own address, answers land in your inbox.",
  },
];

const FEATURES = [
  {
    icon: Crosshair,
    title: "You pick who, and what to say",
    text: "Describe the companies you want and the message you want to send. The looking up and the sending stop being your job.",
  },
  {
    icon: SlidersHorizontal,
    title: "Everything is decided before take-off",
    text: "Who you target, when the emails go out and what they say are all set by you. Then your Copilot flies on its own.",
  },
  {
    icon: Mail,
    title: "The relationship stays yours",
    text: "Emails go out from your own address, and every reply lands in your inbox, not in a tool you have to check.",
  },
];

function WhatIsCopilot() {
  return (
    <section className="w-full bg-[#eef0fd] mt-16 py-16 sm:py-20 px-5">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary">
              The one thing to know
            </span>
            <h2 className="text-[clamp(1.9rem,4vw,2.6rem)] font-bold tracking-[-0.02em] leading-tight text-[#0f0f12]">
              So, what is a Copilot?
            </h2>
            <p className="text-lg sm:text-xl leading-relaxed text-[#2a2a33] max-w-xl">
              A Copilot is an{" "}
              <span className="font-semibold text-primary">
                automated campaign
              </span>
              . You tell it your target, it finds the prospects and contacts
              them for you. Their replies land straight in your inbox.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e3e5f5] p-6 flex flex-col gap-4">
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#0f0f12]">
              One Copilot, three moves
            </span>
            <ol className="flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span className="w-6 h-6 rounded-md bg-primary-light text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#0f0f12]">
                      {step.title}
                    </span>
                    <span className="text-[13px] text-gray-600 leading-snug">
                      {step.text}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-[#e3e5f5] p-6 flex flex-col gap-3"
            >
              <span className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </span>
              <h3 className="text-[15px] font-semibold text-[#0f0f12] mt-1">
                {title}
              </h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatIsCopilot;
