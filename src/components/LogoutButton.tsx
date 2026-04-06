"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-full border border-[#D1D3D4] bg-white px-4 py-2 text-sm font-medium text-[#414042] shadow-sm transition hover:border-[#4382C3] hover:text-[#002B56] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Logger ut..." : "Logg ut"}
    </button>
  );
}
