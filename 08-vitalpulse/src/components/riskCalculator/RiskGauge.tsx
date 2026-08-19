import React from 'react';
import type { RiskTier } from '../../types/clinicalRisk';

interface RiskGaugeProps {
  scorePercentage: number;
  riskTier: RiskTier;
  riskColor: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  scorePercentage,
  riskTier,
  riskColor
}) => {
  // Clamped angle between -90deg and +90deg (180deg total sweep)
  // Max score on gauge: 30%
  const normalized = Math.min(30, Math.max(0, scorePercentage)) / 30;
  const needleAngle = -90 + normalized * 180;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg viewBox="0 0 200 120" style={{ width: '100%', maxWidth: 260, overflow: 'visible' }}>
        {/* Arc Background Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--bg-secondary)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Low Zone (0 - 5%) -> 0 - 30deg */}
        <path
          d="M 20 100 A 80 80 0 0 1 45 44"
          fill="none"
          stroke="#10b981"
          strokeWidth="16"
          opacity="0.8"
        />

        {/* Borderline (5 - 7.5%) */}
        <path
          d="M 45 44 A 80 80 0 0 1 68 28"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="16"
          opacity="0.8"
        />

        {/* Intermediate (7.5 - 20%) */}
        <path
          d="M 68 28 A 80 80 0 0 1 140 32"
          fill="none"
          stroke="#f97316"
          strokeWidth="16"
          opacity="0.8"
        />

        {/* High Zone (≥20%) */}
        <path
          d="M 140 32 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="16"
          opacity="0.8"
        />

        {/* Needle */}
        <g transform={`rotate(${needleAngle}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="30" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="7" fill={riskColor} stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Min & Max Labels */}
        <text x="16" y="118" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-mono)">0%</text>
        <text x="174" y="118" fontSize="9" fill="var(--text-muted)" fontFamily="var(--font-mono)">30%+</text>
      </svg>

      <div style={{ marginTop: -10, textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: riskColor }}>
          {scorePercentage}%
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            background: `${riskColor}20`,
            color: riskColor,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginTop: 2
          }}
        >
          {riskTier} Risk
        </div>
      </div>
    </div>
  );
};
