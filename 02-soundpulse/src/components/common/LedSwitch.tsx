import React from 'react';

interface LedSwitchProps {
  label: string;
  active: boolean;
  onChange: (active: boolean) => void;
  color?: string;
  className?: string;
}

export const LedSwitch: React.FC<LedSwitchProps> = ({
  label,
  active,
  onChange,
  color = '#10b981',
  className = '',
}) => {
  return (
    <button
      type="button"
      className={`led-switch ${active ? 'active' : ''} ${className}`}
      onClick={() => onChange(!active)}
      style={{ '--lamp-color': color } as React.CSSProperties}
    >
      <span className="led-lamp" />
      <span>{label}</span>
    </button>
  );
};
