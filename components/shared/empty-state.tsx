import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

interface EmptyStateProps {
  icon: TablerIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-input flex items-center justify-center mb-4">
        <Icon size={26} stroke={1.5} className="text-text-disabled" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-6 max-w-xs">{description}</p>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        <IconPlus size={16} />
        {actionLabel}
      </Link>
    </div>
  );
}
