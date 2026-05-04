"use client";

import { useState, useEffect } from "react";
import { User, Lock, Bell, Palette, Save, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { settingsApi } from "@/lib/api";
import { useUser } from "@clerk/nextjs";

type Settings = {
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  notifyOnReply: boolean;
  notifyOnBounce: boolean;
  notifyWeeklyReport: boolean;
  theme: "light" | "dark" | "system";
};

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  /* { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette }, */
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const { user } = useUser()



  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await settingsApi.get();
      setSettings(res.data);
    } catch {
      setSettings({
        firstName: "", lastName: "", email: "", timezone: "UTC",
        notifyOnReply: true, notifyOnBounce: true, notifyWeeklyReport: false,
        theme: "light",
      });
    } finally { setLoading(false); }
  }

  useEffect(() => {
    fetchSettings();
  }, []);

  async function handleSave() {
    if (!settings) return;
    try {
      setSaving(true);
      await settingsApi.update(settings as unknown as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { alert("Failed to save settings."); } finally { setSaving(false); }
  }

  async function handlePasswordChange() {
    if (pwForm.next !== pwForm.confirm) { alert("Passwords don't match."); return; }
    try {
      setPwSaving(true);
      await settingsApi.updatePassword({ current: pwForm.current, password: pwForm.next });
      setPwForm({ current: "", next: "", confirm: "" });
      alert("Password updated.");
    } catch { alert("Failed to update password."); } finally { setPwSaving(false); }
  }

  async function handleDeleteAccount() {
    if (!confirm("Are you sure? This is irreversible.")) return;
    if (!confirm("This will permanently delete your account and all data. Type DELETE to confirm.")) return;
    try { await settingsApi.deleteAccount(); window.location.href = "/"; } catch { alert("Failed to delete account."); }
  }

  if (loading) return <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>;
  if (!settings) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences.</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${activeTab === tab.id ? "bg-gray-100 font-medium text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                  <Icon size={15} /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
              <h2 className="font-semibold text-gray-900">Profile Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={settings.firstName} onChange={e => setSettings({ ...settings, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={settings.lastName} onChange={e => setSettings({ ...settings, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Timezone</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" value={settings.timezone} onChange={e => setSettings({ ...settings, timezone: e.target.value })}>
                  {["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Kolkata"].map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
                <Save size={14} /> {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>
                <div className="space-y-3">
                  {[
                    { label: "Current Password", key: "current" },
                    { label: "New Password", key: "next" },
                    { label: "Confirm New Password", key: "confirm" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
                      <div className="relative">
                        <input type={showPw ? "text" : "password"} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-9" value={pwForm[field.key as keyof typeof pwForm]} onChange={e => setPwForm({ ...pwForm, [field.key]: e.target.value })} />
                        {field.key === "next" && (
                          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button onClick={handlePasswordChange} disabled={pwSaving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 mt-1">
                    <Lock size={14} /> {pwSaving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  <h2 className="font-semibold text-red-800">Danger Zone</h2>
                </div>
                <p className="text-sm text-red-600 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button onClick={handleDeleteAccount} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Email Notifications</h2>
              <div className="space-y-4">
                {[
                  { key: "notifyOnReply", label: "Email replies", desc: "Get notified when a prospect replies to your outreach." },
                  { key: "notifyOnBounce", label: "Bounced emails", desc: "Alert when an email bounces or fails to deliver." },
                  { key: "notifyWeeklyReport", label: "Weekly report", desc: "Receive a weekly summary of your copilot performance." },
                ].map(item => (
                  <div key={item.key} className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof Settings] })}
                      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${settings[item.key as keyof Settings] ? "bg-gray-900" : "bg-gray-200"}`}
                      style={{ height: "22px", width: "40px" }}
                    >
                      <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${settings[item.key as keyof Settings] ? "translate-x-[19px]" : "translate-x-0.5"}`} style={{ width: "18px", height: "18px", top: "2px" }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 mt-6">
                <Save size={14} /> {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-4">Theme</h2>
              <div className="grid grid-cols-3 gap-3">
                {(["light", "dark", "system"] as const).map(theme => (
                  <button
                    key={theme}
                    onClick={() => setSettings({ ...settings, theme })}
                    className={`border-2 rounded-xl p-4 text-sm font-medium capitalize transition-all ${settings.theme === theme ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className={`w-full h-12 rounded-lg mb-3 ${theme === "light" ? "bg-white border border-gray-200" : theme === "dark" ? "bg-gray-900" : "bg-gradient-to-br from-white to-gray-900"}`} />
                    {theme}
                  </button>
                ))}
              </div>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 mt-6">
                <Save size={14} /> {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
