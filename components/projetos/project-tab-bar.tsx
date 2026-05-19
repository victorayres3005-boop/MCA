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

interface Tab {
  href: string;
  label: string;
  icon: React.ElementType;
  accent?: boolean;
}

interface ProjectTabBarProps {
  projetoId: string;
}

export function ProjectTabBar({ projetoId }: ProjectTabBarProps) {
  const pathname = usePathname();
  const base = `/projetos/${projetoId}`;

  const tabs: Tab[] = [
    { href: base,                             label: "Dados",              icon: IconPencil        },
    { href: `${base}/escopo`,                 label: "Escopo & EAP",       icon: IconLayoutList    },
    { href: `${base}/cronograma`,             label: "Cronograma",         icon: IconCalendar      },
    { href: `${base}/custos`,                 label: "Custos",             icon: IconCoin          },
    { href: `${base}/riscos`,                 label: "Riscos",             icon: IconAlertTriangle },
    { href: `${base}/comunicacao`,            label: "Comunicação",        icon: IconMessage       },
    { href: `${base}/partes-interessadas`,    label: "Stakeholders",       icon: IconUsers          },
    { href: `${base}/qualidade`,              label: "Qualidade",          icon: IconClipboardCheck },
    { href: `${base}/recursos`,               label: "Recursos",           icon: IconUsersGroup     },
    { href: `${base}/aquisicoes`,             label: "Aquisições",         icon: IconBuildingStore  },
    { href: `${base}/mudancas`,               label: "Mudanças",           icon: IconGitPullRequest },
    { href: `${base}/atas`,                   label: "Atas",               icon: IconNotes          },
    { href: `${base}/encerramento`,           label: "Encerramento",       icon: IconFlagCheck      },
    { href: `${base}/documentos`,             label: "IA Docs",            icon: IconSparkles, accent: true },
    { href: `${base}/relatorio`,              label: "Relatório",          icon: IconFileText  },
  ];

  return (
    <div className="flex items-center gap-0.5 px-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {tabs.map(({ href, label, icon: Icon, accent }) => {
        const isExact = href === base;
        const active  = isExact ? pathname === base : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium whitespace-nowrap transition-colors shrink-0 border-b-2 ${
              active
                ? accent
                  ? "border-brand-500 text-brand-600"
                  : "border-navy-700 text-text-primary"
                : "border-transparent text-text-disabled hover:text-text-secondary hover:border-surface-border"
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
