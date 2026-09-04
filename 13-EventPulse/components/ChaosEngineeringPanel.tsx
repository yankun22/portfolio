'use client';

import React from 'react';
import { useEventPulseStore } from '../store/useEventPulseStore';
import {
  Flame,
  Skull,
  AlertTriangle,
  Clock,
  Zap,
  Activity,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';

export default function ChaosEngineeringPanel() {
  const chaos = useEventPulseStore((state) => state.chaos);
  const toggleConsumerCrash = useEventPulseStore((state) => state.toggleConsumerCrash);
  const injectPoisonPill = useEventPulseStore((state) => state.injectPoisonPill);
  const togglePartitionLag = useEventPulseStore((state) => state.togglePartitionLag);
  const dlq = useEventPulseStore((state) => state.dlq);
  const toggleDLQDrawer = useEventPulseStore((state) => state.toggleDLQDrawer);

  return (
    <div className="w-full rounded-2xl bg-canvas-card/85 backdrop-blur-xl border border-white/10 shadow-cockpit-card p-4 sm:p-6 select-none space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Chaos Engineering Controller
          </h2>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Failure Mode Injection Engine
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-1 gap-3.5">
        {/* Chaos Toggle 1: Consumer Crash */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            chaos.consumerCrash
              ? 'bg-rose-500/15 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : 'bg-canvas-deep/80 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between gap-2.5 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  chaos.consumerCrash ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-zinc-400'
                }`}
              >
                <Skull className={`w-4 h-4 ${chaos.consumerCrash ? 'animate-bounce' : ''}`} />
              </div>
              <span className="font-bold text-xs font-mono text-white tracking-wide truncate">
                Simulate Consumer Crash
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold flex-shrink-0 ${
                chaos.consumerCrash ? 'bg-rose-500 text-white' : 'bg-white/10 text-zinc-400'
              }`}
            >
              {chaos.consumerCrash ? 'CRASHED' : 'HEALTHY'}
            </span>
          </div>

          <p className="text-xs text-zinc-400 mb-3.5 leading-relaxed font-sans">
            Kills Worker Beta instance. Triggers partition rebalance; Worker Alpha assumes ownership of partition-1.
          </p>

          <button
            onClick={toggleConsumerCrash}
            className={`w-full py-2.5 rounded-lg text-xs font-mono font-semibold transition active:scale-[0.98] ${
              chaos.consumerCrash
                ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
            }`}
          >
            {chaos.consumerCrash ? 'Restore Worker Beta' : 'Crash Worker Beta'}
          </button>
        </div>

        {/* Chaos Action 2: Poison Pill Payload */}
        <div className="p-4 rounded-xl border border-white/10 bg-canvas-deep/80 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between gap-2.5 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-500/15 text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs font-mono text-white tracking-wide truncate">
                Inject Poison Pill Payload
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex-shrink-0">
              DLQ: {dlq.length}
            </span>
          </div>

          <p className="text-xs text-zinc-400 mb-3.5 leading-relaxed font-sans">
            Sends malformed JSON payload with unescaped null bytes. Consumer panic diverted to Dead-Letter Queue.
          </p>

          <button
            onClick={injectPoisonPill}
            className="w-full py-2.5 rounded-lg text-xs font-mono font-semibold bg-amber-500 text-canvas hover:bg-amber-400 transition shadow-glow-amber active:scale-[0.98]"
          >
            Inject Poison Pill ⚡
          </button>
        </div>

        {/* Chaos Toggle 3: 5000ms Partition Lag */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            chaos.partitionLagActive
              ? 'bg-amber-500/15 border-amber-500/50 shadow-glow-amber'
              : 'bg-canvas-deep/80 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between gap-2.5 mb-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  chaos.partitionLagActive ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-zinc-400'
                }`}
              >
                <Clock className={`w-4 h-4 ${chaos.partitionLagActive ? 'animate-spin' : ''}`} />
              </div>
              <span className="font-bold text-xs font-mono text-white tracking-wide truncate">
                Induce 5000ms Partition Lag
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold flex-shrink-0 ${
                chaos.partitionLagActive ? 'bg-amber-400 text-canvas' : 'bg-white/10 text-zinc-400'
              }`}
            >
              {chaos.partitionLagActive ? 'THROTTLED' : 'NORMAL'}
            </span>
          </div>

          <p className="text-xs text-zinc-400 mb-3.5 leading-relaxed font-sans">
            Throttles partition-2 worker consumption. Lag surges to 5,000+ messages; p99 commit latency spikes to 5s.
          </p>

          <button
            onClick={togglePartitionLag}
            className={`w-full py-2.5 rounded-lg text-xs font-mono font-semibold transition active:scale-[0.98] ${
              chaos.partitionLagActive
                ? 'bg-amber-500 text-canvas hover:bg-amber-400 font-bold'
                : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
            }`}
          >
            {chaos.partitionLagActive ? 'Remove Lag Throttle' : 'Throttle Partition 2 (5s)'}
          </button>
        </div>
      </div>

      {/* DLQ Quick-Access Footer Banner */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-mono text-zinc-400 truncate">
            Dead-Letter Queue:
          </span>
          <span className="text-xs font-mono font-bold text-amber-400">
            {dlq.length} quarantined
          </span>
        </div>
        <button
          onClick={() => toggleDLQDrawer()}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition flex items-center gap-1.5 flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Open DLQ</span>
        </button>
      </div>
    </div>
  );
}
