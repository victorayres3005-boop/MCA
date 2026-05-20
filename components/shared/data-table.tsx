interface DataTableCol {
  label: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps {
  cols: string;
  headers: DataTableCol[];
  title?: string;
  badge?: string;
  children: React.ReactNode;
}

export function DataTable({ cols, headers, title, badge, children }: DataTableProps) {
  return (
    <div className="bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E9EBF0] bg-[#FAFBFC]">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            {title}
          </span>
          {badge && (
            <span className="text-[11px] text-text-disabled tabular-nums">{badge}</span>
          )}
        </div>
      )}
      <div
        className="grid items-center gap-3 px-4 py-2 border-b border-[#E9EBF0] bg-[#FAFBFC]"
        style={{ gridTemplateColumns: cols }}
      >
        {headers.map((h, i) => (
          <span
            key={i}
            className={`text-[10px] font-semibold text-text-disabled uppercase tracking-wider${
              h.align === "center" ? " text-center" :
              h.align === "right"  ? " text-right"  : ""
            }`}
          >
            {h.label}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}
