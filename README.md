# Kinaara 🌊

**A safety-first recreational intelligence platform for India's coastline.**

Kinaara (also referenced as *TideSense* in early planning docs) fuses government ocean, weather, and pollution data into a single **Beach Suitability Index (BSI)** — helping tourists know when a beach is actually safe to visit, and helping State Tourism Boards monitor conditions across their coastline. Built for the Smart India Hackathon (SIH) internal round.

---

## The Problem

- 7,500 km of coastline, 1,000+ drownings a year, largely from unpredictable rip currents
- Water quality and crowding data exist but are siloed across INCOIS, IMD, and CPCB
- Tourists have no single, actionable source of truth before or during a beach visit

## The Solution

A weighted **Beach Suitability Index (0–100)** combining safety, water quality, weather, and crowd data — with a **Safety Override** that hard-caps the score to 0 during active cyclone, tsunami, high-wave, or rip-current alerts, regardless of how good the score would otherwise be.

```text
BSI = (0.4 × Safety + 0.3 × WaterQuality + 0.2 × Weather + 0.1 × Crowd) / ΣWeights

```

---

## Tech Stack

| Layer | Technology | Hosting |
| --- | --- | --- |
| Backend API | Python (FastAPI) + SQLAlchemy | Vercel |
| Database | MySQL | Aiven (free tier) |
| Frontend | React + TypeScript (Vite), Tailwind CSS | Vercel |
| Maps | React Leaflet + OpenStreetMap | CDN |
| Charts | Chart.js | CDN |
| Notifications | Web Push API (VAPID) | Native browser |
| Data Sources | INCOIS (WMS/WFS), Open-Meteo (Marine + Weather), CPCB (baseline water quality) | — |

---

## Core Features

* 🗺️ Beach directory & map with live BSI scores, lifeguard/parking/food overlays
* 🌊 Real-time wave, swell, weather, and tide data
* 🚨 Safety Override alert system (cyclone/tsunami/rip-current hard-cap)
* 🧑‍⚕️ User safety profile: emergency contacts, blood group, medical notes
* 🌐 Multilingual UI
* 🔔 Push notifications for active hazard alerts
* 📊 Tourism Board compliance dashboard
* 👥 Crowd-sourced reports (jellyfish, litter, crowding)

---

## Project Structure

```text
Kinaara/
├── backend/          # FastAPI + MySQL REST API
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── routers/
│   │   └── services/ # bsi.py, weather.py, incois.py, safety_override.py
│   └── requirements.txt
├── tidesense-frontend/ # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── design/           # Figma exports, design tokens
└── docs/             # API contract, roadmap

```

---

## Getting Started

**Backend**

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

```

**Frontend**

```bash
cd tidesense-frontend
npm install
npm run dev

```

Set `DATABASE_URL`, `JWT_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `API_BASE_URL` as environment variables (see `.env.example`).

---

## Impact

* **Public Safety** — real-time, government-sourced hazard awareness
* **Blue Economy** — supports India's Deep Ocean Mission & sustainable coastal tourism
* **Government Adoption** — free compliance dashboard for State Tourism Boards

## License

MIT License

```

Once you save this in VS Code, you can finish the merge process by running `git add README.md`, followed by `git commit -m "Resolved merge conflict in README.md"`, and then `git push -u origin FrontEnd`.

Does this updated structure accurately reflect the rest of your team's hackathon project setup?
