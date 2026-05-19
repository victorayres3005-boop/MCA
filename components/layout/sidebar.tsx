"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconBuilding,
  IconHelmet,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { href: "/projetos",    label: "Carteira",     icon: IconLayoutDashboard },
  { href: "/clientes",    label: "Clientes",     icon: IconBuilding        },
  { href: "/contratadas", label: "Contratadas",  icon: IconHelmet          },
];

interface SidebarProps {
  userEmail?: string;
}

export function Sidebar({ userEmail = "" }: SidebarProps) {
  const pathname = usePathname();
  const initials = userEmail ? userEmail[0].toUpperCase() : "U";

  return (
    <aside className="w-[200px] shrink-0 flex flex-col h-screen border-r border-white/[0.06]" style={{ background: "linear-gradient(160deg, #0D2B45 0%, #0D2B45 55%, #0A5C56 85%, #00897F 100%)" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-3 h-[62px] border-b border-white/[0.08] shrink-0">
        <div className="relative h-11 w-11 shrink-0 rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #00B4A6, #007A73)" }}>
          <Image
            src="/logo-mca.png"
            alt="MCA"
            fill
            style={{ objectFit: "contain", padding: "6px", filter: "brightness(0) invert(1)" }}
            priority
          />
        </div>
        <div className="leading-none">
          <p className="text-white text-[13px] font-bold tracking-wide">MCA Gestão</p>
          <p className="text-[9px] tracking-widest uppercase mt-0.5" style={{ color: "rgba(0,180,166,0.65)" }}>Carteira de Obras</p>
        </div>
      </div>

      {/* Separador visual */}
      <div className="mx-3 my-1 h-px bg-white/[0.06]" />

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-px overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-100 ${
                active
                  ? "text-white font-medium"
                  : "text-white/40 hover:bg-white/[0.06] hover:text-white/75"
              }`}
              style={active ? { background: "rgba(0,180,166,0.15)" } : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r-full" style={{ background: "#00B4A6" }} />
              )}
              <Icon
                size={15}
                stroke={active ? 2 : 1.5}
                className={`shrink-0`}
                style={active ? { color: "#00B4A6" } : undefined}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="shrink-0 border-t border-white/[0.06] px-2 py-2 space-y-px">
        <Link
          href="/configuracoes"
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] text-white/35 hover:bg-white/[0.06] hover:text-white/70 transition-colors"
        >
          <IconSettings size={15} stroke={1.5} />
          Configurações
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] text-white/35 hover:bg-white/[0.06] hover:text-white/70 transition-colors"
          >
            <IconLogout size={15} stroke={1.5} />
            Sair
          </button>
        </form>

        {userEmail && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 mt-1 border-t border-white/[0.06] pt-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(0,180,166,0.18)" }}>
              <span className="text-[9px] font-bold" style={{ color: "#00B4A6" }}>{initials}</span>
            </div>
            <span className="text-[11px] text-white/30 truncate">{userEmail}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
