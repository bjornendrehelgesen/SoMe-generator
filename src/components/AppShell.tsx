import Link from "next/link";

import { LogoutButton } from "@/components/LogoutButton";
import type { User } from "@/types/rewrite";

type AppShellProps = {
  user: User;
  children: React.ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  const links = [
    { href: "/", label: "Generator" },
    { href: "/historikk", label: "Historikk" },
    { href: "/prompts", label: "Prompts" }
  ];

  if (user.role === "admin") {
    links.push({ href: "/admin", label: "Admin" });
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4">
        <header className="rounded-[28px] border border-[#D1D3D4] bg-white/95 p-4 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#6D6E71]">
                Innlogget som {user.name} ({user.role === "admin" ? "admin" : "bruker"})
              </p>
              <h1 className="mt-1 text-2xl font-bold text-[#002B56]">
                Newton SoMe-generator
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[#DCE7F0] bg-[#F7FBFD] px-4 py-2 text-sm font-medium text-[#002B56] transition hover:border-[#4382C3] hover:bg-white"
                >
                  {link.label}
                </Link>
              ))}
              <LogoutButton />
            </div>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
