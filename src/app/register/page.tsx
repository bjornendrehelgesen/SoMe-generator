import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-[520px] rounded-[32px] border border-[#D1D3D4] bg-white p-6 shadow-[0_32px_80px_-36px_rgba(0,43,86,0.24)] sm:p-8">
        <h1 className="text-3xl font-bold text-[#002B56]">Opprett konto</h1>
        <p className="mt-2 text-sm leading-6 text-[#6D6E71]">
          Registrer deg for å lagre historikk, jobbe med prompts og dele dem med andre.
        </p>
        <div className="mt-6">
          <AuthForm mode="register" />
        </div>
        <p className="mt-4 text-sm text-[#6D6E71]">
          Har du allerede konto?{" "}
          <Link href="/login" className="font-medium text-[#002B56] underline">
            Logg inn
          </Link>
        </p>
      </div>
    </main>
  );
}
