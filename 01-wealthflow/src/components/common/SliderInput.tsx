import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  description?: string;
  badgeColor?: 'emerald' | 'cyan' | 'violet' | 'amber';
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  prefix = '',
  description,
  badgeColor = 'emerald',
}) => {
  const getBadgeStyle = () => {
    switch (badgeColor) {
      case 'cyan':
        return { color: '#06b6d4', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.25)' };
      case 'violet':
        return { color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.25)' };
      case 'amber':
        return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)' };
      default:
        return { color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)' };
    }
  };

  return (
    <div className="slider-container">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        <span className="slider-val-badge" style={getBadgeStyle()}>
          {prefix}
          {typeof value === 'number' ? (step < 1 ? value.toFixed(1) : value.toLocaleString()) : value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="custom-range"
      />
      {description && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{description}</p>}
    </div>
  );
};
