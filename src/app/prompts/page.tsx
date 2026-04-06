import { AppShell } from "@/components/AppShell";
import { PromptManager } from "@/components/PromptManager";
import { requireUser } from "@/lib/auth";
import { listPromptsVisibleToUser } from "@/lib/store";

export default async function PromptsPage() {
  const user = await requireUser();
  const prompts = listPromptsVisibleToUser(user.id);

  return (
    <AppShell user={user}>
      <section className="space-y-4">
        <div className="rounded-[28px] border border-[#D1D3D4] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
          <h2 className="text-2xl font-bold text-[#002B56]">Promptbibliotek</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6D6E71]">
            Lagre egne prompts, publiser gode varianter og bygg videre på det andre brukere deler.
          </p>
        </div>
        <PromptManager initialPrompts={prompts} currentUserId={user.id} />
      </section>
    </AppShell>
  );
}
