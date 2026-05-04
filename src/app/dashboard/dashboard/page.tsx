import { BarChart3, Send, Users, TrendingUp } from "lucide-react";

const stats = [
  { label: "Emails Sent", value: "3,249", change: "+12%", icon: Send },
  { label: "Active Copilots", value: "28.4%", change: "+3.1%", icon: BarChart3 },
  { label: "New Leads", value: "142", change: "+22%", icon: Users },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, John. Here&apos;s your overview.</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {s.label}
              </span>
              <s.icon size={15} className="text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-green-600 font-medium mt-1">{s.change} this month</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Send size={20} className="text-gray-500" />
        </div>
        <h2 className="font-bold text-gray-900 mb-2">No active copilots</h2>
        <p className="text-sm text-gray-500 mb-4">Create a copilot to start automating your outreach.</p>
        <a
          href="/copilots/new"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Create New Copilot
        </a>
      </div>
    </div>
  );
}
