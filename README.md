# Portfolio & Engineering Showcase

Hi, I'm **Alok Vishwakarma** — a full-stack engineer and creative technologist.

This repository is a monorepo containing 10 interactive web applications and a master exhibition hub. I built these projects to push the capabilities of modern web browsers, focusing on **Three.js / WebGL 3D**, **Web Audio API & low-latency DSP**, **in-browser SQLite via WebAssembly**, **stochastic Monte Carlo simulations**, and **interactive graph visualizations**.

[![CI Pipeline](https://github.com/yankun22/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/yankun22/portfolio/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Showcase_Only-red.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg?logo=typescript)](#)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](#)

[🌐 Master Hub Live](https://alokvishwa-studio.vercel.app) • [💼 Inquiries](mailto:contact@alokvishwastudio.in) • [📄 Licensing](./LICENSE) • [🐙 GitHub](https://github.com/yankun22)

---

## 🚀 Live Deployments

All projects are deployed and live on Vercel. Feel free to try them out:

| # | Project | Live Demo | Focus Area | Tech Stack | Highlights |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **00** | **[Master Hub](./00-master-hub)** | [alokvishwa-studio.vercel.app](https://alokvishwa-studio.vercel.app) | Portfolio Directory | Next.js 15, Tailwind, Framer | Filterable catalog & search |
| **01** | **[WealthFlow](./01-wealthflow)** | [wealthflow-zeta.vercel.app](https://wealthflow-zeta.vercel.app) | Fintech & Wealth Analytics | React 19, Recharts, jsPDF | 500-iteration Monte Carlo simulation |
| **02** | **[SoundPulse](./02-soundpulse)** | [soundpulse-five.vercel.app](https://soundpulse-five.vercel.app) | Web Audio DAW & Oscilloscope | Web Audio API, Wavesurfer.js | Real-time DSP rack, drum synth, WAV export |
| **03** | **[SpatialCore](./03-spatialcore)** | [spatialcore-five.vercel.app](https://spatialcore-five.vercel.app) | 3D Product Customizer | Three.js, WebGL, OrbitControls | PBR material tiers, exploded-view animation |
| **04** | **[IncidentPulse](./04-incidentpulse)** | [incidentpulse.vercel.app](https://incidentpulse.vercel.app) | SRE Status & Incident Deck | React 19, SVG Topology | Simulated anomaly feed, command palette, Kanban |
| **05** | **[NexusWiki](./05-nexuswiki)** | [nexuswiki-five.vercel.app](https://nexuswiki-five.vercel.app) | Bi-Directional Note Taking | D3.js, KaTeX, LocalStorage | Dynamic [[WikiLinks]], force physics graph |
| **06** | **[CanvasFlow](./06-canvasflow)** | [canvasflow-drab.vercel.app](https://canvasflow-drab.vercel.app) | Vector Diagramming Canvas | HTML5 Canvas, SVG | Infinite pan/zoom, magnetic routing, vector export |
| **07** | **[VoyagePlanner](./07-voyageplanner)** | [voyageplanner-three.vercel.app](https://voyageplanner-three.vercel.app) | Route Planner & Trip Budget | Leaflet, dnd-kit, Open-Meteo | Continuous map routing, multi-currency splitter |
| **08** | **[VitalPulse](./08-vitalpulse)** | [vitalpulse-iota.vercel.app](https://vitalpulse-iota.vercel.app) | Health & Biometrics Dashboard | Responsive SVG Charts | Time-series telemetry, ASCVD risk calculator |
| **09** | **[CodeForge](./09-codeforge)** | [codeforge-one-phi.vercel.app](https://codeforge-one-phi.vercel.app) | In-Browser Code Sandbox & DB | sql.js WASM, Regex AST | In-memory SQLite engine, regex railroad diagram |
| **10** | **[HavenRealty](./10-havenrealty)** | [havenrealty-omega.vercel.app](https://havenrealty-omega.vercel.app) | Architectural Real Estate | HTML5 Canvas 360°, SVG | 360° cylindrical room panorama, yield solver |

---

## 🛠️ Overview of Projects

### 01. WealthFlow (`01-wealthflow`)
A personal finance and wealth trajectory simulator. Features a 500-iteration Monte Carlo engine using geometric Brownian motion to model 10, 25, and 50-year outcomes with confidence bands ($P_{10}, P_{50}, P_{90}$). Also includes a multi-asset allocation tracker, FIRE timeline calculator, and formatted PDF export.

### 02. SoundPulse (`02-soundpulse`)
An in-browser digital audio workstation and waveform editor. Built with the native Web Audio API and Wavesurfer.js. Includes a 3-band parametric EQ, resonant biquad filters, convolution reverb, an 8-pad procedural drum synthesizer, offline WAV rendering, and real-time 60 FPS oscilloscope visualizers.

### 03. SpatialCore (`03-spatialcore`)
An interactive 3D product customization studio. Built with Three.js featuring physical studio lighting, OrbitControls, dynamic PBR material switching (carbon fiber, titanium, leather, chrome), spring-animated exploded view assemblies, and instant high-res snapshot export.

### 04. IncidentPulse (`04-incidentpulse`)
An SRE incident triage and service telemetry dashboard. Includes a simulated streaming anomaly feed (latency spikes, 5xx errors, deadlocks), keyboard-first command palette (`Cmd+K`), a 4-stage triage board with SLA timers, and an interactive microservice dependency graph.

### 05. NexusWiki (`05-nexuswiki`)
A networked note-taking application inspired by Obsidian. Features a custom markdown parser supporting `[[WikiLinks]]`, LaTeX math via KaTeX, dynamic tag indexing, and an interactive D3.js force-directed graph to visualize connections between notes.

### 06. CanvasFlow (`06-canvasflow`)
A hardware-accelerated diagramming canvas. Supports infinite pan and zoom with cursor-anchoring, magnetic anchor ports with Bézier routing, pressure-smoothed freehand brush curves, history undo/redo stacks, and multi-scale vector SVG/PNG export.

### 07. VoyagePlanner (`07-voyageplanner`)
A travel itinerary builder with continuous map routing using Leaflet. Supports drag-and-drop multi-day scheduling, route playback simulation, Open-Meteo weather forecasts, and a graph-based debt minimization solver for multi-currency group expenses.

### 08. VitalPulse (`08-vitalpulse`)
A clinical biometric telemetry and patient monitoring dashboard. Features custom responsive SVG charts for blood pressure (AHA zones), heart rate, glucose, and sleep stages. Includes an interactive AHA/ACC 10-year cardiovascular risk calculator and formatted printable PDF reports.

### 09. CodeForge (`09-codeforge`)
A developer playground combining an isolated iframe execution sandbox with a real in-memory SQLite database powered by WebAssembly (`sql.js`). Also includes an interactive SVG railroad diagram generator that parses regular expressions into state machines.

### 10. HavenRealty (`10-havenrealty`)
An architectural real estate showcase. Features an interactive SVG floor plan explorer with room hotspots, a cylindrical 360° panorama canvas with adjustable lighting moods, and a comprehensive mortgage amortization and rental yield calculator.

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Next.js 15, Vite 8
- **3D & Graphics**: Three.js, WebGL, HTML5 Canvas 2D
- **Audio & DSP**: Web Audio API, Wavesurfer.js, OfflineAudioContext
- **Data & Visualization**: D3.js, Recharts, Chart.js, Custom SVG
- **Engines & Tools**: SQLite WASM (`sql.js`), Leaflet, KaTeX, `@dnd-kit`, jsPDF, Lucide React

---

## ⚡ Running Locally

You can run any of the applications directly from the root using the monorepo scripts:

```bash
# Clone the repository
git clone https://github.com/yankun22/portfolio.git
cd portfolio

# Run any project
npm run dev:wealthflow     # WealthFlow (Monte Carlo & FIRE)
npm run dev:soundpulse     # SoundPulse (Web Audio DAW)
npm run dev:spatialcore    # SpatialCore (Three.js 3D Studio)
npm run dev:incidentpulse  # IncidentPulse (SRE Dashboard)
npm run dev:nexuswiki      # NexusWiki (Knowledge Graph)
npm run dev:canvasflow     # CanvasFlow (Diagramming Canvas)
npm run dev:voyageplanner  # VoyagePlanner (Map & Routing)
npm run dev:vitalpulse     # VitalPulse (Health Telemetry)
npm run dev:codeforge      # CodeForge (SQLite WASM Sandbox)
npm run dev:havenrealty    # HavenRealty (Architectural 360°)
npm run dev:hub            # Master Hub

# Run checks across all projects
npm run lint:all           # Run oxlint across all projects
npm run build:all          # Run production builds
```

---

## 📄 License & Usage

Copyright (c) 2024–2026 Alok Vishwakarma. All rights reserved.

This repository is published for portfolio demonstration, technical evaluation, and client review. The code is proprietary and not licensed for public re-hosting, commercial deployment, resale, or redistribution without written permission.

For commercial licensing, consulting, or contract inquiries, please reach out to **contact@alokvishwastudio.in**.

---

## 📬 Contact & Inquiries

I am available for full-stack engineering contracts, WebGL/3D development, and custom web application projects.

- **Email**: [contact@alokvishwastudio.in](mailto:contact@alokvishwastudio.in)
- **LinkedIn**: [linkedin.com/in/alokvishwa-studio](https://www.linkedin.com/in/alokvishwa-studio)
- **GitHub**: [github.com/yankun22](https://github.com/yankun22)
