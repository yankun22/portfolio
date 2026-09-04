'use client';

import React from 'react';
import { useVoxelDBStore } from '../store/useVoxelDBStore';
import { QuantizationMode } from '../types/vector';
import {
  Database,
  Cpu,
  Clock,
  HardDrive,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Zap,
} from 'lucide-react';

export default function TelemetryHUD() {
  const vectors = useVoxelDBStore((state) => state.vectors);
  const quantizationMode = useVoxelDBStore((state) => state.quantizationMode);
  const setQuantizationMode = useVoxelDBStore((state) => state.setQuantizationMode);
  const p99QueryLatencyMs = useVoxelDBStore((state) => state.p99QueryLatencyMs);
  const isInspectorOpen = useVoxelDBStore((state) => state.isInspectorOpen);
  const toggleInspector = useVoxelDBStore((state) => state.toggleInspector);

  // Dynamic memory calculation based on quantization mode
  const memoryStats = React.useMemo(() => {
    switch (quantizationMode) {
      case 'FP32':
        return {
          sizeMB: '18.4 MB',
          savings: '0%',
          reductionFactor: '1x (Full Precision)',
          precisionBits: '32-bit Float',
        };
      case 'FP16':
        return {
          sizeMB: '9.2 MB',
          savings: '50.0%',
          reductionFactor: '2x Compression',
          precisionBits: '16-bit Half-Float',
        };
      case 'INT8':
        return {
          sizeMB: '4.6 MB',
          savings: '75.0%',
          reductionFactor: '4x Compression',
          precisionBits: '8-bit Quantized Int',
        };
    }
  }, [quantizationMode]);

  return (
    <header className="w-full border-b border-white/10 bg-canvas-card/90 backdrop-blur-xl px-4 py-3 select-none z-30 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Project Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-neon-cyan/15 border border-neon-cyan/40 shadow-glow-cyan">
            <Database className="w-4 h-4 text-neon-cyan" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#06B6D4]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-sans">
                VoxelDB
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-neon-cyan border border-neon-cyan/30">
                v1.8 HNSW
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400 hidden sm:block">
              High-Density 3D Vector Space & Quantization Visualizer
            </p>
          </div>
        </div>

        {/* Telemetry Chips (Compact on Mobile, Expanded on Desktop) */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono overflow-x-auto max-w-full pb-0.5 scrollbar-none">
          {/* Vector Count Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <HardDrive className="w-3.5 h-3.5 text-neon-emerald" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">Vectors</div>
              <div className="text-xs font-bold text-white leading-tight">
                {vectors.length.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Memory Footprint & Quantization Mode */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <Cpu className="w-3.5 h-3.5 text-neon-magenta" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none flex items-center gap-1">
                <span>RAM</span>
                <span className="text-neon-emerald font-bold">(-{memoryStats.savings})</span>
              </div>
              <div className="text-xs font-bold text-white leading-tight">
                {memoryStats.sizeMB}
              </div>
            </div>
          </div>

          {/* p99 Query Latency */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            <Clock className="w-3.5 h-3.5 text-neon-cyan" />
            <div>
              <div className="text-[9px] text-zinc-500 uppercase leading-none">p99 Latency</div>
              <div className="text-xs font-bold text-neon-cyan leading-tight flex items-center gap-1">
                <span>{p99QueryLatencyMs}ms</span>
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Quantization Toggle & Inspector Button */}
        <div className="flex items-center gap-2">
          {/* Quantization Pill (FP32 | FP16 | INT8) */}
          <div className="flex items-center rounded-xl bg-black/60 border border-white/10 p-0.5 text-[11px] font-mono">
            {(['FP32', 'FP16', 'INT8'] as QuantizationMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setQuantizationMode(mode)}
                title={`Simulate ${mode} vector storage precision`}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  quantizationMode === mode
                    ? 'bg-neon-cyan text-canvas font-bold shadow-glow-cyan'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Toggle Inspector Button (Mobile & Desktop) */}
          <button
            onClick={() => toggleInspector()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
              isInspectorOpen
                ? 'bg-white/15 text-white border-white/30'
                : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="hidden sm:inline">Inspector</span>
          </button>
        </div>
      </div>
    </header>
  );
}
