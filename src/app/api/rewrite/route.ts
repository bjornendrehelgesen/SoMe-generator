import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { generateRewriteSuggestions } from "@/lib/ai";
import { validateRewriteRequest } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = validateRewriteRequest(body);
    const result = await generateRewriteSuggestions(text);

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
