# Supervision & Analyse des Capteurs IoT (ESP32)

Interface web légère de supervision industrielle (SCADA / Dashboard IoT) permettant de visualiser, analyser et exporter en temps réel les mesures de **Température (°C)** et d'**Humidité (%)** transmises par un microcontrôleur **ESP32** via l'API REST **ThingSpeak**.

**Lien de démonstration en direct :** https://abdouousmanemecatronique-spec.github.io/dashboard-capteurs-esp32/

---

## Architecture du système

Capteurs (DHT11/DHT22) -> ESP32 (Wi-Fi) -> Cloud ThingSpeak (API REST) -> Dashboard Web (HTML / CSS / JS + Chart.js)

## Fonctionnalités principales

- **Acquisition temps réel :** Interrogation automatique du canal ThingSpeak (`#3551785`) toutes les 15 secondes.
- **Indicateurs clés (KPI) & Statistiques :** Affichage de la dernière mesure ainsi que des valeurs **Minimum** et **Maximum** sur la fenêtre choisie (15, 30 ou 60 relevés).
- **Détection d'anomalies (Alertes visuelles) :** Passage automatique des cartes en alerte rouge en cas de dépassement des seuils critiques (`Température > 30 °C` ou `Humidité > 80 %`).
- **Mode Simulation intégré :** Bouton permettant de générer des courbes réalistes à la demande pour tester ou présenter l'interface sans matériel connecté.
- **Exportation CSV :** Téléchargement en un clic de l'historique des relevés au format `.csv` exploitable sous Excel, Python ou MATLAB.

## Structure du projet

- `index.html` : Structure sémantique de l'interface homme-machine (IHM) et intégration de **Chart.js**.
- `style.css` : Design sombre industriel responsive (Grilles CSS adaptatives et états d'alerte).
- `script.js` : Logique métier, requêtes `fetch()` vers l'API ThingSpeak, tracé dynamique des courbes et génération de fichiers `.csv`.
