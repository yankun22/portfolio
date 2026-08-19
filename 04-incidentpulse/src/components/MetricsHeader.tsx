import React from 'react';
import { useIncident } from '../context/IncidentContext';
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Zap,
  TrendingDown,
  ShieldCheck,
  Server,
} from 'lucide-react';

export const MetricsHeader: React.FC = () => {
  const { services, incidents, healAllServices } = useIncident();

  const totalSev1 = incidents.filter((i) => i.severity === 'SEV-1' && i.status !== 'resolved').length;
  const totalSev2 = incidents.filter((i) => i.severity === 'SEV-2' && i.status !== 'resolved').length;
  const totalSev3 = incidents.filter((i) => i.severity === 'SEV-3' && i.status !== 'resolved').length;
  const totalSev4 = incidents.filter((i) => i.severity === 'SEV-4' && i.status !== 'resolved').length;
  const activeCount = totalSev1 + totalSev2 + totalSev3 + totalSev4;

  const degradedServices = services.filter((s) => s.status === 'degraded' || s.status === 'outage');
  const totalRps = services.reduce((acc, s) => acc + s.rps, 0);

  // Compute average p99 latency and average error rate
  const avgP99 = Math.round(services.reduce((acc, s) => acc + s.p99LatencyMs, 0) / (services.length || 1));
  const avgErrorRate = (services.reduce((acc, s) => acc + s.errorRate, 0) / (services.length || 1)).toFixed(2);

  const uptimePercent = totalSev1 > 0 ? '99.82%' : degradedServices.length > 0 ? '99.94%' : '99.998%';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
      }}
    >
      {/* 1. Global System Status */}
      <div
        className="card-glass"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: totalSev1 > 0 ? '4px solid #ef4444' : degradedServices.length > 0 ? '4px solid #f59e0b' : '4px solid #10b981',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>GLOBAL HEALTH</span>
          {totalSev1 > 0 ? (
            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              <Flame size={14} /> MAJOR OUTAGE
            </span>
          ) : degradedServices.length > 0 ? (
            <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              <AlertTriangle size={14} /> DEGRADED
            </span>
          ) : (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
              <CheckCircle2 size={14} /> OPERATIONAL
            </span>
          )}
        </div>

        <div style={{ margin: '10px 0 4px 0', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
            {uptimePercent}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>30-Day SLA Uptime</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>{services.length - degradedServices.length}/{services.length} Microservices Healthy</span>
          {degradedServices.length > 0 && (
            <button
              onClick={healAllServices}
              className="btn btn-sm btn-emerald"
              style={{ padding: '2px 8px', fontSize: '0.68rem', gap: '4px' }}
              title="Reset all degraded services and resolve active anomalies"
            >
              <ShieldCheck size={12} /> Auto-Heal
            </button>
          )}
        </div>
      </div>

      {/* 2. Active Incidents Severity Breakdown */}
      <div
        className="card-glass"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ACTIVE INCIDENTS</span>
          <span className="font-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: activeCount > 0 ? '#ef4444' : '#10b981' }}>
            {activeCount} UNRESOLVED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0 6px 0' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 4px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 700 }}>SEV-1</span>
            <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f87171' }}>{totalSev1}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 4px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>SEV-2</span>
            <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>{totalSev2}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 4px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
            <span style={{ fontSize: '0.65rem', color: '#38bdf8', fontWeight: 700 }}>SEV-3</span>
            <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>{totalSev3}</span>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 4px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '6px', border: '1px solid rgba(148, 163, 184, 0.25)' }}>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>SEV-4</span>
            <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#cbd5e1' }}>{totalSev4}</span>
          </div>
        </div>

        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {totalSev1 > 0 ? '⚠️ SEV-1 SLA breach window active (<15m)' : 'All severity response teams on standby'}
        </div>
      </div>

      {/* 3. Global P99 Latency */}
      <div
        className="card-glass"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MESH P99 LATENCY</span>
          <Clock size={14} color="#06b6d4" />
        </div>

        <div style={{ margin: '10px 0 4px 0', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: avgP99 > 300 ? '#ef4444' : avgP99 > 120 ? '#f59e0b' : '#38bdf8' }}>
            {avgP99} ms
          </span>
          <span style={{ fontSize: '0.75rem', color: avgP99 > 150 ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <TrendingDown size={12} /> {avgP99 > 150 ? '+140% spike' : 'Nominal (<80ms)'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>Throughput: {totalRps.toLocaleString()} req/s</span>
          <span className="font-mono">10 Services</span>
        </div>
      </div>

      {/* 4. Global 5xx Error Rate */}
      <div
        className="card-glass"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>5XX ERROR RATE</span>
          <Server size={14} color={Number(avgErrorRate) > 1.0 ? '#ef4444' : '#10b981'} />
        </div>

        <div style={{ margin: '10px 0 4px 0', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: Number(avgErrorRate) > 2.0 ? '#ef4444' : Number(avgErrorRate) > 0.5 ? '#f59e0b' : '#10b981' }}>
            {avgErrorRate}%
          </span>
          <span style={{ fontSize: '0.75rem', color: Number(avgErrorRate) > 0.5 ? '#ef4444' : '#10b981' }}>
            {Number(avgErrorRate) > 2.0 ? 'Exceeding SLO target' : 'Within Error Budget'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>Error Budget: 98.4% remaining</span>
          <span style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Zap size={11} /> Auto-Mitigation ON
          </span>
        </div>
      </div>
    </div>
  );
};
