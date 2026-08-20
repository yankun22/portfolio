import React from 'react';
import { Zap, Cpu } from 'lucide-react';

interface BenchmarkMeterProps {
  executionTimeMs: number;
  rowCount: number;
}

export const BenchmarkMeter: React.FC<BenchmarkMeterProps> = ({
  executionTimeMs,
  rowCount
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '6px 12px',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.72rem'
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#10b981', fontWeight: 700 }}>
        <Zap size={13} /> {executionTimeMs} ms
      </span>

      <span style={{ color: 'var(--border-medium)' }}>|</span>

      <span style={{ color: 'var(--text-secondary)' }}>
        {rowCount} {rowCount === 1 ? 'row' : 'rows'}
      </span>

      <span style={{ color: 'var(--border-medium)' }}>|</span>

      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
        <Cpu size={12} /> SQLite 3 WASM (In-Memory)
      </span>
    </div>
  );
};
