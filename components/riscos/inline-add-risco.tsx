"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { IconPlus, IconCheck, IconLoader2 } from "@tabler/icons-react";
import type { CategoriaRisco } from "@/lib/types";

const CATS: { value: CategoriaRisco; label: string }[] = [
  { value: "tecnico",        label: "Técnico"        },
  { value: "externo",        label: "Externo"        },
  { value: "organizacional", label: "Organizacional" },
  { value: "cronograma",     label: "Cronograma"     },
  { value: "custo",          label: "Custo"          },
  { value: "outro",          label: "Outro"          },
];

const ESCALA_P = [
  { value: 1, label: "P1 — Muito baixa" },
  { value: 2, label: "P2 — Baixa"       },
  { value: 3, label: "P3 — Moderada"    },
  { value: 4, label: "P4 — Alta"        },
  { value: 5, label: "P5 — Muito alta"  },
];

const ESCALA_I = [
  { value: 1, label: "I1 — Muito baixo" },
  { value: 2, label: "I2 — Baixo"       },
  { value: 3, label: "I3 — Moderado"    },
  { value: 4, label: "I4 — Alto"        },
  { value: 5, label: "I5 — Muito alto"  },
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

export function InlineAddRisco({ action }: Props) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  const sel = "text-[11px] bg-transparent border-none outline-none text-text-secondary py-1 w-full appearance-none cursor-pointer";

  return (
    <form ref={formRef} action={formAction}
      className="grid items-center gap-3 px-4 py-2 bg-surface-page/30 hover:bg-surface-page/60 transition-colors group"
      style={{ gridTemplateColumns: "8px 1fr 90px 48px 48px 80px 90px 32px" }}>
      <IconPlus size={12} className="text-text-disabled group-focus-within:text-brand-500 transition-colors" />
      <input name="descricao" required placeholder="Descrever o risco…"
        className="text-[12px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-disabled py-1 min-w-0" />
      <select name="categoria" defaultValue="tecnico" className={sel}>
        {CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
      <select name="probabilidade" defaultValue="3" className={sel}>
        {ESCALA_P.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
      </select>
      <select name="impacto" defaultValue="3" className={sel}>
        {ESCALA_I.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
      </select>
      <span /><span />
      <SubmitBtn />
    </form>
  );
}
