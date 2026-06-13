import { useBilling } from "@/lib/useBilling";
import { useClerk } from "@clerk/nextjs";
import { ChevronUp, Crown, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function UserCard({
  user,
  isActive,
}: {
  user: any;
  isActive: boolean;
}) {
  const { limits } = useBilling();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { openUserProfile, signOut } = useClerk();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <div className="p-4 space-y-3">
      {/* Plan Card */}
      <div className="bg-gray-50  rounded-xl p-4">
        {isActive && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Crown size={14} className="text-gray-700" />
              <span className="font-bold text-sm">
                {limits?.planId ? `${limits.planId} Plan` : "Starter plan"}
              </span>
            </div>
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1.5">
                <span className="font-bold text-gray-900">
                  {limits?.usage?.emailsSent ?? 0}
                </span>{" "}
                / {limits?.limits?.emailsPerMonth ?? 0} emails used
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gray-900 h-1.5 rounded-full"
                  style={{ width: `${limits?.usage?.emailsPercent ?? 0}%` }}
                />
              </div>
            </div>
          </>
        )}
        <Link
          href={"/dashboard/billing"}
          className="flex justify-center border border-gray-300 w-full bg-white text-gray-900 text-sm font-medium py-2 rounded-lg hover:bg-gray-900 hover:text-white transition-colors"
        >
          Upgrade Plan
        </Link>
      </div>

      {/* User */}
      <div className="relative" ref={menuRef}>
        <div
          className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">
                {user?.firstName?.[0] || user?.emailAddresses?.[0].emailAddress[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-sm font-bold leading-none mb-1">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-gray-500 leading-none">
                {user?.emailAddresses?.[0].emailAddress}
              </div>
            </div>
          </div>
          <ChevronUp size={12} className="text-gray-400" />
        </div>
        {showUserMenu && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 space-y-2">
            <button
              onClick={() => openUserProfile()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              <User size={16} style={{ color: 'var(--color-secondary)' }} />
              Profile
            </button>
            <hr className="w-full border-gray-200" />
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              style={{ color: '#dc2626' }}
            >
              <LogOut size={16} style={{ color: '#dc2626' }} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
