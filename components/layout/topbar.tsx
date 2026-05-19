"use client";

import { usePathname } from "next/navigation";
import { IconBell } from "@tabler/icons-react";

const ROUTE_MAP: [string, string][] = [
  ["/projetos",     "Carteira de Projetos"],
  ["/clientes",     "Clientes"],
  ["/contratadas",  "Contratadas"],
  ["/configuracoes","Configurações"],
];

function getRouteLabel(pathname: string): string {
  for (const [route, label] of ROUTE_MAP) {
    if (pathname === route || pathname.startsWith(route + "/")) return label;
  }
  return "";
}

interface TopbarProps {
  userEmail: string;
}

export function Topbar({ userEmail }: TopbarProps) {
  const pathname = usePathname();
  const label    = getRouteLabel(pathname);
  const initials = userEmail ? userEmail[0].toUpperCase() : "U";

  return (
    <header className="h-[56px] shrink-0 flex items-center justify-between px-6 bg-white border-b border-surface-border">
      <span className="text-sm font-medium text-text-secondary tracking-wide">{label}</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notificações"
          className="p-1.5 rounded-lg hover:bg-surface-input transition-colors"
        >
          <IconBell size={18} className="text-text-disabled" />
        </button>

        <div
          title={userEmail}
          className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-bold select-none"
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
