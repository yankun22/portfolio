'use client';

import React, { useState } from 'react';
import { ToolDefinition } from '../types/agent';
import { Copy, Check, Code2, Table } from 'lucide-react';

interface JsonSchemaViewerProps {
  tool: ToolDefinition;
}

export default function JsonSchemaViewer({ tool }: JsonSchemaViewerProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'json' | 'table'>('json');

  const jsonString = JSON.stringify(tool.parameters, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Extract property details for table view
  const properties = tool.parameters.properties || {};
  const requiredFields = new Set(tool.parameters.required || []);

  return (
    <div className="rounded-xl border border-white/10 bg-canvas-deep/80 overflow-hidden shadow-glass-card">
      {/* Tool Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="px-2 py-0.5 rounded bg-mint/10 border border-mint/20 text-mint font-mono text-xs font-semibold">
            fn
          </div>
          <span className="font-mono text-sm font-bold text-white">
            {tool.name}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode(viewMode === 'json' ? 'table' : 'json')}
            title="Toggle View Mode"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition text-xs flex items-center gap-1 px-2"
          >
            {viewMode === 'json' ? (
              <>
                <Table className="w-3.5 h-3.5" />
                <span>Table</span>
              </>
            ) : (
              <>
                <Code2 className="w-3.5 h-3.5" />
                <span>JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            title="Copy JSON Schema"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-mint hover:bg-white/10 transition text-xs flex items-center gap-1 px-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-mint" />
                <span className="text-mint">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tool Description & Return Type */}
      <div className="px-4 py-2.5 border-b border-white/5 bg-white/[0.01] text-xs text-zinc-300">
        <p className="mb-1">{tool.description}</p>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
          <span className="text-zinc-500">Returns:</span>
          <span className="text-cyan-400">{tool.returnType}</span>
        </div>
      </div>

      {/* Main Content: JSON Schema or Parameter Table */}
      {viewMode === 'json' ? (
        <div className="p-4 font-mono text-xs overflow-x-auto max-h-64 scrollbar-thin">
          <pre className="text-zinc-300 leading-relaxed">
            {jsonString.split('\n').map((line, idx) => {
              // Lightweight syntax highlighting
              const isKey = line.includes('":');
              const isRequired = line.includes('"required"');
              const isType = line.includes('"type"');

              let lineClass = 'text-zinc-300';
              if (isRequired) lineClass = 'text-amber-400';
              else if (isType) lineClass = 'text-mint';
              else if (isKey) lineClass = 'text-sky-300';

              return (
                <div key={idx} className={lineClass}>
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-zinc-400">
                <th className="py-2.5 px-4 font-medium">Parameter</th>
                <th className="py-2.5 px-4 font-medium">Type</th>
                <th className="py-2.5 px-4 font-medium">Required</th>
                <th className="py-2.5 px-4 font-medium font-sans">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(properties).map(([propName, propDef]: [string, any]) => {
                const isReq = requiredFields.has(propName);
                return (
                  <tr key={propName} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-4 text-white font-semibold">
                      {propName}
                    </td>
                    <td className="py-2.5 px-4 text-mint">
                      {propDef.type || 'any'}
                    </td>
                    <td className="py-2.5 px-4">
                      {isReq ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px]">
                          YES
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[10px]">opt</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-zinc-300">
                      {propDef.description || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
