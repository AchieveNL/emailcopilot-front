"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ExternalLink, Zap } from "lucide-react";
import { integrationsApi } from "@/lib/api";

type Integration = {
  provider: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  connectedAt?: string;
  logo: string;
};

const INTEGRATION_CATALOG: Omit<Integration, "connected" | "connectedAt">[] = [
  { provider: "google", name: "Google Workspace", description: "Connect Gmail and Google Calendar for seamless outreach.", category: "Email", logo: "G" },
  { provider: "microsoft", name: "Microsoft 365", description: "Use Outlook and Teams for email automation.", category: "Email", logo: "M" },
  { provider: "sendgrid", name: "SendGrid", description: "Route bulk emails through SendGrid's infrastructure.", category: "Email", logo: "SG" },
  { provider: "hunter", name: "Hunter.io", description: "Find and verify email addresses from any website.", category: "Prospecting", logo: "H" },
  { provider: "apollo", name: "Apollo.io", description: "Access millions of B2B contacts and enrich lead data.", category: "Prospecting", logo: "A" },
  { provider: "clearbit", name: "Clearbit", description: "Enrich leads with firmographic and demographic data.", category: "Enrichment", logo: "C" },
  { provider: "hubspot", name: "HubSpot CRM", description: "Sync contacts, deals, and activities with HubSpot.", category: "CRM", logo: "HS" },
  { provider: "salesforce", name: "Salesforce", description: "Push qualified leads and email data to Salesforce CRM.", category: "CRM", logo: "SF" },
  { provider: "slack", name: "Slack", description: "Receive reply and campaign alerts directly in Slack.", category: "Notifications", logo: "S" },
  { provider: "webhook", name: "Webhooks", description: "Send event data to any custom endpoint.", category: "Developer", logo: "⚡" },
];

const CATEGORIES = ["All", "Email", "Prospecting", "Enrichment", "CRM", "Notifications", "Developer"];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => { fetchIntegrations(); }, []);

  async function fetchIntegrations() {
    try {
      setLoading(true);
      const res = await integrationsApi.getAll();
      const connected: { provider: string; connectedAt: string }[] = res.data;
      setIntegrations(INTEGRATION_CATALOG.map(i => ({
        ...i,
        connected: connected.some(c => c.provider === i.provider),
        connectedAt: connected.find(c => c.provider === i.provider)?.connectedAt,
      })));
    } catch {
      setIntegrations(INTEGRATION_CATALOG.map(i => ({ ...i, connected: false })));
    } finally { setLoading(false); }
  }

  async function handleConnect(provider: string) {
    const needsApiKey = ["hunter", "apollo", "clearbit", "sendgrid", "webhook"].includes(provider);
    if (needsApiKey) { setShowApiKeyModal(provider); return; }
    try {
      setConnectingProvider(provider);
      await integrationsApi.connect(provider, {});
      fetchIntegrations();
    } catch { alert("Connection failed."); } finally { setConnectingProvider(null); }
  }

  async function handleConnectWithKey() {
    if (!showApiKeyModal) return;
    try {
      setConnectingProvider(showApiKeyModal);
      await integrationsApi.connect(showApiKeyModal, { apiKey });
      setShowApiKeyModal(null);
      setApiKey("");
      fetchIntegrations();
    } catch { alert("Connection failed."); } finally { setConnectingProvider(null); }
  }

  async function handleDisconnect(provider: string) {
    if (!confirm(`Disconnect ${provider}?`)) return;
    try {
      await integrationsApi.disconnect(provider);
      fetchIntegrations();
    } catch { alert("Failed to disconnect."); }
  }

  const logoColors: Record<string, string> = {
    google: "bg-blue-100 text-blue-700", microsoft: "bg-blue-100 text-blue-700",
    sendgrid: "bg-cyan-100 text-cyan-700", hunter: "bg-orange-100 text-orange-700",
    apollo: "bg-purple-100 text-purple-700", clearbit: "bg-emerald-100 text-emerald-700",
    hubspot: "bg-orange-100 text-orange-800", salesforce: "bg-blue-100 text-blue-800",
    slack: "bg-pink-100 text-pink-700", webhook: "bg-gray-100 text-gray-700",
  };

  const filtered = integrations.filter(i => activeCategory === "All" || i.category === activeCategory);
  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-500 text-sm mt-1">{connectedCount} of {integrations.length} integrations connected.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <Zap size={14} className="text-gray-500" />
          <span className="text-sm text-gray-600 font-medium">{connectedCount} Active</span>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-6">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === c ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(integration => (
            <div key={integration.provider} className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${integration.connected ? "border-emerald-200" : "border-gray-200"}`}>
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${logoColors[integration.provider] || "bg-gray-100 text-gray-700"}`}>
                  {integration.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm">{integration.name}</span>
                    {integration.connected && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 size={10} /> Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{integration.description}</p>
                  {integration.connectedAt && (
                    <p className="text-xs text-gray-400 mt-1">Connected {new Date(integration.connectedAt).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {integration.connected ? (
                    <button onClick={() => handleDisconnect(integration.provider)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <XCircle size={12} /> Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.provider)}
                      disabled={connectingProvider === integration.provider}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <ExternalLink size={12} />
                      {connectingProvider === integration.provider ? "Connecting..." : "Connect"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Connect {INTEGRATION_CATALOG.find(i => i.provider === showApiKeyModal)?.name}</h2>
            <p className="text-sm text-gray-500 mb-4">Enter your API key to complete the connection.</p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">API Key</label>
              <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" placeholder="sk-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowApiKeyModal(null); setApiKey(""); }} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleConnectWithKey} disabled={!apiKey || connectingProvider !== null} className="flex-1 bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
                {connectingProvider ? "Connecting..." : "Connect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
