"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconPencil,
  IconLayoutList,
  IconCalendar,
  IconCoin,
  IconAlertTriangle,
  IconMessage,
  IconUsers,
  IconSparkles,
  IconFileText,
  IconBuildingStore,
  IconGitPullRequest,
  IconNotes,
  IconClipboardCheck,
  IconUsersGroup,
  IconFlagCheck,
} from "@tabler/icons-react";

type TabItem =
  | { type: "tab"; href: string; label: string; icon: React.ElementType; accent?: boolean }
  | { type: "sep" };

interface ProjectTabBarProps {
  projetoId: string;
}

export function ProjectTabBar({ projetoId }: ProjectTabBarProps) {
  const pathname = usePathname();
  const base = `/projetos/${projetoId}`;

  const items: TabItem[] = [
    { type: "tab", href: base,                          label: "Dados",        icon: IconPencil         },
    { type: "sep" },
    { type: "tab", href: `${base}/escopo`,              label: "Escopo",       icon: IconLayoutList     },
    { type: "tab", href: `${base}/cronograma`,          label: "Cronograma",   icon: IconCalendar       },
    { type: "tab", href: `${base}/custos`,              label: "Custos",       icon: IconCoin           },
    { type: "sep" },
    { type: "tab", href: `${base}/riscos`,              label: "Riscos",       icon: IconAlertTriangle  },
    { type: "tab", href: `${base}/comunicacao`,         label: "Comunicação",  icon: IconMessage        },
    { type: "tab", href: `${base}/partes-interessadas`, label: "Stakeholders", icon: IconUsers          },
    { type: "tab", href: `${base}/qualidade`,           label: "Qualidade",    icon: IconClipboardCheck },
    { type: "tab", href: `${base}/recursos`,            label: "Recursos",     icon: IconUsersGroup     },
    { type: "tab", href: `${base}/aquisicoes`,          label: "Aquisições",   icon: IconBuildingStore  },
    { type: "tab", href: `${base}/mudancas`,            label: "Mudanças",     icon: IconGitPullRequest },
    { type: "tab", href: `${base}/atas`,                label: "Atas",         icon: IconNotes          },
    { type: "sep" },
    { type: "tab", href: `${base}/encerramento`,        label: "Encerramento", icon: IconFlagCheck      },
    { type: "sep" },
    { type: "tab", href: `${base}/documentos`,          label: "IA Docs",      icon: IconSparkles, accent: true },
    { type: "tab", href: `${base}/relatorio`,           label: "Relatório",    icon: IconFileText       },
  ];

  return (
    <div
      className="flex items-center px-5 overflow-x-auto"
      style={{ scrollbarWidth: "none" }}
    >
      {items.map((item, i) => {
        if (item.type === "sep") {
          return (
            <span
              key={`sep-${i}`}
              className="mx-1.5 w-px h-4 shrink-0"
              style={{ background: "#E9EBF0" }}
            />
          );
        }

        const { href, label, icon: Icon, accent } = item;
        const isExact = href === base;
        const active  = isExact ? pathname === base : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-1.5 px-2.5 py-2.5 text-[12px] font-medium whitespace-nowrap transition-colors shrink-0 border-b-2 ${
              active
                ? accent
                  ? "border-brand-500 text-brand-600"
                  : "border-[#0D2B45] text-text-primary"
                : "border-transparent text-text-disabled hover:text-text-secondary"
            }`}
          >
            <Icon
              size={13}
              stroke={active ? 2 : 1.5}
              className={accent && active ? "text-brand-500" : ""}
            />
            {label}
            {accent && (
              <span className="ml-0.5 text-[9px] font-bold text-brand-500 tracking-wider">IA</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
