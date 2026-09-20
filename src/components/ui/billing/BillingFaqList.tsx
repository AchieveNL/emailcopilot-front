"use client";

import { useMemo, useState } from "react";
import { Mail, Search } from "lucide-react";
import { BILLING_FAQS, BILLING_SUPPORT_EMAIL } from "@/lib/billingFaq";
import NoData from "../overview/NoData";
import FaqAccordionItem from "./FaqAccordionItem";

/** Searchable FAQ accordion plus the "Still have questions?" footer. */
export default function BillingFaqList() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return BILLING_FAQS;

    return BILLING_FAQS.filter(
      (faq) =>
        faq.question.toLocaleLowerCase().includes(term) ||
        faq.answer.toLocaleLowerCase().includes(term),
    );
  }, [query]);

  return (
    <>
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search billing questions..."
          aria-label="Search billing questions"
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-primary focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mt-8 space-y-3">
        {results.length === 0 ? (
          <NoData title="No questions match your search." />
        ) : (
          results.map((faq) => (
            <FaqAccordionItem
              key={faq.id}
              faq={faq}
              index={faq.id}
              isOpen={openId === faq.id}
              onToggle={() =>
                setOpenId((current) => (current === faq.id ? null : faq.id))
              }
            />
          ))
        )}

        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
              <Mail size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">
                Still have questions?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                We&apos;re here to help. Contact our team and we&apos;ll get
                back to you as soon as possible.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-1">
            <a
              href={`mailto:${BILLING_SUPPORT_EMAIL}`}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Email us
            </a>
            <span className="text-xs font-medium text-gray-900">
              {BILLING_SUPPORT_EMAIL}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
