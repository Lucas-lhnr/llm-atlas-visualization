
# KI Model Benchmark Explorer

Interaktive 3D-Visualisierung aktueller KI-Sprachmodelle auf Basis verschiedener Benchmark-Kategorien.

## Inhalt

Interaktive 3D-Visualisierung mit Three.js (index.html + main.js).

Lokale Daten liegen im Projektverzeichnis. Wichtige Dateien:

* data.csv — Datensatz mit Benchmark-Ergebnissen aktueller KI-Sprachmodelle
* main.js — Erstellung der 3D-Szene, Datenverarbeitung und Interaktionen
* style.css — Layout und Benutzeroberfläche
* index.html — Hauptseite der Visualisierung

## Eigenschaften

* Interaktive 3D-Visualisierung mit Three.js
* Rotierbare, verschiebbare und zoombare Ansicht mit OrbitControls
* Farbkodierung nach Entwickler
* Größenkodierung anhand des Overall Scores
* Darstellung von Open-Weight- und proprietären Modellen
* Dynamische Skalierung der Achsen auf Basis der vorhandenen Daten
* Hover-Tooltips mit Modellinformationen
* Detailansicht für ausgewählte Modelle
* Vergleichsansicht zweier Modelle mittels Shift-Klick
* Filter nach Entwickler und Quelltyp
* Erweiterte Filter für Coding, Knowledge und Agentic
* Suchfunktion für Modellnamen
* Kamera-Reset und Anzeige der aktuell sichtbaren Modelle

## Datenquelle

BenchLM Leaderboard

https://benchlm.ai/

## Lokales Testen

Im Projektverzeichnis einen einfachen HTTP-Server starten (ES-Module und das Laden der CSV-Datei benötigen HTTP):

python -m http.server 8000

Anschließend im Browser öffnen:

http://localhost:8000/

## Online-Version

Die Visualisierung ist über GitHub Pages erreichbar:

[GitHub-Pages-Link hier einfügen]

## Lizenz / Hinweise

Die Benchmark-Daten stammen von der oben genannten Quelle. Dieses Repository dient der Visualisierung und dem Vergleich aktueller KI-Sprachmodelle. Bei Weiterverwendung der Daten bitte die ursprüngliche Quelle angeben.
