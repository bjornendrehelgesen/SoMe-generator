PRD / FDS – Nettside for AI-omformulering av SoMe-tekster

1. Dokumentinformasjon

Prosjektnavn: AI-omformuleringsverktøy for Newton-rommet
Dokumenttype: PRD / FDS
Versjon: 1.0
Status: Utkast
Språk: Norsk bokmål

⸻

2. Bakgrunn

Newton-rommet produserer innhold til flere sosiale medier, men samme budskap må ofte tilpasses ulike plattformer. Dette tar tid og gjør det lett å få ujevn tone, lengde og kvalitet.

Det er behov for en enkel nettside der brukeren kan skrive inn eller lime inn en grunntekst og få tre ferdige forslag tilpasset:
	•	Facebook
	•	Instagram
	•	LinkedIn

Løsningen skal bruke AI til å omformulere teksten slik at den blir klar til publisering med riktig tone, riktig lengde og en ryddig struktur.

⸻

3. Formål

Målet er å lage en enkel og effektiv nettside som gjør det mulig å:
	•	skrive inn én grunntekst
	•	få tre plattformtilpassede versjoner automatisk
	•	kopiere hver versjon separat
	•	spare tid i produksjon av innhold til sosiale medier
	•	sikre bedre og mer konsekvent språkføring for Newton-rommet

⸻

4. Målgruppe

Primærmålgruppe
	•	ansatte i Newton-rommet
	•	kommunikasjonsansvarlige
	•	lærere eller formidlere som publiserer innhold i sosiale medier

Sekundærmålgruppe
	•	andre som lager formidlingsinnhold om undervisning, teknologi, realfag eller arrangementer

⸻

5. Problem som skal løses

Dagens arbeidsmåte innebærer ofte at én tekst må omskrives manuelt flere ganger. Dette gir følgende utfordringer:
	•	unødvendig tidsbruk
	•	ujevn kvalitet mellom kanaler
	•	uklare forskjeller mellom profesjonell og folkelig tone
	•	ekstra arbeid med å formulere korte bildetekster og CTA-er

Løsningen skal redusere dette ved å standardisere og automatisere førsteutkastene.

⸻

6. Produktmål

Løsningen skal:
	1.	gjøre det raskt å få gode SoMe-forslag fra én originaltekst
	2.	gi tydelig kanaltilpassede versjoner
	3.	fungere godt både på mobil og desktop
	4.	være så enkel at en ny bruker forstår den uten opplæring
	5.	gi resultater som er klare til bruk eller krever minimal redigering

⸻

7. Omfang

Inkludert i MVP
	•	én side med tekstfelt for input
	•	knapp for å generere forslag
	•	tre separate resultatfelt for Facebook, Instagram og LinkedIn
	•	valgfritt felt for kort tekst til bilde
	•	valgfritt felt for CTA
	•	kopieringsknapp per resultatfelt
	•	enkel feilhåndtering
	•	responsivt design
	•	bruk av fast AI-prompt i backend

Ikke inkludert i MVP
	•	innlogging og brukeradministrasjon
	•	lagring av historikk
	•	flerspråklig støtte
	•	direkte publisering til sosiale medier
	•	bildeopplasting eller bildeanalyse
	•	avansert redigering av AI-prompt i brukergrensesnittet
	•	analyse av resultatkvalitet over tid

⸻

8. Brukerhistorier

US1

Som innholdsansvarlig vil jeg kunne lime inn en tekst og få tre kanaltilpassede versjoner, slik at jeg sparer tid.

US2

Som bruker vil jeg kunne kopiere Facebook-, Instagram- eller LinkedIn-teksten hver for seg, slik at jeg enkelt kan publisere riktig versjon i riktig kanal.

US3

Som bruker vil jeg få en tydelig feilmelding hvis jeg prøver å sende inn en tom tekst, slik at jeg forstår hva som mangler.

US4

Som bruker vil jeg at teksten skal være skrevet på godt norsk bokmål og være klar til publisering, slik at jeg slipper mye etterarbeid.

US5

Som bruker vil jeg gjerne få forslag til kort bildetekst og CTA når det passer, slik at innlegget blir mer komplett.

