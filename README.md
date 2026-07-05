# KI Model Benchmark Explorer

Interaktive 3D-Visualisierung aktueller Large Language Models (LLMs) auf Basis verschiedener Benchmark-Kategorien.

## Live-Version

Die Visualisierung ist über GitHub Pages erreichbar:

**https://lucas-lhnr.github.io/llm-atlas-visualization/**

---

# Motivation

Mit der zunehmenden Anzahl leistungsfähiger KI-Sprachmodelle wird deren Vergleich immer komplexer. Tabellen mit Benchmark-Ergebnissen ermöglichen zwar einen direkten Zahlenvergleich, bieten jedoch nur einen begrenzten Überblick über Zusammenhänge zwischen verschiedenen Leistungsmerkmalen.

Ziel dieses Projekts war die Entwicklung einer interaktiven 3D-Informationsvisualisierung, welche die Leistungsdaten aktueller KI-Sprachmodelle übersichtlich darstellt und durch verschiedene Interaktionsmöglichkeiten eine explorative Analyse ermöglicht.

---

# Visualisierte Daten

Visualisiert werden Benchmark-Ergebnisse aktueller Large Language Models.

Der Datensatz enthält unter anderem folgende Informationen:

- Modellname
- Entwickler
- Open Weight / Proprietary
- Overall Score
- Coding
- Knowledge
- Agentic
- Reasoning
- Math
- Multilingual
- Multimodal Grounded
- Instruction Following
- Input- und Output-Preis

## Datenquelle

BenchLM Leaderboard

https://benchlm.ai/

---

# Datenmapping

Die Modelle werden als Kugeln im dreidimensionalen Raum dargestellt.

| Visuelles Merkmal | Zugeordnete Daten |
|-------------------|-------------------|
| X-Achse           | Coding            |
| Y-Achse           | Knowledge         |
| Z-Achse           | Agentic           |
| Kugelgröße        | Overall Score     |
| Kugelfarbe        | Entwickler        |
| Material          | Open / Proprietary|

Die Achsen werden automatisch anhand der im Datensatz vorhandenen Minimal- und Maximalwerte skaliert.

---

# Interaktion

Die Anwendung unterstützt verschiedene Interaktionsmöglichkeiten:

- Drehen, Zoomen und Verschieben der Kamera
- Auswahl eines Modells per Mausklick
- Detailansicht eines ausgewählten Modells
- Vergleich zweier Modelle mittels **Shift + Klick**
- Hover-Tooltip mit Modellinformationen
- Suchfunktion nach Modellnamen
- Filter nach Entwickler
- Filter nach Quelltyp
- Filter nach Overall Score
- Erweiterte Filter für Coding, Knowledge und Agentic
- Zurücksetzen der Kamera auf die Ausgangsansicht
- Anzeige der aktuell sichtbaren Modelle

---

# Aufbau des Projekts

Die wichtigsten Dateien sind:

- **index.html** – Benutzeroberfläche
- **main.js** – Erstellung der 3D-Szene, Datenverarbeitung und Interaktionen
- **style.css** – Gestaltung der Benutzeroberfläche
- **data.csv** – Benchmark-Datensatz

---

# Verwendete Technologien

- HTML5
- CSS3
- JavaScript (ES6)
- Three.js
- OrbitControls

---

# Lokales Ausführen

Da die Daten per `fetch()` geladen werden, muss die Anwendung über einen HTTP-Server gestartet werden.

Beispiel mit Python:

```bash
python -m http.server 8000
```

Anschließend im Browser öffnen:

```
http://localhost:8000/
```

---

# XR

Für dieses Projekt wurde keine XR- oder VR-Erweiterung umgesetzt.

---

# Lizenz / Hinweise

Die verwendeten Benchmark-Daten stammen vom BenchLM Leaderboard.

Diese Anwendung dient ausschließlich der Visualisierung und dem Vergleich aktueller KI-Sprachmodelle. Bei Weiterverwendung der Daten sollte die ursprüngliche Quelle angegeben werden.
