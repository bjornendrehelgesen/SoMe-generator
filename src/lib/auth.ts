import crypto from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { findUserById } from "@/lib/store";
import type { User } from "@/types/rewrite";

const SESSION_COOKIE = "newton_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function getSecret() {
  return process.env.AUTH_SECRET ?? "dev-secret-change-me";
}

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signValue(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, storedValue] = storedHash.split(":");

  if (!salt || !storedValue) {
    return false;
  }

  const candidate = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(storedValue, "hex"));
}

export async function createSession(userId: string) {
  const payload = {
    userId,
    exp: Date.now() + SESSION_MAX_AGE * 1000
  };
  const value = encodeBase64Url(JSON.stringify(payload));
  const signed = `${value}.${signValue(value)}`;
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, signed, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/"
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

async function getSessionUserId() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;

  if (!raw) {
    return null;
  }

  const [payload, signature] = raw.split(".");

  if (!payload || !signature || signValue(payload) !== signature) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as {
      userId: string;
      exp: number;
    };

    if (!parsed.userId || parsed.exp < Date.now()) {
      return null;
    }

    return parsed.userId;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  return findUserById(userId);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user || user.status !== "active") {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    redirect("/");
  }

  return user;
}

export async function requireApiUser() {
  const user = await getCurrentUser();

  if (!user || user.status !== "active") {
    throw new AuthError("Du må være logget inn for å bruke denne funksjonen.", 401);
  }

  return user;
}

export async function requireApiAdmin() {
  const user = await requireApiUser();

  if (user.role !== "admin") {
    throw new AuthError("Du har ikke tilgang til denne funksjonen.", 403);
  }

  return user;
}

export function shouldBecomeAdmin(email: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.trim().toLowerCase());
}

export function getSafeUser(user: User): User {
  return user;
}
