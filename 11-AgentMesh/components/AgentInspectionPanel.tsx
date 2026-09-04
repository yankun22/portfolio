'use client';

import React, { useState, useEffect } from 'react';
import { useAgentMeshStore } from '../store/useAgentMeshStore';
import JsonSchemaViewer from './JsonSchemaViewer';
import VectorContextViewer from './VectorContextViewer';
import {
  X,
  Code,
  Database,
  Terminal,
  Cpu,
  Shield,
  Activity,
  Zap,
  Sliders,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function AgentInspectionPanel() {
  const selectedAgentId = useAgentMeshStore((state) => state.selectedAgentId);
  const selectAgent = useAgentMeshStore((state) => state.selectAgent);
  const agents = useAgentMeshStore((state) => state.agents);

  const [activeTab, setActiveTab] = useState<'system' | 'vector' | 'traces'>('system');
  const [traceFilter, setTraceFilter] = useState<'all' | 'tool_call' | 'thought' | 'agent_output'>('all');

  const agent = agents.find((ag) => ag.id === selectedAgentId);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectAgent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectAgent]);

  if (!selectedAgentId || !agent) return null;

  const filteredTraces = agent.traces.filter((trace) => {
    if (traceFilter === 'all') return true;
    return trace.type === traceFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={() => selectAgent(null)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        className="absolute inset-y-0 right-0 max-w-2xl w-full flex flex-col bg-canvas-deep/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.85)] transform transition-transform duration-300 ease-out text-white"
        style={{
          boxShadow: `0 0 50px -10px ${agent.color}25, -10px 0 30px rgba(0, 0, 0, 0.9)`,
        }}
      >
        {/* Top Panel Header */}
        <div className="p-6 border-b border-white/10 bg-canvas-card/60">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-lg border shadow-lg"
                style={{
                  backgroundColor: `${agent.color}15`,
                  borderColor: agent.color,
                  color: agent.color,
                  boxShadow: `0 0 20px ${agent.color}30`,
                }}
              >
                {agent.archetype.slice(0, 2)}
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    {agent.name}
                  </h2>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase border"
                    style={{
                      backgroundColor: `${agent.color}15`,
                      borderColor: `${agent.color}40`,
                      color: agent.color,
                    }}
                  >
                    {agent.archetype}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 font-sans">
                  {agent.roleTitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => selectAgent(null)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
              title="Close Panel (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Telemetry Strip */}
          <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
            <div>
              <div className="text-[10px] text-zinc-500">CONFIDENCE</div>
              <div className="text-sm font-bold text-mint">
                {agent.confidence}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">LATENCY P99</div>
              <div className="text-sm font-bold text-sky-400">
                {agent.latencyMs}ms
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">TOKEN LOAD</div>
              <div className="text-sm font-bold text-zinc-200">
                {agent.tokenCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">RAM BUFFER</div>
              <div className="text-sm font-bold text-amber-400">
                {agent.memoryBufferKB} KB
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-5 border-b border-white/10 pb-1">
            <button
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === 'system'
                  ? 'bg-white/10 text-mint font-semibold border-b-2 border-mint'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>System & Tool Schemas ({agent.tools.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('vector')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === 'vector'
                  ? 'bg-white/10 text-mint font-semibold border-b-2 border-mint'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Vector Context ({agent.vectorContext.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('traces')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
                activeTab === 'traces'
                  ? 'bg-white/10 text-mint font-semibold border-b-2 border-mint'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Prompt Traces ({agent.traces.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Body Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* TAB 1: SYSTEM INSTRUCTIONS & TOOL DEFINITIONS */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              {/* System Instruction Parameters Card */}
              <div className="p-4 rounded-xl border border-white/10 bg-canvas-card/80 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-mint" />
                    Model & Inference Parameters
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400">
                    {agent.systemParams.model}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-zinc-500">TEMPERATURE</div>
                    <div className="text-white font-bold">{agent.systemParams.temperature}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-zinc-500">TOP-P PROBABILITY</div>
                    <div className="text-white font-bold">{agent.systemParams.topP}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-zinc-500">MAX CONTEXT WINDOW</div>
                    <div className="text-white font-bold">
                      {agent.systemParams.maxContextTokens.toLocaleString()} tokens
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-zinc-500">ISOLATION LEVEL</div>
                    <div className="text-mint font-bold">{agent.systemParams.isolationLevel}</div>
                  </div>
                </div>

                {/* System Prompt Box */}
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                    System Instruction Directive
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {agent.systemParams.systemPrompt}
                  </div>
                </div>
              </div>

              {/* Function Tool Definitions (JSON Schema) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-mint" />
                    Registered Function Tools ({agent.tools.length})
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    OpenAI / JSON-Schema Standard
                  </span>
                </div>

                {agent.tools.map((tool) => (
                  <JsonSchemaViewer key={tool.name} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: IN-MEMORY VECTOR CONTEXT BUFFER */}
          {activeTab === 'vector' && (
            <VectorContextViewer
              chunks={agent.vectorContext}
              agentName={agent.name}
            />
          )}

          {/* TAB 3: DYNAMIC PROMPT TRACE LOG */}
          {activeTab === 'traces' && (
            <div className="space-y-4">
              {/* Filter Buttons */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
                {(['all', 'tool_call', 'thought', 'agent_output'] as const).map(
                  (filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setTraceFilter(filterType)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition ${
                        traceFilter === filterType
                          ? 'bg-mint text-canvas font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {filterType.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>

              {/* Traces Timeline */}
              <div className="space-y-3">
                {filteredTraces.map((trace) => (
                  <div
                    key={trace.id}
                    className="p-4 rounded-xl border border-white/10 bg-canvas-deep/80 space-y-2 hover:border-white/20 transition"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            trace.type === 'tool_call'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : trace.type === 'thought'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-mint/20 text-mint border border-mint/30'
                          }`}
                        >
                          {trace.type.replace('_', ' ')}
                        </span>
                        <span className="text-zinc-400 text-xs font-mono">
                          Step #{trace.stepNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                        <Clock className="w-3 h-3" />
                        <span>{trace.timestamp}</span>
                        <span className="text-mint font-semibold">
                          +{trace.latencyMs}ms
                        </span>
                      </div>
                    </div>

                    {/* Trace Content */}
                    <div className="font-mono text-xs text-zinc-200 leading-relaxed">
                      {trace.type === 'thought' ? (
                        <div className="text-purple-200/90 italic bg-purple-950/20 p-2.5 rounded-lg border border-purple-800/30">
                          &lt;thought&gt; {trace.content} &lt;/thought&gt;
                        </div>
                      ) : (
                        <div className="text-zinc-200">{trace.content}</div>
                      )}
                    </div>

                    {/* Tool Arguments & Output if Tool Call */}
                    {trace.toolArgs && (
                      <div className="mt-2 p-2.5 rounded-lg bg-black/50 border border-white/5 font-mono text-[11px] space-y-1">
                        <div className="text-zinc-500 text-[9px] uppercase">
                          Arguments:
                        </div>
                        <pre className="text-sky-300 overflow-x-auto">
                          {JSON.stringify(trace.toolArgs, null, 2)}
                        </pre>
                        {trace.toolResult && (
                          <>
                            <div className="text-zinc-500 text-[9px] uppercase mt-2">
                              Result Payload:
                            </div>
                            <pre className="text-mint overflow-x-auto">
                              {JSON.stringify(trace.toolResult, null, 2)}
                            </pre>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {filteredTraces.length === 0 && (
                  <div className="text-center py-8 text-zinc-500 text-xs font-mono">
                    No traces available for this filter.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
