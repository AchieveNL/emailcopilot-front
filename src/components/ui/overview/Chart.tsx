"use client";

import React from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Lead } from "@/lib/types";
import { periodToDays } from "@/lib/helpers";

interface PerformanceDataPoint {
  date: string;
  emailsSent: number;
  replies: number;
}

export type DateRange = "Last 7 days" | "Last 14 days" | "Last 30 days";

interface PerformanceChartProps {
  leads?: Lead[];
  range?: DateRange;
  onRangeChange?: (range: DateRange) => void;
}

interface CustomTooltipPayloadItem {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
  stroke?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: CustomTooltipPayloadItem[];
}

export function buildLeadChartItems(leads: Lead[], daysBack: number = 60) {
  const countsByDate: Record<string, { emailsSent: number; replies: number }> =
    {};

  leads.forEach((lead) => {
    const rawDate = lead.sentAt || lead.createdAt;

    if (!rawDate) return;

    const dateObj = new Date(rawDate);

    if (isNaN(dateObj.getTime())) return;

    const key = dateObj.toISOString().split("T")[0];

    if (!countsByDate[key]) {
      countsByDate[key] = {
        emailsSent: 0,
        replies: 0,
      };
    }

    if (lead.status === "sent") {
      countsByDate[key].emailsSent += 1;
    }

    if (lead.status === "replied") {
      countsByDate[key].replies += 1;
    }
  });

  const result: {
    date: Date;
    emailsSent: number;
    replies: number;
  }[] = [];

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  for (let i = daysBack; i >= 0; i--) {
    const d = new Date(today);

    d.setDate(d.getDate() - i);

    const key = d.toISOString().split("T")[0];

    result.push({
      date: d,
      emailsSent: countsByDate[key]?.emailsSent || 0,
      replies: countsByDate[key]?.replies || 0,
    });
  }

  return result;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-md text-sm">
      <div className="font-semibold text-gray-900 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.stroke ?? p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

export default function PerformanceChart({
  leads = [],
  range: externalRange,
  onRangeChange,
}: PerformanceChartProps) {
  const [internalRange, setInternalRange] =
    React.useState<DateRange>("Last 7 days");

  const activeRange = externalRange ?? internalRange;

  const handleRangeChange = (newRange: DateRange) => {
    if (onRangeChange) {
      onRangeChange(newRange);
    } else {
      setInternalRange(newRange);
    }
  };

  const chartItems = React.useMemo(
    () => buildLeadChartItems(leads, 60),
    [leads],
  );

  const data: PerformanceDataPoint[] = React.useMemo(() => {
    const days = periodToDays(activeRange);

    const items = chartItems.slice(-days);

    return items.map((item) => {
      const month = item.date.toLocaleDateString("en-US", {
        month: "short",
      });

      const day = item.date.getDate();

      return {
        date: `${month} ${day}`,
        emailsSent: item.emailsSent,
        replies: item.replies,
      };
    });
  }, [chartItems, activeRange]);

  return (
    <div className="bg-white border mb-8 border-gray-200 rounded-xl px-6 py-5 font-sans w-full max-w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-900 flex-1">
          Performance
        </h2>

        <div className="flex items-center gap-4">
          <div className="flex gap-2 items-center justify-center">
            <div className="w-5 border-b-2 border-primary" />
            <p className="text-gray-800 text-xs">Emails Sent</p>
            <div className="w-5 border-b-2 border-dashed border-success" />
            <p className="text-gray-800 text-xs">Replies</p>
          </div>

          <select
            value={activeRange}
            onChange={(e) => handleRangeChange(e.target.value as DateRange)}
            className="text-xs text-gray-700 border border-gray-200 rounded-md px-2 py-1 bg-white cursor-pointer"
          >
            <option>Last 7 days</option>
            <option>Last 14 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="emailGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#f0f0f0" />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="emailsSent"
            name="Emails sent"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#emailGradient)"
            dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />

          <Line
            type="monotone"
            dataKey="replies"
            name="Replies"
            stroke="#1d8a68"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={{ r: 3, fill: "#1d8a68", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
