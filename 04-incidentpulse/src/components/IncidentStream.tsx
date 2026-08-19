import React, { useState, useRef } from 'react';
import { useIncident } from '../context/IncidentContext';
import {
  Search,
  Play,
  Pause,
  Copy,
  Lock,
  Unlock,
  Check,
  Terminal,
} from 'lucide-react';

export const IncidentStream: React.FC = () => {
  const { logEvents, isStreamPaused, setIsStreamPaused, services } = useIncident();
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [filterService, setFilterService] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const streamBottomRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logEvents.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel.toLowerCase();
    const matchesService = filterService === 'ALL' || log.serviceId === filterService;
    const matchesSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.traceId && log.traceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLevel && matchesService && matchesSearch;
  });

  const handleCopyLogs = () => {
    const text = filteredLogs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.serviceName}] ${l.message} (trace: ${l.traceId || '-'})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return '#ef4444';
      case 'error':
        return '#f87171';
      case 'warn':
        return '#fbbf24';
      case 'info':
        return '#38bdf8';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="card-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Stream Controls Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="#06b6d4" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Live Streaming Telemetry Terminal</h2>
            <span
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: isStreamPaused ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                color: isStreamPaused ? '#fbbf24' : '#34d399',
                border: `1px solid ${isStreamPaused ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              }}
            >
              {isStreamPaused ? 'PAUSED' : 'STREAMING (WebSocket/SSE)'}
            </span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Real-time feed of server events, metric breaches, access logs, and automated incident alarms.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsStreamPaused(!isStreamPaused)}
            className="btn btn-sm"
            style={{
              background: isStreamPaused ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              borderColor: isStreamPaused ? '#10b981' : '#f59e0b',
              color: isStreamPaused ? '#34d399' : '#fbbf24',
            }}
          >
            {isStreamPaused ? <Play size={13} /> : <Pause size={13} />}
            <span>{isStreamPaused ? 'Resume Feed' : 'Pause Feed'}</span>
          </button>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className="btn btn-sm"
            title="Toggle sticky scroll"
            style={{ color: autoScroll ? '#38bdf8' : 'var(--text-secondary)' }}
          >
            {autoScroll ? <Lock size={13} /> : <Unlock size={13} />}
            <span>Sticky Top</span>
          </button>

          <button
            onClick={handleCopyLogs}
            className="btn btn-sm"
            title="Copy logs to clipboard"
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy Logs'}</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search logs by keyword, endpoint, or trace ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 12px 6px 32px',
              background: 'rgba(6, 9, 14, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Level Filters */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {['ALL', 'CRITICAL', 'ERROR', 'WARN', 'INFO'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              style={{
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: filterLevel === lvl ? 'rgba(6, 182, 212, 0.2)' : 'rgba(6, 9, 14, 0.6)',
                color: filterLevel === lvl ? '#38bdf8' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Service Selector */}
        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          style={{
            background: 'rgba(6, 9, 14, 0.8)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.75rem',
            outline: 'none',
          }}
        >
          <option value="ALL">All Services ({services.length})</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Terminal Viewport */}
      <div
        className="font-mono"
        style={{
          height: '560px',
          background: '#05080e',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          padding: '14px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontSize: '0.78rem',
          lineHeight: 1.5,
        }}
      >
        {filteredLogs.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '40px' }}>
            No log events matching active filters.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const levelColor = getLevelColor(log.level);
            const isSev = log.level === 'critical' || log.level === 'error';

            return (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  background: isSev ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                  borderLeft: isSev ? `3px solid ${levelColor}` : '3px solid transparent',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = isSev ? 'rgba(239, 68, 68, 0.08)' : 'transparent')}
              >
                {/* Timestamp */}
                <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 })}
                </span>

                {/* Level Badge */}
                <span
                  style={{
                    color: levelColor,
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    minWidth: '64px',
                  }}
                >
                  [{log.level.toUpperCase()}]
                </span>

                {/* Service Tag */}
                <span style={{ color: '#06b6d4', minWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {log.serviceName}:
                </span>

                {/* Message */}
                <span style={{ color: isSev ? '#fecaca' : '#f8fafc', flex: 1 }}>
                  {log.message}
                </span>

                {/* Trace ID */}
                {log.traceId && (
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
                    trace={log.traceId}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={streamBottomRef} />
      </div>
    </div>
  );
};
