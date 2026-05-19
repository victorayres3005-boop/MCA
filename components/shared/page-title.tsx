import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";

interface PageTitleProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageTitle({ title, description, action, backHref, backLabel }: PageTitleProps) {
  return (
    <div
      className="shrink-0 print:hidden px-8 pt-6 pb-5"
      style={{ background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 40%, #0A7B72 75%, #00B4A6 100%)" }}
    >
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-white/80 transition-colors mb-2.5"
        >
          <IconChevronLeft size={12} />
          {backLabel ?? "Voltar"}
        </Link>
      )}
      <div className="flex items-end justify-between gap-4">
        <div>
          {description && (
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
              {description}
            </p>
          )}
          <h1 className="text-[22px] font-bold text-white tracking-tight leading-none">
            {title}
          </h1>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
