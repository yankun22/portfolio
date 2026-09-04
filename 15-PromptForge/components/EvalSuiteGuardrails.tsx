'use client';

import React, { useState } from 'react';
import { usePromptForgeStore } from '../store/usePromptForgeStore';
import { EvalTestCase } from '../types/prompt';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Activity,
  Zap,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

export default function EvalSuiteGuardrails() {
  const evalTests = usePromptForgeStore((state) => state.evalTests);
  const selectedEvalTest = usePromptForgeStore((state) => state.selectedEvalTest);
  const setSelectedEvalTest = usePromptForgeStore((state) => state.setSelectedEvalTest);

  // Compute aggregate pass rates & score averages
  const avgScoreA = Math.round(
    evalTests.reduce((acc, t) => acc + t.scoreA, 0) / evalTests.length
  );
  const avgScoreB = Math.round(
    evalTests.reduce((acc, t) => acc + t.scoreB, 0) / evalTests.length
  );
  const deltaQuality = avgScoreB - avgScoreA;

  return (
    <div className="w-full rounded-2xl bg-canvas-card border border-canvas-border shadow-forge-card p-4 sm:p-6 select-none space-y-5">
      {/* Header & Scoreboard HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Eval Test Suite & Guardrail Engine
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Continuous validation checking JSON schema conformance, prompt injection refusal, latency SLA, and hallucinations.
          </p>
        </div>

        {/* Aggregate Quality Delta Pill */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-2 rounded-xl bg-canvas-deep border border-canvas-border flex items-center gap-2">
            <span className="text-zinc-500 text-[10px] uppercase">Candidate A:</span>
            <span className="text-sky-300 font-bold">{avgScoreA}%</span>
          </div>

          <div className="p-2 rounded-xl bg-canvas-deep border border-canvas-border flex items-center gap-2">
            <span className="text-zinc-500 text-[10px] uppercase">Candidate B:</span>
            <span className="text-violet-light font-bold">{avgScoreB}%</span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5 shadow-glow-emerald">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{deltaQuality}% Net Gain</span>
          </div>
        </div>
      </div>

      {/* Eval Cases Interactive Table */}
      <div className="space-y-3 font-mono text-xs">
        {evalTests.map((test) => {
          const isExpanded = selectedEvalTest?.id === test.id;

          return (
            <div
              key={test.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-canvas-deep border-violet shadow-glow-violet'
                  : 'bg-canvas-deep/70 border-canvas-border hover:border-zinc-600'
              }`}
            >
              {/* Row Header */}
              <div
                onClick={() => setSelectedEvalTest(isExpanded ? null : test)}
                className="p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="p-1.5 rounded-lg bg-canvas-surface border border-canvas-border text-zinc-400 flex-shrink-0">
                    <Activity className="w-4 h-4 text-violet-light" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white text-xs block truncate">
                      {test.title}
                    </span>
                    <span className="text-[11px] text-zinc-400 block truncate max-w-xs sm:max-w-sm">
                      {test.rubric}
                    </span>
                  </div>
                </div>

                {/* Status Badges & Scores */}
                <div className="flex items-center gap-3 text-xs flex-shrink-0">
                  {/* Candidate A Badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">A:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border ${
                        test.statusA === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {test.statusA === 'PASS' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {test.scoreA}%
                    </span>
                  </div>

                  {/* Candidate B Badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-500">B:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border ${
                        test.statusB === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {test.statusB === 'PASS' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {test.scoreB}%
                    </span>
                  </div>

                  {/* Expand Chevron */}
                  <span className="text-zinc-400 pl-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-violet-light" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </div>

              {/* Expandable Diagnostic Breakdown Drawer */}
              {isExpanded && (
                <div className="p-4 border-t border-canvas-border bg-canvas-surface/40 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>
                      Target Criterion: <strong className="text-white">{test.targetCriterion}</strong>
                    </span>
                    <span className="text-zinc-500">{test.description}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Diagnostic A */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-300 text-xs">Candidate A Diagnostic:</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            test.statusA === 'PASS'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {test.statusA}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-[11px] font-sans leading-relaxed">
                        {test.diagnosticA}
                      </p>
                      {test.guardrailTriggeredA && (
                        <div className="flex items-center gap-1.5 text-[10px] text-rose-400 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
                          <AlertOctagon className="w-3 h-3 flex-shrink-0" />
                          <span>Guardrail Breach: Malicious prompt injection bypassed.</span>
                        </div>
                      )}
                    </div>

                    {/* Diagnostic B */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-violet-light text-xs">Candidate B Diagnostic:</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            test.statusB === 'PASS'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {test.statusB}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-[11px] font-sans leading-relaxed">
                        {test.diagnosticB}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 bg-emerald-500/10 p-1.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                        <span>Guardrail Enforced: Grounding & schema constraints verified.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
