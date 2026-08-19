import React from 'react';
import { useIncident } from '../context/IncidentContext';
import { ANOMALY_PRESETS } from '../data/mockData';
import {
  X,
  Zap,
  Flame,
  Clock,
  Database,
  Layers,
  Cpu,
  Sparkles,
} from 'lucide-react';

export const ChaosControls: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { triggerAnomaly, healAllServices } = useIncident();

  if (!isOpen) return null;

  const getPresetIcon = (type: string) => {
    switch (type) {
      case 'latency':
        return <Clock size={18} color="#f59e0b" />;
      case '5xx':
        return <Flame size={18} color="#ef4444" />;
      case 'deadlock':
        return <Database size={18} color="#f87171" />;
      case 'lag':
        return <Layers size={18} color="#38bdf8" />;
      case 'cpu':
        return <Cpu size={18} color="#c084fc" />;
      default:
        return <Zap size={18} color="#06b6d4" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: '#0d1320',
          borderRadius: '16px',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.85), 0 0 30px rgba(239, 68, 68, 0.2)',
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
            background: 'rgba(18, 25, 40, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={20} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Chaos Engineering & Anomaly Injector</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Trigger simulated server outages, latency surges, and test SLA on-call response.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-sm"
            style={{ padding: '6px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Anomaly Preset List */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '460px', overflowY: 'auto' }}>
          {ANOMALY_PRESETS.map((preset) => {
            return (
              <div
                key={preset.id}
                style={{
                  padding: '14px 16px',
                  background: 'rgba(14, 21, 35, 0.8)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      marginTop: '2px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getPresetIcon(preset.type)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                        {preset.name}
                      </span>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.65rem',
                          background: preset.severity === 'SEV-1' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: preset.severity === 'SEV-1' ? '#ef4444' : '#fbbf24',
                        }}
                      >
                        {preset.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {preset.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerAnomaly(preset.id);
                    onClose();
                  }}
                  className="btn btn-sm btn-danger"
                  style={{ whiteSpace: 'nowrap', padding: '6px 12px' }}
                >
                  <Zap size={13} /> Inject Anomaly
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer: Full Self-Healing Button */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(14, 20, 32, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Need to reset everything back to nominal?
          </span>
          <button
            onClick={() => {
              healAllServices();
              onClose();
            }}
            className="btn btn-sm btn-emerald"
            style={{ gap: '6px' }}
          >
            <Sparkles size={14} /> Self-Heal All Services
          </button>
        </div>
      </div>
    </div>
  );
};
