FSD – Teknisk løsningsbeskrivelse for AI-omformuleringsnettside

1. Dokumentinformasjon

Prosjektnavn: AI-omformuleringsverktøy for Newton-rommet
Dokumenttype: FSD (Functional Solution Design / teknisk løsningsbeskrivelse)
Versjon: 1.0
Status: Utkast
Språk: Norsk bokmål

⸻

2. Formål

Dette dokumentet beskriver hvordan løsningen skal bygges teknisk for å oppfylle kravene i PRD/FDS.

Målet er å lage en enkel, sikker og vedlikeholdbar nettside der brukeren kan skrive inn en tekst og få AI-genererte forslag til:
	•	Facebook
	•	Instagram
	•	LinkedIn
	•	kort tekst til bilde
	•	CTA

FSD-en skal fungere som teknisk styringsdokument for utvikling av MVP.

⸻

3. Løsningsoversikt

Løsningen består av tre hoveddeler:
	1.	Frontend – nettsiden brukeren ser og bruker
	2.	Backend/API – mottar tekst, bygger AI-forespørsel og returnerer strukturert svar
	3.	AI-tjeneste – språkmodell som genererer omformuleringene

Brukeren skal aldri kommunisere direkte med AI-leverandøren. All kommunikasjon går via backend for å beskytte API-nøkler, kontrollere prompt og validere svar.

⸻

4. Foreslått teknologistack

4.1 Anbefalt stack for MVP

Frontend
	•	Next.js
	•	React
	•	TypeScript
	•	Tailwind CSS

Backend
	•	Next.js API routes eller Route Handlers
	•	TypeScript
	•	server-side integrasjon mot AI-API

Hosting
	•	Vercel

AI-integrasjon
	•	språkmodell via API
	•	systemprompt lagres i backend
	•	API-nøkkel lagres som miljøvariabel

4.2 Hvorfor denne stacken

Denne stacken passer godt fordi den:
	•	er rask å utvikle i
	•	støtter frontend og backend i samme prosjekt
	•	er enkel å deploye
	•	egner seg godt for en liten MVP
	•	gjør det enkelt å holde hemmeligheter på serversiden

⸻

5. Arkitektur

5.1 Logisk arkitektur

Bruker
  ↓
Frontend (Next.js)
  ↓
Backend API (/api/rewrite)
  ↓
AI-modell / språk-API
  ↓
Backend validerer og returnerer JSON
  ↓
Frontend viser resultatkort

5.2 Ansvarsdeling

Frontend ansvar
	•	vise inputfelt og knapper
	•	validere enkel input i klienten
	•	sende forespørsel til backend
	•	vise lasteindikator
	•	vise resultatkort
	•	håndtere kopieringsfunksjon
	•	vise feilmeldinger

Backend ansvar
	•	validere request-body
	•	legge til fast systemprompt
	•	sende forespørsel til AI-tjenesten
	•	parse og validere respons
	•	returnere trygg og strukturert JSON til frontend
	•	logge tekniske feil på en kontrollert måte

AI-tjeneste ansvar
	•	generere tekst basert på prompt og input
	•	returnere strukturert output

⸻

6. Funksjonell komponentbeskrivelse

6.1 Frontend-komponenter

6.1.1 RewriteForm

Ansvar:
	•	vise tekstområde for input
	•	vise knapp for generering
	•	vise eventuell knapp for å tømme tekst
	•	håndtere submit

Felter:
	•	text: string
	•	isLoading: boolean
	•	error: string | null

6.1.2 ResultCard

Ansvar:
	•	vise overskrift for kanal
	•	vise generert tekst
	•	ha egen kopier-knapp
	•	vise tilbakemelding ved kopiering

Props:
	•	title
	•	content
	•	copyLabel

6.1.3 ResultsSection

Ansvar:
	•	rendere alle resultatkort samlet
	•	skjule tomme valgfrie felt hvis ønskelig

6.1.4 StatusMessage

Ansvar:
	•	vise feil, lastestatus eller suksessindikasjon

⸻

7. Sider og navigasjon

7.1 MVP-sider

Løsningen trenger kun én hovedside i MVP:

/

Innhold:
	•	tittel
	•	kort forklaring
	•	inputfelt
	•	knapp for generering
	•	resultatseksjon
	•	feilmeldinger / status

