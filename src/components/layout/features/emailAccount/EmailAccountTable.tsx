"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import outlookIcon from "../../../../../public/outlook.svg";
import gmailIcon from "../../../../../public/gmail.svg";
import Image from "next/image";
import EmailAccountMenu from "@/components/ui/emailAccount/EmailAccountMenu";
import { EmailAccount, EmailProvider } from "@/lib/types";
import EmailAccountStatus from "@/components/ui/emailAccount/EmailAccountStatus";
import {
  StatusDropdown,
  type StatusOption,
} from "@/components/ui/copilots/CopilotToolBar";

interface EmailAccountsTableProps {
  accounts?: EmailAccount[];
}

/**
 * ---------------------------------------------------------------------------
 * Sample data shaped exactly like the API response you shared.
 * Swap this out for your real fetch() / react-query result.
 * ---------------------------------------------------------------------------
 */

/** Maps a raw provider string from the API to a display label + Tailwind color classes. */
const PROVIDER_META: Record<
  string,
  { label: string; icon: React.ReactNode; iconClass: string }
> = {
  gmail: {
    label: "Gmail",
    icon: <Image src={gmailIcon} width={20} height={20} alt="gmail logo" />,
    iconClass: "bg-red-50 text-red-500",
  },
  outlook: {
    label: "Outlook",
    icon: <Image src={outlookIcon} width={20} height={20} alt="outlook logo" />,
    iconClass: "bg-blue-50 text-blue-600",
  },
  smtp: {
    label: "Custom SMTP",
    icon: <Inbox size={20} className="text-gray-500" />,
    iconClass: "bg-gray-100 text-gray-700",
  },
};

function getProviderMeta(provider: EmailProvider) {
  return (
    PROVIDER_META[provider] ?? {
      label: provider,
      iconClass: "bg-gray-100 text-gray-500",
      icon: <Inbox size={18} className="text-gray-500" />,
    }
  );
}

function formatDate(isoString?: string | null): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Derives a friendly display name when the API doesn't provide one. */
function getDisplayName(account: EmailAccount): string {
  return account.profileName || account.sendName || account.email.split("@")[0];
}

/** Derives an "emails sent" figure — prefers a lifetime total if present, falls back to today's count. */
function getEmailsSentCount(account: EmailAccount): number {
  return account.sentToday ?? account.sentToday ?? 0;
}

/* -------------------------------------------------------------------------- */
/* Small, focused presentational components                                   */
/* -------------------------------------------------------------------------- */

function ProviderBadge({ provider }: { provider: EmailProvider }) {
  const meta = getProviderMeta(provider);
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.iconClass}`}
      aria-hidden="true"
    >
      {meta.icon}
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex items-center">
      <Search
        size={15}
        className="pointer-events-none absolute left-2.5 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder="Search accounts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search accounts"
        className="w-52 rounded-lg border border-gray-200  py-2 pl-8 pr-3 text-sm text-gray-900 outline-none focus:border-gray-300 focus:bg-white"
      />
    </div>
  );
}

const EMAIL_ACCOUNT_STATUS_OPTIONS: StatusOption[] = [
  { value: "all", label: "All statuses", dotClassName: "bg-blue-500" },
  { value: "active", label: "Verified", dotClassName: "bg-success" },
  { value: "inactive", label: "Unverified", dotClassName: "bg-orange-500" },
  { value: "error", label: "Error", dotClassName: "bg-error" },
];

function TableHeader() {
  const headerClass = "px-5 py-3.5 text-left text-xs font-medium text-gray-700";
  return (
    <thead>
      <tr className="border-y border-gray-200 ">
        <th scope="col" className={headerClass}>
          Email Account
        </th>
        <th scope="col" className={headerClass}>
          Email address
        </th>
        <th scope="col" className={headerClass}>
          Provider
        </th>
        <th scope="col" className={headerClass}>
          Connected
        </th>
        <th scope="col" className={headerClass}>
          Emails sent
        </th>
        <th scope="col" className={headerClass}>
          Status
        </th>
        <th scope="col" className={headerClass} aria-hidden="true" />
      </tr>
    </thead>
  );
}

function AccountRow({ account }: { account: EmailAccount }) {
  const providerMeta = getProviderMeta(account.provider);
  const cellClass = "px-5 py-3.5 text-[13.5px] text-gray-700";
  return (
    <tr className="border-t border-gray-200">
      <td className={cellClass}>
        <div className="flex items-center gap-2.5">
          <ProviderBadge provider={account.provider} />
          <span className="font-medium text-gray-900">
            {getDisplayName(account)}
          </span>
        </div>
      </td>
      <td className={cellClass}>{account.email}</td>
      <td className={cellClass}>{providerMeta.label}</td>
      <td className={cellClass}>{formatDate(account.createdAt)}</td>
      <td className={cellClass}>{getEmailsSentCount(account)}</td>
      <td className={cellClass}>
        <EmailAccountStatus status={account.status} />
      </td>
      <td className={`${cellClass} text-right`}>
        <EmailAccountMenu account={account} />
      </td>
    </tr>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="py-8 text-center text-[13.5px] text-gray-400">
        No accounts match your search.
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Root component                                                             */
/* -------------------------------------------------------------------------- */

export default function EmailAccountsTable({
  accounts = [],
}: EmailAccountsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesStatus =
        statusFilter === "all" || account.status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      const haystack =
        `${getDisplayName(account)} ${account.email}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [accounts, search, statusFilter]);

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white  pt-5 pb-2 f">
      <div className="mb-5 flex flex-wrap items-center justify-between px-5  gap-4">
        <h2 className="text-base font-semibold text-gray-900">
          Your Email Accounts ({accounts.length})
        </h2>
        <div className="flex items-center gap-2.5">
          <SearchInput value={search} onChange={setSearch} />
          <StatusDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={EMAIL_ACCOUNT_STATUS_OPTIONS}
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-100">
        <table className="w-full border-collapse" aria-label="Email accounts">
          <TableHeader />
          <tbody>
            {filteredAccounts.length === 0 ? (
              <EmptyState />
            ) : (
              filteredAccounts.map((account) => (
                <AccountRow key={account.id} account={account} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
