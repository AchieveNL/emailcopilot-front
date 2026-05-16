"use client";

import { useState, useEffect } from "react";
import { Plus, Mail, Trash2, CheckCircle2, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { emailProfilesApi } from "@/lib/api";
import { useUser } from "@clerk/nextjs";

type EmailProfile = {
  id: number;
  profileName: string;
  email: string;
  provider: string;
  status: "active" | "inactive" | "error";
  sentToday: number;
  createdAt: string;
};

export default function EmailProfilesPage() {
  const [profiles, setProfiles] = useState<EmailProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ profileName: "", email: "", sendName: "", provider: "smtp", smtpHost: "", smtpPort: 587, smtpPass: "", dailyLimit: 100 });
  const [saving, setSaving] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const { user } = useUser()

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const res = await emailProfilesApi.getAll();
      setProfiles(res.data);
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      setSaving(true);
      await emailProfilesApi.create({ ...form, userId: user?.id });
      setShowModal(false);
      setForm({ profileName: "", email: "", sendName: "", provider: "smtp", smtpHost: "", smtpPort: 587, smtpPass: "", dailyLimit: 100 });
      fetchProfiles();
    } catch {
      alert("Failed to create profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this email profile?")) return;
    try {
      await emailProfilesApi.delete(id);
      fetchProfiles();
    } catch {
      alert("Failed to delete profile.");
    }
  }

  async function handleVerify(id: number) {
    try {
      setVerifyingId(id);
      await emailProfilesApi.verify(id);
      fetchProfiles();
    } catch {
      alert("Verification failed.");
    } finally {
      setVerifyingId(null);
    }
  }

  const statusConfig = {
    active: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Active" },
    inactive: { icon: AlertCircle, color: "text-gray-400", bg: "bg-gray-50", label: "Inactive" },
    error: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Error" },
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Profiles</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the email accounts used for outreach.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} /> Add Email Profile
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>
      ) : profiles.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail size={20} className="text-gray-500" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">No email profiles yet</h2>
          <p className="text-sm text-gray-500 mb-5">Add an email account to start sending outreach.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <Plus size={15} /> Add Email Profile
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile) => {
            const cfg = statusConfig[profile.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={profile.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-5">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm">{profile.profileName}</span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} font-medium`}>
                      <StatusIcon size={11} /> {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{profile.email} · {profile.provider}</p>

                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleVerify(profile.id)}
                    disabled={verifyingId === profile.id}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={verifyingId === profile.id ? "animate-spin" : ""} />
                    Verify
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors text-gray-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Add Email Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Profile Name</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Outreach Account" value={form.profileName} onChange={e => setForm({ ...form, profileName: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Provider</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })}>
                  <option value="smtp">Custom SMTP</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">SMTP Host</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="smtp.example.com" value={form.smtpHost} onChange={e => setForm({ ...form, smtpHost: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Port</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="587" value={form.smtpPort} onChange={e => setForm({ ...form, smtpPort: parseInt(e.target.value) })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">App Password / Token</label>
                <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="••••••••" value={form.smtpPass} onChange={e => setForm({ ...form, smtpPass: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your name / Sender Name</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="John Doe" value={form.sendName} onChange={e => setForm({ ...form, sendName: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="flex-1 bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
                {saving ? "Adding..." : "Add Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