⸻

9. Funksjonelle krav

FR1 – Inputfelt

Systemet skal ha et stort tekstfelt der brukeren kan skrive inn eller lime inn tekst.

FR2 – Genereringsknapp

Systemet skal ha en tydelig knapp for å sende teksten til AI for behandling.

FR3 – Validering av input

Systemet skal kontrollere at brukeren har skrevet inn tekst før forespørselen sendes.

FR4 – AI-omformulering

Systemet skal sende brukerens tekst til backend, der en fast prompt kombineres med input og sendes videre til en språkmodell.

FR5 – Kanalspesifikke resultater

Systemet skal vise tre separate tekstresultater:
	•	Facebook
	•	Instagram
	•	LinkedIn

FR6 – Ekstra forslag

Systemet skal kunne vise:
	•	kort tekst til bilde
	•	CTA

Disse feltene kan være tomme dersom AI-en vurderer at det ikke passer.

FR7 – Kopieringsfunksjon

Hvert resultatfelt skal ha en knapp som kopierer innholdet til utklippstavlen.

FR8 – Lasteindikator

Systemet skal vise at behandling pågår etter at brukeren trykker på genereringsknappen.

FR9 – Feilmeldinger

Systemet skal vise en forståelig feilmelding ved:
	•	tom input
	•	feil fra backend
	•	feil fra AI-tjenesten
	•	ugyldig eller mangelfull respons

FR10 – Strukturert resultat

Frontend skal motta og vise strukturert data fra backend i faste felter.

FR11 – Responsivt grensesnitt

Løsningen skal fungere på mobil, nettbrett og desktop.

⸻

10. Ikke-funksjonelle krav

NFR1 – Brukervennlighet

Brukeren skal forstå hvordan løsningen brukes i løpet av få sekunder.

NFR2 – Ytelse

Systemet bør normalt returnere svar innen 10 sekunder ved vanlig bruk.

NFR3 – Sikkerhet

API-nøkler og hemmelig konfigurasjon skal ikke eksponeres i frontend.

NFR4 – Vedlikeholdbarhet

Løsningen skal bygges med ryddig struktur og være enkel å videreutvikle.

NFR5 – Stabilitet

Systemet skal håndtere vanlige feil uten at brukergrensesnittet bryter sammen.

NFR6 – Språkkvalitet

Resultatene skal være på norsk bokmål og ha naturlig flyt.

⸻

11. Innholdskrav til AI-resultatet

AI-resultatene skal følge disse prinsippene:
	•	teksten skal være på norsk bokmål
	•	budskapet fra originalteksten skal bevares
	•	AI skal ikke finne opp fakta
	•	Facebook-teksten skal være litt lengre, engasjerende og folkelig
	•	Instagram-teksten skal være kortere, mer punchy og kan bruke noen relevante emojis
	•	LinkedIn-teksten skal være mer profesjonell og faglig
	•	emojis skal brukes med måte
	•	tonen skal være tydelig, men ikke masete
	•	teksten skal være klar til publisering

⸻

12. Forventet AI-format

Backend skal be AI-modellen returnere et strukturert svar i JSON-format.

Eksempel:

{
  "facebook": "...",
  "instagram": "...",
  "linkedin": "...",
  "imageText": "...",
  "cta": "..."
}

Hvis imageText eller cta ikke passer, skal feltet returneres som tom streng.

⸻

13. Brukerflyt

Hovedflyt
	1.	Brukeren åpner nettsiden.
	2.	Brukeren skriver inn eller limer inn en tekst i inputfeltet.
	3.	Brukeren klikker på «Lag forslag».
	4.	Systemet validerer at input ikke er tom.
	5.	Frontend sender teksten til backend.
	6.	Backend kombinerer teksten med fast systemprompt.
	7.	Backend sender forespørselen til AI-modellen.
	8.	Backend mottar strukturert svar.
	9.	Frontend viser resultatene i egne kort.
	10.	Brukeren kan kopiere hvert forslag separat.

Feilflyt
	1.	Brukeren sender tom tekst.
	2.	Systemet stopper forespørselen.
	3.	Brukeren får feilmelding.

