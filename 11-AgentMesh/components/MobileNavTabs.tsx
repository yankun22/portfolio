'use client';

import React from 'react';
import { useAgentMeshStore } from '../store/useAgentMeshStore';
import { Layers, Sliders, ShieldCheck, Cpu } from 'lucide-react';

export default function MobileNavTabs() {
  const activeTab = useAgentMeshStore((state) => state.activeMobileTab);
  const setActiveTab = useAgentMeshStore((state) => state.setActiveMobileTab);

  const tabs = [
    { id: 'topology', label: 'Topology', icon: Layers },
    { id: 'controls', label: 'Controls', icon: Sliders },
    { id: 'pipeline', label: 'Pipeline', icon: ShieldCheck },
    { id: 'inspector', label: 'Inspector', icon: Cpu },
  ] as const;

  return (
    <div className="flex md:hidden items-center justify-around p-1.5 rounded-xl bg-canvas-card border border-white/10 select-none shadow-glass-card">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-mono transition-all ${
              isActive
                ? 'bg-mint text-canvas font-bold shadow-glass-glow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
