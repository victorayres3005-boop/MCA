import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-[9px] border-b border-[#F5F7F7]">
      <Skeleton className="w-[22px] h-[22px] rounded-[6px]" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-2.5 w-64 rounded" />
      </div>
      <div className="flex flex-col items-end gap-1.5 w-[88px]">
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-[3px] w-full rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-surface-border rounded-[10px] p-4 space-y-3">
      <Skeleton className="h-4 w-32 rounded" />
      <Skeleton className="h-3 w-48 rounded" />
      <Skeleton className="h-3 w-40 rounded" />
    </div>
  );
}
