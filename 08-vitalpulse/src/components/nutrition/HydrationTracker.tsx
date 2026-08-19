import React from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HydrationTrackerProps {
  currentMl: number;
  targetMl: number;
  onUpdateWater: (newAmount: number) => void;
}

export const HydrationTracker: React.FC<HydrationTrackerProps> = ({
  currentMl,
  targetMl,
  onUpdateWater
}) => {
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));

  const handleAdd = (delta: number) => {
    const nextVal = Math.max(0, currentMl + delta);
    onUpdateWater(nextVal);
    if (nextVal >= targetMl && currentMl < targetMl) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Droplets size={18} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Hydration Telemetry
          </h3>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: percentage >= 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
            color: percentage >= 100 ? '#10b981' : '#38bdf8'
          }}
        >
          {percentage}% Target Met
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Animated Water Cylinder Gauge */}
        <div
          style={{
            width: 48,
            height: 90,
            borderRadius: 'var(--radius-lg)',
            border: '2px solid rgba(56, 189, 248, 0.3)',
            background: 'var(--bg-input)',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${percentage}%`,
              background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
              transition: 'height 0.4s ease',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)'
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {currentMl}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              / {targetMl} ml
            </span>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {percentage >= 100
              ? 'Daily optimal hydration goal achieved! 💧'
              : `${targetMl - currentMl} ml remaining to reach goal`}
          </div>

          {/* Quick-add buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              className="btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
              onClick={() => handleAdd(250)}
            >
              <Plus size={12} /> 250ml
            </button>
            <button
              className="btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.75rem' }}
              onClick={() => handleAdd(500)}
            >
              <Plus size={12} /> 500ml
            </button>
            <button
              className="btn-icon"
              style={{ width: 28, height: 28 }}
              onClick={() => handleAdd(-250)}
              title="Remove 250ml"
            >
              <Minus size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
