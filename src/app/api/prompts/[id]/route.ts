import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthError, requireApiUser } from "@/lib/auth";
import { deletePromptTemplate, findPromptById, updatePromptTemplate } from "@/lib/store";
import { validatePromptPayload } from "@/lib/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    const existing = findPromptById(id);

    if (!existing) {
      return NextResponse.json({ error: "Fant ikke prompten." }, { status: 404 });
    }

    if (existing.ownerId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Du har ikke tilgang til å endre denne prompten." }, { status: 403 });
    }

    const payload = validatePromptPayload(await request.json());
    const prompt = updatePromptTemplate(id, payload);

    return NextResponse.json({ prompt });
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

    console.error("Feil i /api/prompts/[id]:", error);
    return NextResponse.json({ error: "Kunne ikke oppdatere prompten." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    const existing = findPromptById(id);

    if (!existing) {
      return NextResponse.json({ error: "Fant ikke prompten." }, { status: 404 });
    }

    if (existing.ownerId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Du har ikke tilgang til å slette denne prompten." }, { status: 403 });
    }

    deletePromptTemplate(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Kunne ikke slette prompten." }, { status: 500 });
  }
}
