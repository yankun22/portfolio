/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

'use client';

import React, { useEffect } from 'react';
import TelemetryHeader from '../components/TelemetryHeader';
import CanvasTopologyEngine from '../components/CanvasTopologyEngine';
import ConsensusSimulatorControls from '../components/ConsensusSimulatorControls';
import ConsensusTimeline from '../components/ConsensusTimeline';
import AgentInspectionPanel from '../components/AgentInspectionPanel';
import MobileNavTabs from '../components/MobileNavTabs';
import { useAgentMeshStore } from '../store/useAgentMeshStore';
import { displayProvenanceWatermark } from '../utils/watermark';
import { Cpu, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';

export default function AgentMeshPage() {
  const activeMobileTab = useAgentMeshStore((state) => state.activeMobileTab);
  const agents = useAgentMeshStore((state) => state.agents);
  const selectAgent = useAgentMeshStore((state) => state.selectAgent);

  useEffect(() => {
    displayProvenanceWatermark('AgentMesh — Multi-Agent Consensus & Topology Simulator');
  }, []);

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-canvas overflow-x-hidden">
      {/* Top Global Telemetry Header */}
      <TelemetryHeader />

      {/* Main Interactive Work Area */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 gap-4 max-w-[1700px] w-full mx-auto">
        {/* Mobile Navigation Tabs */}
        <MobileNavTabs />

        {/* Desktop Viewport Layout (Visible >= md) */}
        <div className="hidden md:flex flex-1 flex-col gap-4 w-full">
          {/* Consensus Simulator Action Bar */}
          <ConsensusSimulatorControls />

          {/* Dynamic Canvas Topology Viewport */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-white/10 shadow-glass-card bg-canvas-deep min-h-[500px]">
            <CanvasTopologyEngine />
          </div>

          {/* Deterministic Consensus Multi-Step Pipeline Timeline */}
          <ConsensusTimeline />
        </div>

        {/* Mobile Phone Layout (Visible < md) */}
        <div className="flex md:hidden flex-col gap-4 w-full">
          {activeMobileTab === 'topology' && (
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-glass-card bg-canvas-deep min-h-[420px] h-[60vh]">
              <CanvasTopologyEngine />
            </div>
          )}

          {activeMobileTab === 'controls' && (
            <div className="w-full space-y-4">
              <ConsensusSimulatorControls />
            </div>
          )}

          {activeMobileTab === 'pipeline' && (
            <div className="w-full space-y-4">
              <ConsensusTimeline />
            </div>
          )}

          {activeMobileTab === 'inspector' && (
            <div className="w-full space-y-3">
              <div className="p-4 rounded-2xl bg-canvas-card/80 border border-white/10 shadow-glass-card">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-mint" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    Agent Archetype Inspector
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 font-mono mb-4">
                  Select an autonomous archetype below to inspect its vector context buffer, JSON schema, and execution traces.
                </p>

                <div className="space-y-2.5">
                  {agents.map((ag) => (
                    <button
                      key={ag.id}
                      onClick={() => selectAgent(ag.id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas-deep/80 hover:bg-canvas-deep border border-white/10 hover:border-mint/40 transition group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: ag.color }}
                        />
                        <div>
                          <div className="text-xs font-bold font-mono text-white group-hover:text-mint transition">
                            {ag.name}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400">
                            {ag.archetype} • {ag.latencyMs}ms
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/5 text-zinc-300">
                          {ag.confidence}%
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Agent Inspection Drawer */}
      <AgentInspectionPanel />

      {/* Visible Copyright & Portfolio Provenance Footer */}
      <footer className="w-full py-4 px-6 border-t border-white/10 bg-canvas-card/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-mint" />
          <span>© 2024–2026 Alok Vishwakarma. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <span>Showcase & Portfolio Evaluation</span>
          <span>•</span>
          <a
            href="https://github.com/yankun22/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-mint transition underline underline-offset-2"
          >
            GitHub Monorepo
          </a>
        </div>
      </footer>
    </main>
  );
}
