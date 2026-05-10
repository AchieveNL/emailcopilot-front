import Sidebar from "@/components/layout/Sidebar";
import MobileMenu from "@/components/layout/MobileMenu";
import { DashboardProviders } from "@/lib/providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {


  return (
    <DashboardProviders>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Mobile Menu */}
        <MobileMenu />
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 w-full md:w-auto">{children}</main>
      </div>
    </DashboardProviders>
  );
}
