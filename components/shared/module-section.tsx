interface ModuleSectionProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

export function ModuleSection({
  title,
  description,
  badge,
  action,
  children,
  noPadding = false,
}: ModuleSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E9EBF0] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#E9EBF0] bg-[#FAFBFC]">
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-[#0D2B45] leading-none">{title}</p>
          {description && (
            <p className="text-[11px] text-text-disabled mt-1 leading-snug">{description}</p>
          )}
        </div>
        {badge !== undefined && (
          <span className="text-[11px] text-text-disabled shrink-0">{badge}</span>
        )}
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}

interface ModuleKpisProps {
  children: React.ReactNode;
}

export function ModuleKpis({ children }: ModuleKpisProps) {
  return (
    <div className="flex items-stretch bg-white rounded-2xl border border-[#E9EBF0] overflow-hidden divide-x divide-[#E9EBF0]">
      {children}
    </div>
  );
}

interface KpiCellProps {
  label: string;
  value: React.ReactNode;
  sub?: string;
  valueClassName?: string;
  flex?: number;
}

export function KpiCell({ label, value, sub, valueClassName = "text-[#0D2B45]", flex = 1 }: KpiCellProps) {
  return (
    <div className="px-5 py-4" style={{ flex }}>
      <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-[0.1em] mb-1.5">{label}</p>
      <div className={`text-[22px] font-bold tabular-nums leading-none ${valueClassName}`}>{value}</div>
      {sub && <p className="text-[11px] text-text-disabled mt-1">{sub}</p>}
    </div>
  );
}
