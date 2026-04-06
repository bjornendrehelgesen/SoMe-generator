import { AdminPanel } from "@/components/AdminPanel";
import { AppShell } from "@/components/AppShell";
import { requireAdmin } from "@/lib/auth";
import { listAllPrompts, listUsers } from "@/lib/store";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const users = listUsers();
  const prompts = listAllPrompts();

  return (
    <AppShell user={admin}>
      <section className="space-y-4">
        <div className="rounded-[28px] border border-[#D1D3D4] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
          <h2 className="text-2xl font-bold text-[#002B56]">Admin</h2>
          <p className="mt-2 text-sm leading-6 text-[#6D6E71]">
            Administrer brukere, roller, kontostatus og delte prompts.
          </p>
        </div>
        <AdminPanel initialUsers={users} initialPrompts={prompts} />
      </section>
    </AppShell>
  );
}
