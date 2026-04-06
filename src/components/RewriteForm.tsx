"use client";

import { useMemo, useState } from "react";

import { ResultsSection } from "@/components/ResultsSection";
import { StatusMessage } from "@/components/StatusMessage";
import { getDefaultPromptTemplate } from "@/lib/prompt";
import { isRewriteErrorResponse, validateClientText } from "@/lib/validation";
import type {
  PromptTemplate,
  RewriteExecutionResponse,
  RewriteField,
  RewriteResult
} from "@/types/rewrite";

type RewriteFormProps = {
  availablePrompts: PromptTemplate[];
};

export function RewriteForm({ availablePrompts }: RewriteFormProps) {
  const [text, setText] = useState("");
  const [customPrompt, setCustomPrompt] = useState(getDefaultPromptTemplate());
  const [results, setResults] = useState<RewriteResult | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRefreshField, setActiveRefreshField] = useState<RewriteField | null>(null);
  const [previousValues, setPreviousValues] = useState<Partial<Record<RewriteField, string>>>({});
  const [promptTitle, setPromptTitle] = useState("");
  const [promptVisibility, setPromptVisibility] = useState<"private" | "public">("private");
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<PromptTemplate[]>(availablePrompts);

  const promptOptions = useMemo(
    () => savedPrompts.filter((prompt) => prompt.status === "active"),
    [savedPrompts]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateClientText(text);

    if (validationError) {
      setError(validationError);
      setStatus(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus("Lager forslag...");

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, customPrompt })
      });

      const data = (await response.json()) as RewriteExecutionResponse & { error?: string };

      if (!response.ok) {
        if (isRewriteErrorResponse(data)) {
          throw new Error(data.error);
        }

        throw new Error("Noe gikk galt. Prøv igjen.");
      }

      setResults(data.result);
      setSessionId(data.sessionId);
      setStatus("Forslagene er klare og lagret i historikken.");
    } catch (submitError) {
      setResults(null);
      setSessionId(null);
      setStatus(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Noe gikk galt. Prøv igjen."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setText("");
    setResults(null);
    setSessionId(null);
    setError(null);
    setStatus(null);
    setActiveRefreshField(null);
    setPreviousValues({});
    setCustomPrompt(getDefaultPromptTemplate());
  }

  async function handleRegenerate(field: RewriteField) {
    if (!results) {
      return;
    }

    const validationError = validateClientText(text);

    if (validationError) {
      setError(validationError);
      setStatus(null);
      return;
    }

    setActiveRefreshField(field);
    setError(null);
    setStatus(null);

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          target: field,
          results,
          sessionId,
          customPrompt
        })
      });

      const data = (await response.json()) as RewriteExecutionResponse & { error?: string };

      if (!response.ok) {
        if (isRewriteErrorResponse(data)) {
          throw new Error(data.error);
        }

        throw new Error("Noe gikk galt. Prøv igjen.");
      }

      setPreviousValues((current) => ({
        ...current,
        [field]: results[field]
      }));
      setResults(data.result);
      setSessionId(data.sessionId);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Kunne ikke lage nytt forslag akkurat nå. Prøv igjen."
      );
    } finally {
      setActiveRefreshField(null);
    }
  }

  function handleUndo(field: RewriteField) {
    const previousValue = previousValues[field];

    if (!results || previousValue === undefined) {
      return;
    }

    setResults({
      ...results,
      [field]: previousValue
    });
    setPreviousValues((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSavePrompt() {
    setIsSavingPrompt(true);
    setError(null);

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: promptTitle,
          promptBody: customPrompt,
          visibility: promptVisibility
        })
      });

      const data = (await response.json()) as { prompt?: PromptTemplate; error?: string };

      if (!response.ok || !data.prompt) {
        throw new Error(data.error ?? "Kunne ikke lagre prompten.");
      }

      setSavedPrompts((current) => [data.prompt as PromptTemplate, ...current]);
      setPromptTitle("");
      setPromptVisibility("private");
      setStatus("Prompten ble lagret.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Kunne ikke lagre prompten."
      );
    } finally {
      setIsSavingPrompt(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="rounded-[1.75rem] border border-[#D1D3D4] bg-white p-3 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.22)]">
            <textarea
              id="rewrite-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Skriv eller lim inn teksten du vil tilpasse til ulike kanaler."
              className="min-h-40 w-full resize-y rounded-[1.25rem] border border-[#E1E7ED] bg-white px-5 py-4 text-base leading-7 text-[#414042] outline-none transition placeholder:text-[#939598] focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/8"
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-full bg-[#002B56] px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_-16px_rgba(0,43,86,0.8)] transition hover:-translate-y-0.5 hover:bg-[#01376c] disabled:cursor-not-allowed disabled:bg-[#A7A9AC]"
            >
              {isLoading ? "Lager forslag..." : "Lag forslag"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-full border border-[#D1D3D4] bg-white px-6 py-3.5 text-sm font-bold text-[#414042] shadow-sm transition hover:-translate-y-0.5 hover:border-[#4382C3] hover:bg-[#F8FBFD]"
            >
              Nullstill
            </button>
          </div>
        </form>

        <section className="rounded-[1.75rem] border border-[#D1D3D4] bg-white p-4 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.2)]">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#002B56]">Prompteditor</h2>
              <p className="mt-1 text-sm text-[#6D6E71]">
                Rediger hele prompten, eller last inn en lagret variant.
              </p>
            </div>
            <select
              defaultValue=""
              onChange={(event) => {
                const selected = promptOptions.find((item) => item.id === event.target.value);
                if (selected) {
                  setCustomPrompt(selected.promptBody);
                  setPromptTitle(selected.title);
                  setPromptVisibility(selected.visibility);
                }
              }}
              className="w-full rounded-2xl border border-[#D1D3D4] px-4 py-3 text-sm outline-none focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
            >
              <option value="">Velg fra eget eller delt promptbibliotek</option>
              {promptOptions.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.title} · {prompt.ownerName}
                </option>
              ))}
            </select>
            <textarea
              value={customPrompt}
              onChange={(event) => setCustomPrompt(event.target.value)}
              className="min-h-64 w-full resize-y rounded-[1.25rem] border border-[#E1E7ED] bg-white px-4 py-4 text-sm leading-6 outline-none transition focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
            />
            <div className="flex flex-col gap-3">
              <input
                value={promptTitle}
                onChange={(event) => setPromptTitle(event.target.value)}
                placeholder="Navn på prompten du vil lagre"
                className="w-full rounded-2xl border border-[#D1D3D4] px-4 py-3 text-sm outline-none focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={promptVisibility}
                  onChange={(event) =>
                    setPromptVisibility(event.target.value as "private" | "public")
                  }
                  className="rounded-2xl border border-[#D1D3D4] px-4 py-3 text-sm outline-none focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/10"
                >
                  <option value="private">Privat</option>
                  <option value="public">Offentlig</option>
                </select>
                <button
                  type="button"
                  onClick={handleSavePrompt}
                  disabled={isSavingPrompt}
                  className="inline-flex items-center justify-center rounded-full border border-[#002B56] px-5 py-3 text-sm font-bold text-[#002B56] transition hover:bg-[#002B56] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingPrompt ? "Lagrer..." : "Lagre prompt"}
                </button>
                <button
                  type="button"
                  onClick={() => setCustomPrompt(getDefaultPromptTemplate())}
                  className="inline-flex items-center justify-center rounded-full border border-[#D1D3D4] px-5 py-3 text-sm font-medium text-[#414042] transition hover:border-[#4382C3] hover:text-[#002B56]"
                >
                  Tilbakestill standardprompt
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>

      {error ? <StatusMessage message={error} tone="error" /> : null}
      {!error && status ? <StatusMessage message={status} tone="info" /> : null}

      <ResultsSection
        results={results}
        activeRefreshField={activeRefreshField}
        canUndo={(field) => previousValues[field] !== undefined}
        onRegenerate={handleRegenerate}
        onUndo={handleUndo}
      />
    </div>
  );
}
