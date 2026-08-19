# 🚀 Interactive Web Applications & Engineering Portfolio

A showcase of production-grade, high-performance web applications built with **React 19**, **TypeScript**, **Three.js**, **Web Audio API**, **Chart.js**, **D3.js**, and **Wavesurfer.js**.

---

## 📂 Project Showcase

### 1. 💎 [WealthFlow (`01-wealthflow`)](./01-wealthflow)
> **Comprehensive Wealth Management, Stochastic Monte Carlo Engine & FIRE Analytics Web App**

- **Multi-Asset Portfolio Tracker**: Add, edit, and delete assets across Cash, Stocks, Crypto, Real Estate, and Commodities with live asset-allocation donut visualization.
- **500-Iteration Monte Carlo Simulation**: 10, 25, and 50-year wealth trajectories with custom drift, volatility, inflation, and percentile outcome fan charts ($P_{10}, P_{50}, P_{90}$).
- **Financial Independence (FIRE) Calculator**: Dynamic calculation for Standard-FIRE, Lean-FIRE, and Coast-FIRE target dates with animated progress dials.
- **Export Suite**: Multi-page formatted PDF financial health reports (via `jsPDF`) and CSV data exports.
- **Local Persistence**: `localStorage` auto-sync for all portfolio holdings and simulation parameters.

---

### 2. 🎧 [SoundPulse (`02-soundpulse`)](./02-soundpulse)
> **Interactive Web Audio DAW, Waveform Editor & 60fps Oscilloscope**

- **Wavesurfer.js Waveform Studio**: Multi-source audio loader (MP3/WAV/FLAC upload, direct mic recording, 440Hz calibration test tone, and synthesized Cyberpunk/Lo-Fi loops) with interactive scrubbing and zooming ($10\text{px} \dots 300\text{px}/\text{s}$).
- **Real-Time DSP FX Rack**: 3-Band Parametric EQ (Low/Mid/High Shelf + Peak), Resonant High-pass/Low-pass Biquad Filters, Algorithmic Convolution Reverb, and WaveShaper Distortion (Warm Tube, Hard Clip, Heavy Fuzz, Bitcrush).
- **8-Pad Synthesized Drum Soundboard**: Zero-latency procedural Web Audio percussive instruments with keyboard hotkeys (`Q, W, E, R, A, S, D, F`).
- **Offline DSP FX Rendering & WAV Export**: Hardware-accelerated offline DSP rendering (`OfflineAudioContext`) baking all active FX and reverb tails into 16-bit linear PCM WAV files for both full mixes and sliced regions.
- **60fps Oscilloscope & RTA**: Multi-mode visualizer (Phosphor Oscilloscope, 64-band RTA Frequency Spectrum, and X/Y Stereo Phase Scope).

---

### 3. 👟 [SpatialCore (`03-spatialcore`)](./03-spatialcore)
> **Interactive 3D E-Commerce Product Studio & Customizer**

- **3D Procedural Studio Canvas**: Three.js WebGL viewport featuring the *SpatialPulse Apex-01* 6-component composite assembly with physical studio lighting environments and smooth 360° OrbitControls.
- **Physical PBR Material & Color Switcher**: Real-time switching across 5 material tiers (Matte Ultra-Leather, Aero Carbon Fiber, Aerospace Titanium, Cyber Polycarbonate, Chameleon Iridescent Chrome) with procedural bump/normal mapping.
- **Exploded View Mode**: Smooth spring-animated displacement with floating 2D/3D screen-space engineering callouts.
- **4K Studio Snapshot Generator**: High-resolution 1920x1080 composited branded render cards with material manifest and instant PNG export.
- **Dynamic Pricing Cart & Checkout**: Real-time pricing engine based on material tiers, size selection, promo code validation (`SPATIAL20`, `CYBER10`, `FREESHIP`), and checkout flow with celebratory confetti.

---

### 4. 🚨 [IncidentPulse (`04-incidentpulse`)](./04-incidentpulse)
> **Site Reliability Engineering (SRE) Incident Management, Real-Time Dependency Topology & Service Status Command Center**

