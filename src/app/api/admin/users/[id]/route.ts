import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AuthError, requireApiAdmin } from "@/lib/auth";
import { updateUserAdmin } from "@/lib/store";
import { validateUserAdminPayload } from "@/lib/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireApiAdmin();
    const { id } = await context.params;
    const payload = validateUserAdminPayload(await request.json());
    const user = updateUserAdmin(id, payload);

    if (!user) {
      return NextResponse.json({ error: "Fant ikke brukeren." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Ugyldig brukeroppdatering." },
        { status: 400 }
      );
    }

    console.error("Feil i /api/admin/users/[id]:", error);
    return NextResponse.json({ error: "Kunne ikke oppdatere brukeren." }, { status: 500 });
  }
}
