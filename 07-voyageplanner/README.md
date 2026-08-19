# 🧭 VoyagePlanner — Intelligent Travel Itinerary & Route Optimization Studio

> **State-of-the-Art Interactive Travel Planning Web App built with React 19, TypeScript, Leaflet, and @dnd-kit**

VoyagePlanner provides an all-in-one, buttery-smooth workspace for designing complex multi-day travel itineraries. It combines high-performance interactive map routing, drag-and-drop timeline scheduling, smart multi-currency budget splitting with debt minimization, live climate telemetry with rain warnings, and offline packing generators.

---

## 🌟 Key Features

### 1. 🗺️ Interactive Map & Continuous Routing (`Leaflet`)
- **Interactive Multi-Layer Map**: Real-time tile switching between **CartoDB Dark Matter**, **OpenStreetMap Standard**, and **CartoDB Voyager**.
- **Numbered Sequence Pins**: Day-color-coded custom markers featuring category iconography (🏛️, 🍜, 🏨, 🚆, 🏖️, 🛍️) and pulsing radius animations.
- **Continuous Polyline Paths**: Animated directional dashed polylines connecting consecutive day destinations with automatic bounding box fitting.
- **Haversine Distance & Transit Estimates**: Calculates travel distance (km & miles), walking duration (@ 4.5 km/h), transit times, and inter-activity leg dividers.
- **Route Playback Simulator**: Real-time traveler marker simulation advancing along polyline waypoints with Play, Pause, Reset, and `1x`, `2x`, `5x` speed controls.
- **Instant Geocoding & Place Search**: Instant search combining OpenStreetMap Nominatim with a curated offline index of 100+ iconic landmarks.

### 2. 📅 Draggable Multi-Day Timeline (`@dnd-kit`)
- **Cross-Day Drag & Drop**: Seamlessly move activities between `Day 1`, `Day 2`, `Day 3`, ..., and the `✨ Ideas / Bucket List` column.
- **Intra-Day Reordering**: Fluid sorting with `@dnd-kit/sortable` updating sequence numbers and route order instantly.
- **Rich Activity Cards**: Time slots, durations, category tags, costs, booked badges, confirmation reference codes, and direct map focus buttons.
- **Dynamic Day Summary HUD**: Real-time recalculation of total travel distance, walk times, total cost, activity count, and travel pace score (**Relaxed**, **Moderate**, **Packed**).

### 3. 💰 Smart Budget & Multi-Currency Splitter
- **Expense Categorization**: Categorized spending ledger across *Lodging*, *Food*, *Transit*, *Tickets*, *Shopping*, *Activities*, *Emergency*, and *Misc*.
- **18+ Global Currencies**: Instant conversion rates (USD, EUR, GBP, JPY, CAD, AUD, CHF, SGD, CNY, INR, KRW, THB, ISK, etc.).
- **Graph Debt Minimization Algorithm**: Solves the optimal minimum cash-flow settlement matrix among travel companions (e.g. *Alex pays Jordan $45.00*), eliminating circular debts.
- **Interactive Financial Visualizations**: Category distribution bar stack and budget utilization gauges.

### 4. 🌤️ Weather Forecast & Climate Telemetry
- **Open-Meteo Integration**: Real-time 7-day weather forecast with fallback model for destination coordinates.
- **Key Metrics**: High/Low temperatures (°C / °F toggle), condition icons, rain probability % bars, UV index, and wind speeds.
- **Weather-Aware Recommendations**: Smart rain alerts suggesting indoor museums or umbrellas when precipitation risk is high.

### 5. 🎒 Offline Packing & Checklist Generator
- **Categorized Packing Modules**: Documents & Passports, Clothing, Electronics, Toiletries & Health, Outdoor Gear, Essentials, Emergency.
- **Interactive Progress Engine**: Real-time category progress bars, overall percentage dials, companion assignments, and essential priority flags.
- **Batch Actions**: 1-click *Pack All*, *Reset Checklist*, and custom item creation.

### 6. 📄 PDF & Print-Ready Itinerary Suite
- **Printable Itinerary Sheet**: Clean `@media print` A4 layout with day schedule, confirmation codes, expense split matrix, and packing status.
- **1-Click Standalone PDF Export**: Generated client-side using `jspdf` and `jspdf-autotable`.

### 7. 🚀 5 Preloaded Curated Dream Itineraries
1. **7-Day Japan Highlights: Tokyo & Kyoto** (JPY / USD, Bullet train, temples, teamLab, Wagyu dining)
2. **5-Day Italian Riviera & Eternal City: Amalfi & Rome** (EUR, Colosseum, Vatican, Positano, Catamaran cruise)
3. **4-Day Swiss Alpine Wonderland: Interlaken & Jungfrau** (CHF, Top of Europe 3,454m, Lauterbrunnen waterfalls)
4. **3-Day New York City Highlights** (USD, Empire State, High Line, Broadway, The Met)
5. **6-Day Iceland Golden Circle & South Coast** (USD / ISK, Blue Lagoon, Gullfoss, Reynisfjara black sands)

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, Vite 8
- **Map & Routing**: Leaflet 1.9, OpenStreetMap Tiles, CartoDB Tiles, Haversine Distance Engine
- **Drag-and-Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **PDF & Exports**: `jspdf`, `jspdf-autotable`, `canvas-confetti`
- **Icons & Styling**: `lucide-react`, Pure Vanilla CSS Design System with dark/light themes

---

## ⚡ Quick Start

```bash
# Navigate to voyageplanner directory
cd 07-voyageplanner

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
