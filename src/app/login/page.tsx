import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-[520px] rounded-[32px] border border-[#D1D3D4] bg-white p-6 shadow-[0_32px_80px_-36px_rgba(0,43,86,0.24)] sm:p-8">
        <h1 className="text-3xl font-bold text-[#002B56]">Logg inn</h1>
        <p className="mt-2 text-sm leading-6 text-[#6D6E71]">
          Bruk e-post og passord for å fortsette til generatoren.
        </p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <p className="mt-4 text-sm text-[#6D6E71]">
          Har du ikke konto?{" "}
          <Link href="/register" className="font-medium text-[#002B56] underline">
            Opprett konto
          </Link>
        </p>
      </div>
    </main>
  );
}
