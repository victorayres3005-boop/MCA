"use client";

import { cn } from "@/lib/utils";
import type { CorSemaforo } from "@/types";

const dotClasses: Record<CorSemaforo, string> = {
  verde:    "bg-green-500",
  amarelo:  "bg-amber-400",
  vermelho: "bg-red-500",
  roxo:     "bg-purple-500",
  cinza:    "bg-gray-400",
};

const bgClasses: Record<CorSemaforo, string> = {
  verde:    "bg-green-50 border-green-200",
  amarelo:  "bg-amber-50 border-amber-200",
  vermelho: "bg-red-50 border-red-200",
  roxo:     "bg-purple-50 border-purple-200",
  cinza:    "bg-gray-50 border-gray-200",
};

interface SemaforoProps {
  cor: CorSemaforo;
  label: string;
  tooltip?: string;
  className?: string;
}

export function Semaforo({ cor, label, tooltip, className }: SemaforoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium text-gray-700",
        bgClasses[cor],
        className
      )}
      title={tooltip}
    >
      <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", dotClasses[cor])} />
      {label}
    </div>
  );
}