Det er ingen behov for flere sider i første versjon.

⸻

8. API-design

8.1 Endepunkt

POST /api/rewrite

Mottar brukerens tekst og returnerer omformulerte versjoner.

8.2 Request-format

{
  "text": "Her er teksten brukeren vil omformulere"
}

8.3 Response-format ved suksess

{
  "facebook": "...",
  "instagram": "...",
  "linkedin": "...",
  "imageText": "...",
  "cta": "..."
}

8.4 Response-format ved feil

{
  "error": "Noe gikk galt. Prøv igjen."
}

8.5 HTTP-statuskoder
	•	200 OK – vellykket respons
	•	400 Bad Request – manglende eller ugyldig input
	•	500 Internal Server Error – teknisk feil i backend eller AI-kall

⸻

9. Backend-flyt

9.1 Prosess ved innsendt tekst
	1.	Frontend sender POST /api/rewrite med tekst.
	2.	Backend leser request body.
	3.	Backend validerer at text finnes og ikke er tom.
	4.	Backend bygger AI-kall med:
	•	systemprompt
	•	brukerens input
	5.	Backend sender forespørsel til språkmodellen.
	6.	Backend mottar svar.
	7.	Backend parser svaret.
	8.	Backend validerer at nødvendige felter finnes.
	9.	Backend returnerer normalisert JSON til frontend.

9.2 Validering i backend

Backend skal kontrollere:
	•	at input er tekst
	•	at input ikke bare består av whitespace
	•	at AI-responsen kan tolkes
	•	at forventede JSON-felter finnes
	•	at manglende valgfrie felter settes til tom streng

⸻

10. Promptdesign

10.1 Promptstrategi

Prompten skal deles i to deler:
	1.	Systemprompt – faste regler og ønsket oppførsel
	2.	Brukerprompt – teksten som skal omformuleres

Systemprompten skal ligge i backend og ikke kunne redigeres av brukeren i MVP.

10.2 Krav til prompten

Prompten skal sikre at modellen:
	•	skriver på norsk bokmål
	•	tilpasser tekst til Facebook, Instagram og LinkedIn
	•	ikke finner opp fakta
	•	bruker moderat mengde emojis der det passer
	•	returnerer ren JSON
	•	lar imageText og cta være tom streng hvis det ikke passer

10.3 Eksempel på intern promptbygging

[SYSTEMPROMPT]

Her er teksten som skal omformuleres:

[BRUKERENS TEKST]


⸻

11. Datamodell

Det er ikke behov for database i MVP.

Data behandles midlertidig i minne per forespørsel.

11.1 Intern responsmodell

interface RewriteResponse {
  facebook: string;
  instagram: string;
  linkedin: string;
  imageText: string;
  cta: string;
}

11.2 Requestmodell

interface RewriteRequest {
  text: string;
}

11.3 Feilmodell

interface ErrorResponse {
  error: string;
}


⸻

12. Feilhåndtering

12.1 Feiltyper

Løsningen skal håndtere minst disse feilene:

Klientfeil
	•	tom tekst
	•	ugyldig request-format

Serverfeil
	•	manglende API-nøkkel
	•	timeout mot AI-tjeneste
	•	ugyldig respons fra AI
	•	intern serverfeil

12.2 Feilmeldingsstrategi

Brukeren skal få enkle og forståelige meldinger, for eksempel:
	•	«Skriv inn tekst før du lager forslag.»
	•	«Noe gikk galt ved generering. Prøv igjen.»
	•	«Tjenesten svarte ikke som forventet. Prøv på nytt.»

Tekniske detaljer skal ikke vises til sluttbruker.

12.3 Logging

Backend bør logge:
	•	tidspunkt for feil
	•	type feil
	•	statuskode fra AI-leverandør ved behov
	•	om parsing feilet

Det bør unngås å logge sensitiv informasjon eller full brukertekst dersom det ikke er nødvendig.

⸻

13. Sikkerhet

13.1 API-nøkler
	•	lagres i miljøvariabler
	•	brukes kun på serversiden
	•	skal aldri eksponeres til frontend

13.2 Inputkontroll
	•	trim input
	•	avvis tom input
	•	begrens maksimal tekstlengde ved behov

13.3 Misbruk og robusthet

