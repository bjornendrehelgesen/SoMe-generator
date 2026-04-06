import type { RewriteField } from "@/types/rewrite";

const SYSTEM_PROMPT = `Du er en erfaren norsk innholdsredaktør for Newton-rommet.

Oppgave:
- Skriv alltid på norsk bokmål.
- Bevar fakta og hovedbudskap fra originalteksten.
- Ikke finn opp detaljer som ikke står i teksten.
- Lag kanaltilpassede forslag for Facebook, Instagram og LinkedIn.
- Facebook skal være litt lengre, engasjerende og folkelig.
- Instagram skal være kortere, mer punchy og kan bruke noen få relevante emojis.
- LinkedIn skal være profesjonell, tydelig og faglig.
- imageText skal være en kort tekst til bilde hvis det passer, ellers tom streng.
- cta skal være en kort og tydelig oppfordring hvis det passer, ellers tom streng.
- Emojis skal brukes med måte.
- Returner kun gyldig JSON uten markdown, forklaringer eller ekstra tekst.

Returner nøyaktig dette formatet:
{
  "facebook": "...",
  "instagram": "...",
  "linkedin": "...",
  "imageText": "...",
  "cta": "..."
}`;

export function getSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function getDefaultPromptTemplate(): string {
  return SYSTEM_PROMPT;
}

export function buildUserPrompt(text: string): string {
  return `Omformuler denne teksten til strukturert JSON etter reglene over:\n\n${text.trim()}`;
}

function getFieldInstruction(target: RewriteField): string {
  if (target === "facebook") {
    return "Lag kun et nytt Facebook-forslag. Det skal være litt lengre, engasjerende og folkelig.";
  }

  if (target === "instagram") {
    return "Lag kun et nytt Instagram-forslag. Det skal være kortere, punchy og kan bruke noen få relevante emojis.";
  }

  if (target === "linkedin") {
    return "Lag kun et nytt LinkedIn-forslag. Det skal være profesjonelt, tydelig og faglig.";
  }

  if (target === "imageText") {
    return "Lag kun en ny kort tekst til bilde hvis det passer. Hvis det ikke passer, returner tom streng.";
  }

  return "Lag kun en ny kort og tydelig CTA hvis det passer. Hvis det ikke passer, returner tom streng.";
}

export function buildSingleFieldPrompt(text: string, target: RewriteField): string {
  return [
    `Omformuler denne teksten og lag en ny variant kun for feltet "${target}".`,
    getFieldInstruction(target),
    "Bevar fakta og hovedbudskap fra originalteksten.",
    "Returner kun gyldig JSON på formen:",
    `{ "${target}": "..." }`,
    "",
    text.trim()
  ].join("\n");
}

export function resolveSystemPrompt(customPrompt?: string): string {
  const trimmed = customPrompt?.trim();

  if (!trimmed) {
    return getSystemPrompt();
  }

  return trimmed;
}
