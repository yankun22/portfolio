'use client';

import React from 'react';
import { usePromptForgeStore } from '../store/usePromptForgeStore';
import { Columns2, ShieldCheck, GitCompare } from 'lucide-react';

export default function MobileNavTabs() {
  const activeMobileTab = usePromptForgeStore((state) => state.activeMobileTab);
  const setActiveMobileTab = usePromptForgeStore((state) => state.setActiveMobileTab);

  const tabs = [
    { id: 'arena', label: 'Prompt Arena', icon: Columns2 },
    { id: 'evals', label: 'Eval Suite', icon: ShieldCheck },
    { id: 'diff', label: 'Diff & Cost', icon: GitCompare },
  ] as const;

  return (
    <div className="flex md:hidden items-center justify-between p-1 rounded-xl bg-canvas-card border border-canvas-border shadow-forge-card">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeMobileTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveMobileTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
              isActive
                ? 'bg-violet text-white shadow-glow-violet'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
