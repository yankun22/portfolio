# 🚨 IncidentPulse (`04-incidentpulse`)
> **Site Reliability Engineering (SRE) Incident Management, Real-Time Dependency Topology & Service Status Command Center**

Built with **React 19**, **TypeScript**, **Vite 8**, **Web Audio API**, and **HTML5 Canvas/SVG**.

---

## ✨ Features

### 1. 📡 Live Streaming Incident & Telemetry Engine
- **Simulated WebSocket/SSE Engine**: Real-time emission of access logs, latency anomalies, 5xx floods, and database lock warnings.
- **Adjustable Stream Frequency**: 1.0s, 2.5s, 5.0s, or Pause mode with sticky scroll lock.
- **Web Audio Alert Synthesizer**: Procedural synthesized alarm chimes for critical SEV-1 alerts, on-call acknowledgements, and incident resolutions.

### 2. ⌨️ Command Palette (`Cmd+K` / `Ctrl+K`)
- **Full Keyboard Navigation**: Search across incidents, microservices, chaos actions, and navigation destinations with `ArrowUp`, `ArrowDown`, `Enter`, and `Esc`.
- **Instant SRE Remediation**:
  - Acknowledge active incidents
  - Escalate severity to SEV-1 Critical
  - Trigger rolling pod restarts
  - Rollback microservice releases to previous stable versions
  - Inject chaos anomalies directly from the keyboard

### 3. 📋 Incident Triage Kanban Board
- **4-Stage Workflow**: `Investigating` ➔ `Identified` ➔ `Monitoring` ➔ `Resolved`.
- **HTML5 Drag-and-Drop**: Smooth drag-and-drop between triage columns.
- **Dynamic SLA Countdown Timers**:
  - Live color-coded countdowns (`SEV-1`: 15m, `SEV-2`: 60m, `SEV-3`: 4h, `SEV-4`: 24h).
  - Automatically freezes upon resolution with exact resolution duration and SLA performance status (*Met* vs *Breached*).
- **Incident Declaration**: Manual modal to raise new incidents with assignees and root-cause classification.

### 4. 📝 Interactive Post-Mortem & RCA Studio
- **Auto-Populated Incident Dossier**: Imports metadata, impacted users, duration, and chronological timeline directly from any incident.
- **5-Whys Root Cause Analysis Builder**: Add, edit, or delete nested why-analysis prompts.
- **Action Items & Remediation Checklist**: Track P0/P1/P2 action items with assignees, status checkboxes, and target completion dates.
- **Live Markdown Split-View Preview**: Instant side-by-side markdown preview with one-click **Copy Markdown** and **Download .md** export.

### 5. 🕸️ Interactive Service Topology Mesh
- **Interactive SVG Dependency Graph**: 10 interconnected microservices mapped across Ingress, API, Domain Services, and Data/Event Streaming tiers.
- **Animated Traffic Dash Flow**: Particle animations representing live throughput and request flow.
- **Visual Health Halos**: Glowing status indicators (Operational Emerald, Degraded Amber, Outage Crimson with radiating shockwave rings, and Maintenance Purple).
- **Telemetry Inspector Drawer**: Deep-dive into RPS, P95/P99 latency, CPU/Memory utilization, upstream/downstream dependencies, and direct remediation actions (Restart, Rollback, Drain).

### 6. ⚡ Chaos Engineering Anomaly Injector
- **Pre-Configured Scenarios**:
  - *Payments 504 Gateway Flood* (19.8% 5xx error rate)
  - *Auth JWT Latency Surge* (> 1200ms P99 delay)
  - *PostgreSQL Row Lock Deadlock & Pool Exhaustion*
  - *Kafka Event Pipeline Consumer Lag*
  - *Recommendation AI CPU Starvation*
- **One-Click Self-Healing**: Resets and stabilizes all mesh services to baseline with celebratory confetti.

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, Vite 8
- **Audio Synthesis**: Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`)
- **Visuals & Icons**: Pure Vanilla CSS Dark SRE Design System, Lucide React, Canvas-Confetti
- **Quality & Linting**: Oxlint

---

## 🚀 Getting Started

```bash
# Navigate to project
cd 04-incidentpulse

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
