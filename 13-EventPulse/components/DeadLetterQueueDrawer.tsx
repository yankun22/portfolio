'use client';

import React, { useEffect } from 'react';
import { useEventPulseStore } from '../store/useEventPulseStore';
import {
  X,
  AlertOctagon,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Terminal,
} from 'lucide-react';

export default function DeadLetterQueueDrawer() {
  const dlq = useEventPulseStore((state) => state.dlq);
  const isDLQDrawerOpen = useEventPulseStore((state) => state.isDLQDrawerOpen);
  const toggleDLQDrawer = useEventPulseStore((state) => state.toggleDLQDrawer);
  const reprocessDLQItem = useEventPulseStore((state) => state.reprocessDLQItem);
  const purgeDLQ = useEventPulseStore((state) => state.purgeDLQ);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleDLQDrawer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDLQDrawer]);

  if (!isDLQDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={() => toggleDLQDrawer(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer */}
      <aside
        className="absolute inset-y-0 right-0 max-w-lg w-full flex flex-col bg-canvas-deep/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.85)] text-white"
        style={{
          boxShadow: '0 0 50px -10px rgba(244, 63, 94, 0.25), -10px 0 30px rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-canvas-card/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-sans">
                  Dead-Letter Queue (DLQ)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {dlq.length} Quarantined
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Poison pills, deserialization panics & schema rejections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {dlq.length > 0 && (
              <button
                onClick={purgeDLQ}
                className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/10 transition text-xs font-mono flex items-center gap-1"
                title="Purge all DLQ items"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => toggleDLQDrawer(false)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
              title="Close Drawer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quarantined List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {dlq.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-3 font-mono">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-sm text-zinc-300 font-semibold">
                Dead-Letter Queue Clean
              </div>
              <p className="text-xs text-zinc-500 max-w-xs">
                Zero quarantined payloads. Click &quot;Inject Poison Pill Payload&quot; in the Chaos Controller to test isolation.
              </p>
            </div>
          ) : (
            dlq.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/[0.04] space-y-3 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
              >
                <div className="flex items-start justify-between gap-2 border-b border-rose-500/20 pb-2">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      ID: {item.id} • {item.timestamp}
                    </div>
                    <span className="text-xs font-bold text-rose-300 font-mono">
                      {item.errorType}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-[10px] font-mono text-rose-300">
                    Partition {item.packet.partitionId}
                  </span>
                </div>

                {/* Error Log */}
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 font-mono text-xs text-zinc-300">
                  <div className="text-[9px] text-zinc-500 uppercase mb-1 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-rose-400" />
                    Stack Diagnostic:
                  </div>
                  <div className="text-rose-300 text-[11px] leading-relaxed">
                    {item.errorMessage}
                  </div>
                </div>

                {/* Raw Corrupted Payload */}
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-zinc-400 overflow-x-auto">
                  <div className="text-zinc-500 text-[9px] uppercase mb-1">
                    Quarantined Payload:
                  </div>
                  <pre className="text-zinc-300">
                    {JSON.stringify(item.packet.payload, null, 2)}
                  </pre>
                </div>

                {/* 1-Click Reprocess & Re-route Workflow */}
                <button
                  onClick={() => reprocessDLQItem(item.id)}
                  className="w-full py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-canvas hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 shadow-glow-mint"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reprocess & Re-route to Gate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