- **Live Incident Stream & Anomaly Engine**: Simulated WebSocket/SSE streaming feed of access logs, latency anomalies, 5xx floods, and database deadlocks with Web Audio alert sound synthesizer.
- **Command Palette (`Cmd+K` / `Ctrl+K`)**: Full keyboard navigation to search services, acknowledge incidents, escalate severity, trigger mock rollbacks, and navigate the entire suite.
- **Incident Triage Kanban Board**: Drag-and-drop 4-stage board (`Investigating`, `Identified`, `Monitoring`, `Resolved`) with automatic dynamic SLA countdown clocks and breach notifications.
- **Interactive Post-Mortem & RCA Studio**: Form-based post-mortem generator with timeline auto-population, interactive 5-Whys root-cause analysis builder, preventive action items tracker, and live GitHub-flavored Markdown export.
- **Service Dependency Topology Mesh**: Interactive SVG node graph displaying microservice dependency graphs, live traffic particle flow animations, status halo alerts, and deep telemetry inspection drawers with pod restart and rollback actions.

---

### 5. 🧠 [NexusWiki (`05-nexuswiki`)](./05-nexuswiki)
> **Interconnected Bi-Directional Note-Taking & D3.js Dynamic Force-Directed Knowledge Graph System**

- **Bi-Directional `[[WikiLink]]` Parser & Live Markdown Editor**: Real-time markdown editor with live `[[WikiLink]]` autocomplete dropdown popup, inline LaTeX math equations via KaTeX, task checklists, and code block syntax highlighting.
- **Interactive 2D/3D Force-Directed Knowledge Graph**: D3.js physics graph simulation modeling Coulomb repulsion, Hooke spring attraction, degree-based node scaling, and 3D spatial perspective view modes. Hovering isolates connected clusters, while clicking immediately opens that note.
- **Backlinks & Unlinked Mentions Panel**: Automatic detection of incoming `[[WikiLinks]]` with surrounding excerpt context, and 1-click conversion of plain-text unlinked mentions into bi-directional wiki references.
- **Full-Text Fuzzy Search Modal (`Ctrl+P` / `Cmd+K`)**: Instant search indexing across note titles, body content, YAML tags, and markdown headers with keyword highlight excerpts.
- **Lossless Vault Portability**: Export and import entire vaults as a client-side `.zip` archive of individual `.md` markdown files (via `JSZip`) or structured JSON backup bundles.

---

### 6. 🎨 [CanvasFlow (`06-canvasflow`)](./06-canvasflow)
> **Hardware-Accelerated Infinite Diagramming & Vector Flow Studio**

- **Infinite Pan & Zoom Engine**: Smooth viewport matrix transformations with infinite dot matrix grid scaling (10% to 500% zoom bounds) and mouse-anchor zoom centering.
- **Smart Magnetic Connectors & Shapes**: Complete shape library (Rectangles, Diamonds, Circles, Sticky Notes, Database Cylinders, Text Blocks) with 4 magnetic anchor ports and persistent dynamic Bézier / Orthogonal / Straight routing.
- **Freehand Pen & Highlighter**: Smoothed Catmull-Rom spline curves with pressure simulation and semi-transparent highlighter brushes.
- **History Stack Engine**: Full snapshot-based Undo / Redo (`Cmd+Z`, `Cmd+Shift+Z`) state engine with 8-handle element resizing, rotation, and z-index reordering.
- **Interactive Mini-Map Radar**: Real-time visual radar HUD displaying whole-canvas item distribution with a draggable viewfinder viewport.
- **Vector & Raster Export Suite**: Multi-scale PNG rasterization (1x, 2x, 3x), pure standalone SVG vector export, and JSON diagram backup/restore.

---

## 🛠️ Tech Stack Overview

- **Core**: React 19, TypeScript, Vite 8, Pure Vanilla CSS Design Systems
- **3D Graphics & Physics**: Three.js (PBR Shaders, PCF Shadows, OrbitControls)
- **Audio DSP & Synthesis**: Web Audio API, Wavesurfer.js v7, OfflineAudioContext
- **Knowledge Graphs & Diagramming**: D3.js (Force-Directed Simulation), Hardware-Accelerated Infinite SVG/Canvas, Chart.js, HTML5 Canvas 60fps Analysers
- **Math & Markdown**: KaTeX (LaTeX math rendering), Regex AST WikiLink Parsers, JSZip, Canvas-Confetti, Lucide React, Oxlint

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/yankun22/portfolio.git
cd portfolio

# Run 01-WealthFlow
cd 01-wealthflow && npm install && npm run dev

# Run 02-SoundPulse
cd ../02-soundpulse && npm install && npm run dev

# Run 03-SpatialCore
cd ../03-spatialcore && npm install && npm run dev

# Run 04-IncidentPulse
cd ../04-incidentpulse && npm install && npm run dev

# Run 05-NexusWiki
cd ../05-nexuswiki && npm install && npm run dev

# Run 06-CanvasFlow
cd ../06-canvasflow && npm install && npm run dev
```
