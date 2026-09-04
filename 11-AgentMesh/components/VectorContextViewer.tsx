'use client';

import React, { useState } from 'react';
import { VectorChunk } from '../types/agent';
import { Database, Search, Cpu, Sparkles, HardDrive, Layers } from 'lucide-react';

interface VectorContextViewerProps {
  chunks: VectorChunk[];
  agentName: string;
}

export default function VectorContextViewer({
  chunks,
  agentName,
}: VectorContextViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(
    chunks[0]?.id || null
  );

  const filteredChunks = chunks.filter(
    (c) =>
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search & Stats Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search working vector buffer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-canvas-deep border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-mint/50 transition font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-zinc-300">
          <Database className="w-3.5 h-3.5 text-mint" />
          <span>{chunks.length} Chunks</span>
        </div>
      </div>

      {/* Memory Allocation Status Banner */}
      <div className="p-3.5 rounded-xl border border-mint/20 bg-mint/[0.03] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-mint" />
          <span className="text-zinc-300">
            Embedding Space: <strong className="text-white font-mono">dim=1536 (OpenAI / Gemini Vector)</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            L1 Hot Cache Active
          </span>
        </div>
      </div>

      {/* Vector Chunks List */}
      <div className="space-y-3">
        {filteredChunks.map((chunk) => {
          const isSelected = selectedChunkId === chunk.id;
          const similarityPct = Math.round(chunk.similarity * 100);

          return (
            <div
              key={chunk.id}
              onClick={() => setSelectedChunkId(chunk.id)}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                isSelected
                  ? 'border-mint/50 bg-mint/[0.04] shadow-glass-glow'
                  : 'border-white/10 bg-canvas-deep/80 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              {/* Top Row: Similarity & Tier */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] font-semibold">
                    {chunk.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 ${
                      chunk.tier === 'L1 Working RAM'
                        ? 'bg-mint/15 text-mint border border-mint/20'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                    }`}
                  >
                    {chunk.tier === 'L1 Working RAM' ? (
                      <HardDrive className="w-2.5 h-2.5" />
                    ) : (
                      <Layers className="w-2.5 h-2.5" />
                    )}
                    {chunk.tier}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-zinc-500">
                      COSINE SIMILARITY
                    </div>
                    <div className="text-xs font-mono font-bold text-mint">
                      {(chunk.similarity).toFixed(3)} ({similarityPct}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Similarity Bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-mint to-cyan-400 transition-all duration-500"
                  style={{ width: `${similarityPct}%` }}
                />
              </div>

              {/* Chunk Semantic Text */}
              <p className="text-xs text-zinc-200 leading-relaxed mb-3 font-sans">
                {chunk.content}
              </p>

              {/* Embedding Preview Float Array */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-zinc-400 overflow-x-auto mb-2">
                <div className="text-zinc-500 text-[9px] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Raw Embedding Vector (Sample 8-dim of {chunk.dimension})</span>
                  <span className="text-mint">FLOAT32</span>
                </div>
                <div className="text-cyan-300">
                  [{chunk.embeddingPreview.map((v) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3))).join(', ')}, ...]
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                <span>Source: <span className="text-zinc-400">{chunk.source}</span></span>
                <span>{chunk.tokens} tokens • {chunk.timestamp}</span>
              </div>
            </div>
          );
        })}

        {filteredChunks.length === 0 && (
          <div className="text-center py-8 text-zinc-500 text-xs font-mono">
            No vector chunks matched your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
