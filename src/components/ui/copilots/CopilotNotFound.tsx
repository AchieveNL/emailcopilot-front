import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function CopilotNotFound() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-5">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <SearchX size={24} className="text-gray-500" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-gray-900">
          Copilot not found
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          This copilot may have been deleted, or the link you followed is
          incorrect.
        </p>
        <Link
          href="/dashboard/copilots"
          className="btn-cta mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to Copilots
        </Link>
      </div>
    </div>
  );
}
