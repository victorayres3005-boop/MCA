import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

interface PageTitleProps {
  title: string;
  eyebrow?: string;
  icon?: TablerIcon;
  action?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageTitle({ title, eyebrow, icon: Icon, action, backHref, backLabel }: PageTitleProps) {
  return (
    <div className="shrink-0 print:hidden flex items-center justify-between px-7 h-[56px] bg-white border-b-2 border-[#00B4A6]">
      <div className="flex items-center gap-3 min-w-0">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-0.5 text-[11.5px] text-text-disabled hover:text-text-secondary transition-colors shrink-0"
          >
            <IconChevronLeft size={13} />
            {backLabel ?? "Voltar"}
          </Link>
        ) : Icon ? (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#F0FBF9" }}
          >
            <Icon size={15} style={{ color: "#00B4A6" }} />
          </div>
        ) : null}

        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] leading-none mb-[5px]" style={{ color: "#00B4A6" }}>
              {eyebrow}
            </p>
          )}
          <h1 className="text-[15px] font-semibold text-[#0D2B45] tracking-tight leading-none truncate">
            {title}
          </h1>
        </div>
      </div>

      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  );
}
