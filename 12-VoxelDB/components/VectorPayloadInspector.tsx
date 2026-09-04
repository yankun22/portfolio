'use client';

import React, { useState } from 'react';
import { useVoxelDBStore } from '../store/useVoxelDBStore';
import {
  X,
  Copy,
  Check,
  Code2,
  Database,
  Tag,
  Hash,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  Sliders,
} from 'lucide-react';

export default function VectorPayloadInspector() {
  const vectors = useVoxelDBStore((state) => state.vectors);
  const selectedVectorId = useVoxelDBStore((state) => state.selectedVectorId);
  const activeProbe = useVoxelDBStore((state) => state.activeProbe);
  const activeMetric = useVoxelDBStore((state) => state.activeMetric);
  const quantizationMode = useVoxelDBStore((state) => state.quantizationMode);
  const isInspectorOpen = useVoxelDBStore((state) => state.isInspectorOpen);
  const toggleInspector = useVoxelDBStore((state) => state.toggleInspector);
  const selectVector = useVoxelDBStore((state) => state.selectVector);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'payload' | 'neighbors' | 'metadata'>('payload');

  const selectedVector = vectors.find((v) => v.id === selectedVectorId);

  if (!isInspectorOpen || !selectedVector) return null;

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(selectedVector, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:max-w-lg bg-canvas-deep/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.85)] flex flex-col text-white transition-all select-none"
      style={{
        boxShadow: `0 0 50px -10px ${selectedVector.clusterColor}20, -10px 0 30px rgba(0, 0, 0, 0.9)`,
      }}
    >
      {/* Header */}
      <div className="p-5 border-b border-white/10 bg-canvas-card/60">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedVector.clusterColor }}
            />
            <div>
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block">
                {selectedVector.category} Cluster
              </span>
              <h3 className="font-bold text-base text-white truncate max-w-[260px] sm:max-w-xs font-sans">
                {selectedVector.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => toggleInspector(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
            title="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Spec Pills */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-xl border border-white/5">
          <div>
            <div className="text-[9px] text-zinc-500 uppercase">VECTOR ID</div>
            <div className="text-neon-cyan font-semibold truncate">
              {selectedVector.id}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-zinc-500 uppercase">HNSW LAYER</div>
            <div className="text-white font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3 text-neon-magenta" />
              <span>L{selectedVector.hnswLayer}</span>
            </div>
          </div>
          <div>
            <div className="text-[9px] text-zinc-500 uppercase">TOKENS</div>
            <div className="text-neon-emerald font-semibold">
              {selectedVector.tokenCount}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeTab === 'payload'
                ? 'bg-white/10 text-neon-cyan border-b-2 border-neon-cyan font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Vector Payload
          </button>
          <button
            onClick={() => setActiveTab('neighbors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeTab === 'neighbors'
                ? 'bg-white/10 text-neon-cyan border-b-2 border-neon-cyan font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Top-K Neighbors ({activeProbe?.neighbors.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
              activeTab === 'metadata'
                ? 'bg-white/10 text-neon-cyan border-b-2 border-neon-cyan font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            JSON Metadata
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
        {/* TAB 1: 768-DIM VECTOR PAYLOAD */}
        {activeTab === 'payload' && (
          <div className="space-y-4">
            {/* 3D Coordinate Position */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">
                3D Spatial Centroid
              </div>
              <div className="text-zinc-200">
                X: <span className="text-neon-cyan">{selectedVector.position[0]}</span> |{' '}
                Y: <span className="text-neon-magenta">{selectedVector.position[1]}</span> |{' '}
                Z: <span className="text-neon-amber">{selectedVector.position[2]}</span>
              </div>
            </div>

            {/* 768-Dim Dense Vector Float Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-neon-cyan" />
                  Dense Embedding Preview (768-dim)
                </span>
                <span className="px-2 py-0.5 rounded bg-neon-cyan/15 text-neon-cyan text-[10px] font-bold">
                  {quantizationMode}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/70 border border-white/10 font-mono text-xs text-zinc-300 leading-relaxed max-h-56 overflow-y-auto">
                <div className="text-zinc-500 text-[10px] mb-1.5">
                  // Sample 16-component window of full 768-dimensional float32 vector:
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  {selectedVector.vector768.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded bg-white/5 border border-white/5 text-neon-cyan truncate"
                    >
                      {val >= 0 ? `+${val.toFixed(3)}` : val.toFixed(3)}
                    </div>
                  ))}
                </div>
                <div className="text-zinc-500 text-[10px] mt-2 italic text-center">
                  ... + 752 remaining quantized dimensions in HNSW index
                </div>
              </div>
            </div>

            {/* Token & Embedding Specs */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-500">Model Embedding:</span>
                <span className="text-white">text-embedding-3-large (768d)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-500">L2 Vector Norm:</span>
                <span className="text-neon-emerald">{selectedVector.metadata.norm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Quantized Size:</span>
                <span className="text-neon-cyan">
                  {quantizationMode === 'INT8'
                    ? '768 bytes (INT8)'
                    : quantizationMode === 'FP16'
                    ? '1.53 KB (FP16)'
                    : '3.07 KB (FP32)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOP-K NEAREST NEIGHBORS */}
        {activeTab === 'neighbors' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">
                Metric: <strong className="text-white uppercase">{activeMetric}</strong>
              </span>
              <span className="text-neon-cyan font-semibold">
                Query Latency: {activeProbe?.searchLatencyMs}ms
              </span>
            </div>

            <div className="space-y-2">
              {activeProbe?.neighbors.map((neighbor) => (
                <div
                  key={neighbor.id}
                  onClick={() => selectVector(neighbor.id)}
                  className="p-3 rounded-xl border border-white/10 bg-canvas-card hover:border-neon-cyan/50 transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center bg-white/10 text-[10px] font-mono font-bold text-white">
                      #{neighbor.rank}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate font-sans">
                        {neighbor.targetVector.title}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: neighbor.targetVector.clusterColor }}
                        />
                        <span>{neighbor.targetVector.category}</span>
                        <span>•</span>
                        <span>{neighbor.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 font-mono">
                    <div className="text-xs font-bold text-neon-cyan">
                      {neighbor.similarityPct}% Match
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Dist: {neighbor.distance.toFixed(3)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: JSON METADATA */}
        {activeTab === 'metadata' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                Full Embedding Descriptor
              </span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-zinc-300 hover:text-neon-cyan hover:bg-white/10 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-neon-cyan" />
                    <span className="text-neon-cyan">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-black/80 border border-white/10 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed max-h-96">
              {JSON.stringify(selectedVector, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </aside>
  );
}
