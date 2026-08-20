import React, { useState } from 'react';
import type { HeartRateReading } from '../../types/biometrics';

interface HeartRateChartProps {
  readings: HeartRateReading[];
}

export const HeartRateChart: React.FC<HeartRateChartProps> = ({ readings }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (readings.length === 0) {
    return (
      <div style={{ height: 'clamp(180px, 35vw, 240px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No heart rate data recorded for this timeframe.
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

  const minVal = 40;
  const maxVal = 120;

  const getY = (val: number) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  const getX = (idx: number) =>
    readings.length <= 1 ? padLeft + chartW / 2 : padLeft + (idx / (readings.length - 1)) * chartW;

  const hrPoints = readings.map((r, i) => `${getX(i)},${getY(r.restingBpm || r.bpm)}`).join(' ');
  const gridTicks = [50, 60, 70, 80, 90, 100, 110];

  const activeReading = hoveredIdx !== null ? readings[hoveredIdx] : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Optimal Resting Zone Shading (60-80 bpm) */}
        <rect
          x={padLeft}
          y={getY(80)}
          width={chartW}
          height={getY(60) - getY(80)}
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
                strokeDasharray={tick === 60 || tick === 100 ? '4,4' : 'none'}
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-muted)"
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
          points={`${padLeft},${getY(minVal)} ${hrPoints} ${getX(readings.length - 1)},${getY(minVal)}`}
          fill="url(#hrGradient)"
        />
        <polyline
          points={hrPoints}
          fill="none"
          stroke="#fb7185"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Points */}
        {readings.map((r, i) => {
          const x = getX(i);
          const y = getY(r.restingBpm || r.bpm);
          const isHovered = hoveredIdx === i;

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

              <circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 3.5}
                fill="#fb7185"
                stroke="#ffffff"
                strokeWidth={isHovered ? 2 : 1}
              />
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
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fb7185' }}>
              {activeReading.restingBpm || activeReading.bpm}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>BPM (Resting)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>{activeReading.zone} Zone</span>
            {activeReading.hrvRmssd && (
              <span style={{ color: '#a855f7', fontWeight: 600 }}>HRV: {activeReading.hrvRmssd} ms</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

