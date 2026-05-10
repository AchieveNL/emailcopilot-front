import { useBilling } from '@/lib/useBilling'
import { UserButton } from '@clerk/nextjs'
import { ChevronDown, Crown } from 'lucide-react'
import Link from 'next/link'

export default function UserCard({ user, isActive }: { user: any; isActive: boolean }) {
  const {
    limits,
  } = useBilling()
  return (
    <div className="p-4 space-y-3">
      {/* Plan Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        {isActive && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Crown size={14} className="text-gray-700" />
              <span className="font-bold text-sm">{limits?.planId ? `${limits.planId} Plan` : "Starter Plan"}</span>
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1.5">
                <span className="font-bold text-gray-900">{limits?.usage?.emailsSent ?? 0}</span> / {limits?.limits?.emailsPerMonth ?? 0} emails used
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: `${limits?.usage?.emailsPercent ?? 0}%` }} />
              </div>
            </div>
          </>)}
        <Link href={"/dashboard/billing"} className="flex justify-center w-full bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Upgrade Plan
        </Link>
      </div>

      {/* User */}
      <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all">
        <div className="flex items-center gap-3">
          <UserButton />
          <div>
            <div className="text-sm font-bold leading-none mb-1">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-500 leading-none">{user?.emailAddresses?.[0].emailAddress}</div>
          </div>
        </div>
        <ChevronDown size={12} className="text-gray-400" />
      </div>
    </div>
  )
}