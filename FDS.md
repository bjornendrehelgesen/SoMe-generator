PRD / FDS – AI-omformulering for Newton-rommet

1. Dokumentinformasjon

Prosjektnavn: AI-omformuleringsverktøy for Newton-rommet
Dokumenttype: PRD / FDS
Versjon: 2.0
Status: Aktiv
Språk: Norsk bokmål

⸻

2. Produktretning

Løsningen er ikke lenger kun en enkel MVP-generator. Fase 2 utvider produktet med:
	•	innlogging og egne brukerkontoer
	•	personlig historikk for alle genereringer
	•	promptredigering per kjøring
	•	lagring og deling av prompts
	•	adminflate for brukere og prompts

Målet er fortsatt å gjøre det raskt å lage gode SoMe-forslag, men nå med mer kontroll, gjenbruk og administrasjon.

⸻

3. Målgruppe

Primærmålgruppe
	•	ansatte i Newton-rommet
	•	kommunikasjonsansvarlige
	•	formidlere og lærere som publiserer i sosiale medier

Sekundærmålgruppe
	•	andre innholdsprodusenter som jobber med realfag, læring eller arrangementer

⸻

4. Viktigste brukerbehov

Brukerne skal kunne:
	•	logge inn og jobbe med egne forslag
	•	gå tilbake til tidligere genereringer
	•	tilpasse AI-prompten til egne behov
	•	lagre prompts for senere bruk
	•	dele gode prompts med andre brukere

Administratorer skal kunne:
	•	se og administrere brukere
	•	endre roller
	•	deaktivere kontoer
	•	moderere, skjule eller slette delte prompts

⸻

5. Omfang

Inkludert i fase 2
	•	registrering og innlogging med e-post og passord
	•	rollemodell med minst `user` og `admin`
	•	full historikk per bruker
	•	redigering av hele prompten i genereringsflyten
	•	lagring av private og offentlige prompts
	•	delt promptbibliotek for innloggede brukere
	•	adminside for bruker- og promptadministrasjon

Ikke inkludert i fase 2
	•	SSO mot eksterne identitetsleverandører
	•	offentlig deling uten innlogging
	•	avansert analyse/statistikk
	•	versjonering av prompts
	•	rettighetsstyring utover `user` og `admin`

⸻

6. Brukerhistorier

US1

Som bruker vil jeg kunne registrere meg og logge inn, slik at jeg får tilgang til egne data.

US2

Som bruker vil jeg kunne se alle tidligere genereringer, slik at jeg kan gå tilbake til tidligere arbeid.

US3

Som bruker vil jeg kunne redigere hele prompten før generering, slik at jeg får mer kontroll på resultatet.

US4

Som bruker vil jeg kunne lagre en prompt som privat eller offentlig, slik at jeg kan gjenbruke den selv eller dele den med andre.

US5

Som bruker vil jeg kunne laste inn en delt prompt og bruke den som utgangspunkt i generatoren.

US6

Som admin vil jeg kunne administrere brukere, roller og kontostatus.

US7

Som admin vil jeg kunne skjule eller slette prompts som ikke bør være tilgjengelige for andre.

⸻

7. Funksjonelle krav

FR1 – Brukerkontoer

Systemet skal støtte registrering, innlogging og utlogging.

FR2 – Tilgangskontroll

Beskyttede sider og API-er skal kreve autentisert bruker.

FR3 – Roller

Systemet skal støtte minst rollene `user` og `admin`.

FR4 – Historikk

Hver generering skal lagres med:
	•	inputtekst
	•	full prompt
	•	resultatobjekt
	•	bruker-id
	•	tidsstempel

FR5 – Historikkvisning

Bruker skal kunne se listevisning og detaljvisning av egen historikk.

FR6 – Promptredigering

Bruker skal kunne redigere hele prompten i UI før generering.

FR7 – Standardprompt

Systemet skal fortsatt tilby en standardprompt som utgangspunkt.

FR8 – Promptlagring

Bruker skal kunne lagre prompt som privat eller offentlig.

FR9 – Delt promptbibliotek

Innloggede brukere skal kunne se og bruke offentlige prompts.

FR10 – Admin brukeradministrasjon

Admin skal kunne:
	•	se alle brukere
	•	endre rolle
	•	deaktivere kontoer

FR11 – Admin promptadministrasjon

Admin skal kunne:
	•	se alle prompts
	•	endre synlighet/status
	•	slette prompts

FR12 – AI-generering

Systemet skal fortsatt returnere strukturert resultat i formatet:

{
  "facebook": "...",
  "instagram": "...",
  "linkedin": "...",
  "imageText": "...",
  "cta": "..."
}

⸻

8. Ikke-funksjonelle krav

NFR1 – Sikkerhet

API-nøkler og hemmeligheter skal fortsatt holdes i backend.

NFR2 – Dataskille

Vanlig bruker skal kun ha tilgang til egen historikk og egne private prompts.

NFR3 – Administrasjon

Adminfunksjoner skal være eksplisitt rollebeskyttet.

NFR4 – Vedlikeholdbarhet

Løsningen skal bygges med tydelige typer, små komponenter og enkel struktur.

NFR5 – Robusthet

Systemet skal håndtere ugyldig innlogging, ugyldige API-kall og manglende tilgang på en kontrollert måte.

⸻

9. Sikkerhetsprinsipper

Følgende prinsipper gjelder fortsatt:
	•	OpenAI-nøkkel skal ikke eksponeres i frontend
	•	prompten sendes alltid via backend til AI-modellen
	•	sessions skal være serverkontrollerte
	•	admin-tilganger skal ikke styres kun i UI

Fri promptredigering er en avansert funksjon og må derfor behandles som brukerinnhold med tydelig validering og server-side kontroll.

⸻

10. Akseptansekriterier

Fase 2 regnes som levert når:
	•	ny bruker kan registrere seg og logge inn
	•	innlogget bruker kan generere forslag og få dem lagret i historikken
	•	bruker kan åpne tidligere historikkposter
	•	bruker kan skrive egen prompt og bruke den i genereringen
	•	bruker kan lagre privat eller offentlig prompt
	•	offentlige prompts kan brukes av andre innloggede brukere
	•	admin kan administrere brukere og prompts
