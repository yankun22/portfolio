import React, { useState } from 'react';
import type { ConsoleMessage, ConsoleLogLevel } from '../../types/sandbox';
import { formatConsoleLevelColor } from '../../services/consoleBridge';
import { Terminal, Trash2, ChevronUp, ChevronDown, AlertCircle, AlertTriangle } from 'lucide-react';

interface ConsoleDrawerProps {
  logs: ConsoleMessage[];
  onClear: () => void;
}

export const ConsoleDrawer: React.FC<ConsoleDrawerProps> = ({ logs, onClear }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState<'all' | ConsoleLogLevel>('all');

  const filteredLogs = logs.filter((l) => (filter === 'all' ? true : l.level === filter));

  const errorCount = logs.filter((l) => l.level === 'error').length;
  const warnCount = logs.filter((l) => l.level === 'warn').length;

  return (
    <div
      className="console-drawer-container"
      style={{ height: isOpen ? 170 : 34 }}
    >
      {/* Console Header Bar */}
      <div className="console-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}
          >
            <Terminal size={14} color="#06b6d4" />
            <span>Developer Console</span>
            {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {errorCount > 0 && (
            <span style={{ color: '#f43f5e', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <AlertCircle size={11} /> {errorCount}
            </span>
          )}

          {warnCount > 0 && (
            <span style={{ color: '#f59e0b', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <AlertTriangle size={11} /> {warnCount}
            </span>
          )}
        </div>

        {isOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Filter Pills */}
            {(['all', 'log', 'warn', 'error'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: filter === lvl ? 'var(--accent-cyan)' : 'transparent',
                  color: filter === lvl ? '#000000' : 'var(--text-muted)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {lvl.toUpperCase()}
              </button>
            ))}

            <button
              className="btn-icon"
              style={{ width: 22, height: 22 }}
              onClick={onClear}
              title="Clear Console Output"
            >
              <Trash2 size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Log Entries Viewport */}
      {isOpen && (
        <div className="console-log-list">
          {filteredLogs.length === 0 ? (
            <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: '12px 0' }}>
              No console logs captured yet. Call <code>console.log()</code> in JavaScript.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="console-log-entry">
                <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>[{log.timestamp}]</span>
                <span
                  style={{
                    color: formatConsoleLevelColor(log.level),
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.68rem',
                    minWidth: 42
                  }}
                >
                  {log.level}:
                </span>
                <span
                  style={{
                    color: log.level === 'error' ? '#f43f5e' : log.level === 'warn' ? '#f59e0b' : 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    flex: 1
                  }}
                >
                  {log.formattedText}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
