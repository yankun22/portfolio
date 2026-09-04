'use client';

import React from 'react';
import { useEventPulseStore } from '../store/useEventPulseStore';
import { CompatibilityMode } from '../types/schema';
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sliders,
  Sparkles,
} from 'lucide-react';

export default function SchemaEvolutionSandbox() {
  const schemaV1 = useEventPulseStore((state) => state.schemaV1);
  const schemaV2 = useEventPulseStore((state) => state.schemaV2);
  const activePresetName = useEventPulseStore((state) => state.activePresetName);
  const setSchemaV2Preset = useEventPulseStore((state) => state.setSchemaV2Preset);
  const compatibilityMode = useEventPulseStore((state) => state.compatibilityMode);
  const setCompatibilityMode = useEventPulseStore((state) => state.setCompatibilityMode);
  const validationResult = useEventPulseStore((state) => state.validationResult);

  const presets = [
    { id: 'compatible', label: 'Safe Evolution (Compatible)' },
    { id: 'breaking_deletion', label: 'Breaking Deletion' },
    { id: 'type_mutation', label: 'Type Mutation' },
    { id: 'required_no_default', label: 'Added Required w/o Default' },
  ];

  return (
    <div className="w-full rounded-2xl bg-canvas-card/85 backdrop-blur-xl border border-white/10 shadow-cockpit-card p-4 sm:p-6 select-none space-y-6">
      {/* Top Header: Controls & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-ultra" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Schema Evolution & Compatibility Sandbox
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time Confluent/Avro compatibility validator. Detects breaking mutations before cluster registration.
          </p>
        </div>

        {/* Compatibility Mode Selector */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-zinc-500 uppercase">Mode:</span>
          <div className="flex items-center rounded-xl bg-black/60 border border-white/10 p-0.5">
            {(['BACKWARD', 'FORWARD', 'FULL', 'NONE'] as CompatibilityMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setCompatibilityMode(mode)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  compatibilityMode === mode
                    ? 'bg-ultra text-white font-bold shadow-glow-ultra'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Selector Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-zinc-400 mr-1">Load Scenario:</span>
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSchemaV2Preset(preset.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
              activePresetName === preset.id
                ? 'bg-ultra/20 text-ultra-light border-ultra shadow-glow-ultra font-bold'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Side-by-Side Schema Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Active Schema v1 */}
        <div className="rounded-xl bg-canvas-deep/80 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-xs font-mono font-bold text-white">
                Active Schema (v1.0.0 Production)
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {schemaV1.fields.length} fields
            </span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto font-mono text-xs pr-1 scrollbar-thin">
            {schemaV1.fields.map((field) => (
              <div
                key={field.name}
                className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-white font-semibold truncate">
                    {field.name}
                  </span>
                  <span className="text-[10px] text-sky-400 px-1.5 py-0.2 rounded bg-sky-500/10">
                    {field.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {field.required ? (
                    <span className="text-[10px] text-zinc-400 bg-white/5 px-1.5 rounded">
                      required
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500">optional</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inbound Schema v2 */}
        <div className="rounded-xl bg-canvas-deep/80 border border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  validationResult.isCompatible ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-mono font-bold text-white">
                Inbound Candidate (v2.0.0 Draft)
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              {schemaV2.fields.length} fields
            </span>
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto font-mono text-xs pr-1 scrollbar-thin">
            {schemaV2.fields.map((field) => {
              // Check if this field has an issue
              const breach = validationResult.breakingChanges.find(
                (b) => b.field === field.name
              );
              const isBreach = breach && breach.severity === 'CRITICAL';
              const isWarning = breach && breach.severity === 'WARNING';
              const isAdded = breach && breach.type === 'SAFE_OPTIONAL_ADDED';

              return (
                <div
                  key={field.name}
                  className={`p-2 rounded-lg border flex items-center justify-between gap-2 transition ${
                    isBreach
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                      : isWarning
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : isAdded
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-black/40 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-white truncate">
                      {field.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        isBreach ? 'bg-rose-500/30 text-rose-300' : 'bg-ultra/15 text-ultra-light'
                      }`}
                    >
                      {field.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0 text-[10px]">
                    {isBreach && <span className="text-rose-400 font-bold">MUTATED</span>}
                    {isAdded && <span className="text-emerald-400 font-bold">+NEW</span>}
                    {field.required ? (
                      <span className="text-zinc-400 bg-white/5 px-1.5 rounded">required</span>
                    ) : (
                      <span className="text-zinc-500">optional</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-Time Compatibility Engine Diagnostics */}
      <div
        className={`p-4 rounded-xl border transition-all ${
          validationResult.isCompatible
            ? 'bg-emerald-500/[0.06] border-emerald-500/30 shadow-glow-mint'
            : 'bg-rose-500/[0.08] border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            {validationResult.isCompatible ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400" />
            )}
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              {validationResult.isCompatible
                ? 'Schema Registry: Compatibility Approved'
                : `Schema Registry: Registration Rejected (${validationResult.criticalCount} Breaking Changes)`}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
              validationResult.isCompatible
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {compatibilityMode} Mode
          </span>
        </div>

        <p className="text-xs text-zinc-300 font-sans mb-3">
          {validationResult.summary}
        </p>

        {/* Detailed Breaking Changes List */}
        {validationResult.breakingChanges.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/10 font-mono text-xs">
            {validationResult.breakingChanges.map((change, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2.5"
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-0.5 ${
                    change.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : change.severity === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {change.type.replace(/_/g, ' ')}
                </span>
                <div className="flex-1 text-zinc-300 leading-relaxed font-sans text-xs">
                  {change.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
