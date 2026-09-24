"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { Invoice } from "@/lib/useBilling";
import { formatBillingDate, formatInvoiceNumber } from "@/lib/helpers";
import NoData from "../overview/NoData";
import InvoiceStatus from "./InvoiceStatus";

const PREVIEW_COUNT = 3;

interface InvoicesCardProps {
  invoices: Invoice[];
  /** `amountDue` from `useBilling()` — formats cents as EUR. */
  formatAmount: (cents: number) => string;
}

export default function InvoicesCard({
  invoices,
  formatAmount,
}: InvoicesCardProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleInvoices = showAll ? invoices : invoices.slice(0, PREVIEW_COUNT);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-lg font-bold text-gray-900">Invoices</h2>
      <p className="mt-1 text-sm text-gray-500">
        View and download your past invoices.
      </p>

      {invoices.length === 0 ? (
        <div className="mt-5">
          <NoData title="No invoices yet." />
        </div>
      ) : (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-xl">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-sm font-bold text-gray-900">
                    Invoice
                  </th>
                  <th className="pb-3 text-sm font-bold text-gray-900">Date</th>
                  <th className="pb-3 text-sm font-bold text-gray-900">
                    Amount
                  </th>
                  <th className="pb-3 text-sm font-bold text-gray-900">
                    Status
                  </th>
                  <th className="pb-3 text-sm font-bold text-gray-900">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm text-gray-900">
                      {formatInvoiceNumber(invoice)}
                    </td>
                    <td className="py-4 text-sm text-gray-500">
                      {formatBillingDate(invoice.paidAt || invoice.createdAt)}
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-900">
                      {formatAmount(invoice.amount)}
                    </td>
                    <td className="py-4">
                      <InvoiceStatus status={invoice.status} />
                    </td>
                    <td className="py-4">
                      {invoice.downloadUrl ? (
                        <a
                          href={invoice.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                        >
                          <Download size={16} />
                          Download
                        </a>
                      ) : (
                        <span className="text-sm text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {invoices.length > PREVIEW_COUNT && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50"
              >
                {showAll ? "Show less" : "View all invoices"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
