"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { IconPlus, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { MARCO_COLS } from "@/components/cronograma/marco-row";

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

export function InlineAddMarco({ action }: Props) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction}
      className="grid items-center gap-3 px-4 py-2 bg-surface-page/30 hover:bg-surface-page/60 transition-colors group"
      style={{ gridTemplateColumns: MARCO_COLS }}>
      <IconPlus size={12} className="text-text-disabled group-focus-within:text-brand-500 transition-colors" />
      <input
        ref={inputRef}
        name="nome"
        required
        placeholder="Novo marco…"
        className="text-[12px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-disabled py-1"
      />
      <input
        name="responsavel"
        placeholder="Responsável"
        className="text-[12px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-disabled py-1"
      />
      <input
        name="data_prevista"
        type="date"
        required
        className="text-[12px] bg-transparent border-none outline-none text-text-secondary py-1 w-full"
      />
      <span />
      <SubmitBtn />
    </form>
  );
}
