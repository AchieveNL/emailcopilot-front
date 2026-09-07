"use client";

import { useUser } from "@clerk/nextjs";
import { BarChart3, Bot, Send, Users } from "lucide-react";

import DashboardHeader from "@/components/layout/DashboardHeader";
import { useRouter } from "next/navigation";
import Chart, {
  DateRange,
  buildLeadChartItems,
} from "@/components/ui/overview/Chart";
import StatCard from "@/components/ui/overview/StatCard";

import { getPeriodStats, getDateRange, periodToDays } from "@/lib/helpers";
import QuickStart from "@/components/ui/overview/QuickStart";
import { useState, useEffect, useMemo } from "react";
import DepartureCard from "@/components/ui/overview/DepartureCard";
import CopilotsCard from "@/components/ui/overview/CopilotsCard";
import CopilotFooter from "@/components/ui/NewCopilot/CopilotFooter";
import { useLeadStore } from "@/store/leadStore";
import { useCopilotStore } from "@/store/copilotStore";

export default function OverviewPage() {
  const { leads, getAllLeads } = useLeadStore();
  const { copilots, getAllCopilots } = useCopilotStore();

  const { user } = useUser();
  const router = useRouter();

  const [period, setPeriod] = useState<DateRange>("Last 7 days");

  useEffect(() => {
    getAllLeads();
    getAllCopilots();
  }, []);

  const leadChartItems = useMemo(() => buildLeadChartItems(leads, 60), [leads]);

  const sentStats = useMemo(
    () =>
      getPeriodStats(
        leadChartItems.map((item) => ({ date: item.date, value: item.emailsSent })),
        period,
      ),
    [leadChartItems, period],
  );

  const replyStats = useMemo(
    () =>
      getPeriodStats(
        leadChartItems.map((item) => ({ date: item.date, value: item.replies })),
        period,
      ),
    [leadChartItems, period],
  );

  const replyRate =
    sentStats.total > 0
      ? (replyStats.total / sentStats.total) * 100
      : 0;

  const comparisonLabel = useMemo(
    () => "vs " + getDateRange(periodToDays(period)),
    [period],
  );

  const stats = [
    {
      label: "Emails Sent",
      value: sentStats.total,
      change: sentStats.percentageChange,
      comparisonLabel,
      icon: Send,
    },
    {
      label: "Replies",
      value: replyStats.total,
      change: replyStats.percentageChange,
      comparisonLabel,
      icon: BarChart3,
    },
    {
      label: "Reply Rate",
      value: `${replyRate.toFixed(1)}%`,
      change: 0,
      comparisonLabel,
      icon: Users,
    },
    {
      label: "Copilots",
      value: copilots?.length ?? 0,
      change: 0,
      comparisonLabel,
      icon: Bot,
    },
  ];

  return (
    <div className="p-5 w-full mx-auto">
      <DashboardHeader
        title={`Welcome back, ${user?.firstName || user?.fullName || "there"}!👋`}
        description={`Here's what's happening with your outreach today`}
        actionLabel="Create New Copilot"
        onAction={() => router.push("/dashboard/copilots/new")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            icon={s.icon}
            label={s.label}
            value={s.value as string | number}
            change={s.change}
            comparisonLabel={s.comparisonLabel}
          />
        ))}
      </div>
      <Chart
        leads={leads}
        range={period}
        onRangeChange={(newRange) => setPeriod(newRange)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <CopilotsCard />
        <DepartureCard />
        <QuickStart />
      </div>
      <CopilotFooter />
    </div>
  );
}
