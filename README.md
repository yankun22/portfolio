# Portfolio & Engineering Showcase

Hi, I'm **Alok Vishwakarma** — a full-stack engineer and creative technologist.

This repository is a monorepo containing 15 interactive web applications and a master exhibition hub. I built these projects to push the capabilities of modern web browsers, focusing on **Three.js / WebGL 3D**, **Web Audio API & low-latency DSP**, **in-browser SQLite via WebAssembly**, **stochastic Monte Carlo simulations**, and **interactive graph visualizations**.

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
| **11** | **[AgentMesh](./11-AgentMesh)** | [agentmesh.vercel.app](https://agentmesh.vercel.app) | Autonomous Agent Consensus & Topology | Next.js 15, Canvas 2D, Zustand | 5-Step Byzantine Quorum loop, vector inspection |
| **12** | **[VoxelDB](./12-VoxelDB)** | [voxeldb.vercel.app](https://voxeldb.vercel.app) | 3D Vector Space & HNSW Quantization | Three.js, React Three Fiber, WebGL | 1,500+ WebGL vectors, INT8/FP16/FP32 HUD |
| **13** | **[EventPulse](./13-EventPulse)** | [eventpulse.vercel.app](https://eventpulse.vercel.app) | Real-Time Kafka Stream & Schema Evolution | Next.js 15, Kafka Streams, Zustand | 3-stage animated stream, DLQ reprocess workflow |
| **14** | **[LatencyLens](./14-LatencyLens)** | [latencylens.vercel.app](https://latencylens.vercel.app) | Anycast Routing & Microsecond Waterfall | Next.js 15, D3 Geo, SVG Maps | Geodesic flight paths, V8 vs Container benchmark |
| **15** | **[PromptForge](./15-PromptForge)** | [promptforge.vercel.app](https://promptforge.vercel.app) | Prompt Arena & LLM Guardrails IDE | Next.js 15, Zustand, Tailwind | Split-pane streaming, 5-case eval, cache cost savings |

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

### 11. AgentMesh (`11-AgentMesh`)
An autonomous multi-agent consensus network and topology simulator built with Next.js 15, TypeScript, Tailwind CSS, and Zustand. Features a hardware-accelerated Canvas 2D engine rendering 5 agent archetypes (Router, Specialist, Synthesizer, Guardrail, Arbiter) with directional particle beams, multi-step deterministic Byzantine quorum consensus loops, and an ultra-deep dark glassmorphic agent inspection panel exposing vector context buffers, JSON schemas, and prompt trace logs.

### 12. VoxelDB (`12-VoxelDB`)
A 3D vector space canvas and HNSW nearest-neighbor quantization engine built with Next.js 15, React Three Fiber, Three.js, TypeScript, Tailwind CSS, and Zustand. Features a high-density 3D scatter plot of 1,500+ categorized vector embeddings across 5 semantic domains, interactive pulsing query probes with dynamic Top-K laser conduits, multi-metric switching (Cosine, Euclidean L2, Manhattan L1), memory footprint quantization HUD (INT8 vs FP16 vs FP32), an interactive raw 768-dim vector payload inspector, and responsive mobile viewport support.

### 13. EventPulse (`13-EventPulse`)
An enterprise real-time event streaming cockpit and schema evolution sandbox built with Next.js 15, TypeScript, Tailwind CSS, and Zustand. Features a 3-stage partitioned Kafka/Redpanda stream canvas (Ingestion Gate -> Partition 0/1/2 -> Consumer Group Workers) with live animated packet trajectories, side-by-side JSON Schema compatibility validator (BACKWARD, FORWARD, FULL), a chaos engineering controller with consumer crash and 5000ms partition lag simulators, and a Dead-Letter Queue (DLQ) with a 1-click reprocess and re-route workflow.

### 14. LatencyLens (`14-LatencyLens`)
A high-performance Anycast network routing simulator, microsecond-precision waterfall profiler, and Edge V8 Isolate vs OCI Container performance benchmark built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Zustand. Features an interactive SVG global world map plotting 6 core data center PoPs (Tokyo, Singapore, Frankfurt, London, Virginia, Mumbai) with geodesic flight arcs and fiber propagation RTT calculations, a microsecond Gantt chart profiling DNS, TCP 1-RTT, TLS 1.3, cache lookups, and compute execution, an architectural runtime comparative simulator with concurrency surge curves, and responsive mobile phone support (412x915 px).

### 15. PromptForge (`15-PromptForge`)
An enterprise prompt engineering arena, automated LLM guardrail evaluation test suite, and semantic token diff & prompt cache cost arbitrage calculator built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Zustand. Features a split-pane dual comparison view (Zero-Shot Baseline vs Chain-of-Thought Guardrailed) with real-time token-by-token simulated streaming and variable interpolation, 5 automated eval test cases (JSON Schema Compliance, Malicious Injection Refusal, Latency SLA, Zero Hallucination, Brand Tone Alignment), visual inline token diffs, and an enterprise prompt caching cost savings model (up to 90% savings).

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Next.js 15, Vite 8, Zustand 5
- **3D & Graphics**: Three.js, React Three Fiber (@react-three/fiber, @react-three/drei), WebGL, HTML5 Canvas 2D
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
npm run dev:agentmesh      # AgentMesh (Autonomous Agent Consensus)
npm run dev:voxeldb        # VoxelDB (3D Vector Space & HNSW)
npm run dev:eventpulse     # EventPulse (Real-Time Stream Cockpit)
npm run dev:latencylens    # LatencyLens (Anycast & Microsecond Waterfall)
npm run dev:promptforge    # PromptForge (Prompt Arena & LLM Eval IDE)
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
