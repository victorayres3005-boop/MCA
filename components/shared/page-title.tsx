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
      className="shrink-0 print:hidden flex items-center justify-between px-7 h-[56px]"
      style={{
        background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 50%, #0A7B72 80%, #00B4A6 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {backHref && (
          <>
            <Link
              href={backHref}
              className="inline-flex items-center gap-0.5 text-[11.5px] text-white/50 hover:text-white/80 transition-colors shrink-0"
            >
              <IconChevronLeft size={13} />
              {backLabel ?? "Voltar"}
            </Link>
            <span className="text-white/20 text-xs shrink-0">/</span>
          </>
        )}
        <div className="min-w-0">
          {description && (
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/30 leading-none mb-0.5">
              {description}
            </p>
          )}
          <h1 className="text-[15px] font-semibold text-white tracking-tight leading-none truncate">
            {title}
          </h1>
        </div>
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  );
}
