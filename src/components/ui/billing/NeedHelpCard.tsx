import Link from "next/link";
import { ChevronRight, FileQuestion, Mail } from "lucide-react";
import { BILLING_SUPPORT_EMAIL } from "@/lib/billingFaq";

export default function NeedHelpCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">Need help?</h2>
      <p className="mt-2 text-sm text-gray-500">
        If you have any question about billing or your subscription we&apos;re
        here to help.
      </p>

      <Link
        href="/dashboard/billing/faq"
        className="mt-5 flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-gray-50"
      >
        <FileQuestion size={20} className="mt-0.5 shrink-0 text-gray-400" />
        <span className="flex-1">
          <span className="block text-sm font-bold text-gray-900">
            Billing FAQ
          </span>
          <span className="block text-sm text-gray-500">
            Find answers to common billing questions.
          </span>
        </span>
        <ChevronRight
          size={18}
          className="shrink-0 self-center text-gray-400"
        />
      </Link>

      <hr className="my-5 border-gray-100" />

      <div className="flex items-start gap-3 p-2">
        <Mail size={20} className="mt-0.5 shrink-0 text-gray-400" />
        <div>
          <p className="text-sm font-bold text-gray-900">Contact support</p>
          <a
            href={`mailto:${BILLING_SUPPORT_EMAIL}`}
            className="text-sm text-primary transition-colors hover:text-primary-hover"
          >
            {BILLING_SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
