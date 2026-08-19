import React from 'react';
import { useIncident } from '../context/IncidentContext';
import {
  X,
  Server,
  RotateCcw,
  History,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  ShieldAlert,
  Clock,
} from 'lucide-react';

export const ServiceDrawer: React.FC = () => {
  const {
    selectedService,
    setSelectedService,
    services,
    logEvents,
    restartService,
    triggerRollback,
    triggerAnomaly,
    healAllServices,
  } = useIncident();

  if (!selectedService) return null;

  const inboundCallers = services.filter((s) => s.dependencies.includes(selectedService.id));
  const serviceLogs = logEvents.filter((l) => l.serviceId === selectedService.id).slice(0, 10);

  const getStatusBadge = () => {
    switch (selectedService.status) {
      case 'operational':
        return <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>OPERATIONAL</span>;
      case 'degraded':
        return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>DEGRADED</span>;
      case 'outage':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)' }}>CRITICAL OUTAGE</span>;
      case 'maintenance':
        return <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.3)' }}>PODS RESTARTING</span>;
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedService(null)}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: '#0e1524',
          borderRadius: '16px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.75)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(18, 26, 42, 0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Server size={22} color="#06b6d4" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>{selectedService.name}</h3>
                {getStatusBadge()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <span className="font-mono">ID: {selectedService.id}</span>
                <span>•</span>
                <span>Region: {selectedService.region}</span>
                <span>•</span>
                <span className="font-mono">Version: {selectedService.version}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedService(null)}
            className="btn btn-sm"
            style={{ padding: '6px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Description */}
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {selectedService.description}
          </p>

          {/* Real-time Telemetry Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div style={{ padding: '12px', background: 'rgba(12, 18, 29, 0.8)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>THROUGHPUT</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
                {selectedService.rps.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>rps</span>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(12, 18, 29, 0.8)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>P99 LATENCY</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedService.p99LatencyMs > 200 ? '#ef4444' : '#10b981', marginTop: '4px' }}>
                {selectedService.p99LatencyMs} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ms</span>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(12, 18, 29, 0.8)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CPU UTILIZATION</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedService.cpuUsage > 80 ? '#ef4444' : '#fbbf24', marginTop: '4px' }}>
                {selectedService.cpuUsage}%
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(12, 18, 29, 0.8)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ERROR RATE</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedService.errorRate > 1.0 ? '#ef4444' : '#10b981', marginTop: '4px' }}>
                {selectedService.errorRate}%
              </div>
            </div>
          </div>

          {/* SRE Action Command Center */}
          <div style={{ padding: '16px', background: 'rgba(14, 21, 35, 0.9)', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={15} /> DIRECT SRE REMEDIATION ACTIONS
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => restartService(selectedService.id)}
                className="btn btn-sm"
                style={{ background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c084fc' }}
              >
                <RotateCcw size={14} /> Restart Pods ({selectedService.replicas} Replicas)
              </button>

              <button
                onClick={() => triggerRollback(selectedService.id, 'vPreviousStable')}
                className="btn btn-sm"
                style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
              >
                <History size={14} /> Rollback to Previous Release
              </button>

              <button
                onClick={() => triggerAnomaly('anomaly-latency-auth')}
                className="btn btn-sm"
                style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
              >
                <Zap size={14} /> Inject Latency Spike
              </button>

              {selectedService.status !== 'operational' && (
                <button
                  onClick={healAllServices}
                  className="btn btn-sm btn-emerald"
                >
                  <Activity size={14} /> Restore Baseline
                </button>
              )}
            </div>
          </div>

          {/* Dependency Relations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '14px', background: 'rgba(12, 18, 29, 0.6)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={13} /> OUTBOUND CALLS ({selectedService.dependencies.length})
              </div>
              {selectedService.dependencies.length === 0 ? (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>No downstream dependencies</span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedService.dependencies.map((depId) => {
                    const depSvc = services.find((s) => s.id === depId);
                    return (
                      <div key={depId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{depSvc?.name || depId}</span>
                        <span className="font-mono" style={{ fontSize: '0.7rem', color: '#06b6d4' }}>{depSvc?.latencyMs}ms</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ padding: '14px', background: 'rgba(12, 18, 29, 0.6)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowRight size={13} /> INBOUND CALLERS ({inboundCallers.length})
              </div>
              {inboundCallers.length === 0 ? (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Top-level entrypoint (no upstream)</span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {inboundCallers.map((inSvc) => (
                    <div key={inSvc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-primary)' }}>{inSvc.name}</span>
                      <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inSvc.tier}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Service Telemetry Logs */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} /> RECENT LOG EVENTS FOR {selectedService.id.toUpperCase()}
            </div>
            <div
              className="font-mono"
              style={{
                background: 'rgba(6, 9, 14, 0.95)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                maxHeight: '180px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {serviceLogs.length === 0 ? (
                <span style={{ color: 'var(--text-dim)' }}>No recent anomaly events captured in buffer.</span>
              ) : (
                serviceLogs.map((log) => (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>
                      {new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                    </span>
                    <span
                      style={{
                        color: log.level === 'critical' || log.level === 'error' ? '#ef4444' : log.level === 'warn' ? '#f59e0b' : '#38bdf8',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                      }}
                    >
                      [{log.level.toUpperCase()}]
                    </span>
                    <span style={{ color: 'var(--text-primary)' }}>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
