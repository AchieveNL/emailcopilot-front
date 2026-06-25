"use client";

import { ChevronDown } from "lucide-react";

interface OtherProviderPopUpProps {
  onClose: () => void;
}

function OtherProviderPopUp({ onClose }: OtherProviderPopUpProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900">Add Email Account</h2>

        {/* Profile Name */}
        <div className="space-y-1">
          <label className="block text-xs text-gray-900" htmlFor="profileName">
            Account Name
          </label>
          <input
            id="profileName"
            type="text"
            placeholder="e.g. Outreach Account"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs text-gray-900" htmlFor="emailAddress">
            Email Address
          </label>
          <input
            id="emailAddress"
            type="email"
            placeholder="you@company.com"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Provider */}
        <div className="space-y-1">
          <label className="block text-xs text-gray-900" htmlFor="provider">
            Provider
          </label>
          <div className="relative">
            <select
              id="provider"
              defaultValue="custom_smtp"
              className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="custom_smtp">Custom SMTP</option>
              <option value="gmail">Gmail</option>
              <option value="outlook">Outlook</option>
              <option value="sendgrid">SendGrid</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* SMTP Host + Port */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs text-gray-900" htmlFor="smtpHost">
              SMTP Host
            </label>
            <input
              id="smtpHost"
              type="text"
              placeholder="smtp.example.com"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-gray-900" htmlFor="port">
              Port
            </label>
            <input
              id="port"
              type="number"
              defaultValue={587}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
        </div>

        {/* App Password / Token */}
        <div className="space-y-1">
          <label className="block text-xs text-gray-900" htmlFor="appPassword">
            App Password / Token
          </label>
          <input
            id="appPassword"
            type="password"
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Sender Name */}
        <div className="space-y-1">
          <label className="block text-xs text-gray-900" htmlFor="senderName">
            Your name / Sender Name
          </label>
          <input
            id="senderName"
            type="text"
            placeholder="John Doe"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-full rounded-xl px-4 py-2.5 text-xs text-white transition-colors"
            style={{ backgroundColor: "var(--color-primary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtherProviderPopUp;
