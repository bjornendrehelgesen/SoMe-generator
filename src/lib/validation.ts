import { z } from "zod";

import type { RewriteRequest, RewriteResult } from "@/types/rewrite";

const MAX_INPUT_LENGTH = 5000;

const rewriteRequestSchema = z.object({
  text: z
    .string({ required_error: "Tekst mangler." })
    .trim()
    .min(1, "Skriv inn tekst før du lager forslag.")
    .max(MAX_INPUT_LENGTH, `Teksten kan ikke være lengre enn ${MAX_INPUT_LENGTH} tegn.`)
});

const rewriteResultSchema = z.object({
  facebook: z.string(),
  instagram: z.string(),
  linkedin: z.string(),
  imageText: z.string().optional(),
  cta: z.string().optional()
});

export function validateRewriteRequest(input: unknown): RewriteRequest {
  return rewriteRequestSchema.parse(input);
}

export function validateClientText(text: string): string | null {
  const parsed = rewriteRequestSchema.safeParse({ text });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Skriv inn tekst før du lager forslag.";
  }

  return null;
}

export function normalizeRewriteResult(input: unknown): RewriteResult {
  const parsed = rewriteResultSchema.parse(input);

  return {
    facebook: parsed.facebook.trim(),
    instagram: parsed.instagram.trim(),
    linkedin: parsed.linkedin.trim(),
    imageText: parsed.imageText?.trim() ?? "",
    cta: parsed.cta?.trim() ?? ""
  };
}

export function isRewriteErrorResponse(
  value: unknown
): value is { error: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as { error?: unknown }).error === "string"
  );
}
