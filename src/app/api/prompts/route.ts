import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthError, requireApiUser } from "@/lib/auth";
import { createPromptTemplate, listPromptsVisibleToUser } from "@/lib/store";
import { validatePromptPayload } from "@/lib/validation";

export async function GET() {
  try {
    const user = await requireApiUser();
    const prompts = listPromptsVisibleToUser(user.id);

    return NextResponse.json({ prompts });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Kunne ikke hente prompts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await request.json();
    const payload = validatePromptPayload(body);
    const prompt = createPromptTemplate({
      ownerId: user.id,
      title: payload.title,
      promptBody: payload.promptBody,
      visibility: payload.visibility
    });

    return NextResponse.json({ prompt }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Ugyldig prompt." },
        { status: 400 }
      );
    }

    console.error("Feil i /api/prompts:", error);
    return NextResponse.json({ error: "Kunne ikke lagre prompten." }, { status: 500 });
  }
}
