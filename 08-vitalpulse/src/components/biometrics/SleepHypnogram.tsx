import React, { useState } from 'react';
import type { SleepRecord } from '../../types/biometrics';

interface SleepHypnogramProps {
  records: SleepRecord[];
}

export const SleepHypnogram: React.FC<SleepHypnogramProps> = ({ records }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (records.length === 0) {
    return (
      <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No sleep telemetry recorded for this timeframe.
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

  const maxHours = 10;
  const barWidth = Math.max(8, Math.min(28, (chartW / records.length) * 0.7));

  const getX = (idx: number) => padLeft + (idx / Math.max(1, records.length - 1)) * (chartW - barWidth) + barWidth / 2;
  const getY = (hrs: number) => padTop + chartH - (hrs / maxHours) * chartH;

  const gridTicks = [2, 4, 6, 8, 10];
  const activeRecord = hoveredIdx !== null ? records[hoveredIdx] : null;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block' }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {/* Recommended 7-9hr Sleep Band */}
        <rect
          x={padLeft}
          y={getY(9)}
          width={chartW}
          height={getY(7) - getY(9)}
          fill="rgba(99, 102, 241, 0.08)"
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
                strokeDasharray={tick === 7 || tick === 9 ? '4,4' : 'none'}
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-muted)"
                fontFamily="var(--font-mono)"
              >
                {tick}h
              </text>
            </g>
          );
        })}

        {/* Dates */}
        {records.map((r, i) => {
          const step = Math.max(1, Math.floor(records.length / 6));
          if (i % step !== 0 && i !== records.length - 1) return null;
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

        {/* Stacked Sleep Stage Bars */}
        {records.map((r, i) => {
          const x = getX(i) - barWidth / 2;

          const deepH = (r.stages.deepMinutes / 60 / maxHours) * chartH;
          const remH = (r.stages.remMinutes / 60 / maxHours) * chartH;
          const lightH = (r.stages.lightMinutes / 60 / maxHours) * chartH;
          const awakeH = (r.stages.awakeMinutes / 60 / maxHours) * chartH;

          let currentY = padTop + chartH;

          const deepY = currentY - deepH;
          currentY -= deepH;
          const remY = currentY - remH;
          currentY -= remH;
          const lightY = currentY - lightH;
          currentY -= lightH;
          const awakeY = currentY - awakeH;

          const isHovered = hoveredIdx === i;

          return (
            <g
              key={r.id}
              onMouseEnter={() => setHoveredIdx(i)}
              style={{ cursor: 'pointer' }}
              opacity={hoveredIdx === null || isHovered ? 1 : 0.6}
            >
              {/* Deep Sleep */}
              <rect
                x={x}
                y={deepY}
                width={barWidth}
                height={deepH}
                fill="#3b82f6"
                rx={deepH > 4 ? 2 : 0}
              />
              {/* REM Sleep */}
              <rect
                x={x}
                y={remY}
                width={barWidth}
                height={remH}
                fill="#8b5cf6"
                rx={remH > 4 ? 2 : 0}
              />
              {/* Light Sleep */}
              <rect
                x={x}
                y={lightY}
                width={barWidth}
                height={lightH}
                fill="#06b6d4"
                rx={lightH > 4 ? 2 : 0}
              />
              {/* Awake */}
              <rect
                x={x}
                y={awakeY}
                width={barWidth}
                height={awakeH}
                fill="#f59e0b"
                rx={2}
              />

              {/* Hover Highlight Ring */}
              {isHovered && (
                <rect
                  x={x - 2}
                  y={awakeY - 2}
                  width={barWidth + 4}
                  height={deepH + remH + lightH + awakeH + 4}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  rx={4}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {activeRecord && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 14,
            background: 'var(--bg-card-solid)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.75rem',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Night of {activeRecord.date}</span>
            <span
              style={{
                fontWeight: 800,
                color: activeRecord.score >= 80 ? '#10b981' : activeRecord.score >= 65 ? '#f59e0b' : '#f43f5e'
              }}
            >
              Score: {activeRecord.score}/100
            </span>
          </div>

          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {activeRecord.totalSleepHours} hrs <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>({activeRecord.efficiencyPercentage}% Efficiency)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px', fontSize: '0.7rem', marginTop: 2 }}>
            <span style={{ color: '#3b82f6' }}>Deep: {activeRecord.stages.deepMinutes}m ({Math.round((activeRecord.stages.deepMinutes / (activeRecord.totalSleepHours * 60)) * 100)}%)</span>
            <span style={{ color: '#8b5cf6' }}>REM: {activeRecord.stages.remMinutes}m ({Math.round((activeRecord.stages.remMinutes / (activeRecord.totalSleepHours * 60)) * 100)}%)</span>
            <span style={{ color: '#06b6d4' }}>Light: {activeRecord.stages.lightMinutes}m ({Math.round((activeRecord.stages.lightMinutes / (activeRecord.totalSleepHours * 60)) * 100)}%)</span>
            <span style={{ color: '#f59e0b' }}>Awake: {activeRecord.stages.awakeMinutes}m</span>
          </div>
        </div>
      )}
    </div>
  );
};
