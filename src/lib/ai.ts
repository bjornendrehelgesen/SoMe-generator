import OpenAI from "openai";

import {
  buildSingleFieldPrompt,
  buildUserPrompt,
  resolveSystemPrompt
} from "@/lib/prompt";
import { normalizeRewriteResult } from "@/lib/validation";
import type { RewriteField, RewriteResult } from "@/types/rewrite";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY mangler.");
  }

  return new OpenAI({ apiKey });
}

function extractJson(content: string): unknown {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("AI-responsen kunne ikke tolkes som JSON.");
    }

    return JSON.parse(match[0]);
  }
}

export async function generateRewriteSuggestions(
  text: string,
  customPrompt?: string
): Promise<RewriteResult> {
  const client = getClient();
  const systemPrompt = resolveSystemPrompt(customPrompt);

  const response = await client.responses.create({
    model: MODEL,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: systemPrompt }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: buildUserPrompt(text) }]
      }
    ]
  });

  const output = response.output_text;

  if (!output) {
    throw new Error("AI-tjenesten returnerte ikke noe innhold.");
  }

  return normalizeRewriteResult(extractJson(output));
}

export async function regenerateRewriteField(
  text: string,
  target: RewriteField,
  currentResults: RewriteResult,
  customPrompt?: string
): Promise<RewriteResult> {
  const client = getClient();
  const systemPrompt = resolveSystemPrompt(customPrompt);

  const response = await client.responses.create({
    model: MODEL,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: systemPrompt }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: buildSingleFieldPrompt(text, target) }]
      }
    ]
  });

  const output = response.output_text;

  if (!output) {
    throw new Error("AI-tjenesten returnerte ikke noe innhold.");
  }

  const parsed = extractJson(output);

  if (typeof parsed !== "object" || parsed === null || !(target in parsed)) {
    throw new Error("AI-responsen manglet feltet som skulle regenereres.");
  }

  const parsedRecord = parsed as Record<string, unknown>;
  const nextValue = parsedRecord[target];

  if (typeof nextValue !== "string") {
    throw new Error("AI-responsen hadde ugyldig format for regenerert felt.");
  }

  return {
    ...currentResults,
    [target]: nextValue.trim()
  };
}
