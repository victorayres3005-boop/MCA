"use client";

import { useTransition } from "react";
import { updateMemberRole } from "@/app/actions/configuracoes";
import type { Profile, Role } from "@/lib/types";

const ROLE_OPTS: { value: Role; label: string }[] = [
  { value: "admin",        label: "Administrador" },
  { value: "gerente",      label: "Gerente"       },
  { value: "analista",     label: "Analista"      },
  { value: "visualizador", label: "Visualizador"  },
];

const ROLE_CLS: Record<Role, string> = {
  admin:        "bg-purple-50 text-purple-700 border-purple-200",
  gerente:      "bg-blue-50 text-blue-700 border-blue-100",
  analista:     "bg-teal-50 text-teal-700 border-teal-200",
  visualizador: "bg-gray-100 text-gray-500 border-gray-200",
};

interface MembersTableProps {
  members:       Profile[];
  currentUserId: string;
}

function MemberRow({ member, isSelf }: { member: Profile; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleRole(e: React.ChangeEvent<HTMLSelectElement>) {
    const role = e.target.value as Role;
    startTransition(async () => { await updateMemberRole(member.id, role); });
  }

  const initials = member.nome?.[0]?.toUpperCase() ?? member.email[0].toUpperCase();

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 border-b border-surface-border last:border-0 ${isPending ? "opacity-60" : ""}`}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #00B4A6, #007A73)" }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-text-primary truncate">
          {member.nome || member.email}
          {isSelf && <span className="ml-1.5 text-[10px] text-text-disabled">(você)</span>}
        </p>
        <p className="text-[11px] text-text-disabled truncate">{member.email}</p>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        {isSelf ? (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${ROLE_CLS[member.role]}`}>
            {ROLE_OPTS.find((o) => o.value === member.role)?.label}
          </span>
        ) : (
          <select
            value={member.role}
            onChange={handleRole}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border cursor-pointer appearance-none ${ROLE_CLS[member.role]}`}
          >
            {ROLE_OPTS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

export function MembersTable({ members, currentUserId }: MembersTableProps) {
  return (
    <div className="divide-y divide-surface-border">
      {members.map((m) => (
        <MemberRow key={m.id} member={m} isSelf={m.id === currentUserId} />
      ))}
    </div>
  );
}
