import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthError, requireApiUser } from "@/lib/auth";
import { generateRewriteSuggestions, regenerateRewriteField } from "@/lib/ai";
import { resolveSystemPrompt } from "@/lib/prompt";
import {
  createRewriteSession,
  getRewriteSessionByIdForUser,
  updateRewriteSession
} from "@/lib/store";
import { normalizeRewriteResult, validateRewriteRequest } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const { text, target, customPrompt } = validateRewriteRequest(body);
    const systemPrompt = resolveSystemPrompt(customPrompt);

    if (!target) {
      const result = await generateRewriteSuggestions(text, customPrompt);
      const session = createRewriteSession({
        userId: user.id,
        inputText: text,
        fullPrompt: systemPrompt,
        generatedResult: result
      });

      return NextResponse.json({
        result,
        sessionId: session?.id ?? ""
      });
    }

    const currentResults = normalizeRewriteResult(body.results);
    const result = await regenerateRewriteField(text, target, currentResults, customPrompt);
    const sessionId =
      typeof body.sessionId === "string" ? body.sessionId : null;

    let session = null;

    if (sessionId && getRewriteSessionByIdForUser(sessionId, user.id)) {
      session = updateRewriteSession(sessionId, user.id, result);
    } else {
      session = createRewriteSession({
        userId: user.id,
        inputText: text,
        fullPrompt: systemPrompt,
        generatedResult: result
      });
    }

    return NextResponse.json({
      result,
      sessionId: session?.id ?? sessionId ?? ""
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

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
