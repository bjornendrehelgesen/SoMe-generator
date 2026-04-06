import { NextResponse } from "next/server";

import { AuthError, requireApiAdmin } from "@/lib/auth";
import { listAllPrompts } from "@/lib/store";

export async function GET() {
  try {
    await requireApiAdmin();
    const prompts = listAllPrompts();

    return NextResponse.json({ prompts });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Kunne ikke hente prompts." }, { status: 500 });
  }
}
