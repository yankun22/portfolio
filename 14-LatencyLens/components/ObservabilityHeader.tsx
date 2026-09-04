'use client';

import React from 'react';
import { useLatencyStore } from '../store/useLatencyStore';
import {
  Activity,
  Globe,
  Zap,
  Clock,
  Radio,
  Server,
  Layers,
  Cpu,
  Flame,
  Send,
  Sparkles,
} from 'lucide-react';

export default function ObservabilityHeader() {
  const selectedOrigin = useLatencyStore((state) => state.selectedOrigin);
  const targetPoP = useLatencyStore((state) => state.targetPoP);
  const geodesicDistanceKm = useLatencyStore((state) => state.geodesicDistanceKm);
  const fiberRttMs = useLatencyStore((state) => state.fiberRttMs);
  const transitHops = useLatencyStore((state) => state.transitHops);
  const runtimeMode = useLatencyStore((state) => state.runtimeMode);
  const totalLatencyMs = useLatencyStore((state) => state.totalLatencyMs);
  const isProbing = useLatencyStore((state) => state.isProbing);
  const triggerProbe = useLatencyStore((state) => state.triggerProbe);

  return (
    <header className="w-full border-b border-canvas-border bg-canvas-card/90 backdrop-blur-xl px-4 sm:px-6 py-3 select-none z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-telemetry-teal/15 border border-telemetry-teal/40 shadow-glow-teal">
            <Radio className="w-4 h-4 text-telemetry-teal animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-telemetry-tealNeon shadow-[0_0_8px_#5EEAD4]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                LatencyLens
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-telemetry-teal/15 text-telemetry-tealLight border border-telemetry-teal/30">
                Anycast v4.1
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 hidden sm:block">
              Global Edge Routing & Microsecond Waterfall Observability Deck
            </p>
          </div>
        </div>

        {/* Live Observability Telemetry Counters */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          {/* Active PoP */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas-surface border border-canvas-border">
            <Globe className="w-3.5 h-3.5 text-telemetry-teal" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Routed PoP</div>
              <div className="text-xs font-bold text-white leading-tight">
                {targetPoP.iata} <span className="text-[10px] text-zinc-400 font-normal">({targetPoP.city.split(' ')[0]})</span>
              </div>
            </div>
          </div>

          {/* Fiber RTT */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas-surface border border-canvas-border">
            <Zap className="w-3.5 h-3.5 text-telemetry-cyan" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Fiber RTT</div>
              <div className="text-xs font-bold text-white leading-tight">
                {fiberRttMs}ms
              </div>
            </div>
          </div>

          {/* Geodesic Distance */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas-surface border border-canvas-border">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Distance</div>
              <div className="text-xs font-bold text-white leading-tight">
                {geodesicDistanceKm.toLocaleString()} km
              </div>
            </div>
          </div>

          {/* Total Waterfall Latency */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas-surface border border-canvas-border">
            <Clock className={`w-3.5 h-3.5 ${runtimeMode === 'CONTAINER' ? 'text-amber-400' : 'text-telemetry-teal'}`} />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Total Latency</div>
              <div className={`text-xs font-bold leading-tight ${runtimeMode === 'CONTAINER' ? 'text-amber-300' : 'text-telemetry-tealNeon'}`}>
                {totalLatencyMs}ms
              </div>
            </div>
          </div>

          {/* Runtime Mode Tag */}
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border ${
              runtimeMode === 'ISOLATE'
                ? 'bg-telemetry-teal/15 text-telemetry-tealLight border-telemetry-teal/40'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
            }`}
          >
            <Cpu className="w-3 h-3" />
            {runtimeMode === 'ISOLATE' ? 'V8 Isolate' : 'Container'}
          </span>
        </div>

        {/* Live Probe Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerProbe}
            disabled={isProbing}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition shadow-telemetry-card active:scale-95 ${
              isProbing
                ? 'bg-telemetry-teal/30 text-telemetry-tealNeon border border-telemetry-teal/50 cursor-wait'
                : 'bg-telemetry-teal text-canvas-deep hover:bg-telemetry-tealLight shadow-glow-teal'
            }`}
          >
            <Send className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
            <span>{isProbing ? 'Probing...' : 'Send Live Probe'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
