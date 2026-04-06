import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createSession, verifyPassword } from "@/lib/auth";
import { findUserByEmail } from "@/lib/store";
import { validateLoginPayload } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = validateLoginPayload(body);
    const userRow = findUserByEmail(email);

    if (!userRow || !verifyPassword(password, userRow.password_hash)) {
      return NextResponse.json(
        { error: "Feil e-post eller passord." },
        { status: 401 }
      );
    }

    if (userRow.status !== "active") {
      return NextResponse.json(
        { error: "Kontoen er deaktivert. Kontakt administrator." },
        { status: 403 }
      );
    }

    await createSession(userRow.id);

    return NextResponse.json({
      user: {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        role: userRow.role,
        status: userRow.status,
        createdAt: userRow.created_at
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Ugyldig innlogging." },
        { status: 400 }
      );
    }

    console.error("Feil i /api/auth/login:", error);
    return NextResponse.json(
      { error: "Kunne ikke logge inn akkurat nå." },
      { status: 500 }
    );
  }
}
