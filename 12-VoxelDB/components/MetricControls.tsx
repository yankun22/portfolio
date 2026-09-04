'use client';

import React, { useState } from 'react';
import { useVoxelDBStore } from '../store/useVoxelDBStore';
import { DistanceMetric, ClusterCategory } from '../types/vector';
import { CLUSTERS } from '../data/vectorClusters';
import {
  RotateCcw,
  Sparkles,
  Sliders,
  Filter,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function MetricControls() {
  const activeMetric = useVoxelDBStore((state) => state.activeMetric);
  const setMetric = useVoxelDBStore((state) => state.setMetric);
  const topK = useVoxelDBStore((state) => state.topK);
  const setTopK = useVoxelDBStore((state) => state.setTopK);
  const activeClusters = useVoxelDBStore((state) => state.activeClusters);
  const toggleCluster = useVoxelDBStore((state) => state.toggleCluster);
  const isAutoRotate = useVoxelDBStore((state) => state.isAutoRotate);
  const toggleAutoRotate = useVoxelDBStore((state) => state.toggleAutoRotate);
  const activeHNSWLayerFilter = useVoxelDBStore((state) => state.activeHNSWLayerFilter);
  const setHNSWLayerFilter = useVoxelDBStore((state) => state.setHNSWLayerFilter);

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const activeClusterCount = Object.values(activeClusters).filter(Boolean).length;

  return (
    <div className="w-full flex flex-col gap-2 rounded-2xl bg-canvas-card/90 backdrop-blur-xl border border-white/10 shadow-glass-panel select-none p-2.5 sm:p-3 transition-all">
      {/* Mobile-Only Quick Toggle Bar */}
      <div className="flex sm:hidden items-center justify-between gap-2 px-1">
        <button
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className="flex-1 flex items-center justify-between text-xs font-mono text-white py-1"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-semibold uppercase text-[11px] text-neon-cyan">
              {activeMetric} • K={topK} • {activeClusterCount} Domains
            </span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <Sliders className="w-3.5 h-3.5" />
            {isMobileExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </button>

        {/* Quick Camera Rotate Toggle on Mobile */}
        <button
          onClick={toggleAutoRotate}
          title={isAutoRotate ? 'Stop Camera Auto-Rotation' : 'Enable Camera Auto-Rotation'}
          className={`p-1.5 rounded-lg border transition ${
            isAutoRotate
              ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40 shadow-glow-cyan'
              : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Full Controls Body (Collapsible on mobile, always visible on >= sm) */}
      <div
        className={`${
          isMobileExpanded ? 'flex' : 'hidden sm:flex'
        } flex-wrap items-center justify-between gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/10`}
      >
        {/* Metric Mode Toggle (Cosine vs Euclidean vs Manhattan) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 hidden sm:inline">
            Distance Metric:
          </span>
          <div className="flex items-center rounded-xl bg-black/60 border border-white/10 p-0.5 text-xs font-mono">
            <button
              onClick={() => setMetric('cosine')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 ${
                activeMetric === 'cosine'
                  ? 'bg-neon-cyan text-canvas shadow-glow-cyan'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Cosine</span>
            </button>

            <button
              onClick={() => setMetric('euclidean')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 ${
                activeMetric === 'euclidean'
                  ? 'bg-neon-magenta text-canvas shadow-glow-magenta'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Euclidean (L2)</span>
            </button>

            <button
              onClick={() => setMetric('manhattan')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 ${
                activeMetric === 'manhattan'
                  ? 'bg-neon-amber text-canvas'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Manhattan (L1)</span>
            </button>
          </div>
        </div>

        {/* Top-K Nearest Neighbors Slider */}
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10">
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
            <span>Top-K:</span>
          </span>
          <input
            type="range"
            min="3"
            max="20"
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="w-20 sm:w-28 accent-neon-cyan cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-neon-cyan w-5 text-right">
            {topK}
          </span>
        </div>

        {/* Semantic Cluster Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {CLUSTERS.map((cl) => {
            const isActive = activeClusters[cl.id];
            return (
              <button
                key={cl.id}
                onClick={() => toggleCluster(cl.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition border ${
                  isActive
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-transparent text-zinc-500 border-white/5 opacity-50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cl.color }}
                />
                <span className="truncate max-w-[80px] sm:max-w-none">{cl.name.split(' ')[0]}</span>
              </button>
            );
          })}

          {/* Auto Rotate Camera Toggle on Desktop */}
          <button
            onClick={toggleAutoRotate}
            title={isAutoRotate ? 'Stop Camera Auto-Rotation' : 'Enable Camera Auto-Rotation'}
            className={`hidden sm:flex p-1.5 rounded-lg border transition ml-1 ${
              isAutoRotate
                ? 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40 shadow-glow-cyan'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
