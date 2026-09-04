/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

'use client';

import React, { useEffect } from 'react';
import TelemetryHUD from '../components/TelemetryHUD';
import VectorSpaceCanvas from '../components/VectorSpaceCanvas';
import MetricControls from '../components/MetricControls';
import VectorPayloadInspector from '../components/VectorPayloadInspector';
import { displayProvenanceWatermark } from '../utils/watermark';
import { Database, ShieldCheck } from 'lucide-react';

export default function VoxelDBPage() {
  useEffect(() => {
    displayProvenanceWatermark('VoxelDB — 3D Vector Space & HNSW Quantization Visualizer');
  }, []);

  return (
    <main className="relative flex flex-col w-full h-screen bg-canvas overflow-hidden">
      {/* Top Floating Telemetry Bar */}
      <TelemetryHUD />

      {/* Main 3D Vector Space Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Three.js / React Three Fiber Canvas */}
        <VectorSpaceCanvas />

        {/* Floating Metric & Nearest-Neighbor Controls */}
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-6 sm:right-auto sm:max-w-3xl z-20 pointer-events-auto">
          <MetricControls />
        </div>

        {/* Floating Provenance & Copyright Watermark Badge (Desktop & Mobile) */}
        <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-6 z-20 pointer-events-auto">
          <div className="flex items-center justify-between sm:justify-start gap-2.5 px-3 py-1.5 rounded-xl bg-canvas-card/85 backdrop-blur-xl border border-white/10 shadow-glass-panel text-[10px] font-mono text-zinc-400 select-none">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" />
              <span>© 2024–2026 Alok Vishwakarma</span>
            </div>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="hidden sm:inline text-zinc-500">Portfolio Evaluation</span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <a
              href="https://github.com/yankun22/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-neon-cyan transition underline underline-offset-2 ml-auto sm:ml-0"
            >
              GitHub Monorepo
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Vector Payload Inspector (Desktop Slide-Over & Mobile Bottom Drawer) */}
      <VectorPayloadInspector />
    </main>
  );
}
