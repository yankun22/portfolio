'use client';

import React from 'react';
import { useLatencyStore } from '../store/useLatencyStore';
import { Globe, BarChart3, Cpu } from 'lucide-react';

export default function MobileNavTabs() {
  const activeMobileTab = useLatencyStore((state) => state.activeMobileTab);
  const setActiveMobileTab = useLatencyStore((state) => state.setActiveMobileTab);

  const tabs = [
    { id: 'map', label: 'Edge Map', icon: Globe },
    { id: 'waterfall', label: 'Waterfall', icon: BarChart3 },
    { id: 'runtime', label: 'Isolate vs Container', icon: Cpu },
  ] as const;

  return (
    <div className="flex md:hidden items-center justify-between p-1 rounded-xl bg-canvas-card border border-canvas-border shadow-telemetry-card">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeMobileTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveMobileTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
              isActive
                ? 'bg-telemetry-teal text-canvas-deep shadow-glow-teal'
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
