import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ title, description, action, backHref, backLabel }: PageHeaderProps) {
  return (
    <div className="bg-brand-gradient px-8 py-5">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-xs text-white/55 hover:text-white/85 transition-colors mb-2"
        >
          <IconChevronLeft size={14} />
          {backLabel ?? "Voltar"}
        </Link>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-white/65 text-sm mt-0.5">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
