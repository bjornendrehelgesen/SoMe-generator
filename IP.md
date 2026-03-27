Implementation Plan – AI-omformuleringsnettside for Newton-rommet

1. Dokumentinformasjon

Prosjektnavn: AI-omformuleringsverktøy for Newton-rommet
Dokumenttype: Implementation Plan / teknisk oppgaveliste
Versjon: 1.0
Status: Utkast
Språk: Norsk bokmål

⸻

2. Formål

Dette dokumentet bryter FSD-en ned i konkrete utviklingsoppgaver for MVP.

Målet er å gjøre det enkelt å:
	•	bygge løsningen steg for steg
	•	fordele arbeid til AI-agenter eller utviklere
	•	kontrollere at PRD/FDS og FSD faktisk blir implementert

Dokumentet er skrevet for en praktisk MVP med Next.js, TypeScript, Tailwind CSS og en backend-rute for AI-omformulering.

⸻

3. Overordnet leveranse

MVP-en skal levere:
	•	én nettside med tekstfelt
	•	én knapp for generering
	•	resultatkort for Facebook, Instagram, LinkedIn, bildetekst og CTA
	•	kopieringsknapp per resultat
	•	backend-endepunkt for AI-kall
	•	sikker håndtering av API-nøkkel
	•	enkel feilhåndtering
	•	responsivt design

⸻

4. Faser

Prosjektet deles inn i disse fasene:
	1.	Oppsett og grunnstruktur
	2.	UI og frontend
	3.	Backend og AI-integrasjon
	4.	Validering og feilhåndtering
	5.	Testing og kvalitetssikring
	6.	Deploy og produksjonsklargjøring

⸻

5. Fase 1 – Oppsett og grunnstruktur

Mål

Opprette prosjektet og få på plass teknisk grunnmur.

Oppgaver

1.1 Opprette prosjekt
	•	Opprette nytt Next.js-prosjekt med TypeScript
	•	Aktivere App Router
	•	Installere og konfigurere Tailwind CSS
	•	Kontrollere at prosjektet kjører lokalt

Leveranse: Kjøreklart prosjekt med standard struktur

1.2 Lage mappe- og filstruktur
Opprette anbefalt struktur:

src/
  app/
    page.tsx
    api/
      rewrite/
        route.ts
  components/
    RewriteForm.tsx
    ResultsSection.tsx
    ResultCard.tsx
    StatusMessage.tsx
  lib/
    ai.ts
    prompt.ts
    validation.ts
  types/
    rewrite.ts

Leveranse: Ryddig prosjektstruktur klar for utvikling

1.3 Opprette grunnleggende typer
Opprette TypeScript-typer for:
	•	request
	•	response
	•	error response
	•	komponent-props ved behov

Leveranse: types/rewrite.ts

⸻

6. Fase 2 – UI og frontend

Mål

Bygge brukergrensesnittet for input, resultater og statusmeldinger.

Oppgaver

2.1 Lage hovedside
På page.tsx:
	•	vise sidetittel
	•	vise kort hjelpetekst
	•	rendere inputkomponent
	•	rendere resultatseksjon

Leveranse: Første fungerende side med layout

2.2 Lage RewriteForm
Komponenten skal:
	•	vise et stort tekstfelt
	•	ha knapp for Lag forslag
	•	ha knapp for Tøm tekst
	•	håndtere lokal state for input
	•	trigge submit til backend

Funksjonelle krav: FR1, FR2, FR3

Leveranse: Fungerende inputskjema

2.3 Lage ResultCard
Komponenten skal:
	•	vise overskrift
	•	vise generert innhold
	•	ha kopier-knapp
	•	vise kort bekreftelse ved kopiering

Funksjonelle krav: FR7

Leveranse: Gjenbrukbar resultatkomponent

2.4 Lage ResultsSection
Komponenten skal:
	•	vise fem resultatkort
	•	håndtere tomme felt på en ryddig måte
	•	kunne skjule eller vise valgfrie felt

Funksjonelle krav: FR5, FR6, FR10

