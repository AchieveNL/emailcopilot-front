"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { emailAccountsApi } from "@/lib/api";
import { useCopilotStore } from "../../../../../store/copilotStore";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface OtherProviderPopUpProps {
  onClose: (saved?: boolean) => void;
  editProfile?: any;
}

function OtherProviderPopUp({ onClose, editProfile }: OtherProviderPopUpProps) {
  const { user } = useUser();
  const { updateCopilotData } = useCopilotStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    profileName: "",
    email: "",
    provider: "smtp",
    smtpHost: "",
    smtpPort: 587,
    smtpPass: "",
    sendName: "",
    dailyLimit: 100,
  });

  useEffect(() => {
    if (editProfile) {
      setForm({
        profileName: editProfile.profileName || editProfile.name || "",
        email: editProfile.email || "",
        provider: editProfile.provider || "smtp",
        smtpHost: editProfile.smtpHost || "",
        smtpPort: editProfile.smtpPort || 587,
        smtpPass: "",
        sendName: editProfile.sendName || "",
        dailyLimit: editProfile.dailyLimit || 100,
      });
    }
  }, [editProfile]);

  const handleAddAccount = async () => {
    if (!form.profileName || !form.email) {
      toast.error("Profile Name and Email Address are required");
      return;
    }

    try {
      setSaving(true);
      if (editProfile) {
        const { smtpPass, ...rest } = form;
        const payload = !smtpPass ? rest : form;
        await emailAccountsApi.update(editProfile.id, payload);
        onClose(true);
      } else {
        const res = await emailAccountsApi.create({
          ...form,
          userId: user?.id,
        });
        if (res.data?.id) {
          updateCopilotData({ emailAccountId: res.data.id });
        }
        onClose(true);
      }
    } catch (error) {
      toast.error(
        editProfile ? "Failed to update profile." : "Failed to create profile.",
      );
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => onClose()}
    >
      {/* Modal */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900">
          {editProfile ? "Edit Email Account" : "Add Email Account"}
        </h2>

        {/* Profile Name */}
        <div className="space-y-1">
          <label className="block text-xs text-gray-900" htmlFor="profileName">
            Account Name
          </label>
          <input
            id="profileName"
            type="text"
            placeholder="e.g. Outreach Account"
            value={form.profileName}
            onChange={(e) => setForm({ ...form, profileName: e.target.value })}
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
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
            >
              <option value="smtp">Custom SMTP</option>
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
              value={form.smtpHost}
              onChange={(e) => setForm({ ...form, smtpHost: e.target.value })}
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
              value={form.smtpPort}
              onChange={(e) =>
                setForm({ ...form, smtpPort: parseInt(e.target.value) || 0 })
              }
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
            value={form.smtpPass}
            onChange={(e) => setForm({ ...form, smtpPass: e.target.value })}
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
            value={form.sendName}
            onChange={(e) => setForm({ ...form, sendName: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => onClose()}
            disabled={saving}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddAccount}
            disabled={saving}
            className="w-full rounded-xl px-4 py-2.5 text-xs text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
            style={{ backgroundColor: "var(--color-primary)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-primary-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving
              ? editProfile
                ? "Saving..."
                : "Adding..."
              : editProfile
                ? "Save Changes"
                : "Add Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtherProviderPopUp;
