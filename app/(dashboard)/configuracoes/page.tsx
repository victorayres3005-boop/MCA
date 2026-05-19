import { redirect } from "next/navigation";
import { IconSettings, IconUsers, IconBuilding } from "@tabler/icons-react";
import { getProfile, getOrg, getMembers, updateProfile, updateOrg } from "@/app/actions/configuracoes";
import { ProfileForm } from "@/components/configuracoes/profile-form";
import { OrgForm } from "@/components/configuracoes/org-form";
import { MembersTable } from "@/components/configuracoes/members-table";
import { PageTitle } from "@/components/shared/page-title";

function Card({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E9EBF0] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E9EBF0]">
        <Icon size={14} className="text-text-disabled" />
        <span className="text-[13px] font-semibold text-text-primary">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default async function ConfiguracoesPage() {
  const [profile, org, members] = await Promise.all([
    getProfile(),
    getOrg(),
    getMembers(),
  ]);

  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";
  const saveProfile = updateProfile;
  const saveOrg     = updateOrg;

  return (
    <>
      <PageTitle
        title="Configurações"
        eyebrow="Sistema"
        icon={IconSettings}
      />
      <div className="p-6 space-y-5 max-w-3xl">

      <div className="grid grid-cols-2 gap-5">
        {/* Perfil */}
        <Card title="Meu Perfil" icon={IconSettings}>
          <ProfileForm profile={profile} action={saveProfile} />
        </Card>

        {/* Organização */}
        <Card title="Organização" icon={IconBuilding}>
          {org ? (
            <OrgForm orgNome={org.nome} action={saveOrg} canEdit={isAdmin} />
          ) : (
            <p className="text-[12px] text-text-disabled italic">Organização não encontrada.</p>
          )}
        </Card>
      </div>

      {/* Membros — visível para todos, editável apenas por admin */}
      <Card title={`Membros da Organização · ${members.length}`} icon={IconUsers}>
        {members.length === 0 ? (
          <p className="text-[12px] text-text-disabled italic py-4 text-center">Nenhum membro encontrado.</p>
        ) : (
          <>
            {!isAdmin && (
              <p className="text-[11px] text-text-disabled mb-3 px-0.5">
                Apenas administradores podem alterar os papéis dos membros.
              </p>
            )}
            {isAdmin ? (
              <MembersTable members={members} currentUserId={profile.id} />
            ) : (
              <div className="divide-y divide-surface-border">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                      style={{ background: "linear-gradient(135deg, #00B4A6, #007A73)" }}>
                      {m.nome?.[0]?.toUpperCase() ?? m.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-text-primary truncate">
                        {m.nome || m.email}
                        {m.id === profile.id && <span className="ml-1.5 text-[10px] text-text-disabled">(você)</span>}
                      </p>
                      <p className="text-[11px] text-text-disabled truncate">{m.email}</p>
                    </div>
                    <span className="text-[11px] text-text-secondary capitalize">{m.role}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Card>

    </div>
    </>
  );
}
