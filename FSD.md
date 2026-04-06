FSD – Teknisk løsningsbeskrivelse for fase 2

1. Dokumentinformasjon

Prosjektnavn: AI-omformuleringsverktøy for Newton-rommet
Dokumenttype: FSD
Versjon: 2.0
Status: Aktiv
Språk: Norsk bokmål

⸻

2. Teknisk retning

Fase 2 utvider løsningen fra en stateless MVP til en applikasjon med persistens, autentisering og administrasjon.

Løsningen består nå av:
	1.	Frontend i Next.js App Router
	2.	Backend-ruter i Next.js Route Handlers
	3.	AI-integrasjon via OpenAI på serversiden
	4.	Lokal SQLite-database for brukere, historikk og prompts
	5.	Session-basert autentisering via HTTP-only cookie

⸻

3. Arkitektur

Logisk flyt

Bruker
  ↓
Frontend-sider (`/`, `/historikk`, `/prompts`, `/admin`)
  ↓
Beskyttede API-ruter
  ↓
SQLite-datalag + AI-tjeneste
  ↓
Strukturert respons tilbake til UI

Brukeren kommuniserer fortsatt aldri direkte med AI-leverandøren.

⸻

4. Informasjonsarkitektur

Sider
	•	`/` – innlogget generator og prompteditor
	•	`/login` – innlogging
	•	`/register` – registrering
	•	`/historikk` – brukerens historikk
	•	`/prompts` – egne og delte prompts
	•	`/admin` – adminflate for brukere og prompts

API-ruter
	•	`POST /api/auth/register`
	•	`POST /api/auth/login`
	•	`POST /api/auth/logout`
	•	`POST /api/rewrite`
	•	`GET /api/history`
	•	`GET /api/history/:id`
	•	`GET /api/prompts`
	•	`POST /api/prompts`
	•	`PATCH /api/prompts/:id`
	•	`DELETE /api/prompts/:id`
	•	`GET /api/admin/users`
	•	`PATCH /api/admin/users/:id`
	•	`GET /api/admin/prompts`
	•	`PATCH /api/admin/prompts/:id`
	•	`DELETE /api/admin/prompts/:id`

⸻

5. Datamodell

`User`
	•	id
	•	name
	•	email
	•	passwordHash
	•	role (`user` | `admin`)
	•	status (`active` | `inactive`)
	•	createdAt

`RewriteSession`
	•	id
	•	userId
	•	inputText
	•	fullPrompt
	•	generatedResult
	•	createdAt
	•	updatedAt

`PromptTemplate`
	•	id
	•	ownerId
	•	title
	•	promptBody
	•	visibility (`private` | `public`)
	•	status (`active` | `hidden`)
	•	createdAt
	•	updatedAt

`generatedResult`
	•	facebook
	•	instagram
	•	linkedin
	•	imageText
	•	cta

⸻

6. Autentisering og autorisasjon

Autentisering
	•	e-post + passord
	•	passord hashes på serversiden
	•	session lagres i signert HTTP-only cookie

Autorisasjon
	•	vanlige sider og API-er krever innlogget bruker
	•	adminruter krever rolle `admin`
	•	bruker kan kun se egen historikk
	•	bruker kan kun endre egne prompts, med mindre bruker er admin

Første registrerte bruker kan gjøres til admin for enkel oppstart. Ekstra admin-brukere kan også styres via miljøvariabel.

⸻

7. Promptstrategi

Fase 2 støtter både:
	•	standardprompt som følger produktets anbefalte oppførsel
	•	fullt redigerbar prompt fra bruker

Ved generering:
	•	backend bruker `customPrompt` hvis den finnes
	•	hvis ikke brukes standardprompten
	•	den faktiske prompten som ble brukt lagres i historikken

Dette gjør at standardprompten fortsatt er referanse og fallback, selv om brukeren kan overstyre den i UI.

⸻

8. Backend-flyt

Generering
	1.	Autentisert bruker sender `POST /api/rewrite`
	2.	Backend validerer input
	3.	Backend velger standardprompt eller brukerdefinert prompt
	4.	Backend sender forespørsel til OpenAI
	5.	Backend parser og normaliserer respons
	6.	Backend lagrer en `RewriteSession`
	7.	Backend returnerer resultat og `sessionId`

Regenerering av enkeltfelt
	1.	Frontend sender eksisterende resultater, valgt felt og `sessionId`
	2.	Backend genererer ny verdi kun for ett felt
	3.	Backend oppdaterer samme `RewriteSession`
	4.	Frontend oppdaterer kortet lokalt

⸻

9. UI-ansvar

Generator
	•	inputfelt for tekst
	•	full prompteditor
	•	valg av lagrede prompts
	•	lagring av prompt som privat eller offentlig
	•	resultatkort med kopier, reload og angre

Historikk
	•	listevisning
	•	detaljvisning av valgt generering

Promptbibliotek
	•	opprett
	•	rediger
	•	slett
	•	se private og delte prompts

Admin
	•	liste over brukere
	•	rolleendring
	•	aktivering/deaktivering
	•	promptmoderering

⸻

10. Feilhåndtering

Systemet skal håndtere:
	•	ugyldig registrerings- eller innloggingsdata
	•	feil passord eller deaktivert konto
	•	manglende session
	•	manglende adminrolle
	•	ugyldig promptdata
	•	ugyldig AI-respons
	•	manglende miljøvariabler
	•	generelle serverfeil

API-er skal returnere forståelige JSON-feilmeldinger. UI skal vise tydelig statusmelding til brukeren.

⸻

11. Miljøvariabler

Påkrevd
	•	`OPENAI_API_KEY`
	•	`AUTH_SECRET`

Valgfritt
	•	`OPENAI_MODEL`
	•	`ADMIN_EMAILS`

⸻

12. Sikkerhetsgrenser

Fase 2 opprettholder disse grensene:
	•	API-nøkler blir værende i backend
	•	prompten går alltid via backend
	•	session kontrolleres på server
	•	adminfunksjoner må valideres i backend
	•	deaktiverte brukere skal ikke kunne bruke beskyttede funksjoner
