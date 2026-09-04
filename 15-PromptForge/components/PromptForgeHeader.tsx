'use client';

import React from 'react';
import { usePromptForgeStore } from '../store/usePromptForgeStore';
import {
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function PromptForgeHeader() {
  const modelPricingTiers = usePromptForgeStore((state) => state.modelPricingTiers);
  const selectedPricingTier = usePromptForgeStore((state) => state.selectedPricingTier);
  const setSelectedPricingTier = usePromptForgeStore((state) => state.setSelectedPricingTier);
  const isStreaming = usePromptForgeStore((state) => state.isStreaming);
  const startStreamingComparison = usePromptForgeStore((state) => state.startStreamingComparison);
  const resetOutputs = usePromptForgeStore((state) => state.resetOutputs);
  const promptCacheHitRate = usePromptForgeStore((state) => state.promptCacheHitRate);

  return (
    <header className="w-full border-b border-canvas-border bg-canvas-card/90 backdrop-blur-xl px-4 sm:px-6 py-3 select-none z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-violet/20 border border-violet/40 shadow-glow-violet">
            <Terminal className="w-4 h-4 text-violet-light animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-light shadow-[0_0_8px_#C084FC]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                PromptForge
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-violet/15 text-violet-light border border-violet/30">
                IDE v5.2
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 hidden sm:block">
              Split-Pane Prompt Arena • Guardrail Eval Suite • Token Cost Arbitrage
            </p>
          </div>
        </div>

        {/* Center: Model Selector & Cache Status */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          {/* Model Selector Dropdown/Buttons */}
          <div className="flex items-center rounded-xl bg-canvas-deep border border-canvas-border p-1">
            {modelPricingTiers.map((tier) => {
              const isSelected = selectedPricingTier.id === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedPricingTier(tier)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all font-semibold ${
                    isSelected
                      ? 'bg-violet text-white shadow-glow-violet font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tier.name}
                </button>
              );
            })}
          </div>

          {/* Prompt Cache Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-canvas-deep border border-canvas-border">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Prompt Cache</div>
              <div className="text-xs font-bold text-sky-300 leading-tight">
                {promptCacheHitRate}% Hit Rate
              </div>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={resetOutputs}
            disabled={isStreaming}
            className="p-2 rounded-xl bg-canvas-deep border border-canvas-border text-zinc-400 hover:text-white hover:border-zinc-500 transition active:scale-95 disabled:opacity-50"
            title="Clear outputs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={startStreamingComparison}
            disabled={isStreaming}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition shadow-forge-card active:scale-95 ${
              isStreaming
                ? 'bg-violet/30 text-violet-light border border-violet/40 cursor-wait'
                : 'bg-violet hover:bg-violet-dark text-white shadow-glow-violet'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
            <span>{isStreaming ? 'Streaming Arena...' : 'Run Arena Benchmark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
