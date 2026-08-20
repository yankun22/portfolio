# ⚡ CodeForge — Developer Playground, Regex Visualizer & SQLite Studio

CodeForge is an interactive developer playground, regular expression visualizer, and in-browser SQLite laboratory built with **React 19**, **TypeScript**, **Vite**, and **sql.js**.

---

## 🌟 Key Features

### 1. 🖥️ Multi-Tab Code Sandbox
- **Live HTML / CSS / JavaScript Multi-Tab Editor**: Real-time compilation and debouncing with full tab indentation and line numbering.
- **Sandboxed Iframe Preview**: Isolated execution environment with error boundaries and full-screen preview.
- **Real-Time Console Log Interceptor**: Injects a proxy script into the iframe that intercepts `console.log`, `console.warn`, `console.error`, and `console.table`, forwarding logs to an interactive docked developer console with level filtering and timestamping.
- **Layout Switcher**: Split-Screen Horizontal (50/50), Split-Screen Vertical, Editor Only, and Preview Only.
- **1-Click Starter Templates**: *Cyberpunk Neon Glow Button*, *2D Canvas Particle Matrix*, *Reactive State Counter*.
- **External CDN Manager**: Instant injector for Tailwind CSS, Bootstrap 5, FontAwesome, Chart.js, Three.js, Lodash, and Canvas-Confetti.

### 2. 🔍 Live Regex Engine & Railroad Visualizer
- **Real-Time Regex Engine**: Live pattern evaluation with flags (`g`, `i`, `m`, `s`, `u`, `y`).
- **Color-Coded Capture Groups**: Distinct vibrant highlight colors for individual capture groups (`$1` Cyan, `$2` Emerald, `$3` Amber, `$4` Purple).
- **Interactive Railroad State-Machine Diagram**: Custom SVG generator parsing regex patterns into interconnected railroad syntax diagrams with start/end stations, character classes, quantifiers, and branches.
- **Capture Group Extraction Table**: Detailed tabular breakdown with start/end character offsets.
- **Step-by-Step Regex Explainer**: Human-readable syntax explanations for every pattern token.
- **Substitution / Replace Playground**: Real-time `$1`, `$2`, `$&` token replacements.
- **Preset Regex Library**: 15+ curated regex presets (Email, URL, IPv4, Hex Color, ISO Date, SemVer, HTML Tags, JWT).

### 3. 🗄️ In-Browser SQLite Studio
- **Real In-Memory SQLite Engine (`sql.js`)**: Executes full SQL scripts via WebAssembly in the browser with zero server latency.
- **Live Schema Inspector**: Inspects database tables, column data types, not-null constraints, primary keys, and live row counts.
- **Tabular Query Results Grid**: Formatted query output with sortable columns, row counts, and CSV/Markdown export.
- **Benchmark Meter**: Measures real-time query latency in milliseconds (e.g. `⚡ 1.24 ms`).
- **Pre-Loaded Sample Databases**: *E-Commerce Marketplace* (`users`, `products`, `orders`, `order_items`) and *Tech HR Directory* (`departments`, `employees`, `projects`).

### 4. 💾 Code Snippet Vault & Sharing
- **Local Storage Vault**: Save, tag, search, and favorite code snippets across JavaScript, HTML, CSS, SQL, and Regex.
- **Shareable URL Permalinks**: Encodes sandbox code, regex patterns, or SQL queries into a compressed base64 URL hash for instant sharing.
- **GitHub Gist Export**: 1-click generation and download of GitHub Gist JSON format.
- **Import / Export Backup**: Full vault JSON export and restore.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite
- **Database**: SQLite (via `sql.js` WebAssembly)
- **Styling**: Pure Vanilla CSS Developer IDE Design System
- **Icons**: Lucide React
- **Animations**: Canvas-Confetti

---

## 🚀 Quick Start

```bash
# Navigate to directory
cd 09-codeforge

# Install dependencies
npm install

# Run dev server
npm run dev

# Run linting check
npm run lint

# Build production bundle
npm run build
```
