"use client";

import { useState } from "react";

import { ResultsSection } from "@/components/ResultsSection";
import { StatusMessage } from "@/components/StatusMessage";
import { isRewriteErrorResponse, validateClientText } from "@/lib/validation";
import type { RewriteField, RewriteResult } from "@/types/rewrite";

export function RewriteForm() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<RewriteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRefreshField, setActiveRefreshField] = useState<RewriteField | null>(null);
  const [previousValues, setPreviousValues] = useState<Partial<Record<RewriteField, string>>>({});

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
        body: JSON.stringify({ text })
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        if (isRewriteErrorResponse(data)) {
          throw new Error(data.error);
        }

        throw new Error("Noe gikk galt. Prøv igjen.");
      }

      if (isRewriteErrorResponse(data)) {
        throw new Error(data.error);
      }

      setResults(data as RewriteResult);
      setStatus("Forslagene er klare.");
    } catch (submitError) {
      setResults(null);
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
    setError(null);
    setStatus(null);
    setActiveRefreshField(null);
    setPreviousValues({});
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
        body: JSON.stringify({ text, target: field, results })
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        if (isRewriteErrorResponse(data)) {
          throw new Error(data.error);
        }

        throw new Error("Noe gikk galt. Prøv igjen.");
      }

      if (isRewriteErrorResponse(data)) {
        throw new Error(data.error);
      }

      setPreviousValues((current) => ({
        ...current,
        [field]: results[field]
      }));
      setResults(data as RewriteResult);
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

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="rounded-[1.75rem] border border-[#D1D3D4] bg-white p-3 shadow-[0_18px_44px_-30px_rgba(0,43,86,0.22)]">
          <textarea
            id="rewrite-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Skriv eller lim inn teksten du vil tilpasse til ulike kanaler."
            className="min-h-36 w-full resize-y rounded-[1.25rem] border border-[#E1E7ED] bg-white px-5 py-4 text-base leading-7 text-[#414042] outline-none transition placeholder:text-[#939598] focus:border-[#4382C3] focus:ring-4 focus:ring-[#4382C3]/8"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-full bg-[#002B56] px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_-16px_rgba(0,43,86,0.8)] transition hover:-translate-y-0.5 hover:bg-[#01376c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4382C3]/25 disabled:cursor-not-allowed disabled:bg-[#A7A9AC] disabled:shadow-none"
          >
            {isLoading ? "Lager forslag..." : "Lag forslag"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading && !text}
            className="inline-flex items-center justify-center rounded-full border border-[#D1D3D4] bg-white px-6 py-3.5 text-sm font-bold text-[#414042] shadow-sm transition hover:-translate-y-0.5 hover:border-[#4382C3] hover:bg-[#F8FBFD] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4382C3]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tøm tekst
          </button>
        </div>
      </form>

      {error ? <StatusMessage message={error} tone="error" /> : null}
      {!error && status && isLoading ? (
        <StatusMessage
          message={status}
          tone="info"
        />
      ) : null}

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
