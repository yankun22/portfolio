'use client';

import React from 'react';
import { useAgentMeshStore } from '../store/useAgentMeshStore';
import {
  Activity,
  Cpu,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function TelemetryHeader() {
  const globalMetrics = useAgentMeshStore((state) => state.globalMetrics);
  const agents = useAgentMeshStore((state) => state.agents);
  const selectedAgentId = useAgentMeshStore((state) => state.selectedAgentId);
  const selectAgent = useAgentMeshStore((state) => state.selectAgent);
  const simulationStatus = useAgentMeshStore((state) => state.simulationStatus);

  // Generate SVG Sparkline path for rolling p99 latency
  const latencyHistory = globalMetrics.latencyHistory;
  const minLatency = Math.min(...latencyHistory, 10);
  const maxLatency = Math.max(...latencyHistory, 35);
  const sparkWidth = 84;
  const sparkHeight = 22;

  const points = latencyHistory.map((val, idx) => {
    const x = (idx / (latencyHistory.length - 1)) * sparkWidth;
    const norm = (val - minLatency) / (maxLatency - minLatency || 1);
    const y = sparkHeight - norm * (sparkHeight - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const sparkPath = `M ${points.join(' L ')}`;

  return (
    <header className="w-full border-b border-white/10 bg-canvas-card/80 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 sm:gap-4 select-none z-30">
      {/* Brand & Logo Section */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-mint/10 border border-mint/30 shadow-glass-glow">
          <Layers className="w-5 h-5 text-mint animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-mint shadow-[0_0_8px_#2EE59D]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white font-sans">
              AgentMesh
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-white/10 text-mint border border-mint/20">
              v2.4 Production Engine
            </span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            Autonomous Multi-Agent Consensus & Topology Simulator
          </p>
        </div>
      </div>

      {/* Center: Live Global Telemetry Metrics */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-2 rounded-xl bg-canvas-deep/80 border border-white/10">
        {/* Token Usage Ticker */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-mint/10 text-mint">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Token Counter
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-mono font-bold text-white">
                {globalMetrics.totalTokens.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                ({globalMetrics.promptTokens.toLocaleString()}p / {globalMetrics.completionTokens.toLocaleString()}c)
              </span>
            </div>
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* p99 Latency & Sparkline */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Latency p99</span>
              <span className="text-sky-400 font-bold ml-2">
                {globalMetrics.p99LatencyMs}ms
              </span>
            </div>
            {/* Sparkline */}
            <div className="w-[84px] h-[22px] mt-0.5">
              <svg width={sparkWidth} height={sparkHeight} className="overflow-visible">
                <path
                  d={sparkPath}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Byzantine Quorum Agreement Meter */}
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded-lg ${
              globalMetrics.quorumCount >= 5
                ? 'bg-mint/10 text-mint'
                : globalMetrics.quorumCount >= 3
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              Byzantine Quorum
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((stepNum) => {
                  const isAchieved = globalMetrics.quorumCount >= stepNum;
                  return (
                    <div
                      key={stepNum}
                      className={`w-2.5 h-3.5 rounded-sm transition-all duration-300 ${
                        isAchieved
                          ? 'bg-mint shadow-[0_0_6px_#2EE59D]'
                          : 'bg-white/10'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-mono font-bold text-white">
                {globalMetrics.quorumCount}/5
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Agent Archetype Quick Nav */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
        <span className="text-[10px] font-mono text-zinc-500 mr-1 hidden sm:inline">
          INSPECT:
        </span>
        {agents.map((ag) => {
          const isSelected = selectedAgentId === ag.id;
          return (
            <button
              key={ag.id}
              onClick={() => selectAgent(isSelected ? null : ag.id)}
              title={`Inspect ${ag.name} (${ag.archetype})`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono text-xs transition border ${
                isSelected
                  ? 'bg-white/15 text-white border-mint shadow-glass-glow'
                  : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ag.color }}
              />
              <span className="font-semibold">{ag.name.split('-')[0]}</span>
              <span className="text-[10px] opacity-60">
                {ag.confidence}%
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
