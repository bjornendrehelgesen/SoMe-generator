import crypto from "node:crypto";

import { getDb } from "@/lib/db";
import type {
  PromptStatus,
  PromptTemplate,
  PromptVisibility,
  RewriteResult,
  RewriteSession,
  User,
  UserRole,
  UserStatus
} from "@/types/rewrite";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
};

type PromptRow = {
  id: string;
  owner_id: string;
  owner_name: string;
  title: string;
  prompt_body: string;
  visibility: PromptVisibility;
  status: PromptStatus;
  created_at: string;
  updated_at: string;
};

type SessionRow = {
  id: string;
  user_id: string;
  input_text: string;
  full_prompt: string;
  generated_result: string;
  created_at: string;
  updated_at: string;
};

function makeId() {
  return crypto.randomUUID();
}

function nowIso() {
  return new Date().toISOString();
}

function mapUser(row: UserRow | undefined | null): User | null {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.created_at
  };
}

function mapPrompt(row: PromptRow): PromptTemplate {
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    title: row.title,
    promptBody: row.prompt_body,
    visibility: row.visibility,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSession(row: SessionRow): RewriteSession {
  return {
    id: row.id,
    userId: row.user_id,
    inputText: row.input_text,
    fullPrompt: row.full_prompt,
    generatedResult: JSON.parse(row.generated_result) as RewriteResult,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function countUsers() {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  return row.count;
}

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}) {
  const db = getDb();
  const id = makeId();
  const createdAt = nowIso();

  db.prepare(
    `
      INSERT INTO users (id, name, email, password_hash, role, status, created_at)
      VALUES (@id, @name, @email, @passwordHash, @role, 'active', @createdAt)
    `
  ).run({
    id,
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    role: input.role,
    createdAt
  });

  return findUserById(id);
}

export function findUserByEmail(email: string) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as UserRow | undefined;

  return row;
}

export function findUserById(id: string) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
  return mapUser(row);
}

export function listUsers() {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM users ORDER BY created_at ASC")
    .all() as UserRow[];

  return rows.map((row) => mapUser(row)).filter(Boolean) as User[];
}

export function updateUserAdmin(id: string, input: { role?: UserRole; status?: UserStatus }) {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;

  if (!existing) {
    return null;
  }

  db.prepare(
    `
      UPDATE users
      SET role = @role, status = @status
      WHERE id = @id
    `
  ).run({
    id,
    role: input.role ?? existing.role,
    status: input.status ?? existing.status
  });

  return findUserById(id);
}

export function createPromptTemplate(input: {
  ownerId: string;
  title: string;
  promptBody: string;
  visibility: PromptVisibility;
}) {
  const db = getDb();
  const id = makeId();
  const timestamp = nowIso();

  db.prepare(
    `
      INSERT INTO prompt_templates (
        id, owner_id, title, prompt_body, visibility, status, created_at, updated_at
      ) VALUES (
        @id, @ownerId, @title, @promptBody, @visibility, 'active', @timestamp, @timestamp
      )
    `
  ).run({
    id,
    ownerId: input.ownerId,
    title: input.title,
    promptBody: input.promptBody,
    visibility: input.visibility,
    timestamp
  });

  return findPromptById(id);
}

export function listPromptsVisibleToUser(userId: string) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT p.*, u.name as owner_name
        FROM prompt_templates p
        JOIN users u ON u.id = p.owner_id
        WHERE p.status = 'active'
          AND (p.owner_id = @userId OR p.visibility = 'public')
        ORDER BY p.updated_at DESC
      `
    )
    .all({ userId }) as PromptRow[];

  return rows.map(mapPrompt);
}

export function listAllPrompts() {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT p.*, u.name as owner_name
        FROM prompt_templates p
        JOIN users u ON u.id = p.owner_id
        ORDER BY p.updated_at DESC
      `
    )
    .all() as PromptRow[];

  return rows.map(mapPrompt);
}

export function findPromptById(id: string) {
  const db = getDb();
  const row = db
    .prepare(
      `
        SELECT p.*, u.name as owner_name
        FROM prompt_templates p
        JOIN users u ON u.id = p.owner_id
        WHERE p.id = ?
      `
    )
    .get(id) as PromptRow | undefined;

  return row ? mapPrompt(row) : null;
}

export function updatePromptTemplate(
  id: string,
  input: Partial<{
    title: string;
    promptBody: string;
    visibility: PromptVisibility;
    status: PromptStatus;
  }>
) {
  const existing = findPromptById(id);

  if (!existing) {
    return null;
  }

  const db = getDb();
  db.prepare(
    `
      UPDATE prompt_templates
      SET title = @title,
          prompt_body = @promptBody,
          visibility = @visibility,
          status = @status,
          updated_at = @updatedAt
      WHERE id = @id
    `
  ).run({
    id,
    title: input.title ?? existing.title,
    promptBody: input.promptBody ?? existing.promptBody,
    visibility: input.visibility ?? existing.visibility,
    status: input.status ?? existing.status,
    updatedAt: nowIso()
  });

  return findPromptById(id);
}

export function deletePromptTemplate(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM prompt_templates WHERE id = ?").run(id);
}

export function createRewriteSession(input: {
  userId: string;
  inputText: string;
  fullPrompt: string;
  generatedResult: RewriteResult;
}) {
  const db = getDb();
  const id = makeId();
  const timestamp = nowIso();

  db.prepare(
    `
      INSERT INTO rewrite_sessions (
        id, user_id, input_text, full_prompt, generated_result, created_at, updated_at
      ) VALUES (
        @id, @userId, @inputText, @fullPrompt, @generatedResult, @timestamp, @timestamp
      )
    `
  ).run({
    id,
    userId: input.userId,
    inputText: input.inputText,
    fullPrompt: input.fullPrompt,
    generatedResult: JSON.stringify(input.generatedResult),
    timestamp
  });

  return getRewriteSessionByIdForUser(id, input.userId);
}

export function updateRewriteSession(id: string, userId: string, generatedResult: RewriteResult) {
  const db = getDb();
  db.prepare(
    `
      UPDATE rewrite_sessions
      SET generated_result = @generatedResult,
          updated_at = @updatedAt
      WHERE id = @id AND user_id = @userId
    `
  ).run({
    id,
    userId,
    generatedResult: JSON.stringify(generatedResult),
    updatedAt: nowIso()
  });

  return getRewriteSessionByIdForUser(id, userId);
}

export function listRewriteSessionsForUser(userId: string) {
  const db = getDb();
  const rows = db
    .prepare(
      `
        SELECT * FROM rewrite_sessions
        WHERE user_id = ?
        ORDER BY created_at DESC
      `
    )
    .all(userId) as SessionRow[];

  return rows.map(mapSession);
}

export function getRewriteSessionByIdForUser(id: string, userId: string) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM rewrite_sessions WHERE id = ? AND user_id = ?")
    .get(id, userId) as SessionRow | undefined;

  return row ? mapSession(row) : null;
}
