import { NextResponse } from "next/server";

import { AuthError, requireApiAdmin } from "@/lib/auth";
import { listUsers } from "@/lib/store";

export async function GET() {
  try {
    await requireApiAdmin();
    const users = listUsers();

    return NextResponse.json({ users });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Kunne ikke hente brukere." }, { status: 500 });
  }
}
