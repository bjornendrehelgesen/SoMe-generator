"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          mode === "register" ? { name, email, password } : { email, password }
        )
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Noe gikk galt.");
      }

      router.push("/");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Noe gikk galt."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" ? (
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-[#002B56]">
            Navn
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-[#D1D3D4] px-4 py-3 outline-none transition focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
            placeholder="Navnet ditt"
            disabled={isLoading}
          />
        </div>
      ) : null}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-[#002B56]">
          E-post
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-[#D1D3D4] px-4 py-3 outline-none transition focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
          placeholder="navn@newton.no"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-[#002B56]">
          Passord
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-[#D1D3D4] px-4 py-3 outline-none transition focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
          placeholder="Minst 8 tegn"
          disabled={isLoading}
        />
      </div>
      {error ? (
        <p className="rounded-2xl border border-[#F2C1BC] bg-[#FFF5F3] px-4 py-3 text-sm text-[#8D2C1F]">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#002B56] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#01376c] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? mode === "login"
            ? "Logger inn..."
            : "Oppretter konto..."
          : mode === "login"
            ? "Logg inn"
            : "Opprett konto"}
      </button>
    </form>
  );
}
