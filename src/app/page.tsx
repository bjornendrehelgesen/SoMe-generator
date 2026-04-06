import Image from "next/image";
import Link from "next/link";

import { AppShell } from "@/components/AppShell";
import { RewriteForm } from "@/components/RewriteForm";
import { getCurrentUser } from "@/lib/auth";
import { listPromptsVisibleToUser } from "@/lib/store";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-[1100px]">
          <section className="overflow-hidden rounded-[32px] border border-[#D1D3D4] bg-white shadow-[0_32px_80px_-36px_rgba(0,43,86,0.28)]">
            <div
              className="h-[110px]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,43,86,1) 0%, rgba(0,43,86,0.96) 72%, rgba(239,121,24,0.6) 100%)"
              }}
            />
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <Image
                src="/logo/Newton-logo_lang_farge_More.png"
                alt="Newton"
                width={220}
                height={58}
                priority
                className="h-auto w-[168px]"
              />
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-[#002B56]">
                Neste fase av SoMe-generatoren
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#6D6E71]">
                Logg inn for å generere innhold, lagre hele historikken din, jobbe med egne prompts
                og dele dem med andre brukere.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-full bg-[#002B56] px-6 py-3 text-sm font-bold text-white"
                >
                  Logg inn
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-[#D1D3D4] px-6 py-3 text-sm font-bold text-[#414042]"
                >
                  Opprett konto
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const prompts = listPromptsVisibleToUser(user.id);

  return (
    <AppShell user={user}>
      <section className="rounded-[32px] border border-[#D1D3D4] bg-white p-5 shadow-[0_32px_80px_-36px_rgba(0,43,86,0.18)] sm:p-6 lg:p-8">
        <div className="mb-5 max-w-3xl">
          <h2 className="text-[2rem] font-bold tracking-tight text-[#002B56] sm:text-[2.35rem]">
            Lag SoMe-forslag fra én tekst
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6D6E71] sm:text-base">
            Generer forslag, rediger hele prompten, lagre gode promptvarianter og bygg opp din
            egen historikk.
          </p>
        </div>
        <RewriteForm availablePrompts={prompts} />
      </section>
    </AppShell>
  );
}
