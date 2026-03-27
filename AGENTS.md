# AGENTS.md

## Prosjektmål
Dette repoet skal bygge en enkel MVP for AI-omformulering av tekster for Newton-rommet.

## Viktige kilder
Bruk disse dokumentene som source of truth:
- FDS.md
- FSD.md
- IP.md

## Teknostack
- Next.js
- TypeScript
- Tailwind CSS
- App Router

## Regler
- Ikke eksponer API-nøkler i frontend
- Hold systemprompt i backend
- Ikke legg til features som ikke er nødvendige for MVP
- Hold koden enkel, lesbar og vedlikeholdbar
- Bruk norsk bokmål der det er relevant i UI
- Foretrekk små, ryddige komponenter
- Bruk tydelige typer
- Håndter feil robust

## Forventet backend-format
```json
{
  "facebook": "...",
  "instagram": "...",
  "linkedin": "...",
  "imageText": "...",
  "cta": "..."
}