'use client';

import React from 'react';
import { usePromptForgeStore } from '../store/usePromptForgeStore';
import {
  GitCompare,
  DollarSign,
  TrendingDown,
  Zap,
  Layers,
  Sparkles,
  Sliders,
  Percent,
} from 'lucide-react';

export default function SemanticDiffAndCostWidget() {
  const candidateA = usePromptForgeStore((state) => state.candidateA);
  const candidateB = usePromptForgeStore((state) => state.candidateB);
  const selectedPricingTier = usePromptForgeStore((state) => state.selectedPricingTier);
  const monthlyTokensMillion = usePromptForgeStore((state) => state.monthlyTokensMillion);
  const setMonthlyTokensMillion = usePromptForgeStore((state) => state.setMonthlyTokensMillion);
  const promptCacheHitRate = usePromptForgeStore((state) => state.promptCacheHitRate);
  const setPromptCacheHitRate = usePromptForgeStore((state) => state.setPromptCacheHitRate);

  // Compute Word-Level Semantic Token Diff between Candidate A and Candidate B system prompts
  const wordsA = candidateA.systemMessage.split(/\s+/);
  const wordsB = candidateB.systemMessage.split(/\s+/);
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  // Cost calculations:
  // Monthly volume split: ~70% input prompt tokens (static system prompt + few-shot), ~30% output completion tokens
  const totalInputTokensM = monthlyTokensMillion * 0.7;
  const totalOutputTokensM = monthlyTokensMillion * 0.3;

  // Uncached Cost
  const uncachedInputCost = totalInputTokensM * selectedPricingTier.inputPer1M;
  const outputCost = totalOutputTokensM * selectedPricingTier.outputPer1M;
  const totalUncachedCost = uncachedInputCost + outputCost;

  // Cached Cost (e.g. 85% cache hit rate gets the cached price)
  const cachedFraction = promptCacheHitRate / 100;
  const cachedInputTokensM = totalInputTokensM * cachedFraction;
  const nonCachedInputTokensM = totalInputTokensM * (1 - cachedFraction);

  const cachedInputCost =
    cachedInputTokensM * selectedPricingTier.cachedInputPer1M +
    nonCachedInputTokensM * selectedPricingTier.inputPer1M;
  const totalCachedCost = cachedInputCost + outputCost;

  const dollarsSaved = Math.max(0, totalUncachedCost - totalCachedCost);
  const savingsPct = Math.round((dollarsSaved / totalUncachedCost) * 100);

  return (
    <div className="w-full rounded-2xl bg-canvas-card border border-canvas-border shadow-forge-card p-4 sm:p-6 select-none space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-border pb-4">
        <div className="flex items-center gap-2.5">
          <GitCompare className="w-5 h-5 text-violet-light" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Semantic Token Diff & Cost Arbitrage Widget
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Visual inline token delta between revisions and enterprise Prompt Caching savings model.
            </p>
          </div>
        </div>

        {/* Active Model Tier Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-canvas-deep border border-canvas-border text-xs font-mono">
          <span className="text-zinc-400">{selectedPricingTier.provider}:</span>
          <span className="text-violet-light font-bold">{selectedPricingTier.name}</span>
        </div>
      </div>

      {/* Top Half: Semantic Token Diff View */}
      <div className="rounded-xl bg-canvas-deep border border-canvas-border p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-canvas-border/50 pb-2">
          <div className="flex items-center gap-2 text-white font-bold">
            <span>System Prompt Semantic Revisions</span>
            <span className="text-[10px] text-zinc-500 font-normal">
              (Candidate A Baseline → Candidate B Guardrails)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded bg-emerald-500" /> Added in B
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded bg-rose-500" /> Removed from A
            </span>
          </div>
        </div>

        {/* Rendered Inline Diff */}
        <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-thin text-zinc-300">
          {wordsB.map((word, idx) => {
            const isAdded = !setA.has(word);
            return (
              <span
                key={idx}
                className={isAdded ? 'diff-add font-semibold' : 'text-zinc-300'}
              >
                {word}{' '}
              </span>
            );
          })}
          {wordsA
            .filter((w) => !setB.has(w))
            .map((word, idx) => (
              <span key={`del-${idx}`} className="diff-del mr-1">
                {word}
              </span>
            ))}
        </div>
      </div>

      {/* Bottom Half: Prompt Cache Arbitrage Calculator */}
      <div className="p-4 rounded-xl bg-canvas-surface/60 border border-canvas-border space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-canvas-border/50 pb-2">
          <div className="flex items-center gap-2 text-white font-bold">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Prompt Cache Arbitrage Model</span>
          </div>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Save {savingsPct}% with Prompt Caching
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Tokens Volume Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Workload Volume:</span>
              <strong className="text-white">{monthlyTokensMillion}M tokens/month</strong>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={monthlyTokensMillion}
              onChange={(e) => setMonthlyTokensMillion(Number(e.target.value))}
              className="w-full accent-violet bg-canvas-deep rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>5M tokens</span>
              <span>50M tokens</span>
              <span>100M tokens</span>
            </div>
          </div>

          {/* Cache Hit Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Prompt Cache Hit Rate:</span>
              <strong className="text-sky-300">{promptCacheHitRate}% Hit</strong>
            </div>
            <input
              type="range"
              min="40"
              max="95"
              step="5"
              value={promptCacheHitRate}
              onChange={(e) => setPromptCacheHitRate(Number(e.target.value))}
              className="w-full accent-sky-400 bg-canvas-deep rounded-lg cursor-pointer h-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>40% (Cold)</span>
              <span>75% (Warm)</span>
              <span>95% (High Reuse)</span>
            </div>
          </div>
        </div>

        {/* Comparative Cost Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center">
          <div className="p-3 rounded-xl bg-canvas-deep border border-canvas-border space-y-1">
            <span className="text-zinc-500 block text-[10px] uppercase">Uncached API Cost</span>
            <span className="text-white font-bold text-sm block">
              ${Math.round(totalUncachedCost).toLocaleString()} /mo
            </span>
            <span className="text-[10px] text-rose-400 block">Standard billing</span>
          </div>

          <div className="p-3 rounded-xl bg-canvas-deep border border-violet/40 shadow-glow-violet space-y-1">
            <span className="text-violet-light block text-[10px] uppercase">Cached API Cost</span>
            <span className="text-violet-light font-bold text-sm block">
              ${Math.round(totalCachedCost).toLocaleString()} /mo
            </span>
            <span className="text-[10px] text-emerald-300 block">Up to 90% input discount</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-glow-emerald space-y-1">
            <span className="text-emerald-400 block text-[10px] uppercase">Net Monthly Savings</span>
            <span className="text-emerald-300 font-bold text-base block">
              +${Math.round(dollarsSaved).toLocaleString()} /mo
            </span>
            <span className="text-[10px] text-emerald-400 block font-semibold">
              {savingsPct}% Cost Reduction
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