Eller:
	1.	Backend eller AI-tjeneste feiler.
	2.	Frontend viser en tydelig generell feilmelding.
	3.	Brukeren kan prøve igjen.

⸻

14. UI-krav

Hovedsiden skal minst inneholde:
	•	tydelig sidetittel
	•	kort forklarende tekst
	•	stort tekstfelt
	•	knapp for generering
	•	eventuelt knapp for å tømme input
	•	resultatkort for:
	•	Facebook
	•	Instagram
	•	LinkedIn
	•	kort tekst til bilde
	•	CTA
	•	kopier-knapp på hvert kort
	•	tilbakemelding ved vellykket kopiering
	•	synlig lasteindikator
	•	synlige feilmeldinger

Designet skal være enkelt, moderne og uten unødvendige elementer.

⸻

15. Akseptansekriterier

Løsningen er godkjent når følgende er oppfylt:
	1.	Brukeren kan skrive inn en tekst og få tre forslag.
	2.	Forslagene er tydelig skilt mellom Facebook, Instagram og LinkedIn.
	3.	Hver tekst kan kopieres separat.
	4.	Inputfeltet valideres før innsending.
	5.	Brukeren får en forståelig feilmelding ved feil.
	6.	Løsningen fungerer godt på mobil og desktop.
	7.	AI-resultatene følger ønsket språk og kanaltilpasning.
	8.	API-nøkkel er ikke eksponert i frontend.

⸻

16. Måleparametere

Følgende kan brukes for å vurdere om løsningen fungerer godt:
	•	tid spart per publisering
	•	hvor ofte brukeren tar i bruk forslagene uten større redigering
	•	brukeropplevd kvalitet på tekstene
	•	andel vellykkede genereringer
	•	gjennomsnittlig svartid

⸻

17. Risikoer og avgrensninger

Risikoer
	•	AI kan formulere seg litt for generelt
	•	AI kan gi ujevne resultater hvis originalteksten er veldig kort eller uklar
	•	AI kan av og til returnere format som ikke matcher forventet JSON
	•	svartid kan variere avhengig av AI-leverandør

Tiltak
	•	bruke tydelig systemprompt
	•	validere og eventuelt parse responsen i backend
	•	gi brukeren tydelige feilmeldinger
	•	teste med realistiske eksempler fra Newton-rommet

⸻

18. Fremtidige utvidelser

Mulige forbedringer etter MVP:
	•	valg mellom flere tone-of-voice-profiler
	•	støtte for hashtags
	•	lagring av tidligere forslag
	•	redigering av prompt via adminvisning
	•	flere kanaler, som TikTok eller nyhetsbrev
	•	mulighet for å legge inn målgruppe eller kampanjemål
	•	direkte eksport eller integrasjon med publiseringsverktøy

⸻

19. Foreslått systemprompt

Du er en norsk innholdsassistent som hjelper Newton-rommet med å omformulere tekster til sosiale medier.

Newton-rommet driver undervisning innen realfag og teknologi for elever.

Når brukeren gir deg en tekst eller et utgangspunkt, skal du lage tre versjoner av teksten:
1. Facebook – litt lengre, engasjerende og folkelig tone
2. Instagram – kortere, mer punchy, gjerne med emojis
3. LinkedIn – mer profesjonell og faglig tone

Krav:
- Skriv på norsk bokmål
- Tekstene skal ha naturlig flyt og være klare til publisering
- Bruk relevante emojis på Facebook og Instagram når det passer, men ikke overdriv
- Ha en tydelig, men ikke masete formidling
- Behold meningen i originalteksten, men gjør språket bedre og plattformtilpasset
- Ikke finn opp fakta som ikke finnes i originalteksten
- Hvis informasjon mangler, skriv nøkternt og generelt

Når det passer, foreslå også:
- En kort tekst til bilde
- En enkel call-to-action

Svar alltid i gyldig JSON med disse feltene:
{
  "facebook": "...",
  "instagram": "...",
  "linkedin": "...",
  "imageText": "...",
  "cta": "..."
}

Hvis kort tekst til bilde eller CTA ikke passer, returner tom streng i feltet.