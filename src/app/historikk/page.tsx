import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import {
  getRewriteSessionByIdForUser,
  listRewriteSessionsForUser
} from "@/lib/store";

export default async function HistorikkPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const user = await requireUser();
  const history = listRewriteSessionsForUser(user.id);
  const params = await searchParams;
  const selectedSession = params.id
    ? getRewriteSessionByIdForUser(params.id, user.id)
    : history[0] ?? null;

  return (
    <AppShell user={user}>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[28px] border border-[#D1D3D4] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
          <h2 className="text-lg font-bold text-[#002B56]">Min historikk</h2>
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-[#6D6E71]">Ingen genereringer er lagret ennå.</p>
            ) : (
              history.map((item) => (
                <Link
                  key={item.id}
                  href={`/historikk?id=${item.id}`}
                  className={`block rounded-[22px] border p-4 transition ${
                    selectedSession?.id === item.id
                      ? "border-[#4382C3] bg-[#F4F8FB]"
                      : "border-[#E1E7ED] bg-[#F8FBFD]"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#6D6E71]">
                    {new Date(item.createdAt).toLocaleString("nb-NO")}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#414042]">
                    {item.inputText}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-[#D1D3D4] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
          <h2 className="text-lg font-bold text-[#002B56]">Detaljer</h2>
          {!selectedSession ? (
            <p className="mt-4 text-sm text-[#6D6E71]">Velg en historikkpost for å se detaljer.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <article className="rounded-[22px] border border-[#E1E7ED] bg-[#F8FBFD] p-4">
                <h3 className="font-bold text-[#002B56]">Originaltekst</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#414042]">
                  {selectedSession.inputText}
                </p>
              </article>
              <article className="rounded-[22px] border border-[#E1E7ED] bg-[#F8FBFD] p-4">
                <h3 className="font-bold text-[#002B56]">Prompt brukt</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#414042]">
                  {selectedSession.fullPrompt}
                </p>
              </article>
              <article className="rounded-[22px] border border-[#E1E7ED] bg-[#F8FBFD] p-4">
                <h3 className="font-bold text-[#002B56]">Resultater</h3>
                <div className="mt-3 space-y-3 text-sm leading-6 text-[#414042]">
                  <p><strong>Facebook:</strong> {selectedSession.generatedResult.facebook}</p>
                  <p><strong>Instagram:</strong> {selectedSession.generatedResult.instagram}</p>
                  <p><strong>LinkedIn:</strong> {selectedSession.generatedResult.linkedin}</p>
                  <p><strong>Kort tekst til bilde:</strong> {selectedSession.generatedResult.imageText || "Ingen"}</p>
                  <p><strong>CTA:</strong> {selectedSession.generatedResult.cta || "Ingen"}</p>
                </div>
              </article>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
