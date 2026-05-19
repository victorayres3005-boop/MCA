"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { IconPlus, IconCheck, IconLoader2 } from "@tabler/icons-react";
import type { CategoriaOrcamento } from "@/lib/types";

const CATS: { value: CategoriaOrcamento; label: string }[] = [
  { value: "material",    label: "Material"    },
  { value: "mao_de_obra", label: "Mão de obra" },
  { value: "equipamento", label: "Equipamento" },
  { value: "servico",     label: "Serviço"     },
  { value: "outro",       label: "Outro"       },
];

interface Props {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-brand-500 text-brand-500 hover:bg-brand-50 disabled:opacity-40 transition-colors ml-auto">
      {pending
        ? <IconLoader2 size={13} className="animate-spin" />
        : <IconCheck size={13} />}
    </button>
  );
}

export function InlineAddOrcamento({ action }: Props) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  const inp = "text-[12px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-disabled py-1 w-full";
  const sel = "text-[12px] bg-transparent border-none outline-none text-text-secondary py-1 w-full";

  return (
    <form ref={formRef} action={formAction}
      className="grid grid-cols-[16px_1fr_110px_120px_120px_80px] items-center gap-3 px-4 py-2 bg-surface-page/30 hover:bg-surface-page/60 transition-colors group">
      <IconPlus size={12} className="text-text-disabled group-focus-within:text-brand-500 transition-colors" />
      <input name="descricao" required placeholder="Novo item…" className={inp} />
      <select name="categoria" defaultValue="material" className={sel}>
        {CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
      <div className="relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[11px] text-text-disabled">R$</span>
        <input name="valor_planejado" type="number" step="0.01" min="0" required placeholder="0,00"
          className="pl-5 text-[12px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-disabled py-1 w-full" />
      </div>
      <div className="relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[11px] text-text-disabled">R$</span>
        <input name="valor_realizado" type="number" step="0.01" min="0" placeholder="realizado"
          className="pl-5 text-[12px] bg-transparent border-none outline-none text-text-secondary placeholder:text-text-disabled py-1 w-full" />
      </div>
      <SubmitBtn />
    </form>
  );
}
