"use client";

import { useEffect, useState } from "react";
import type { RewriteField } from "@/types/rewrite";

type ResultCardProps = {
  title: string;
  content: string;
  copyLabel: string;
  accent: number;
  platform: RewriteField;
  variant?: "default" | "compact";
  isRefreshing: boolean;
  showUndo: boolean;
  onRegenerate: (field: RewriteField) => Promise<void>;
  onUndo: (field: RewriteField) => void;
};

const accentStyles = [
  "from-[#F7FBFD] to-white border-[#DCE7F0]",
  "from-[#F7FBFD] to-white border-[#DCE7F0]",
  "from-[#F7FBFD] to-white border-[#DCE7F0]",
  "from-[#F7FBFD] to-white border-[#DCE7F0]",
  "from-[#F7FBFD] to-white border-[#DCE7F0]"
];

export function ResultCard({
  title,
  content,
  copyLabel,
  accent,
  platform,
  variant = "default",
  isRefreshing,
  showUndo,
  onRegenerate,
  onUndo
}: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    if (!content) {
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function handleRegenerate() {
    await onRegenerate(platform);
  }

  const isCompact = variant === "compact";

  function PlatformIcon() {
    const iconClassName = isCompact ? "h-[16px] w-[16px]" : "h-[18px] w-[18px]";

    if (platform === "facebook") {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={iconClassName}>
          <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.5 1.6-1.5H16V5a16 16 0 0 0-1.9-.1c-2 0-3.4 1.2-3.4 3.6V11H8.5v3h2.2v7h2.8Z" />
        </svg>
      );
    }

    if (platform === "instagram") {
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.4" cy="6.7" r="1.2" fill="currentColor" />
        </svg>
      );
    }

    if (platform === "linkedin") {
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={iconClassName}>
          <path d="M6.2 8.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM4.8 19V10h2.8v9H4.8Zm4.5 0V10H12v1.3h.1c.4-.8 1.3-1.6 2.8-1.6 3 0 3.6 2 3.6 4.5V19h-2.8v-4.3c0-1 0-2.4-1.5-2.4s-1.8 1.1-1.8 2.3V19H9.3Z" />
        </svg>
      );
    }

    if (platform === "imageText") {
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
          <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" />
          <path d="m7 16 3.2-3.2a1 1 0 0 1 1.4 0L14 15l1.2-1.2a1 1 0 0 1 1.4 0L19 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClassName}>
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <article
      className={`flex h-full flex-col rounded-[1.75rem] border bg-gradient-to-br ${isCompact ? "p-4" : "p-5"} shadow-[0_18px_42px_-30px_rgba(0,43,86,0.18)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_56px_-30px_rgba(0,43,86,0.24)] ${accentStyles[accent % accentStyles.length]}`}
    >
      <div className={`flex items-start justify-between gap-4 ${isCompact ? "mb-2.5" : "mb-3"}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className={`flex ${isCompact ? "h-9 w-9" : "h-10 w-10"} shrink-0 items-center justify-center rounded-full border border-[#DCE7F0] bg-white/95 text-[#002B56] shadow-sm`}>
              <PlatformIcon />
            </div>
            <div className="min-w-0">
              <h3 className={`${isCompact ? "text-base" : "text-lg"} font-bold tracking-tight text-[#002B56]`}>
                {title}
              </h3>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showUndo ? (
            <button
              type="button"
              onClick={() => onUndo(platform)}
              aria-label={`Angre nytt forslag for ${title}`}
              className={`inline-flex items-center justify-center rounded-full border border-[#D1D3D4] bg-white/95 ${isCompact ? "h-9 w-9" : "h-10 w-10"} text-[#414042] shadow-sm transition hover:border-[#4382C3] hover:bg-white hover:text-[#002B56] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4382C3]/20`}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={isCompact ? "h-4 w-4" : "h-[18px] w-[18px]"}>
                <path d="M9 7 5 11l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 11h7a5 5 0 1 1 0 10h-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRefreshing}
            aria-label={`Lag nytt forslag for ${title}`}
            className={`inline-flex items-center justify-center rounded-full border border-[#D1D3D4] bg-white/95 ${isCompact ? "h-9 w-9" : "h-10 w-10"} text-[#414042] shadow-sm transition hover:border-[#4382C3] hover:bg-white hover:text-[#002B56] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4382C3]/20 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${isCompact ? "h-4 w-4" : "h-[18px] w-[18px]"} ${isRefreshing ? "animate-spin" : ""}`}>
              <path d="M20 12a8 8 0 1 1-2.3-5.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M20 4v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!content || isRefreshing}
            aria-label={copyLabel}
            className={`rounded-full border border-[#D1D3D4] bg-white/95 ${isCompact ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm"} font-medium text-[#414042] shadow-sm transition hover:border-[#4382C3] hover:bg-white hover:text-[#002B56] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4382C3]/20 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {copied ? "Kopiert" : "Kopier"}
          </button>
        </div>
      </div>
      <div className={`${isCompact ? "min-h-20 p-3.5 leading-6" : "min-h-28 p-4 leading-7"} whitespace-pre-wrap rounded-[1.25rem] border border-[#EEF1F4] bg-white/98 text-sm text-[#414042] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]`}>
        {content || "Ingen tekst tilgjengelig."}
      </div>
    </article>
  );
}
