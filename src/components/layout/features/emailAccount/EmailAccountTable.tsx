"use client";

import { useMemo, useState } from "react";
import { Search, Inbox, Plus } from "lucide-react";
import outlookIcon from "../../../../../public/outlook.svg";
import gmailIcon from "../../../../../public/gmail.svg";
import Image from "next/image";
import EmailAccountMenu from "@/components/ui/emailAccount/EmailAccountMenu";
import { EmailAccount, EmailProvider } from "@/lib/types";
import EmailAccountStatus from "@/components/ui/emailAccount/EmailAccountStatus";
import TemplatesPagination from "@/components/ui/templates/Pagination";
import { useRowsPerPage } from "@/lib/hooks";
import {
  StatusDropdown,
  type StatusOption,
} from "@/components/ui/copilots/CopilotToolBar";

interface EmailAccountsTableProps {
  accounts?: EmailAccount[];
  onCreateNew?: () => void;
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
    <div className="relative w-full sm:w-80">
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#59637C]"
      />
      <input
        type="text"
        placeholder="Search accounts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search accounts"
        className="w-full h-10 border border-[#E2E8F0] rounded-lg pl-10 pr-4 text-sm bg-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
        style={{ color: "#59637C" }}
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

const TABLE_HEADERS = [
  "Email account",
  "Email address",
  "Provider",
  "Connected",
  "Emails sent",
  "Status",
  "Actions",
];

const COLUMNS = "1.4fr 1.2fr 0.8fr 0.8fr 0.6fr 0.8fr 0.4fr";

function AccountRow({ account }: { account: EmailAccount }) {
  const providerMeta = getProviderMeta(account.provider);
  return (
    <>
      {/* Desktop Row */}
      <div
        className="hidden lg:grid items-center px-5 py-6 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors"
        style={{ gridTemplateColumns: COLUMNS }}
      >
        <span className="min-w-0 flex items-center gap-2.5 pr-4">
          <ProviderBadge provider={account.provider} />
          <span className="font-semibold truncate text-sm text-[#0F172A]">
            {getDisplayName(account)}
          </span>
        </span>

        <span className="min-w-0 truncate text-sm text-[#0F172A]">
          {account.email}
        </span>

        <span className="text-sm text-[#0F172A]">{providerMeta.label}</span>

        <span className="text-sm text-[#0F172A]">
          {formatDate(account.createdAt)}
        </span>

        <span className="text-sm text-[#0F172A]">
          {getEmailsSentCount(account)}
        </span>

        <span>
          <EmailAccountStatus status={account.status} />
        </span>

        <div className="flex items-center">
          <EmailAccountMenu account={account} />
        </div>
      </div>

      {/* Mobile Row */}
      <div className="lg:hidden px-4 py-5 border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ProviderBadge provider={account.provider} />
              <span className="font-semibold truncate text-sm text-[#0F172A]">
                {getDisplayName(account)}
              </span>
            </div>
            <div className="truncate text-xs text-[#59637C]">
              {account.email}
            </div>
            <div className="mt-0.5 text-xs text-[#59637C]">
              {providerMeta.label} · {getEmailsSentCount(account)} sent ·{" "}
              {formatDate(account.createdAt)}
            </div>
            <div className="mt-2">
              <EmailAccountStatus status={account.status} />
            </div>
          </div>
          <EmailAccountMenu account={account} />
        </div>
      </div>
    </>
  );
}

function EmptyState({
  onCreateNew,
  isFiltered,
}: {
  onCreateNew?: () => void;
  isFiltered: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: "var(--color-primary-light)" }}
      >
        <Inbox
          size={32}
          className="sm:hidden"
          style={{ color: "var(--color-primary)" }}
        />
        <Inbox
          size={40}
          className="hidden sm:block"
          style={{ color: "var(--color-primary)" }}
        />
      </div>
      <h3 className="font-bold mb-2 text-center text-lg leading-7 text-[#0F172A]">
        {isFiltered ? "No Email Accounts Found" : "No Email Accounts Yet"}
      </h3>
      <p className="mb-6 text-center text-sm leading-5 font-light text-[#59637C]">
        {isFiltered
          ? "Try adjusting your search or filters"
          : "Add an email account to start sending outreach."}
      </p>
      {onCreateNew && (
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 btn-cta text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} />
          Add Email Account
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Root component                                                             */
/* -------------------------------------------------------------------------- */

export default function EmailAccountsTable({
  accounts = [],
  onCreateNew,
}: EmailAccountsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  // Same responsive rows-per-page as the templates table
  const perPage = useRowsPerPage(20);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAccounts.length / perPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filteredAccounts.slice(
    (safeCurrentPage - 1) * perPage,
    safeCurrentPage * perPage,
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  return (
    <>
      <div className="bg-white border border-[#E2E8F0] rounded-lg">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-lg leading-6 text-[#0F172A]">
            Your Email Accounts ({filteredAccounts.length})
          </h2>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2.5">
            <SearchInput value={search} onChange={handleSearchChange} />
            <StatusDropdown
              value={statusFilter}
              onChange={handleStatusChange}
              options={EMAIL_ACCOUNT_STATUS_OPTIONS}
            />
          </div>
        </div>

        {/* Desktop Table Header */}
        <div
          className="hidden lg:grid px-5 py-3 border-b border-[#E2E8F0]"
          style={{ gridTemplateColumns: COLUMNS }}
        >
          {TABLE_HEADERS.map((col) => (
            <span
              key={col}
              className="font-normal text-xs leading-5 text-[#94A3B8]"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Rows / Empty */}
        {filteredAccounts.length === 0 ? (
          <EmptyState
            onCreateNew={onCreateNew}
            isFiltered={accounts.length > 0}
          />
        ) : (
          <div>
            {paginated.map((account) => (
              <AccountRow key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>

      {filteredAccounts.length > 0 && (
        <div className="mt-4">
          <TemplatesPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
}
