import React, { useState } from 'react';
import type { BloodPressureReading } from '../../types/biometrics';

interface BloodPressureChartProps {
  readings: BloodPressureReading[];
}

export const BloodPressureChart: React.FC<BloodPressureChartProps> = ({ readings }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (readings.length === 0) {
    return (
      <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No blood pressure records for this timeframe.
      </div>
    );
  }

  // Dimensions
  const width = 600;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Scales
  const minVal = 50;
  const maxVal = 180;

  const getY = (val: number) => padTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
  const getX = (idx: number) =>
    readings.length <= 1 ? padLeft + chartW / 2 : padLeft + (idx / (readings.length - 1)) * chartW;

  // Points path for Systolic & Diastolic
  const sysPoints = readings.map((r, i) => `${getX(i)},${getY(r.systolic)}`).join(' ');
  const diaPoints = readings.map((r, i) => `${getX(i)},${getY(r.diastolic)}`).join(' ');

  // Grid lines
  const gridTicks = [60, 80, 100, 120, 140, 160];

  const activeReading = hoveredIdx !== null ? readings[hoveredIdx] : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        <defs>
          <linearGradient id="sysGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="diaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* AHA Target Normal Zone Shading (<120 / <80) */}
        <rect
          x={padLeft}
          y={getY(120)}
          width={chartW}
          height={getY(80) - getY(120)}
          fill="rgba(16, 185, 129, 0.06)"
        />
        <rect
          x={padLeft}
          y={getY(140)}
          width={chartW}
          height={getY(120) - getY(140)}
          fill="rgba(245, 158, 11, 0.05)"
        />

        {/* Grid lines & Y-Axis Labels */}
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
                strokeDasharray={tick === 120 || tick === 80 ? '4,4' : 'none'}
                strokeWidth={tick === 120 || tick === 80 ? 1.5 : 1}
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill={tick === 120 ? '#10b981' : tick === 140 ? '#f43f5e' : 'var(--text-muted)'}
                fontFamily="var(--font-mono)"
                fontWeight={tick === 120 ? 'bold' : 'normal'}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X-Axis Date Labels */}
        {readings.map((r, i) => {
          const step = Math.max(1, Math.floor(readings.length / 6));
          if (i % step !== 0 && i !== readings.length - 1) return null;
          const x = getX(i);
          return (
            <text
              key={r.id}
              x={x}
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

        {/* Systolic Area & Polyline */}
        <polygon
          points={`${padLeft},${getY(minVal)} ${sysPoints} ${getX(readings.length - 1)},${getY(minVal)}`}
          fill="url(#sysGradient)"
        />
        <polyline
          points={sysPoints}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Diastolic Area & Polyline */}
        <polygon
          points={`${padLeft},${getY(minVal)} ${diaPoints} ${getX(readings.length - 1)},${getY(minVal)}`}
          fill="url(#diaGradient)"
        />
        <polyline
          points={diaPoints}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover Crosshair & Interactive Dots */}
        {readings.map((r, i) => {
          const x = getX(i);
          const ySys = getY(r.systolic);
          const yDia = getY(r.diastolic);
          const isHovered = hoveredIdx === i;

          return (
            <g key={r.id}>
              {/* Invisible touch/mouse target slice */}
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

              {/* Systolic point */}
              <circle
                cx={x}
                cy={ySys}
                r={isHovered ? 6 : 3}
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth={isHovered ? 2 : 1}
              />

              {/* Diastolic point */}
              <circle
                cx={x}
                cy={yDia}
                r={isHovered ? 6 : 3}
                fill="#38bdf8"
                stroke="#ffffff"
                strokeWidth={isHovered ? 2 : 1}
              />
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Card */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#f43f5e' }}>
              {activeReading.systolic}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#38bdf8' }}>
              {activeReading.diastolic}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>mmHg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontWeight: 700, color: '#10b981' }}>{activeReading.hypertensionStage}</span>
            <span style={{ color: 'var(--text-muted)' }}>Pulse: {activeReading.pulse} bpm</span>
          </div>
        </div>
      )}
    </div>
  );
};
