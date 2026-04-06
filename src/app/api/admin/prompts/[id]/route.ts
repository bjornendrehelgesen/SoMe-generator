import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthError, requireApiAdmin } from "@/lib/auth";
import { deletePromptTemplate, findPromptById, updatePromptTemplate } from "@/lib/store";
import { validatePromptAdminPayload } from "@/lib/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireApiAdmin();
    const { id } = await context.params;
    const existing = findPromptById(id);

    if (!existing) {
      return NextResponse.json({ error: "Fant ikke prompten." }, { status: 404 });
    }

    const payload = validatePromptAdminPayload(await request.json());
    const prompt = updatePromptTemplate(id, payload);

    return NextResponse.json({ prompt });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Ugyldig promptoppdatering." },
        { status: 400 }
      );
    }

    console.error("Feil i /api/admin/prompts/[id]:", error);
    return NextResponse.json({ error: "Kunne ikke oppdatere prompten." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireApiAdmin();
    const { id } = await context.params;
    const existing = findPromptById(id);

    if (!existing) {
      return NextResponse.json({ error: "Fant ikke prompten." }, { status: 404 });
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
