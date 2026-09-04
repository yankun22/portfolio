'use client';

import React, { useState } from 'react';
import { useLatencyStore } from '../store/useLatencyStore';
import { RuntimeMode } from '../types/edge';
import {
  Cpu,
  Layers,
  Zap,
  TrendingDown,
  DollarSign,
  AlertOctagon,
  Clock,
  Sparkles,
  Sliders,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export default function RuntimeExecutionComparison() {
  const runtimeMode = useLatencyStore((state) => state.runtimeMode);
  const setRuntimeMode = useLatencyStore((state) => state.setRuntimeMode);

  // Interactive Simulation Controls
  const [monthlyRequestsMillion, setMonthlyRequestsMillion] = useState<number>(10);
  const [burstConcurrency, setBurstConcurrency] = useState<number>(5000); // req/sec burst

  // Cost Models:
  // Edge Isolate: $0.30 per 1M requests (128MB, 50ms CPU)
  // Standard Container: $2.50 per 1M requests (1024MB container allocation + persistent idle boot)
  const isolateCost = (monthlyRequestsMillion * 0.30).toFixed(2);
  const containerCost = (monthlyRequestsMillion * 2.50).toFixed(2);
  const costSavings = (((Number(containerCost) - Number(isolateCost)) / Number(containerCost)) * 100).toFixed(0);

  // Latency Degradation Estimates under Burst Concurrency:
  // Isolate: p50: 4ms, p95: 12ms, p99: 18ms (0ms queue stall)
  // Container: p50: 18ms, p95: 220ms, p99: 840ms (cold instances boot under surge)
  const isolateP50 = 4;
  const isolateP95 = 12;
  const isolateP99 = 18;

  const containerP50 = 18;
  const containerP95 = Math.min(650, Math.round(140 + (burstConcurrency / 5000) * 80));
  const containerP99 = Math.min(1250, Math.round(820 + (burstConcurrency / 5000) * 120));

  return (
    <div className="w-full rounded-2xl bg-canvas-card border border-canvas-border shadow-telemetry-card p-4 sm:p-6 select-none space-y-6">
      {/* Top Header & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-borderSubtle pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-telemetry-teal" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Edge Isolate vs Container Runtime Benchmark
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compare zero-cold-start V8 process isolation against traditional OCI Linux container virtualization.
          </p>
        </div>

        {/* Runtime Switcher Toggle */}
        <div className="flex items-center rounded-xl bg-canvas-deep border border-canvas-border p-1 text-xs font-mono">
          <button
            onClick={() => setRuntimeMode('ISOLATE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
              runtimeMode === 'ISOLATE'
                ? 'bg-telemetry-teal text-canvas-deep shadow-glow-teal'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>V8 Edge Isolate</span>
          </button>
          <button
            onClick={() => setRuntimeMode('CONTAINER')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all ${
              runtimeMode === 'CONTAINER'
                ? 'bg-amber-500 text-canvas-deep shadow-glow-amber'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>OCI Container</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Architectural Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Card 1: Edge V8 Isolate */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            runtimeMode === 'ISOLATE'
              ? 'bg-telemetry-teal/10 border-telemetry-teal shadow-glow-teal'
              : 'bg-canvas-surface/60 border-canvas-border opacity-70 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-canvas-border pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-telemetry-tealNeon shadow-[0_0_8px_#5EEAD4]" />
              <span className="font-bold text-white text-sm">V8 Edge Isolate</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-telemetry-teal/20 text-telemetry-tealLight border border-telemetry-teal/40">
              0ms COLD START
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Cold Boot Time:</span>
              <span className="text-telemetry-tealNeon font-bold">&lt; 0.5 ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Memory Footprint:</span>
              <span className="text-white">~5 MB (128 MB Limit)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Isolation Layer:</span>
              <span className="text-white">V8 Isolate Heap Sandboxing</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Concurrency Model:</span>
              <span className="text-emerald-400 font-semibold">10,000+ per process</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Cost per 1M Reqs:</span>
              <span className="text-telemetry-tealNeon font-bold">$0.30</span>
            </div>
          </div>
        </div>

        {/* Card 2: Standard Linux Container */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            runtimeMode === 'CONTAINER'
              ? 'bg-amber-500/10 border-amber-500 shadow-glow-amber'
              : 'bg-canvas-surface/60 border-canvas-border opacity-70 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-canvas-border pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B]" />
              <span className="font-bold text-white text-sm">Standard OCI Container</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              800ms BOOT
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-400">Cold Boot Time:</span>
              <span className="text-rose-400 font-bold">140ms - 820ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Memory Footprint:</span>
              <span className="text-white">512 MB - 2,048 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Isolation Layer:</span>
              <span className="text-white">Linux cgroups / Namespaces</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Concurrency Model:</span>
              <span className="text-amber-400 font-semibold">1 - 50 per container</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Cost per 1M Reqs:</span>
              <span className="text-rose-300 font-bold">$2.50+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Sliders */}
      <div className="p-4 rounded-xl bg-canvas-deep border border-canvas-border space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-telemetry-teal" />
          <span>Real-Time Traffic & Scaling Simulator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Slider 1: Monthly Requests */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Monthly Volume:</span>
              <strong className="text-white">{monthlyRequestsMillion}M reqs/month</strong>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={monthlyRequestsMillion}
              onChange={(e) => setMonthlyRequestsMillion(Number(e.target.value))}
              className="w-full accent-telemetry-teal bg-canvas-surface rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>1M</span>
              <span>25M</span>
              <span>50M</span>
            </div>
          </div>

          {/* Slider 2: Surge Concurrency */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Surge Concurrency:</span>
              <strong className="text-amber-400">{burstConcurrency.toLocaleString()} req/s burst</strong>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={burstConcurrency}
              onChange={(e) => setBurstConcurrency(Number(e.target.value))}
              className="w-full accent-amber-400 bg-canvas-surface rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>500 req/s</span>
              <span>7,500 req/s</span>
              <span>15,000 req/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Performance & Cost Results Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cost Comparison Bar */}
        <div className="p-4 rounded-xl bg-canvas-surface border border-canvas-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Projected Monthly Cost</span>
            </div>
            <span className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Save ~{costSavings}%
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-telemetry-tealLight">V8 Edge Isolate:</span>
                <span className="text-white font-bold">${isolateCost} /mo</span>
              </div>
              <div className="w-full h-2 rounded-full bg-canvas-deep overflow-hidden">
                <div
                  className="h-full bg-telemetry-teal rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (Number(isolateCost) / Number(containerCost)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-amber-400">OCI Container:</span>
                <span className="text-white font-bold">${containerCost} /mo</span>
              </div>
              <div className="w-full h-2 rounded-full bg-canvas-deep overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Latency Degradation Percentiles */}
        <div className="p-4 rounded-xl bg-canvas-surface border border-canvas-border space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-4 h-4 text-telemetry-cyan" />
              <span>Surge Latency (p50 / p95 / p99)</span>
            </div>
            <span className="text-zinc-500 text-[10px]">Under Traffic Spike</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-canvas-deep border border-canvas-border">
              <span className="text-zinc-500 block text-[9px]">p50 Latency</span>
              <span className="text-white font-bold text-xs mt-0.5 block">
                {runtimeMode === 'ISOLATE' ? `${isolateP50}ms` : `${containerP50}ms`}
              </span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">
                {runtimeMode === 'ISOLATE' ? 'Sub-5ms' : 'Warm container'}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-canvas-deep border border-canvas-border">
              <span className="text-zinc-500 block text-[9px]">p95 Latency</span>
              <span className={`font-bold text-xs mt-0.5 block ${runtimeMode === 'ISOLATE' ? 'text-white' : 'text-amber-400'}`}>
                {runtimeMode === 'ISOLATE' ? `${isolateP95}ms` : `${containerP95}ms`}
              </span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">
                {runtimeMode === 'ISOLATE' ? 'Stable curve' : 'Queue backlog'}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-canvas-deep border border-canvas-border">
              <span className="text-zinc-500 block text-[9px]">p99 Tail Spike</span>
              <span className={`font-bold text-xs mt-0.5 block ${runtimeMode === 'ISOLATE' ? 'text-telemetry-tealNeon' : 'text-rose-400'}`}>
                {runtimeMode === 'ISOLATE' ? `${isolateP99}ms` : `${containerP99}ms`}
              </span>
              <span className={`text-[9px] block mt-0.5 ${runtimeMode === 'ISOLATE' ? 'text-emerald-400' : 'text-rose-400 font-semibold'}`}>
                {runtimeMode === 'ISOLATE' ? 'Zero cold start' : 'Cold boot penalty'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
