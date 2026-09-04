/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

'use client';

import React, { useEffect } from 'react';
import CockpitHeader from '../components/CockpitHeader';
import StreamPipelineCanvas from '../components/StreamPipelineCanvas';
import SchemaEvolutionSandbox from '../components/SchemaEvolutionSandbox';
import ChaosEngineeringPanel from '../components/ChaosEngineeringPanel';
import DeadLetterQueueDrawer from '../components/DeadLetterQueueDrawer';
import MobileNavTabs from '../components/MobileNavTabs';
import { useEventPulseStore } from '../store/useEventPulseStore';
import { displayProvenanceWatermark } from '../utils/watermark';
import { ShieldCheck } from 'lucide-react';

export default function EventPulsePage() {
  const activeMobileTab = useEventPulseStore((state) => state.activeMobileTab);

  useEffect(() => {
    displayProvenanceWatermark('EventPulse — Real-Time Kafka/Redpanda Event Cockpit');
  }, []);

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-canvas overflow-x-hidden">
      {/* Top Enterprise Cockpit Header */}
      <CockpitHeader />

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Mobile Navigation Tabs (visible on phone screens) */}
        <MobileNavTabs />

        {/* Desktop Layout: All visible simultaneously */}
        <div className="hidden md:block space-y-6">
          {/* Stage 1-3 Stream Pipeline Canvas */}
          <StreamPipelineCanvas />

          {/* Bottom Grid: Schema Sandbox + Chaos Controller */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xl:col-span-8">
              <SchemaEvolutionSandbox />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <ChaosEngineeringPanel />
            </div>
          </div>
        </div>

        {/* Mobile Phone Layout: Switchable tabs for clean thumb-friendly navigation */}
        <div className="block md:hidden space-y-4">
          {activeMobileTab === 'pipeline' && <StreamPipelineCanvas />}
          {activeMobileTab === 'schema' && <SchemaEvolutionSandbox />}
          {activeMobileTab === 'chaos' && <ChaosEngineeringPanel />}
        </div>
      </div>

      {/* Dead-Letter Queue Slide-Over Drawer */}
      <DeadLetterQueueDrawer />

      {/* Visible Copyright & Portfolio Provenance Footer */}
      <footer className="w-full py-4 px-6 border-t border-white/10 bg-canvas-card/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-ultra" />
          <span>© 2024–2026 Alok Vishwakarma. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <span>Enterprise Stream Evaluation</span>
          <span>•</span>
          <a
            href="https://github.com/yankun22/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ultra-light transition underline underline-offset-2"
          >
            GitHub Monorepo
          </a>
        </div>
      </footer>
    </main>
  );
}
