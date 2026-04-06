import { NextResponse } from "next/server";

import { AuthError, requireApiUser } from "@/lib/auth";
import { getRewriteSessionByIdForUser } from "@/lib/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser();
    const { id } = await context.params;
    const session = getRewriteSessionByIdForUser(id, user.id);

    if (!session) {
      return NextResponse.json({ error: "Fant ikke historikkposten." }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Kunne ikke hente historikkposten." }, { status: 500 });
  }
}
