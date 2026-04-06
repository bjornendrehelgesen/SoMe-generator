import { NextResponse } from "next/server";

import { AuthError, requireApiUser } from "@/lib/auth";
import { listRewriteSessionsForUser } from "@/lib/store";

export async function GET() {
  try {
    const user = await requireApiUser();
    const history = listRewriteSessionsForUser(user.id);

    return NextResponse.json({ history });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Kunne ikke hente historikk." }, { status: 500 });
  }
}
