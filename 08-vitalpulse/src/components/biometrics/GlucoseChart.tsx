import React, { useState } from 'react';
import type { GlucoseReading } from '../../types/biometrics';

interface GlucoseChartProps {
  readings: GlucoseReading[];
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({ readings }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (readings.length === 0) {
    return (
      <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No glucose telemetry logged for this period.
      </div>
    );
  }

  const width = 600;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const minVal = 50;
  const maxVal = 220;

  const getY = (val: number) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  const getX = (idx: number) =>
    readings.length <= 1 ? padLeft + chartW / 2 : padLeft + (idx / (readings.length - 1)) * chartW;

  const glucPoints = readings.map((r, i) => `${getX(i)},${getY(r.value)}`).join(' ');
  const gridTicks = [70, 100, 140, 180, 200];

  const activeReading = hoveredIdx !== null ? readings[hoveredIdx] : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id="glucGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* ADA Target Band (70 - 140 mg/dL) */}
        <rect
          x={padLeft}
          y={getY(140)}
          width={chartW}
          height={getY(70) - getY(140)}
          fill="rgba(16, 185, 129, 0.08)"
        />

        {/* Grid lines */}
        {gridTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="var(--border-subtle)"
                strokeDasharray={tick === 70 || tick === 140 ? '4,4' : 'none'}
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill={tick === 100 ? '#10b981' : tick >= 180 ? '#f43f5e' : 'var(--text-muted)'}
                fontFamily="var(--font-mono)"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Dates */}
        {readings.map((r, i) => {
          const step = Math.max(1, Math.floor(readings.length / 6));
          if (i % step !== 0 && i !== readings.length - 1) return null;
          return (
            <text
              key={r.id}
              x={getX(i)}
              y={height - 10}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-muted)"
              fontFamily="var(--font-sans)"
            >
              {r.date.slice(5)}
            </text>
          );
        })}

        {/* Area & Polyline */}
        <polygon
          points={`${padLeft},${getY(minVal)} ${glucPoints} ${getX(readings.length - 1)},${getY(minVal)}`}
          fill="url(#glucGradient)"
        />
        <polyline
          points={glucPoints}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Data Points with State-based shape */}
        {readings.map((r, i) => {
          const x = getX(i);
          const y = getY(r.value);
          const isHovered = hoveredIdx === i;
          const isFasting = r.state === 'Fasting';

          return (
            <g key={r.id}>
              <rect
                x={x - chartW / (readings.length * 2 || 1)}
                y={padTop}
                width={chartW / (readings.length || 1)}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                style={{ cursor: 'pointer' }}
              />

              {isHovered && (
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={height - padBottom}
                  stroke="var(--accent-cyan)"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
              )}

              {isFasting ? (
                // Diamond for Fasting readings
                <polygon
                  points={`${x},${y - (isHovered ? 6 : 4)} ${x + (isHovered ? 6 : 4)},${y} ${x},${y + (isHovered ? 6 : 4)} ${x - (isHovered ? 6 : 4)},${y}`}
                  fill="#06b6d4"
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2 : 1}
                />
              ) : (
                // Circle for Post-Prandial
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 3.5}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={isHovered ? 2 : 1}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {activeReading && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 14,
            background: 'var(--bg-card-solid)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            zIndex: 10
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{activeReading.timestamp}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1rem',
                color: activeReading.value <= 140 ? '#10b981' : activeReading.value <= 180 ? '#f59e0b' : '#f43f5e'
              }}
            >
              {activeReading.value}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>mg/dL</span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                background: activeReading.state === 'Fasting' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: activeReading.state === 'Fasting' ? '#06b6d4' : '#f59e0b'
              }}
            >
              {activeReading.state}
            </span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
            {activeReading.tier} • {activeReading.mealTag || 'Routine check'}
          </div>
        </div>
      )}
    </div>
  );
};
