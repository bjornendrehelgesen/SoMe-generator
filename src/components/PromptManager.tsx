"use client";

import { useState } from "react";

import type { PromptTemplate } from "@/types/rewrite";

type PromptManagerProps = {
  initialPrompts: PromptTemplate[];
  currentUserId: string;
};

export function PromptManager({ initialPrompts, currentUserId }: PromptManagerProps) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [promptBody, setPromptBody] = useState("");
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const response = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(data.error ?? "Kunne ikke slette prompten.");
      return;
    }

    setPrompts((current) => current.filter((prompt) => prompt.id !== id));
  }

  async function handleSave() {
    setError(null);

    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/prompts/${editingId}` : "/api/prompts";
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, promptBody, visibility })
    });

    const data = (await response.json()) as { prompt?: PromptTemplate; error?: string };

    if (!response.ok || !data.prompt) {
      setError(data.error ?? "Kunne ikke lagre prompten.");
      return;
    }

    setPrompts((current) => {
      const next = current.filter((prompt) => prompt.id !== data.prompt?.id);
      return [data.prompt as PromptTemplate, ...next];
    });
    setEditingId(null);
    setTitle("");
    setPromptBody("");
    setVisibility("private");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[28px] border border-[#D1D3D4] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
        <h2 className="text-lg font-bold text-[#002B56]">
          {editingId ? "Rediger prompt" : "Ny prompt"}
        </h2>
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Promptnavn"
            className="w-full rounded-2xl border border-[#D1D3D4] px-4 py-3 text-sm outline-none focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
          />
          <textarea
            value={promptBody}
            onChange={(event) => setPromptBody(event.target.value)}
            placeholder="Skriv hele prompten her"
            className="min-h-64 w-full resize-y rounded-[1.25rem] border border-[#D1D3D4] px-4 py-4 text-sm leading-6 outline-none focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
          />
          <select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value as "private" | "public")}
            className="rounded-2xl border border-[#D1D3D4] px-4 py-3 text-sm outline-none focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
          >
            <option value="private">Privat</option>
            <option value="public">Offentlig</option>
          </select>
          {error ? <p className="text-sm text-[#8D2C1F]">{error}</p> : null}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-[#002B56] px-5 py-3 text-sm font-bold text-white"
            >
              {editingId ? "Oppdater prompt" : "Lagre prompt"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setPromptBody("");
                  setVisibility("private");
                }}
                className="rounded-full border border-[#D1D3D4] px-5 py-3 text-sm font-medium text-[#414042]"
              >
                Avbryt
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#D1D3D4] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
        <h2 className="text-lg font-bold text-[#002B56]">Mine og delte prompts</h2>
        <div className="mt-4 space-y-3">
          {prompts.map((prompt) => {
            const canEdit = prompt.ownerId === currentUserId;

            return (
              <article key={prompt.id} className="rounded-[22px] border border-[#E1E7ED] bg-[#F8FBFD] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-[#002B56]">{prompt.title}</h3>
                    <p className="mt-1 text-sm text-[#6D6E71]">
                      Eier: {prompt.ownerName} · {prompt.visibility === "public" ? "Offentlig" : "Privat"}
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#414042]">
                      {prompt.promptBody}
                    </p>
                  </div>
                  {canEdit ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(prompt.id);
                          setTitle(prompt.title);
                          setPromptBody(prompt.promptBody);
                          setVisibility(prompt.visibility);
                        }}
                        className="rounded-full border border-[#D1D3D4] px-4 py-2 text-sm font-medium text-[#414042]"
                      >
                        Rediger
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(prompt.id)}
                        className="rounded-full border border-[#F2C1BC] px-4 py-2 text-sm font-medium text-[#8D2C1F]"
                      >
                        Slett
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
