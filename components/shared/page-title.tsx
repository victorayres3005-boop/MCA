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
    <div className="bg-white border-b border-surface-border shrink-0">
      <div className="h-[3px] bg-brand-gradient" />
      <div className="flex items-center gap-2 px-6 h-11">
        {backHref && (
          <>
            <Link
              href={backHref}
              className="flex items-center gap-1 text-[12px] text-text-disabled hover:text-brand-700 transition-colors shrink-0"
            >
              <IconChevronLeft size={13} />
              {backLabel ?? "Voltar"}
            </Link>
            <span className="text-surface-border text-sm shrink-0">/</span>
          </>
        )}
        <h1 className="text-[14px] font-semibold text-text-primary truncate">{title}</h1>
        {description && (
          <span className="text-[12px] text-text-disabled shrink-0 hidden md:block">
            · {description}
          </span>
        )}
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </div>
    </div>
  );
}
