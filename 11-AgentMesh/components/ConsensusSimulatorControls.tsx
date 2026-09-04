'use client';

import React, { useEffect } from 'react';
import { useAgentMeshStore } from '../store/useAgentMeshStore';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Zap,
  ShieldAlert,
  ChevronDown,
  Gauge,
  CheckCircle2,
} from 'lucide-react';

export default function ConsensusSimulatorControls() {
  const scenarios = useAgentMeshStore((state) => state.scenarios);
  const activeScenarioId = useAgentMeshStore((state) => state.activeScenarioId);
  const setActiveScenario = useAgentMeshStore((state) => state.setActiveScenario);
  const triggerScenario = useAgentMeshStore((state) => state.triggerScenario);
  const stepForward = useAgentMeshStore((state) => state.stepForward);
  const togglePlay = useAgentMeshStore((state) => state.togglePlay);
  const isPlaying = useAgentMeshStore((state) => state.isPlaying);
  const playbackSpeed = useAgentMeshStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useAgentMeshStore((state) => state.setPlaybackSpeed);
  const resetSimulation = useAgentMeshStore((state) => state.resetSimulation);
  const simulationStatus = useAgentMeshStore((state) => state.simulationStatus);
  const currentStepIndex = useAgentMeshStore((state) => state.currentStepIndex);

  const activeScenario =
    scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  // Auto-play interval effect
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(1200, 3200 / playbackSpeed);
    const timer = setInterval(() => {
      stepForward();
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, stepForward]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-canvas-card/80 backdrop-blur-xl border border-white/10 shadow-glass-card">
      {/* Scenario Selector & Threat Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={activeScenarioId}
            onChange={(e) => setActiveScenario(e.target.value)}
            className="appearance-none pl-3.5 pr-9 py-2.5 rounded-xl bg-canvas-deep border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-mint transition cursor-pointer hover:border-white/30"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id} className="bg-canvas-deep text-white">
                {sc.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>

        {/* Severity Tag & Target System */}
        <div className="hidden md:flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border flex items-center gap-1 ${
              activeScenario.severity === 'CRITICAL'
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            {activeScenario.severity}
          </span>
          <span className="text-xs font-mono text-zinc-400 truncate max-w-xs">
            {activeScenario.targetSystem}
          </span>
        </div>
      </div>

      {/* Simulator Control Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Trigger Scenario Primary Button */}
        <button
          onClick={() => triggerScenario()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-mint to-emerald-400 text-canvas font-bold text-xs shadow-glass-glow hover:brightness-110 active:scale-95 transition"
        >
          <Zap className="w-4 h-4 fill-canvas" />
          <span>Trigger Scenario</span>
        </button>

        {/* Auto Play / Pause Toggle */}
        <button
          onClick={togglePlay}
          title={isPlaying ? 'Pause Simulation' : 'Auto Play Consensus Loop'}
          disabled={simulationStatus === 'idle' && currentStepIndex === -1}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-mono font-semibold transition border ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-glow-amber'
              : 'bg-white/5 text-zinc-200 border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        {/* Step Forward Button */}
        <button
          onClick={stepForward}
          title="Step Next Consensus Step"
          disabled={simulationStatus === 'completed' || simulationStatus === 'idle'}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-semibold text-zinc-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <SkipForward className="w-4 h-4" />
          <span>Step</span>
        </button>

        {/* Reset Simulation Button */}
        <button
          onClick={resetSimulation}
          title="Reset Simulation to Initial State"
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Playback Speed Multiplier Toggle */}
        <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5 text-[11px] font-mono">
          {([1, 2, 4] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                playbackSpeed === spd
                  ? 'bg-mint text-canvas font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
