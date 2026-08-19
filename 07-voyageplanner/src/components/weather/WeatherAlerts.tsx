import React from 'react';
import type { WeatherAlert } from '../../types/weather';
import { AlertTriangle, Info, ShieldAlert, Sparkles, Lightbulb } from 'lucide-react';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  packingTips: string[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts, packingTips }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {alerts.map((alert) => {
          const isWarning = alert.severity === 'warning';
          const isCaution = alert.severity === 'caution';

          return (
            <div
              key={alert.id}
              className={`weather-alert-box ${
                isWarning ? 'alert-warning' : isCaution ? 'alert-caution' : 'alert-info'
              }`}
            >
              <div style={{ marginTop: 2 }}>
                {isWarning ? (
                  <AlertTriangle size={18} />
                ) : isCaution ? (
                  <ShieldAlert size={18} />
                ) : (
                  <Info size={18} />
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{alert.title}</div>
                <div style={{ fontSize: '0.8125rem', opacity: 0.9 }}>{alert.message}</div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginTop: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Lightbulb size={12} />
                  <span>Recommendation: {alert.recommendation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {packingTips.length > 0 && (
        <div className="budget-metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Sparkles size={16} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>
              Smart Weather-Aware Packing Advice
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
            {packingTips.map((tip, idx) => (
              <div
                key={`pack-tip-${idx}`}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)'
                }}
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
