'use client';

import React, { useState } from 'react';
import { usePromptForgeStore } from '../store/usePromptForgeStore';
import { PromptCandidate } from '../types/prompt';
import {
  Columns2,
  Sliders,
  Play,
  Sparkles,
  Layers,
  Cpu,
  Variable,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Shield,
  Zap,
} from 'lucide-react';

export default function SplitPanePromptArena() {
  const candidateA = usePromptForgeStore((state) => state.candidateA);
  const candidateB = usePromptForgeStore((state) => state.candidateB);
  const updateCandidate = usePromptForgeStore((state) => state.updateCandidate);
  const variableSets = usePromptForgeStore((state) => state.variableSets);
  const activeVariableSet = usePromptForgeStore((state) => state.activeVariableSet);
  const setActiveVariableSet = usePromptForgeStore((state) => state.setActiveVariableSet);
  const isStreaming = usePromptForgeStore((state) => state.isStreaming);
  const startStreamingComparison = usePromptForgeStore(
    (state) => state.startStreamingComparison
  );

  const [expandedSystemA, setExpandedSystemA] = useState(false);
  const [expandedSystemB, setExpandedSystemB] = useState(false);

  // Render a candidate column
  const renderCandidateColumn = (
    candidate: PromptCandidate,
    isExpanded: boolean,
    toggleExpanded: () => void
  ) => {
    const isA = candidate.id === 'A';

    return (
      <div className="flex-1 flex flex-col rounded-xl bg-canvas-deep border border-canvas-border overflow-hidden">
        {/* Column Header */}
        <div className="p-3.5 border-b border-canvas-border bg-canvas-surface/70 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isA ? 'bg-sky-400' : 'bg-violet-light'
              }`}
            />
            <span className="text-white font-bold tracking-wide">
              {candidate.name}
            </span>
            <span
              className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                isA
                  ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                  : 'bg-violet/20 text-violet-light border-violet/40'
              }`}
            >
              {candidate.badge}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <span>
              Tokens: <strong className="text-white">{candidate.outputTokens}</strong>
            </span>
            <span>
              Latency: <strong className="text-white">{candidate.latencyMs}ms</strong>
            </span>
          </div>
        </div>

        {/* Hyperparameters Controls Bar */}
        <div className="px-3.5 py-2.5 bg-canvas-surface/40 border-b border-canvas-border/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Temperature Slider */}
          <div className="flex items-center gap-2 flex-1 min-w-[140px]">
            <span className="text-zinc-500 text-[10px] uppercase">Temp:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={candidate.temperature}
              onChange={(e) =>
                updateCandidate(candidate.id, { temperature: Number(e.target.value) })
              }
              className="w-20 accent-violet bg-canvas-deep rounded-lg cursor-pointer h-1.5"
            />
            <span className="text-white font-semibold text-[11px]">
              {candidate.temperature}
            </span>
          </div>

          {/* Speed Slider (tokens/sec) */}
          <div className="flex items-center gap-2 flex-1 min-w-[150px]">
            <span className="text-zinc-500 text-[10px] uppercase">Speed:</span>
            <input
              type="range"
              min="15"
              max="80"
              step="5"
              value={candidate.tokensPerSec}
              onChange={(e) =>
                updateCandidate(candidate.id, { tokensPerSec: Number(e.target.value) })
              }
              className="w-20 accent-violet bg-canvas-deep rounded-lg cursor-pointer h-1.5"
            />
            <span className="text-white font-semibold text-[11px]">
              {candidate.tokensPerSec} t/s
            </span>
          </div>

          {/* Collapsible System Message Trigger */}
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
          >
            <Shield className="w-3 h-3 text-violet-light" />
            <span>System Prompt</span>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Collapsible System Message Tray */}
        {isExpanded && (
          <div className="p-3 bg-canvas-deep border-b border-canvas-border space-y-1 font-mono text-xs">
            <span className="text-zinc-500 text-[10px] uppercase block">
              System Instruction / Guardrail Directives:
            </span>
            <textarea
              rows={4}
              value={candidate.systemMessage}
              onChange={(e) =>
                updateCandidate(candidate.id, { systemMessage: e.target.value })
              }
              className="w-full bg-black/40 border border-canvas-border rounded-lg p-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-violet resize-y"
            />
          </div>
        )}

        {/* User Prompt Template Editor */}
        <div className="p-3 bg-canvas-surface/20 border-b border-canvas-border space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
            <span>Prompt Template:</span>
            <span className="text-violet-light lowercase">interpolating active variables</span>
          </div>
          <textarea
            rows={3}
            value={candidate.template}
            onChange={(e) =>
              updateCandidate(candidate.id, { template: e.target.value })
            }
            className="w-full bg-black/30 border border-canvas-border rounded-lg p-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-violet resize-y scrollbar-thin"
          />
        </div>

        {/* Real-Time Generated Output Box */}
        <div className="flex-1 p-3.5 bg-black/50 min-h-[220px] max-h-[380px] overflow-y-auto font-mono text-xs text-zinc-200 flex flex-col justify-between scrollbar-thin">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-white/5 pb-1">
              <span className="uppercase">Streamed Completion:</span>
              {candidate.isStreaming && (
                <span className="text-violet-light flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet animate-ping" />
                  Generating @ {candidate.tokensPerSec} tokens/s
                </span>
              )}
              {candidate.isCompleted && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>

            <div className="whitespace-pre-wrap leading-relaxed">
              {candidate.output ? (
                <>
                  {candidate.output}
                  {candidate.isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-violet animate-caret align-middle" />
                  )}
                </>
              ) : (
                <span className="text-zinc-600 italic">
                  Click 'Run Arena Benchmark' to stream LLM responses token-by-token...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full rounded-2xl bg-canvas-card border border-canvas-border shadow-forge-card p-4 sm:p-6 select-none space-y-4">
      {/* Arena Top Header & Scenario Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-canvas-border pb-4">
        <div className="flex items-center gap-2.5">
          <Columns2 className="w-5 h-5 text-violet-light" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Split-Pane Prompt Arena
            </h2>
            <p className="text-xs text-zinc-400">
              Side-by-side prompt candidate comparison with dynamic variable interpolation and real-time streaming.
            </p>
          </div>
        </div>

        {/* Global Run Trigger */}
        <button
          onClick={startStreamingComparison}
          disabled={isStreaming}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition shadow-forge-card active:scale-95 ${
            isStreaming
              ? 'bg-violet/30 text-violet-light border border-violet/40 cursor-wait'
              : 'bg-violet hover:bg-violet-dark text-white shadow-glow-violet'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
          <span>{isStreaming ? 'Generating...' : 'Stream Arena'}</span>
        </button>
      </div>

      {/* Test Scenario / Dynamic Variable Set Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
        <span className="text-zinc-400 flex items-center gap-1 mr-1">
          <Variable className="w-3.5 h-3.5 text-violet-light" /> Scenario:
        </span>
        {variableSets.map((vSet) => {
          const isSelected = activeVariableSet.id === vSet.id;
          return (
            <button
              key={vSet.id}
              onClick={() => setActiveVariableSet(vSet)}
              className={`px-3 py-1.5 rounded-xl text-xs transition border ${
                isSelected
                  ? 'bg-violet/20 text-violet-light border-violet shadow-glow-violet font-bold'
                  : 'bg-canvas-deep text-zinc-400 border-canvas-border hover:text-white hover:border-zinc-500'
              }`}
            >
              {vSet.label}
              {vSet.isMaliciousInjection && (
                <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                  ATTACK
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Variable Context Preview Card */}
      <div className="p-3 rounded-xl bg-canvas-deep border border-canvas-border font-mono text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-canvas-border/50 pb-1.5 text-[11px]">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Variable className="w-3 h-3 text-violet-light" />
            <strong className="text-white">Active Interpolation Context:</strong>
          </span>
          <span className="text-zinc-500">Target User: {activeVariableSet.userId}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">
              {'{{customer_query}}'}:
            </span>
            <p className="text-zinc-200 mt-0.5 leading-relaxed bg-black/30 p-2 rounded border border-white/5">
              {activeVariableSet.customerQuery}
            </p>
          </div>
          <div>
            <span className="text-zinc-500 block text-[9px] uppercase">
              {'{{retrieved_context}}'}:
            </span>
            <p className="text-zinc-300 mt-0.5 leading-relaxed bg-black/30 p-2 rounded border border-white/5 truncate">
              {activeVariableSet.retrievedContext}
            </p>
          </div>
        </div>
      </div>

      {/* Dual Column Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
        {renderCandidateColumn(candidateA, expandedSystemA, () =>
          setExpandedSystemA(!expandedSystemA)
        )}
        {renderCandidateColumn(candidateB, expandedSystemB, () =>
          setExpandedSystemB(!expandedSystemB)
        )}
      </div>
    </div>
  );
}
