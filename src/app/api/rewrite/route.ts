import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateRewriteSuggestions, regenerateRewriteField } from "@/lib/ai";
import { normalizeRewriteResult, validateRewriteRequest } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, target } = validateRewriteRequest(body);

    if (!target) {
      const result = await generateRewriteSuggestions(text);
      return NextResponse.json(result);
    }

    const currentResults = normalizeRewriteResult(body.results);

    const result = await regenerateRewriteField(text, target, currentResults);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "Ugyldig forespørsel."
        },
        { status: 400 }
      );
    }

    console.error("Feil i /api/rewrite:", error);

    return NextResponse.json(
      {
        error: "Kunne ikke lage forslag akkurat nå. Prøv igjen."
      },
      { status: 500 }
    );
  }
}
