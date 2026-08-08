# MidwifePro – MVP Lern-App für das Hebammen-Staatsexamen

[![Deploy to GitHub Pages](https://github.com/mirjamcpeters/MidwifePro/actions/workflows/pages.yml/badge.svg)](https://github.com/mirjamcpeters/MidwifePro/actions/workflows/pages.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmirjamcpeters.github.io%2FMidwifePro%2F&label=live%20app)](https://mirjamcpeters.github.io/MidwifePro/)

Eine sehr schlanke, mobile-first Lern-App zur täglichen Vorbereitung auf das Staatsexamen.
Kein Login, kein Backend, keine Navigation – nur eine ruhige Oberfläche und 5 Minuten Lernen pro Tag.

**Live:** https://mirjamcpeters.github.io/MidwifePro/ (via GitHub Pages, siehe unten)

## Ablauf

```
Start → Frage → Feedback → (5×) → Tagesabschluss → Start
```

- **Start:** Begrüßung, Start-Button, Fortschrittsring und Statistik (Trefferquote, beantwortete Fragen, Lernserie).
- **Frage:** Single-Choice (runde Auswahl) oder Multiple-Choice (eckige Auswahl). Single-Choice wählt aus und geht automatisch weiter; Multiple-Choice braucht "Antwort überprüfen".
- **Feedback:** Richtig/Falsch, die eigene Antwort, bei Fehlern zusätzlich die richtige Antwort, eine kurze Erklärung und die Quelle.
- **Tagesabschluss:** Nach der 5. Frage – Konfetti-Animation, Tagesergebnis, aktualisierte Lernserie.

## Lokal starten

Kein Build-Schritt nötig, es reicht ein beliebiger statischer Webserver im Projektordner, z. B.:

```bash
cd hebammenpro-lernapp
python3 -m http.server 8792
```

Danach im Browser öffnen: `http://localhost:8792`

### Auf dem Handy testen

Handy und Rechner müssen im selben WLAN sein. Lokale IP-Adresse des Rechners herausfinden:

```bash
ipconfig getifaddr en0
```

Auf dem Handy im Browser öffnen: `http://<diese-IP>:8792`

Die Oberfläche ist mobile-first gebaut (`width: 100%`, `min-height: 100dvh`) und füllt automatisch die volle Bildschirmhöhe/-breite des jeweiligen Geräts – auf dem Desktop erscheint sie zur besseren Lesbarkeit als zentrierte Karte.

#### Fehler in Safari (iPhone): "Nur-HTTPS-Modus"

Da der lokale Server nur `http://` (kein SSL-Zertifikat) spricht, blockiert Safari die Seite,
wenn der "Nur-HTTPS-Modus" aktiv ist. Das lässt sich pro Website abschalten:

1. In Safari die Adresse öffnen (`http://<IP>:8792`) – die Fehlerseite erscheint.
2. Auf das "aA"-Symbol links in der Adressleiste tippen.
3. **Website-Einstellungen** → **Nur-HTTPS-Modus** für diese Website deaktivieren.
4. Seite neu laden.

Danach lässt sich die Seite ganz normal in Safari öffnen und über "Zum Home-Bildschirm hinzufügen"
als App-Icon ablegen (öffnet dann ohne Adressleiste, wie eine echte App).

## Hosting über GitHub Pages

Das Repo enthält bereits einen GitHub-Actions-Workflow (`.github/workflows/pages.yml`), der die App
bei jedem Push auf `main` automatisch auf GitHub Pages veröffentlicht – kostenlos, mit gültigem
HTTPS-Zertifikat, ohne eigenen Server oder Tunnel.

**Einmaliger manueller Schritt** (das kann nur ein eingeloggter Repo-Owner/Admin machen, nicht per
Skript automatisierbar):

1. Im Repo auf GitHub: **Settings** → **Pages**.
2. Unter **Build and deployment** → **Source** → **GitHub Actions** auswählen.
3. Einmal auf **Save**. Der vorhandene Workflow läuft danach automatisch bei jedem Push.

Nach ein bis zwei Minuten ist die App erreichbar unter:

```
https://mirjamcpeters.github.io/MidwifePro/
```

Der Fortschritt (Fragen-Streak, Trefferquote) bleibt dabei weiterhin rein lokal im Browser jedes
Geräts gespeichert – GitHub Pages hostet nur die statischen Dateien, es gibt keinen Server-Zustand.

## Projektstruktur

| Datei | Zweck |
|---|---|
| `index.html` | Grundgerüst, lädt Fonts, Styles und Skripte |
| `styles.css` | Sämtliche Styles (Farben, Typografie, Layout, Animationen) |
| `questions.js` | Der Fragenpool als reine Datenstruktur |
| `app.js` | Anwendungslogik: State, Persistenz, Auswahl-Algorithmus, Rendering |

Kein Framework, kein Build-Tool – reines HTML/CSS/JavaScript.

## Fragenpool erweitern

Jede Frage in `questions.js` ist ein flaches Objekt:

```js
{
  id: 'q21',                       // eindeutig, wird für die Lernfortschritt-Speicherung genutzt
  topic: 'Physiologische Geburt',  // aktuell ein Thema, spätere Themen einfach als weiteren Wert nutzen
  type: 'single',                  // 'single' (runde Buttons) oder 'multiple' (eckige Buttons)
  text: 'Fragetext …',
  options: [
    { key: 'A', text: '…' },
    { key: 'B', text: '…' },
    { key: 'C', text: '…' },
    { key: 'D', text: '…' }
  ],
  correct: ['B'],                  // ein Key bei single, mehrere bei multiple
  explanation: '3–5 Sätze Erklärung …',
  source: 'Autor, Titel, Jahr'
}
```

Um mehr Fragen oder Themen hinzuzufügen, genügt es, weitere Objekte an das `QUESTIONS`-Array anzuhängen –
am Code selbst muss nichts geändert werden. Die flache, textbasierte Struktur ist bewusst so gehalten,
dass sie sich später leicht aus einem Markdown-Dokument oder Google Doc generieren lässt (z. B. per KI),
falls ein CMS-Anschluss folgt.

## Lernlogik (Spaced Repetition, ohne Backend)

Der gesamte Lernfortschritt wird ausschließlich im `localStorage` des Browsers gespeichert
(Schlüssel `midwifepro:v1`) – es gibt keinen Server und keine geräteübergreifende Synchronisation.

**Pro Frage wird ein Trefferzähler (`correctStreak`, 0–3) geführt:**

| Zustand | Bedeutung | Gewicht bei der täglichen Auswahl |
|---|---|---|
| 0 | nie oder zuletzt falsch beantwortet | hoch |
| 1 | 1× richtig | normal |
| 2 | 2× richtig | reduziert (seltener) |
| 3 | 3× richtig | wird aus dem täglichen Zufallspool entfernt |

Eine falsche Antwort setzt den Zähler der jeweiligen Frage zurück auf 0. Eine übersprungene Frage
("Frage überspringen") verändert den Zähler nicht – sie gilt schlicht als nicht bewertet.

**Auswahl pro Lerneinheit:** Bei jedem Klick auf "Lerneinheit starten" werden 5 Fragen gewichtet
zufällig neu gezogen – mehrere Lerneinheiten am selben Tag sind also möglich. Ein Neuladen der Seite
mitten in einer laufenden Lerneinheit setzt diese nicht zurück (Fortschritt bleibt erhalten).

**Lernserie:** Wird an einem Tag mindestens eine Lerneinheit abgeschlossen und war der Vortag
ebenfalls abgeschlossen, erhöht sich die Serie um 1; bei einer Lücke beginnt sie wieder bei 1.
Weitere Lerneinheiten am selben Tag erhöhen die Serie nicht zusätzlich.

## Fortschritt zurücksetzen

Der gesamte Lernfortschritt liegt im `localStorage`. Zum Zurücksetzen in der Browser-Konsole:

```js
localStorage.removeItem('midwifepro:v1');
```

## Designprinzipien

- Sofort startklar, keine Einstellungen, keine Entscheidungen
- Kein Login, kein Backend, keine Navigation
- Mobile-first, ruhige Oberfläche, hochwertige Typografie (Cormorant Garamond + Inter)
- Lieber ein Element weglassen als eines hinzufügen
