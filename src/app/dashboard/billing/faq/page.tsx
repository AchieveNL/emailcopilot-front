import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import BillingFaqList from "@/components/ui/billing/BillingFaqList";

export const metadata = {
  title: "Billing FAQ",
};

export default function BillingFaqPage() {
  return (
    <div className="p-5 w-full max-w-6xl mx-auto">
      <Link
        href="/dashboard/billing"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ChevronLeft size={16} />
        Back to billing
      </Link>

      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Billing FAQ
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Everything you need to know about payments, subscriptions and
          invoices.
        </p>
      </div>

      <BillingFaqList />
    </div>
  );
}
