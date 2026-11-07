"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useUser } from "@clerk/nextjs";
// import { useBilling } from "@/lib/useBilling"; // TODO: uncomment when backend is ready
import UserCard from "../ui/UserCard";
import Logo from "../homepage/Logo";
import { isNavActive, navGroups } from "@/lib/nav-items";

export default function Sidebar() {
  const pathname = usePathname();
  //get user from Clerk to show in sidebar
  const { user } = useUser();
  console.log("User in Sidebar:", user); // Debugging line to check user object
  console.log("pathname in Sidebar:", pathname); // Debugging line to check pathname value
  // const { limits } = useBilling(); // TODO: uncomment when backend is ready
  // console.log("Limits in Sidebar:", limits); // TODO: uncomment when backend is ready

  // TODO: uncomment the full block below when backend is ready, and remove the simplified sidebar
  /*
  return (
    <>
      {!limits ? (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full flex-shrink-0">
          <div>
            <Logo />
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <AlertTriangle size={48} className="mb-4" />
              <p className="text-center">
                No active subscription found. Please choose a plan to access the
                dashboard.
              </p>
              <Link
                href={"/dashboard/billing"}
                className="mt-4 inline-block bg-gray-900 text-white rounded-lg py-2 px-4 font-medium hover:bg-gray-700 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
          <UserCard user={user} isActive={false} />
        </aside>
      ) : (
  */

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-full flex-shrink-0">
      <div>
        {/* Logo */}
        <Logo />
        <hr className="w-full border-gray-200 mb-2" />

        {/* Nav */}
        <nav>
          {navGroups.map((group, index) => {
            const nextGroup = navGroups[index + 1];
            const gapBelow =
              !nextGroup || nextGroup.divider || Boolean(nextGroup.label);
            return (
              <div key={group.label ?? index}>
                {group.divider && (
                  <hr className="mx-3 border-t-[0.5px] border-gray-200" />
                )}
                <div
                  className={clsx(
                    "px-3",
                    group.divider || group.label ? "pt-3" : "pt-1",
                    gapBelow && "pb-3",
                  )}
                >
                  {group.label && (
                    <div className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                      {group.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {group.items.map(({ href, label, icon: Icon }) => {
                      const isActive = isNavActive(pathname, href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                            group.bold ? "font-semibold" : "font-medium",
                            isActive
                              ? "bg-primary/5 text-primary"
                              : group.bold
                                ? "text-gray-900 hover:bg-gray-50"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          <Icon
                            size={18}
                            className={
                              isActive ? "text-primary" : "text-gray-400"
                            }
                          />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      <UserCard user={user} isActive={true} />
    </aside>
  );

  // TODO: uncomment closing tags below when backend is ready
  // </>
  // );
}
