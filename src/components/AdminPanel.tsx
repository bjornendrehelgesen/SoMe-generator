"use client";

import { useState } from "react";

import type { PromptTemplate, User } from "@/types/rewrite";

type AdminPanelProps = {
  initialUsers: User[];
  initialPrompts: PromptTemplate[];
};

export function AdminPanel({ initialUsers, initialPrompts }: AdminPanelProps) {
  const [users, setUsers] = useState(initialUsers);
  const [prompts, setPrompts] = useState(initialPrompts);
  const [error, setError] = useState<string | null>(null);

  async function updateUser(id: string, role: User["role"], status: User["status"]) {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, status })
    });

    const data = (await response.json()) as { user?: User; error?: string };

    if (!response.ok || !data.user) {
      setError(data.error ?? "Kunne ikke oppdatere brukeren.");
      return;
    }

    setUsers((current) =>
      current.map((user) => (user.id === id ? data.user as User : user))
    );
  }

  async function updatePrompt(
    id: string,
    visibility: PromptTemplate["visibility"],
    status: PromptTemplate["status"]
  ) {
    const response = await fetch(`/api/admin/prompts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility, status })
    });

    const data = (await response.json()) as { prompt?: PromptTemplate; error?: string };

    if (!response.ok || !data.prompt) {
      setError(data.error ?? "Kunne ikke oppdatere prompten.");
      return;
    }

    setPrompts((current) =>
      current.map((prompt) => (prompt.id === id ? data.prompt as PromptTemplate : prompt))
    );
  }

  async function deletePrompt(id: string) {
    const response = await fetch(`/api/admin/prompts/${id}`, {
      method: "DELETE"
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(data.error ?? "Kunne ikke slette prompten.");
      return;
    }

    setPrompts((current) => current.filter((prompt) => prompt.id !== id));
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-2xl border border-[#F2C1BC] bg-[#FFF5F3] px-4 py-3 text-sm text-[#8D2C1F]">
          {error}
        </p>
      ) : null}
      <section className="rounded-[28px] border border-[#D1D3D4] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
        <h2 className="text-lg font-bold text-[#002B56]">Brukere</h2>
        <div className="mt-4 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-[22px] border border-[#E1E7ED] bg-[#F8FBFD] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold text-[#002B56]">{user.name}</h3>
                  <p className="text-sm text-[#6D6E71]">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    defaultValue={user.role}
                    onChange={(event) =>
                      updateUser(user.id, event.target.value as User["role"], user.status)
                    }
                    className="rounded-full border border-[#D1D3D4] px-4 py-2 text-sm"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <select
                    defaultValue={user.status}
                    onChange={(event) =>
                      updateUser(user.id, user.role, event.target.value as User["status"])
                    }
                    className="rounded-full border border-[#D1D3D4] px-4 py-2 text-sm"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[28px] border border-[#D1D3D4] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
        <h2 className="text-lg font-bold text-[#002B56]">Prompts</h2>
        <div className="mt-4 space-y-3">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="rounded-[22px] border border-[#E1E7ED] bg-[#F8FBFD] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="font-bold text-[#002B56]">{prompt.title}</h3>
                  <p className="text-sm text-[#6D6E71]">
                    {prompt.ownerName} · {prompt.visibility} · {prompt.status}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#414042]">
                    {prompt.promptBody}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    defaultValue={prompt.visibility}
                    onChange={(event) =>
                      updatePrompt(
                        prompt.id,
                        event.target.value as PromptTemplate["visibility"],
                        prompt.status
                      )
                    }
                    className="rounded-full border border-[#D1D3D4] px-4 py-2 text-sm"
                  >
                    <option value="private">private</option>
                    <option value="public">public</option>
                  </select>
                  <select
                    defaultValue={prompt.status}
                    onChange={(event) =>
                      updatePrompt(
                        prompt.id,
                        prompt.visibility,
                        event.target.value as PromptTemplate["status"]
                      )
                    }
                    className="rounded-full border border-[#D1D3D4] px-4 py-2 text-sm"
                  >
                    <option value="active">active</option>
                    <option value="hidden">hidden</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => deletePrompt(prompt.id)}
                    className="rounded-full border border-[#F2C1BC] px-4 py-2 text-sm font-medium text-[#8D2C1F]"
                  >
                    Slett
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
