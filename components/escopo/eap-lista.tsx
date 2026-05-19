"use client";

import { useState, useTransition } from "react";
import { IconPlus, IconTrash, IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import { toast } from "sonner";
import { createEapItem, updateEapItem, deleteEapItem } from "@/app/actions/escopo";
import type { EapItem } from "@/lib/types";

// ─── Tree builder ─────────────────────────────────────────────────────────────
function buildTree(flat: EapItem[]): EapItem[] {
  const map = new Map<string, EapItem>();
  const roots: EapItem[] = [];
  flat.forEach((item) => map.set(item.id, { ...item, children: [] }));
  map.forEach((item) => {
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children!.push(item);
    } else {
      roots.push(item);
    }
  });
  return roots;
}

// ─── Inline add form ──────────────────────────────────────────────────────────
function AddItemForm({
  projetoId,
  parentId,
  nivel,
  nextOrdem,
  onDone,
}: {
  projetoId: string;
  parentId:  string | null;
  nivel:     number;
  nextOrdem: number;
  onDone:    () => void;
}) {
  const [codigo, setCodigo] = useState("");
  const [nome,   setNome]   = useState("");
  const [pending, start]    = useTransition();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!codigo.trim() || !nome.trim()) return;
    start(async () => {
      const result = await createEapItem(projetoId, {
        parent_id: parentId,
        codigo:    codigo.trim(),
        nome:      nome.trim(),
        nivel,
        ordem:     nextOrdem,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        onDone();
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 mt-1">
      <input
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="1.1"
        className="w-16 px-2 py-1 text-xs bg-surface-input border border-surface-border rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary"
      />
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do pacote de trabalho…"
        className="flex-1 px-2 py-1 text-xs bg-surface-input border border-surface-border rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary"
        autoFocus
      />
      <button
        type="submit"
        disabled={pending}
        className="px-3 py-1 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-medium rounded transition-colors"
      >
        {pending ? "…" : "Adicionar"}
      </button>
      <button
        type="button"
        onClick={onDone}
        className="px-2 py-1 text-xs text-text-secondary hover:text-text-primary"
      >
        Cancelar
      </button>
    </form>
  );
}

// ─── Single node ──────────────────────────────────────────────────────────────
function EapNode({
  item,
  projetoId,
  allItems,
}: {
  item:      EapItem;
  projetoId: string;
  allItems:  EapItem[];
}) {
  const [open,       setOpen]       = useState(true);
  const [adding,     setAdding]     = useState(false);
  const [editNome,   setEditNome]   = useState<string | null>(null);
  const [pending,    start]         = useTransition();

  const children     = item.children ?? [];
  const hasChildren  = children.length > 0;
  const nextOrdem    = allItems.filter((i) => i.parent_id === item.id).length;
  const indentCls    = item.nivel === 1 ? "" : item.nivel === 2 ? "ml-6" : item.nivel === 3 ? "ml-12" : "ml-16";

  async function handleDelete() {
    if (!confirm(`Remover "${item.nome}" e todos os subitens?`)) return;
    start(async () => {
      const result = await deleteEapItem(projetoId, item.id);
      if (result.error) toast.error(result.error);
    });
  }

  async function handleRename(e: React.FocusEvent<HTMLInputElement>) {
    const newNome = e.target.value.trim();
    if (!newNome || newNome === item.nome) { setEditNome(null); return; }
    start(async () => {
      const result = await updateEapItem(projetoId, item.id, { nome: newNome });
      if (result.error) toast.error(result.error);
      setEditNome(null);
    });
  }

  const levelColors: Record<number, string> = {
    1: "bg-navy-700 text-white",
    2: "bg-brand-500/10 text-brand-700 border border-brand-100",
    3: "bg-surface-input text-text-secondary border border-surface-border",
    4: "bg-white text-text-disabled border border-surface-border",
  };
  const badgeCls = levelColors[item.nivel] ?? levelColors[4];

  return (
    <div className={indentCls}>
      <div className="group flex items-center gap-2 py-1.5 rounded-lg hover:bg-surface-input/60 px-2 -mx-2">
        {/* expand / spacer */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-text-disabled hover:text-text-primary transition-colors w-4 shrink-0"
        >
          {hasChildren
            ? (open ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />)
            : <span className="w-4" />}
        </button>

        {/* badge code */}
        <span className={`text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded ${badgeCls} shrink-0`}>
          {item.codigo}
        </span>

        {/* name (inline editable) */}
        {editNome !== null ? (
          <input
            autoFocus
            defaultValue={item.nome}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Escape" && setEditNome(null)}
            className="flex-1 px-2 py-0.5 text-sm bg-surface-input border border-brand-500 rounded focus:outline-none text-text-primary"
          />
        ) : (
          <span
            onDoubleClick={() => setEditNome(item.nome)}
            className="flex-1 text-sm text-text-primary cursor-default select-none"
            title="Clique duplo para renomear"
          >
            {item.nome}
          </span>
        )}

        {/* actions (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {item.nivel < 4 && (
            <button
              type="button"
              onClick={() => { setAdding(true); setOpen(true); }}
              title="Adicionar subitem"
              className="p-1 text-text-disabled hover:text-brand-500 transition-colors"
            >
              <IconPlus size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            title="Remover"
            className="p-1 text-text-disabled hover:text-status-red transition-colors"
          >
            <IconTrash size={13} />
          </button>
        </div>
      </div>

      {/* children */}
      {open && children.length > 0 && (
        <div className="mt-0.5">
          {children.map((child) => (
            <EapNode key={child.id} item={child} projetoId={projetoId} allItems={allItems} />
          ))}
        </div>
      )}

      {/* inline add child form */}
      {adding && (
        <div className="ml-6">
          <AddItemForm
            projetoId={projetoId}
            parentId={item.id}
            nivel={item.nivel + 1}
            nextOrdem={nextOrdem}
            onDone={() => setAdding(false)}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main list ────────────────────────────────────────────────────────────────
interface EapListaProps {
  projetoId: string;
  itens:     EapItem[];
}

export function EapLista({ projetoId, itens }: EapListaProps) {
  const [addingRoot, setAddingRoot] = useState(false);
  const tree = buildTree(itens);

  return (
    <div>
      {tree.length === 0 && !addingRoot && (
        <div className="py-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-text-disabled">Nenhum elemento na EAP ainda.</p>
          <button
            type="button"
            onClick={() => setAddingRoot(true)}
            className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-700 font-medium"
          >
            <IconPlus size={14} />
            Adicionar primeiro elemento
          </button>
        </div>
      )}

      {tree.map((item) => (
        <EapNode key={item.id} item={item} projetoId={projetoId} allItems={itens} />
      ))}

      {/* Add root node */}
      {tree.length > 0 && !addingRoot && (
        <button
          type="button"
          onClick={() => setAddingRoot(true)}
          className="mt-3 flex items-center gap-1.5 text-xs text-text-disabled hover:text-brand-500 transition-colors"
        >
          <IconPlus size={13} />
          Adicionar elemento raiz
        </button>
      )}

      {addingRoot && (
        <div className="mt-2">
          <AddItemForm
            projetoId={projetoId}
            parentId={null}
            nivel={1}
            nextOrdem={tree.length}
            onDone={() => setAddingRoot(false)}
          />
        </div>
      )}
    </div>
  );
}