Leveranse: Komplett resultatseksjon

2.5 Lage StatusMessage
Komponenten skal kunne vise:
	•	feil
	•	lastestatus
	•	eventuelle suksessmeldinger

Funksjonelle krav: FR8, FR9

Leveranse: Standardisert statuskomponent

2.6 Responsivt design
Sikre at UI fungerer godt på:
	•	mobil
	•	nettbrett
	•	desktop

Ikke-funksjonelle krav: NFR1

Leveranse: Responsiv MVP-layout

⸻

7. Fase 3 – Backend og AI-integrasjon

Mål

Bygge backend-ruten som mottar tekst, sender AI-kall og returnerer strukturert respons.

Oppgaver

3.1 Lage POST /api/rewrite
Ruten skal:
	•	lese request body
	•	validere input
	•	bygge AI-forespørsel
	•	sende til AI-modellen
	•	returnere strukturert JSON

Funksjonelle krav: FR4, FR10

Leveranse: Fungerende API-rute

3.2 Lage prompt.ts
Lagre systemprompt som en egen konstant eller funksjon.

Promptmodulen skal:
	•	holde fast systemprompt
	•	bygge full prompt med brukerinput
	•	være enkel å vedlikeholde

Leveranse: Egen promptmodul

3.3 Lage ai.ts
Lage modul for kommunikasjon med AI-tjenesten.

Modulen skal:
	•	hente API-nøkkel fra miljøvariabel
	•	sende forespørsel til valgt modell
	•	returnere rå eller strukturert respons til route handler
	•	håndtere feil på en kontrollert måte

Leveranse: Gjenbrukbar AI-klientmodul

3.4 Parse og normalisere AI-respons
Backend skal:
	•	parse responsen
	•	validere at feltene finnes
	•	bruke tom streng som fallback for valgfrie felter
	•	returnere et standardisert objekt

Leveranse: Stabil responsmodell til frontend

⸻

8. Fase 4 – Validering og feilhåndtering

Mål

Gjøre løsningen robust ved vanlige brukerfeil og tekniske feil.

Oppgaver

4.1 Lage validation.ts
Valideringsmodulen skal:
	•	trimme input
	•	avvise tom tekst
	•	eventuelt håndtere maks lengde
	•	validere struktur på respons

Leveranse: Gjenbrukbar valideringslogikk

4.2 Håndtere klientfeil
Frontend skal:
	•	stoppe submit ved tom tekst
	•	vise forståelig feilmelding

Leveranse: Tydelig brukerfeedback ved tom input

4.3 Håndtere serverfeil
Backend og frontend skal håndtere:
	•	manglende miljøvariabler
	•	ugyldig AI-respons
	•	timeout eller feil fra API
	•	generelle serverfeil

Leveranse: Forutsigbar feilhåndtering

4.4 Logging
Legg inn enkel teknisk logging for:
	•	feiltype
	•	tidspunkt
	•	statuskode der det er relevant

Leveranse: Basis for feilsøking i utvikling og drift

⸻

9. Fase 5 – Testing og kvalitetssikring

Mål

Sikre at løsningen fungerer teknisk og gir riktig innholdskvalitet.

Oppgaver

5.1 Enhetstester
Teste:
	•	inputvalidering
	•	responsnormalisering
	•	fallback-logikk

Leveranse: Basis enhetstester for kritisk logikk

5.2 Integrasjonstester
Teste API-ruten med:
	•	gyldig input
	•	tom input
	•	simulert AI-feil
	•	simulert ugyldig respons

Leveranse: Integrasjonstester for backendflyt

5.3 Manuell frontend-testing
Teste:
	•	mobilvisning
	•	desktopvisning
	•	kopier-knapper
	•	loading state
	•	feilmeldinger

Leveranse: Verifisert brukeropplevelse

5.4 Innholdstesting
Teste med realistiske tekster fra Newton-rommet for å sjekke:
	•	tone per kanal
	•	bokmål
	•	flyt
	•	om AI unngår å dikte opp fakta

