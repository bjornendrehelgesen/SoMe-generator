Implementation Plan – Fase 2

1. Dokumentinformasjon

Prosjektnavn: AI-omformuleringsverktøy for Newton-rommet
Dokumenttype: Implementation Plan
Versjon: 2.0
Status: Aktiv
Språk: Norsk bokmål

⸻

2. Leveranse

Fase 2 skal levere:
	•	brukerkontoer med registrering og innlogging
	•	session-beskyttet app
	•	full historikk per bruker
	•	promptredigering i genereringsflyten
	•	private og offentlige prompts
	•	adminflate for brukere og prompts

⸻

3. Faser

Fase 1 – Datalag og autentisering
	•	legge til SQLite
	•	opprette tabeller for brukere, historikk og prompts
	•	bygge registrering, login og logout
	•	innføre `user` og `admin`
	•	beskytte sider og API-ruter

Fase 2 – Historikklagring og historikkvisning
	•	lagre hver generering som `RewriteSession`
	•	lagre inputtekst, full prompt og resultat
	•	lage historikkside med liste og detaljvisning
	•	sikre at bruker kun ser egne data

Fase 3 – Promptredigering i generatoren
	•	lage prompteditor på forsiden
	•	la bruker overstyre standardprompt
	•	la backend bruke valgt prompt ved generering
	•	lagre faktisk brukt prompt i historikken

Fase 4 – Delt promptbibliotek
	•	CRUD for prompts
	•	støtte `private` og `public`
	•	vise egne og delte prompts i bibliotek
	•	la bruker hente inn prompt til generatoren

Fase 5 – Adminflate
	•	liste brukere
	•	endre rolle
	•	deaktivere konto
	•	liste alle prompts
	•	skjule eller slette prompts

Fase 6 – Testing og produksjonsklargjøring
	•	lint og build
	•	gjennomgang av auth- og tilgangsflyt
	•	dokumentere miljøvariabler
	•	oppdatere README og styringsdokumenter

⸻

4. Konkrete utviklingsoppgaver

4.1 Datalag
	•	opprette lokal databasefil
	•	lage schema-init ved oppstart
	•	lage repository-funksjoner for brukere, prompts og historikk

4.2 Auth
	•	hashing av passord
	•	session-cookie
	•	server-hjelpere for `requireUser`, `requireAdmin`, `requireApiUser`, `requireApiAdmin`

4.3 Frontend
	•	ny landing for ikke-innlogget bruker
	•	login-side
	•	register-side
	•	app shell for innlogget bruker
	•	admin-panel

4.4 Rewrite-flyt
	•	utvide request med `customPrompt`
	•	returnere `sessionId` sammen med resultat
	•	koble regenerering til lagret historikkpost

4.5 Historikk
	•	`GET /api/history`
	•	`GET /api/history/:id`
	•	siderendering for historikk

4.6 Prompts
	•	`GET /api/prompts`
	•	`POST /api/prompts`
	•	`PATCH /api/prompts/:id`
	•	`DELETE /api/prompts/:id`

4.7 Admin
	•	`GET /api/admin/users`
	•	`PATCH /api/admin/users/:id`
	•	`GET /api/admin/prompts`
	•	`PATCH /api/admin/prompts/:id`
	•	`DELETE /api/admin/prompts/:id`

⸻

5. Testpunkter

Det skal kontrolleres at:
	•	ny bruker kan registrere seg
	•	eksisterende bruker kan logge inn
	•	innlogget bruker kan generere forslag
	•	generering lagres i historikken
	•	regenerering oppdaterer lagret kjøring
	•	br bruker ikke kan se andres historikk
	•	bruker kan lagre privat prompt
	•	bruker kan lagre offentlig prompt
	•	andre innloggede brukere kan se offentlige prompts
	•	admin kan oppdatere rolle og status
	•	admin kan moderere og slette prompts

⸻

6. Branch-strategi

Arbeidet skal gjøres i egen branch.

Anbefalt strategi
	•	branch: `feature/accounts-history-prompts`
	•	egne commits for dokumentasjon, auth/datalag, historikk, prompts og admin
	•	merge til `main` først når auth, datalag og sentrale brukerflyter er verifisert
