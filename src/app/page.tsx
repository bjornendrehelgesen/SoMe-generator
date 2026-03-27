import Image from "next/image";

import { RewriteForm } from "@/components/RewriteForm";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[16rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(255,255,255,0))]" />
      <div className="mx-auto max-w-[1180px]">
        <section className="relative overflow-hidden rounded-[32px] border border-[#D1D3D4] bg-white shadow-[0_32px_80px_-36px_rgba(0,43,86,0.28)]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[110px] opacity-[0.98]"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,43,86,1) 0%, rgba(0,43,86,0.96) 72%, rgba(239,121,24,0.6) 100%)"
            }}
          />
          <div className="pointer-events-none absolute right-[-90px] top-[-50px] h-44 w-44 rounded-full bg-white/10 blur-3xl" />

          <div className="relative px-5 pb-5 pt-4 sm:px-8 sm:pb-6 sm:pt-5 lg:px-10 lg:pb-8">
            <header className="flex items-center justify-between gap-4">
              <div className="rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_14px_30px_-22px_rgba(0,43,86,0.25)] ring-1 ring-[#E6E7E8]">
                <Image
                  src="/logo/Newton-logo_lang_farge_More.png"
                  alt="Newton"
                  width={220}
                  height={58}
                  priority
                  className="h-auto w-[132px] sm:w-[168px]"
                />
              </div>
              <div className="hidden rounded-full border border-[#DCE7F0] bg-[#F7FBFD] px-3 py-1.5 text-sm font-medium text-[#002B56] sm:block">
                AI-verktøy for SoMe
              </div>
            </header>

            <div className="mt-6 max-w-3xl sm:mt-7">
              <h1 className="text-[2rem] font-bold tracking-tight text-[#002B56] sm:text-[2.35rem]">
                Lag SoMe-forslag fra én tekst
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6D6E71] sm:text-base">
                Skriv inn teksten din og få forslag til Facebook, Instagram,
                LinkedIn, bildetekst og CTA.
              </p>
            </div>

            <div className="relative mt-3 rounded-[28px] border border-[#C9D5E1] bg-[#F4F8FB] p-5 shadow-[0_20px_44px_-28px_rgba(0,43,86,0.16)] sm:mt-4 sm:p-6 lg:p-8">
              <RewriteForm />
            </div>
          </div>
        </section>

        <footer className="px-4 py-6 text-center sm:py-7">
          <p className="text-xs font-medium tracking-[0.08em] text-[#808285]">
            VibeCodet av Newton Møre
          </p>
        </footer>
      </div>
    </main>
  );
}
