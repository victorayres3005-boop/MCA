"use client";

import { IconPrinter } from "@tabler/icons-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 px-4 py-2 bg-navy-700 hover:bg-navy-800 text-white text-[12px] font-semibold rounded-lg transition-colors"
    >
      <IconPrinter size={14} />
      Imprimir / Baixar PDF
    </button>
  );
}
