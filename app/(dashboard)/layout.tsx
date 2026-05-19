import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex h-screen overflow-hidden print:block print:h-auto print:overflow-visible">
      <div className="print:hidden">
        <Sidebar userEmail={user?.email ?? ""} />
      </div>
      <main className="flex-1 overflow-y-auto bg-surface-page print:overflow-visible print:bg-white">
        {children}
      </main>
    </div>
  );
}
