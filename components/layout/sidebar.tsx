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
  { href: "/projetos",    label: "Carteira",    icon: IconLayoutDashboard },
  { href: "/clientes",    label: "Clientes",    icon: IconBuilding        },
  { href: "/contratadas", label: "Contratadas", icon: IconHelmet          },
];

interface SidebarProps {
  userEmail?: string;
}

export function Sidebar({ userEmail = "" }: SidebarProps) {
  const pathname = usePathname();
  const initials = userEmail ? userEmail[0].toUpperCase() : "U";

  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col h-screen"
      style={{ background: "#0D2B45", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 h-[60px] shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00B4A6, #007A73)" }}
        >
          <Image
            src="/logo-mca.png"
            alt="MCA"
            fill
            style={{ objectFit: "contain", padding: "5px", filter: "brightness(0) invert(1)" }}
            priority
          />
        </div>
        <div className="leading-none">
          <p className="text-white text-[13.5px] font-semibold tracking-tight">MCA Gestão</p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(0,180,166,0.6)" }}>
            Carteira de Obras
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-5">
        {/* Principal */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25 px-2 mb-2">
            Principal
          </p>
          <div className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-2 py-[7px] rounded-lg text-[13px] transition-all duration-100 ${
                    active
                      ? "font-medium text-white"
                      : "text-white/45 hover:bg-white/[0.05] hover:text-white/75"
                  }`}
                  style={active ? { background: "rgba(0,180,166,0.12)" } : undefined}
                >
                  <Icon
                    size={16}
                    stroke={active ? 2 : 1.5}
                    style={active ? { color: "#00B4A6" } : undefined}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sistema */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25 px-2 mb-2">
            Sistema
          </p>
          <div className="space-y-0.5">
            {[{ href: "/configuracoes", label: "Configurações", icon: IconSettings }].map(
              ({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-2 py-[7px] rounded-lg text-[13px] transition-all duration-100 ${
                      active
                        ? "font-medium text-white"
                        : "text-white/45 hover:bg-white/[0.05] hover:text-white/75"
                    }`}
                    style={active ? { background: "rgba(0,180,166,0.12)" } : undefined}
                  >
                    <Icon
                      size={16}
                      stroke={active ? 2 : 1.5}
                      style={active ? { color: "#00B4A6" } : undefined}
                    />
                    {label}
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </nav>

      {/* Rodapé */}
      <div
        className="shrink-0 px-3 py-3 space-y-0.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {userEmail && (
          <div className="flex items-center gap-2.5 px-2 py-[7px] rounded-lg">
            <div
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(0,180,166,0.18)" }}
            >
              <span className="text-[10px] font-bold" style={{ color: "#00B4A6" }}>{initials}</span>
            </div>
            <span className="text-[12px] text-white/40 truncate flex-1">{userEmail}</span>
          </div>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-2 py-[7px] rounded-lg text-[13px] text-white/35 hover:bg-white/[0.05] hover:text-white/65 transition-colors"
          >
            <IconLogout size={16} stroke={1.5} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
