'use client';

import React from 'react';
import { useEventPulseStore } from '../store/useEventPulseStore';
import {
  Activity,
  Zap,
  AlertOctagon,
  Clock,
  Layers,
  ShieldCheck,
  Flame,
  Radio,
  Sliders,
} from 'lucide-react';

export default function CockpitHeader() {
  const throughputMsgSec = useEventPulseStore((state) => state.throughputMsgSec);
  const totalEventsProcessed = useEventPulseStore((state) => state.totalEventsProcessed);
  const p99CommitLatencyMs = useEventPulseStore((state) => state.p99CommitLatencyMs);
  const errorRatePct = useEventPulseStore((state) => state.errorRatePct);
  const dlq = useEventPulseStore((state) => state.dlq);
  const isDLQDrawerOpen = useEventPulseStore((state) => state.isDLQDrawerOpen);
  const toggleDLQDrawer = useEventPulseStore((state) => state.toggleDLQDrawer);
  const chaos = useEventPulseStore((state) => state.chaos);

  const isLagActive = chaos.partitionLagActive;
  const isCrashActive = chaos.consumerCrash;

  return (
    <header className="w-full border-b border-white/10 bg-canvas-card/85 backdrop-blur-xl px-4 py-3 select-none z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-ultra/15 border border-ultra/40 shadow-glow-ultra">
            <Radio className="w-4 h-4 text-ultra animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-ultra shadow-[0_0_8px_#8B5CF6]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-sans">
                EventPulse
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-ultra-light border border-ultra/30">
                v3.2 Partition Engine
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 hidden sm:block">
              Kafka / Redpanda Real-Time Stream Cockpit & Schema Sandbox
            </p>
          </div>
        </div>

        {/* Live Cockpit Telemetry Counters */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
          {/* Throughput msg/sec */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <Zap className={`w-3.5 h-3.5 ${isCrashActive ? 'text-warn' : 'text-mint'}`} />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Throughput</div>
              <div className="text-xs font-bold text-white leading-tight">
                {throughputMsgSec.toLocaleString()} <span className="text-[10px] text-zinc-400 font-normal">msg/s</span>
              </div>
            </div>
          </div>

          {/* p99 Latency */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-colors ${
              isLagActive
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'bg-white/[0.03] border-white/10 text-zinc-300'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isLagActive ? 'text-rose-400 animate-bounce' : 'text-sky-400'}`} />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">p99 Commit</div>
              <div className="text-xs font-bold leading-tight">
                {p99CommitLatencyMs}ms
              </div>
            </div>
          </div>

          {/* Total Events */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <Activity className="w-3.5 h-3.5 text-ultra" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Processed</div>
              <div className="text-xs font-bold text-white leading-tight">
                {totalEventsProcessed.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Error Rate */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Error Rate</div>
              <div className="text-xs font-bold text-white leading-tight">
                {errorRatePct}%
              </div>
            </div>
          </div>
        </div>

        {/* DLQ Button / Drawer Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleDLQDrawer()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all font-semibold ${
              dlq.length > 0
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>DLQ</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                dlq.length > 0 ? 'bg-rose-500 text-white' : 'bg-white/10 text-zinc-400'
              }`}
            >
              {dlq.length}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
