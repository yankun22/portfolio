'use client';

import React from 'react';
import { useEventPulseStore } from '../store/useEventPulseStore';
import { Layers, Code2, Flame } from 'lucide-react';

export default function MobileNavTabs() {
  const activeTab = useEventPulseStore((state) => state.activeMobileTab);
  const setActiveTab = useEventPulseStore((state) => state.setActiveMobileTab);

  const tabs = [
    { id: 'pipeline', label: 'Pipeline', icon: Layers },
    { id: 'schema', label: 'Schema Sandbox', icon: Code2 },
    { id: 'chaos', label: 'Chaos Controller', icon: Flame },
  ] as const;

  return (
    <div className="flex md:hidden items-center justify-around p-1.5 rounded-xl bg-canvas-card border border-white/10 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-mono transition-all ${
              isActive
                ? 'bg-ultra text-white font-bold shadow-glow-ultra'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
