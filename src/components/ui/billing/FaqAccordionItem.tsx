"use client";

import { ChevronDown } from "lucide-react";
import type { BillingFaq } from "@/lib/billingFaq";

interface FaqAccordionItemProps {
  faq: BillingFaq;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FaqAccordionItem({
  faq,
  index,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  const panelId = `billing-faq-panel-${faq.id}`;

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isOpen
          ? "border-primary/40 bg-primary/5"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
            isOpen
              ? "bg-primary text-white"
              : "border border-gray-200 text-gray-500"
          }`}
        >
          {index}
        </span>

        <span className="flex-1 text-sm font-bold text-gray-900 sm:text-base">
          {faq.question}
        </span>

        <ChevronDown
          size={20}
          className={`shrink-0 transition-transform ${
            isOpen ? "rotate-180 text-primary" : "text-gray-400"
          }`}
        />
      </button>

      {isOpen && (
        <p id={panelId} className="px-5 pb-4 pl-17 text-sm text-gray-500">
          {faq.answer}
        </p>
      )}
    </div>
  );
}
