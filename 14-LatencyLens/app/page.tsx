/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

'use client';

import React, { useEffect } from 'react';
import ObservabilityHeader from '../components/ObservabilityHeader';
import GlobalEdgeMap from '../components/GlobalEdgeMap';
import NetworkWaterfallInspector from '../components/NetworkWaterfallInspector';
import RuntimeExecutionComparison from '../components/RuntimeExecutionComparison';
import MobileNavTabs from '../components/MobileNavTabs';
import { useLatencyStore } from '../store/useLatencyStore';
import { displayProvenanceWatermark } from '../utils/watermark';
import { ShieldCheck } from 'lucide-react';

export default function LatencyLensPage() {
  const activeMobileTab = useLatencyStore((state) => state.activeMobileTab);

  useEffect(() => {
    displayProvenanceWatermark('LatencyLens — Anycast & Microsecond Waterfall Observability');
  }, []);

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-canvas overflow-x-hidden">
      {/* Top Enterprise Observability Header */}
      <ObservabilityHeader />

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Mobile Navigation Tabs (visible on mobile phones) */}
        <MobileNavTabs />

        {/* Desktop Layout: All visible simultaneously */}
        <div className="hidden md:block space-y-6">
          {/* Component 1: Global Edge Map & Anycast Router */}
          <GlobalEdgeMap />

          {/* Component 2 & 3: Waterfall Profiler + Isolate vs Container Benchmark */}
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 xl:col-span-7">
              <NetworkWaterfallInspector />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <RuntimeExecutionComparison />
            </div>
          </div>
        </div>

        {/* Mobile Phone Layout: Switchable tabs for clean thumb-friendly navigation */}
        <div className="block md:hidden space-y-4">
          {activeMobileTab === 'map' && <GlobalEdgeMap />}
          {activeMobileTab === 'waterfall' && <NetworkWaterfallInspector />}
          {activeMobileTab === 'runtime' && <RuntimeExecutionComparison />}
        </div>
      </div>

      {/* Visible Copyright & Portfolio Provenance Footer */}
      <footer className="w-full py-4 px-6 border-t border-canvas-border bg-canvas-card/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-telemetry-teal" />
          <span>© 2024–2026 Alok Vishwakarma. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <span>Edge Network Evaluation</span>
          <span>•</span>
          <a
            href="https://github.com/yankun22/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-telemetry-tealNeon transition underline underline-offset-2"
          >
            GitHub Monorepo
          </a>
        </div>
      </footer>
    </main>
  );
}
