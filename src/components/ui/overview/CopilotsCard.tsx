import Link from "next/link";
import CopilotStatus from "../CopilotStatus";

import { useCopilotStore } from "@/store/copilotStore";
import NoData from "./NoData";
import { useRouter } from "next/navigation";

export default function CopilotsCard() {
  const { copilots } = useCopilotStore();
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5  w-full ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Copilots</h2>
        {copilots.length > 0 && (
          <Link
            href="/dashboard/copilots"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </Link>
        )}
      </div>

      {copilots.length === 0 ? (
        <NoData title="No copilots found" />
      ) : (
        <table className="w-full">
          <tbody>
            {copilots.slice(0, 3).map((copilot) => (
              <tr
                key={copilot.id}
                onClick={() =>
                  router.push(
                    `/dashboard/departure?copilotId=${copilot.id}&name=${copilot.name}`,
                  )
                }
                className="cursor-pointer group"
              >
                <td className="py-3 text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  {copilot.name}
                </td>
                <td className="py-3 text-sm font-semibold text-primary hover:text-primary/80 text-right pr-4 w-[1%] whitespace-nowrap">
                  {copilot.emailsSent}
                </td>
                <td className="py-3 text-right w-[1%] whitespace-nowrap">
                  <CopilotStatus
                    status={copilot?.status || "draft"}
                    isSmall={true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
