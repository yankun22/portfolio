'use client';

import React from 'react';
import { useLatencyStore } from '../store/useLatencyStore';
import { WaterfallPhase } from '../types/edge';
import {
  BarChart3,
  Clock,
  Zap,
  Shield,
  Layers,
  Database,
  Cpu,
  Radio,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
} from 'lucide-react';

export default function NetworkWaterfallInspector() {
  const waterfallPhases = useLatencyStore((state) => state.waterfallPhases);
  const totalLatencyMs = useLatencyStore((state) => state.totalLatencyMs);
  const selectedPhaseForInspection = useLatencyStore(
    (state) => state.selectedPhaseForInspection
  );
  const setSelectedPhaseForInspection = useLatencyStore(
    (state) => state.setSelectedPhaseForInspection
  );
  const cacheStatus = useLatencyStore((state) => state.cacheStatus);
  const setCacheStatus = useLatencyStore((state) => state.setCacheStatus);
  const runtimeMode = useLatencyStore((state) => state.runtimeMode);
  const isProbing = useLatencyStore((state) => state.isProbing);
  const probeProgress = useLatencyStore((state) => state.probeProgress);
  const activePhaseId = useLatencyStore((state) => state.activePhaseId);
  const triggerProbe = useLatencyStore((state) => state.triggerProbe);

  // Category Color Scheme
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'NETWORK':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
      case 'SECURITY':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'EDGE':
        return 'bg-telemetry-teal/15 text-telemetry-tealLight border-telemetry-teal/30';
      case 'COMPUTE':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'TRANSFER':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30';
    }
  };

  const getBarColor = (phase: WaterfallPhase) => {
    if (phase.status === 'COLD_START') {
      return 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-glow-amber';
    }
    if (phase.status === 'FAST_PATH') {
      return 'bg-gradient-to-r from-telemetry-teal to-emerald-400 shadow-glow-teal';
    }
    if (phase.category === 'SECURITY') {
      return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    }
    if (phase.category === 'NETWORK') {
      return 'bg-gradient-to-r from-cyan-500 to-sky-400';
    }
    return 'bg-gradient-to-r from-telemetry-teal to-cyan-400';
  };

  return (
    <div className="w-full rounded-2xl bg-canvas-card border border-canvas-border shadow-telemetry-card p-4 sm:p-6 select-none space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-borderSubtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-telemetry-teal" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Microsecond Network Waterfall Profiler
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gantt timeline profiling DNS, TCP 1-RTT, TLS 1.3 cryptographic handshakes, and Edge compute dispatch.
          </p>
        </div>

        {/* Cache Policy Toggle */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-zinc-400 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-telemetry-teal" /> Cache:
          </span>
          <div className="flex items-center rounded-xl bg-canvas-deep border border-canvas-border p-1">
            <button
              onClick={() => setCacheStatus('HIT')}
              className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                cacheStatus === 'HIT'
                  ? 'bg-telemetry-teal text-canvas-deep shadow-glow-teal font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              HIT (0ms)
            </button>
            <button
              onClick={() => setCacheStatus('MISS')}
              className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                cacheStatus === 'MISS'
                  ? 'bg-amber-500 text-canvas-deep shadow-glow-amber font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              MISS (Compute)
            </button>
          </div>
        </div>
      </div>

      {/* Waterfall Progress / Probe HUD Bar */}
      <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400">Total Request Latency:</span>
          <span className={`text-base font-bold ${runtimeMode === 'CONTAINER' ? 'text-amber-300' : 'text-telemetry-tealNeon'}`}>
            {totalLatencyMs} ms
          </span>
          <span className="text-[11px] text-zinc-500">
            ({Math.round(totalLatencyMs * 1000).toLocaleString()} µs)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isProbing && (
            <div className="flex items-center gap-2 text-telemetry-tealNeon">
              <span className="w-2 h-2 rounded-full bg-telemetry-tealNeon animate-ping" />
              <span>Probing: {probeProgress}%</span>
            </div>
          )}
          <button
            onClick={triggerProbe}
            disabled={isProbing}
            className="px-3 py-1 rounded-lg bg-canvas-deep border border-canvas-border hover:border-telemetry-teal text-zinc-300 hover:text-white transition flex items-center gap-1.5 active:scale-95"
          >
            <Play className="w-3 h-3 text-telemetry-teal" />
            <span>Re-profile</span>
          </button>
        </div>
      </div>

      {/* Waterfall Gantt Chart Rows */}
      <div className="space-y-2.5 font-mono text-xs">
        {waterfallPhases.map((phase) => {
          const isSelected = selectedPhaseForInspection?.id === phase.id;
          const isActiveDuringProbe = activePhaseId === phase.id;

          // Compute left offset and width percentage relative to totalLatencyMs
          const maxScale = Math.max(totalLatencyMs, 1);
          const leftPct = Math.min(95, (phase.startOffsetMs / maxScale) * 100);
          const widthPct = Math.max(1.5, Math.min(100 - leftPct, (phase.actualDurationMs / maxScale) * 100));

          return (
            <div
              key={phase.id}
              onClick={() => setSelectedPhaseForInspection(phase)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-canvas-surface border-telemetry-teal shadow-glow-teal'
                  : isActiveDuringProbe
                  ? 'bg-telemetry-teal/15 border-telemetry-tealNeon'
                  : 'bg-canvas-surface/60 border-canvas-border hover:border-zinc-600'
              }`}
            >
              {/* Phase Header Line */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getCategoryBadge(
                      phase.category
                    )}`}
                  >
                    {phase.category}
                  </span>
                  <span className="text-white font-bold text-xs truncate">
                    {phase.name}
                  </span>
                  <span className="text-[11px] text-zinc-400 hidden sm:inline">
                    • {phase.protocol}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs flex-shrink-0">
                  <span className="text-zinc-500 text-[11px]">
                    +{phase.startOffsetMs}ms
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      phase.status === 'COLD_START'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : phase.status === 'FAST_PATH'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-white'
                    }`}
                  >
                    {phase.actualDurationMs} ms
                  </span>
                </div>
              </div>

              {/* Gantt Bar Lane */}
              <div className="relative w-full h-3 rounded bg-canvas-deep border border-canvas-border overflow-hidden">
                <div
                  className={`absolute top-0 bottom-0 rounded-full transition-all duration-300 ${getBarColor(
                    phase
                  )}`}
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Phase Inspector Tray */}
      {selectedPhaseForInspection && (
        <div className="p-4 rounded-xl bg-canvas-deep border border-telemetry-teal/30 shadow-telemetry-card space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-canvas-border pb-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-telemetry-teal" />
              <span className="text-white font-bold uppercase tracking-wider">
                Phase Inspector: {selectedPhaseForInspection.name}
              </span>
            </div>
            <span className="text-telemetry-tealNeon font-bold">
              {selectedPhaseForInspection.actualDurationMs} ms (
              {Math.round(selectedPhaseForInspection.actualDurationMs * 1000).toLocaleString()} µs)
            </span>
          </div>

          <p className="text-zinc-300 font-sans leading-relaxed text-xs">
            {selectedPhaseForInspection.explanation}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {selectedPhaseForInspection.details.map((detail, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-canvas-surface border border-canvas-border text-[11px]"
              >
                <span className="text-zinc-500 block text-[9px] uppercase">
                  {detail.label}
                </span>
                <span className="text-white font-semibold truncate block mt-0.5">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
