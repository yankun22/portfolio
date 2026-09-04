/**
 * PROPRIETARY & CONFIDENTIAL
 * (c) 2024-2026 Alok Vishwakarma. All Rights Reserved.
 * Showcase & Client Evaluation Only. Commercial use strictly prohibited.
 */

'use client';

import React, { useEffect } from 'react';
import PromptForgeHeader from '../components/PromptForgeHeader';
import SplitPanePromptArena from '../components/SplitPanePromptArena';
import EvalSuiteGuardrails from '../components/EvalSuiteGuardrails';
import SemanticDiffAndCostWidget from '../components/SemanticDiffAndCostWidget';
import MobileNavTabs from '../components/MobileNavTabs';
import { usePromptForgeStore } from '../store/usePromptForgeStore';
import { displayProvenanceWatermark } from '../utils/watermark';
import { ShieldCheck } from 'lucide-react';

export default function PromptForgePage() {
  const activeMobileTab = usePromptForgeStore((state) => state.activeMobileTab);

  useEffect(() => {
    displayProvenanceWatermark('PromptForge — Prompt Arena & LLM Guardrails IDE');
  }, []);

  return (
    <main className="relative flex flex-col w-full min-h-screen bg-canvas overflow-x-hidden">
      {/* Developer IDE Header */}
      <PromptForgeHeader />

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Mobile Navigation Tabs (visible on phone screens) */}
        <MobileNavTabs />

        {/* Desktop Layout: All visible simultaneously */}
        <div className="hidden md:block space-y-6">
          {/* Component 1: Split-Pane Prompt Arena */}
          <SplitPanePromptArena />

          {/* Component 2 & 3: Eval Test Suite + Semantic Diff & Cost Arbitrage */}
          <div className="grid grid-cols-12 gap-6 items-start">
            <div className="col-span-12 xl:col-span-7">
              <EvalSuiteGuardrails />
            </div>
            <div className="col-span-12 xl:col-span-5">
              <SemanticDiffAndCostWidget />
            </div>
          </div>
        </div>

        {/* Mobile Phone Layout: Switchable tabs for clean thumb-friendly navigation */}
        <div className="block md:hidden space-y-4">
          {activeMobileTab === 'arena' && <SplitPanePromptArena />}
          {activeMobileTab === 'evals' && <EvalSuiteGuardrails />}
          {activeMobileTab === 'diff' && <SemanticDiffAndCostWidget />}
        </div>
      </div>

      {/* Visible Copyright & Portfolio Provenance Footer */}
      <footer className="w-full py-4 px-6 border-t border-canvas-border bg-canvas-card/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-500 select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-light" />
          <span>© 2024–2026 Alok Vishwakarma. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-400">
          <span>LLM Engineering Evaluation</span>
          <span>•</span>
          <a
            href="https://github.com/yankun22/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-violet-light transition underline underline-offset-2"
          >
            GitHub Monorepo
          </a>
        </div>
      </footer>
    </main>
  );
}