For senere versjoner kan man vurdere:
	•	rate limiting
	•	enkel bot-beskyttelse
	•	begrensning på antall kall per tidsperiode

Dette er ikke et absolutt krav i første MVP, men bør vurderes tidlig ved publisering.

⸻

14. Ytelse

14.1 Mål
	•	normal svartid bør være under 10 sekunder
	•	frontend skal gi umiddelbar visuell tilbakemelding etter innsending
	•	resultatseksjonen skal oppdatere uten full sideoppdatering

14.2 Tiltak
	•	enkel request/response-flyt
	•	ingen database i MVP
	•	lett frontend uten tunge avhengigheter
	•	tydelig lastestatus

⸻

15. UI/UX-detaljer

15.1 Inputområde

Skal være stort nok til at brukeren enkelt kan lime inn flere avsnitt.

15.2 Knapper

Minst disse knappene bør finnes:
	•	Lag forslag
	•	Tøm tekst
	•	Kopier på hvert resultatkort

15.3 Resultatvisning

Resultatene bør vises i egne kort eller paneler med tydelig overskrift:
	•	📘 Facebook
	•	📸 Instagram
	•	💼 LinkedIn
	•	✏️ Kort tekst til bilde
	•	📣 CTA

15.4 Tilbakemeldinger
	•	vis «Kopiert» kortvarig etter kopiering
	•	vis loader/spinner under generering
	•	vis feil nær inputområdet eller tydelig i resultatseksjonen

⸻

16. Tilgjengelighet

Løsningen bør følge grunnleggende tilgjengelighetsprinsipper:
	•	tydelige labels eller label-lignende overskrifter
	•	god kontrast
	•	knapper som kan brukes med tastatur
	•	synlig fokusstatus
	•	semantisk HTML

Dette er særlig viktig fordi løsningen skal være enkel og robust.

⸻

17. Kodeorganisering

17.1 Foreslått prosjektstruktur

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

17.2 Ansvar per mappe

app/
	•	sider og API-ruter

components/
	•	presentasjons- og UI-komponenter

lib/
	•	AI-kall
	•	promptlogikk
	•	validering

types/
	•	TypeScript-typer og kontrakter

⸻

18. Teststrategi

18.1 Enhetstester

Bør dekke:
	•	validering av input
	•	parsing og normalisering av AI-respons
	•	fallback ved manglende felt

18.2 Integrasjonstester

Bør dekke:
	•	POST /api/rewrite med gyldig tekst
	•	POST /api/rewrite med tom tekst
	•	feilrespons fra AI-tjeneste

18.3 Manuelle tester

Bør dekke:
	•	mobilvisning
	•	kopieringsknapper
	•	lasteindikator
	•	realistiske eksempeltekster fra Newton-rommet

⸻

19. Avhengigheter og konfigurasjon

19.1 Miljøvariabler

Eksempler:

OPENAI_API_KEY=...
MODEL_NAME=...

19.2 Eksterne avhengigheter
	•	AI-klientbibliotek
	•	Next.js
	•	React
	•	Tailwind CSS

Det bør holdes så få avhengigheter som mulig i MVP.

⸻

20. Deploy og drift

20.1 Anbefalt deploymodell
	•	kode lagres i Git-repositorium
	•	deploy til Vercel
	•	miljøvariabler konfigureres i deploymiljøet

20.2 Drift i MVP
	•	enkel overvåking via plattformlogger
	•	manuell oppfølging ved feil
	•	ingen databasebackup nødvendig i MVP

⸻

21. Fremtidige utvidelser

Teknisk bør løsningen senere kunne utvides med:
	•	historikklagring
	•	autentisering
	•	flere tonevalg
	•	flere kanaler
	•	maler for ulike innholdstyper
	•	adminside for promptstyring
	•	statistikk og bruksmåling

Arkitekturen bør derfor holdes enkel, men ryddig.

⸻

22. Beslutninger for MVP

Følgende tekniske valg anbefales for første versjon:
	1.	Én side i Next.js
	2.	Én backend-rute for generering
	3.	Ingen database
	4.	Fast systemprompt i backend
	5.	Strukturert JSON-respons
	6.	Enkel og tydelig UI
	7.	Deploy på Vercel

Dette gir lav kompleksitet og rask vei til fungerende MVP.

⸻
