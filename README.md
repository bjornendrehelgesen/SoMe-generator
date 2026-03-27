# SoMe-generator

AI-basert MVP for Newton-rommet som gjør én grunntekst om til forslag for:

- Facebook
- Instagram
- LinkedIn
- kort tekst til bilde
- CTA

Appen er bygget som et enkelt verktøy med Next.js, TypeScript, Tailwind CSS og App Router. AI-kallet går via backend, slik at API-nøkler og systemprompt holdes på serversiden.

## Funksjoner

- ett tekstfelt for input
- generering av strukturert JSON-respons via backend
- egne resultatkort for hver kanal
- kopier-knapp per resultat
- loading state og tydelig feilhåndtering
- responsivt UI tilpasset Newton-uttrykket

## Teknologi

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Zod

## Kom i gang

1. Installer avhengigheter:

```bash
npm install
```

2. Opprett lokal miljøfil:

```bash
cp .env.example .env.local
```

3. Legg inn gyldig API-nøkkel i `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

4. Start utviklingsserver:

```bash
npm run dev
```

5. Åpne appen i nettleseren:

```text
http://localhost:3000
```

## Kjøring og verifisering

```bash
npm run lint
npm run build
```

## API

Backend-rute:

```text
POST /api/rewrite
```

Request:

```json
{
  "text": "Her er teksten brukeren vil omformulere"
}
```

Respons:

```json
{
  "facebook": "...",
  "instagram": "...",
  "linkedin": "...",
  "imageText": "...",
  "cta": "..."
}
```

Ved feil returneres:

```json
{
  "error": "Noe gikk galt. Prøv igjen."
}
```

## Struktur

```text
src/
  app/
    api/rewrite/route.ts
    layout.tsx
    page.tsx
  components/
    ResultCard.tsx
    ResultsSection.tsx
    RewriteForm.tsx
    StatusMessage.tsx
  lib/
    ai.ts
    prompt.ts
    validation.ts
  types/
    rewrite.ts
```

## Kildegrunnlag

Prosjektet er implementert med disse dokumentene som source of truth:

- `AGENTS.md`
- `FDS.md`
- `FSD.md`
- `IP.md`
- `docs/brand-guidelines.md`
