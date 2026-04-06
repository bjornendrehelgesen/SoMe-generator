# SoMe-generator

AI-basert fase 2-løsning for Newton-rommet. Appen lar brukere logge inn, generere SoMe-forslag, lagre hele historikken sin, redigere AI-prompten og dele gode prompts med andre brukere.

## Funksjoner

- registrering, innlogging og utlogging
- generering av Facebook-, Instagram- og LinkedIn-forslag samt bildetekst og CTA
- reload og angre per resultatkort
- lagring av full historikk per bruker
- redigering av hele prompten i generatoren
- private og offentlige prompts
- adminflate for brukere og prompts

## Teknologi

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- SQLite via `better-sqlite3`
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
AUTH_SECRET=replace_with_a_long_random_secret
ADMIN_EMAILS=admin@example.com
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

## Viktige sider

- `/` generator for innlogget bruker
- `/login`
- `/register`
- `/historikk`
- `/prompts`
- `/admin`

## API

Viktigste ruter:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/rewrite`
- `GET /api/history`
- `GET /api/prompts`
- `GET /api/admin/users`

## Struktur

```text
src/
  app/
    admin/page.tsx
    api/rewrite/route.ts
    historikk/page.tsx
    layout.tsx
    login/page.tsx
    page.tsx
    prompts/page.tsx
    register/page.tsx
  components/
    AdminPanel.tsx
    AppShell.tsx
    AuthForm.tsx
    LogoutButton.tsx
    PromptManager.tsx
    ResultCard.tsx
    ResultsSection.tsx
    RewriteForm.tsx
    StatusMessage.tsx
  lib/
    auth.ts
    ai.ts
    db.ts
    prompt.ts
    store.ts
    validation.ts
  types/
    rewrite.ts
```

## Lokal data

SQLite-databasen lagres lokalt i `data/app.db`. Mappen er ignorert i git.

## Kildegrunnlag

Prosjektet er implementert med disse dokumentene som source of truth:

- `AGENTS.md`
- `FDS.md`
- `FSD.md`
- `IP.md`
- `docs/brand-guidelines.md`
