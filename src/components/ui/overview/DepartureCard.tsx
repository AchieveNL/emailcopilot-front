import Link from "next/link";
import { useLeadStore } from "@/store/leadStore";
import { formatDateTime } from "@/lib/helpers";
import NoData from "./NoData";
import LeadStatus from "../departure/LeadStatus";

export default function DepartureCard() {
  const { leads } = useLeadStore();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5  w-full ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Departure</h2>
        {leads.length > 0 && (
          <Link
            href="/dashboard/departure"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </Link>
        )}
      </div>
      {leads.length === 0 ? (
        <NoData title="No departure found" />
      ) : (
        <table className="w-full">
          <tbody>
            {leads.slice(0, 3).map((item) => (
              <tr key={item.id}>
                <td className="py-3 text-sm font-semibold text-gray-900">
                  {item.copilotName}
                </td>
                <td className="py-3 text-xs text-gray-500 text-right pr-3 whitespace-nowrap w-[1%]">
                  {formatDateTime(item.createdAt)}
                </td>
                <td className="py-3 text-right w-[1%] whitespace-nowrap">
                  <LeadStatus status={item.status || "sent"} isSmall />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
