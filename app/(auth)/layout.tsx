import { AuthLeftPanel } from "@/components/auth/auth-left-panel";
import { LogoMca } from "@/components/shared/logo-mca";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AuthLeftPanel />

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-surface-page">
        {/* Logo mobile (visível apenas em telas < lg) */}
        <div className="mb-10 lg:hidden">
          <LogoMca variant="teal" size="md" />
        </div>
        {children}
      </div>
    </div>
  );
}