Leveranse: Verifisert outputkvalitet

⸻

10. Fase 6 – Deploy og produksjonsklargjøring

Mål

Gjøre løsningen klar for publisering og trygg drift i MVP-format.

Oppgaver

6.1 Forberede miljøvariabler
Konfigurere:

OPENAI_API_KEY=...
MODEL_NAME=...

Leveranse: Sikker serverkonfigurasjon

6.2 Deploy til Vercel
	•	koble repo til Vercel
	•	sette miljøvariabler
	•	verifisere produksjonsbygg

Leveranse: Live MVP

6.3 Produksjonstest
Teste i produksjonsmiljø:
	•	input
	•	API-kall
	•	resultater
	•	feilmeldinger
	•	responsivitet

Leveranse: Produksjonsgodkjent MVP

⸻

11. Prioritert oppgaveliste

Må bygges først
	1.	Prosjektoppsett
	2.	Hovedside
	3.	Inputskjema
	4.	API-rute
	5.	Promptmodul
	6.	AI-klient
	7.	Resultatvisning
	8.	Feilhåndtering
	9.	Kopieringsfunksjon
	10.	Responsivt design

Deretter
	11.	Valideringsmodul
	12.	Logging
	13.	Testing
	14.	Deploy

⸻

12. Tekniske milepæler

Milepæl 1 – Grunnstruktur klar

Kriterier:
	•	prosjektet kjører lokalt
	•	struktur er på plass
	•	Tailwind fungerer

Milepæl 2 – UI klart uten AI

Kriterier:
	•	inputfelt finnes
	•	resultatområde finnes
	•	kopieringsknapper finnes
	•	siden er responsiv

Milepæl 3 – Backend og AI-kall virker

Kriterier:
	•	frontend kan sende tekst
	•	backend returnerer JSON
	•	AI-resultater vises korrekt

Milepæl 4 – Robust MVP

Kriterier:
	•	feil håndteres ryddig
	•	tom input stoppes
	•	output følger forventet struktur

Milepæl 5 – Produksjonsklar MVP

Kriterier:
	•	deploy fungerer
	•	miljøvariabler er satt
	•	testet i produksjon

⸻

13. Forslag til agentoppdrag

Agent 1 – Frontend

Oppgave:
Bygg frontend for MVP i Next.js, TypeScript og Tailwind. Lag hovedside, inputskjema, resultatkort, kopieringsknapper og responsive layouts.

Agent 2 – Backend

Oppgave:
Bygg POST /api/rewrite i Next.js. Ruten skal validere input, bruke systemprompt, kalle AI-modell og returnere strukturert JSON.

Agent 3 – Prompt

Oppgave:
Forbedre systemprompten slik at output blir stabil, på norsk bokmål, og returneres som ren JSON uten ekstra tekst.

Agent 4 – QA

Oppgave:
Lag testscenarier og testcases for inputvalidering, API-feil, outputkvalitet, responsivt design og kopieringsfunksjon.

⸻

14. Anbefalt arbeidsrekkefølge

Den mest effektive rekkefølgen er:
	1.	Opprette prosjekt
	2.	Lage typer og struktur
	3.	Lage side og frontend-komponenter
	4.	Lage backend-rute
	5.	Legge inn prompt og AI-kall
	6.	Koble frontend til backend
	7.	Legge til feilhåndtering
	8.	Legge til kopieringsfunksjon
	9.	Teste med ekte eksempler
	10.	Deploye MVP

⸻

15. Definisjon av ferdig (Definition of Done)

MVP-en regnes som ferdig når:
	•	brukeren kan skrive inn tekst
	•	teksten sendes til backend uten feil
	•	backend returnerer Facebook, Instagram og LinkedIn-forslag
	•	valgfrie felt for bildetekst og CTA håndteres korrekt
	•	resultatene kan kopieres separat
	•	løsningen fungerer på mobil og desktop
	•	feilmeldinger vises tydelig
	•	API-nøkkel ikke er eksponert i frontend
	•	løsningen er deployet og testet i produksjon