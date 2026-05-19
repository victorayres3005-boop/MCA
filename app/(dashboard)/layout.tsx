import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden print:block print:h-auto print:overflow-visible">
      <div className="print:hidden">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto bg-surface-page print:overflow-visible print:bg-white">
        {children}
      </main>
    </div>
  );
}
