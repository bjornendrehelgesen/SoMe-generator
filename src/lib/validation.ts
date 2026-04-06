import { z } from "zod";

import type {
  PromptStatus,
  PromptTemplate,
  PromptVisibility,
  RewriteField,
  RewriteRequest,
  RewriteResult,
  UserRole,
  UserStatus
} from "@/types/rewrite";

const MAX_INPUT_LENGTH = 5000;
const MAX_PROMPT_LENGTH = 8000;

const rewriteRequestSchema = z.object({
  text: z
    .string({ required_error: "Tekst mangler." })
    .trim()
    .min(1, "Skriv inn tekst før du lager forslag.")
    .max(MAX_INPUT_LENGTH, `Teksten kan ikke være lengre enn ${MAX_INPUT_LENGTH} tegn.`),
  target: z
    .enum(["facebook", "instagram", "linkedin", "imageText", "cta"])
    .optional(),
  results: z
    .object({
      facebook: z.string(),
      instagram: z.string(),
      linkedin: z.string(),
      imageText: z.string(),
      cta: z.string()
    })
    .optional(),
  customPrompt: z.string().max(MAX_PROMPT_LENGTH).optional()
});

const rewriteResultSchema = z.object({
  facebook: z.string(),
  instagram: z.string(),
  linkedin: z.string(),
  imageText: z.string().optional(),
  cta: z.string().optional()
});

const authPayloadSchema = z.object({
  name: z.string().trim().min(2, "Navn må være minst 2 tegn.").max(80).optional(),
  email: z.string().trim().email("Skriv inn en gyldig e-postadresse."),
  password: z
    .string()
    .min(8, "Passordet må være minst 8 tegn.")
    .max(200, "Passordet er for langt.")
});

const promptPayloadSchema = z.object({
  title: z.string().trim().min(2, "Tittel må være minst 2 tegn.").max(120),
  promptBody: z
    .string()
    .trim()
    .min(20, "Prompten må være minst 20 tegn.")
    .max(MAX_PROMPT_LENGTH),
  visibility: z.enum(["private", "public"])
});

const promptAdminSchema = z.object({
  visibility: z.enum(["private", "public"]).optional(),
  status: z.enum(["active", "hidden"]).optional()
});

const userAdminSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  status: z.enum(["active", "inactive"]).optional()
});

export function validateRewriteRequest(input: unknown): RewriteRequest {
  return rewriteRequestSchema.parse(input);
}

export function validateClientText(text: string): string | null {
  const parsed = rewriteRequestSchema.safeParse({ text });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Skriv inn tekst før du lager forslag.";
  }

  return null;
}

export function normalizeRewriteResult(input: unknown): RewriteResult {
  const parsed = rewriteResultSchema.parse(input);

  return {
    facebook: parsed.facebook.trim(),
    instagram: parsed.instagram.trim(),
    linkedin: parsed.linkedin.trim(),
    imageText: parsed.imageText?.trim() ?? "",
    cta: parsed.cta?.trim() ?? ""
  };
}

export function normalizePromptTemplate(
  input: PromptTemplate
): PromptTemplate {
  return {
    ...input,
    title: input.title.trim(),
    promptBody: input.promptBody.trim()
  };
}

export function isRewriteField(value: unknown): value is RewriteField {
  return ["facebook", "instagram", "linkedin", "imageText", "cta"].includes(
    String(value)
  );
}

export function isPromptVisibility(value: unknown): value is PromptVisibility {
  return value === "private" || value === "public";
}

export function isPromptStatus(value: unknown): value is PromptStatus {
  return value === "active" || value === "hidden";
}

export function isUserRole(value: unknown): value is UserRole {
  return value === "user" || value === "admin";
}

export function isUserStatus(value: unknown): value is UserStatus {
  return value === "active" || value === "inactive";
}

export function validateRegisterPayload(input: unknown) {
  const parsed = authPayloadSchema.extend({
    name: z.string().trim().min(2, "Navn må være minst 2 tegn.").max(80)
  });

  return parsed.parse(input);
}

export function validateLoginPayload(input: unknown) {
  return authPayloadSchema.omit({ name: true }).parse(input);
}

export function validatePromptPayload(input: unknown) {
  return promptPayloadSchema.parse(input);
}

export function validatePromptAdminPayload(input: unknown) {
  return promptAdminSchema.parse(input);
}

export function validateUserAdminPayload(input: unknown) {
  return userAdminSchema.parse(input);
}

export function isRewriteErrorResponse(
  value: unknown
): value is { error: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as { error?: unknown }).error === "string"
  );
}
