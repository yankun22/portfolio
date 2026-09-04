'use client';

import React from 'react';
import { useAgentMeshStore } from '../store/useAgentMeshStore';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Terminal,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function ConsensusTimeline() {
  const scenarios = useAgentMeshStore((state) => state.scenarios);
  const activeScenarioId = useAgentMeshStore((state) => state.activeScenarioId);
  const currentStepIndex = useAgentMeshStore((state) => state.currentStepIndex);
  const agents = useAgentMeshStore((state) => state.agents);
  const lastEventLog = useAgentMeshStore((state) => state.lastEventLog);
  const simulationStatus = useAgentMeshStore((state) => state.simulationStatus);

  const activeScenario =
    scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const getAgentColor = (agentId: string) => {
    return agents.find((a) => a.id === agentId)?.color || '#38BDF8';
  };

  const getAgentName = (agentId: string) => {
    return agents.find((a) => a.id === agentId)?.name || agentId;
  };

  return (
    <div className="w-full p-4 rounded-2xl bg-canvas-card/80 backdrop-blur-xl border border-white/10 shadow-glass-card space-y-3 select-none">
      {/* Top Header: Consensus Pipeline Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-mint" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Deterministic Consensus Pipeline (5-Step Byzantine Quorum Loop)
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-zinc-500">STATE:</span>
          <span
            className={`px-2 py-0.5 rounded uppercase font-semibold ${
              simulationStatus === 'completed'
                ? 'bg-mint/15 text-mint border border-mint/20'
                : simulationStatus === 'running'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                : 'bg-white/10 text-zinc-400'
            }`}
          >
            {simulationStatus}
          </span>
        </div>
      </div>

      {/* 5 Step Sequence Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
        {activeScenario.steps.map((step, idx) => {
          const isCompleted = currentStepIndex > idx;
          const isCurrent = currentStepIndex === idx;
          const isPending = currentStepIndex < idx;

          const fromColor = getAgentColor(step.fromAgentId);
          const toColor = getAgentColor(step.toAgentId);

          return (
            <div
              key={step.stepNumber}
              className={`p-3 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isCurrent
                  ? 'bg-mint/[0.08] border-mint shadow-glass-glow'
                  : isCompleted
                  ? 'bg-white/[0.03] border-white/15'
                  : 'bg-canvas-deep/60 border-white/5 opacity-50'
              }`}
            >
              {/* Active Step Indicator Pulse Bar */}
              {isCurrent && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mint to-cyan-400 animate-pulse" />
              )}

              {/* Step Header */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isCompleted
                        ? 'bg-mint text-canvas'
                        : isCurrent
                        ? 'bg-sky-400 text-canvas'
                        : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      step.stepNumber
                    )}
                  </span>
                  <span className="text-[10px] font-mono font-semibold uppercase text-zinc-400">
                    Step {step.stepNumber}
                  </span>
                </div>

                <span className="text-[9px] font-mono text-zinc-500">
                  {step.payloadSizeKB} KB
                </span>
              </div>

              {/* Step Title */}
              <h4 className="text-xs font-semibold text-white mb-1.5 line-clamp-1">
                {step.title}
              </h4>

              {/* Transmitting & Receiving Agents */}
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-300 mb-2">
                <span
                  className="px-1.5 py-0.5 rounded bg-white/5 truncate max-w-[65px]"
                  style={{ color: fromColor }}
                >
                  {getAgentName(step.fromAgentId).split('-')[0]}
                </span>
                <ArrowRight className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                <span
                  className="px-1.5 py-0.5 rounded bg-white/5 truncate max-w-[65px]"
                  style={{ color: toColor }}
                >
                  {getAgentName(step.toAgentId).split('-')[0]}
                </span>
              </div>

              {/* Payload Tag */}
              <div className="text-[9px] font-mono text-zinc-400 truncate bg-black/40 px-2 py-1 rounded border border-white/5">
                {step.payloadName}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Event Log Terminal Ticker */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-mint flex-shrink-0">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-bold">LIVE CONSENSUS AUDIT:</span>
        </div>
        <p className="text-zinc-300 truncate font-sans">
          {lastEventLog}
        </p>
      </div>
    </div>
  );
}
