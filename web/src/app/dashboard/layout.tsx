import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <Sidebar />
      <div>
        <Topbar />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
