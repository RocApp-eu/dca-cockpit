import type { ReactNode } from "react";
import { AuthGate } from "@/components/AuthGate";
import { UserDataProvider } from "@/lib/user-context";
import { SignalProvider } from "@/lib/signals";
import { MobileNavProvider } from "@/lib/mobile-nav";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <UserDataProvider>
        <SignalProvider>
          <MobileNavProvider>
            <div className="shell">
              <Sidebar />
              <div>
                <Topbar />
                <main className="main">{children}</main>
              </div>
            </div>
          </MobileNavProvider>
        </SignalProvider>
      </UserDataProvider>
    </AuthGate>
  );
}
