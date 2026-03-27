import OpenAI from "openai";

import { buildUserPrompt, getSystemPrompt } from "@/lib/prompt";
import { normalizeRewriteResult } from "@/lib/validation";
import type { RewriteResult } from "@/types/rewrite";

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

export async function generateRewriteSuggestions(text: string): Promise<RewriteResult> {
  const client = getClient();

  const response = await client.responses.create({
    model: MODEL,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: getSystemPrompt() }]
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
