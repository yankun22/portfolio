# 🚀 Interactive Web Applications & Engineering Portfolio

A showcase of production-grade, high-performance web applications built with **React 19**, **TypeScript**, **Three.js**, **Web Audio API**, **Chart.js**, and **Wavesurfer.js**.

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

## 🛠️ Tech Stack Overview

- **Core**: React 19, TypeScript, Vite 8, Pure Vanilla CSS Design Systems
- **3D Graphics & Physics**: Three.js (PBR Shaders, PCF Shadows, OrbitControls)
- **Audio DSP & Synthesis**: Web Audio API, Wavesurfer.js v7, OfflineAudioContext
- **Data Visualization**: Chart.js, HTML5 Canvas 60fps Analysers
- **Utilities & Export**: jsPDF, Canvas-Confetti, Lucide React, Oxlint

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
```
