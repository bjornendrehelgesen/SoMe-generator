import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { createSession, hashPassword, shouldBecomeAdmin } from "@/lib/auth";
import { countUsers, createUser, findUserByEmail } from "@/lib/store";
import { validateRegisterPayload } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = validateRegisterPayload(body);

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: "Denne e-postadressen er allerede registrert." },
        { status: 409 }
      );
    }

    const isFirstUser = countUsers() === 0;
    const role = isFirstUser || shouldBecomeAdmin(email) ? "admin" : "user";
    const user = createUser({
      name,
      email,
      passwordHash: hashPassword(password),
      role
    });

    if (!user) {
      throw new Error("Kunne ikke opprette bruker.");
    }

    await createSession(user.id);

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Ugyldig registreringsdata." },
        { status: 400 }
      );
    }

    console.error("Feil i /api/auth/register:", error);

    return NextResponse.json(
      { error: "Kunne ikke opprette bruker akkurat nå." },
      { status: 500 }
    );
  }
}
