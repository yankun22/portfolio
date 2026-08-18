import React, { useState, useRef, useEffect, useCallback } from 'react';

interface KnobProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
  color?: string;
  size?: number;
}

export const Knob: React.FC<KnobProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  defaultValue = min,
  unit = '',
  color = '#06b6d4',
  size = 52,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  // Angle range: -135deg to +135deg (270deg span)
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = -135 + norm * 270;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaY = startYRef.current - e.clientY;
      const range = max - min;
      const sensitivity = 150; // pixels for full range
      const change = (deltaY / sensitivity) * range;
      let nextVal = startValRef.current + change;

      // Quantize to step
      if (step > 0) {
        nextVal = Math.round(nextVal / step) * step;
      }
      nextVal = Math.max(min, Math.min(max, nextVal));
      onChange(nextVal);
    },
    [isDragging, max, min, step, onChange]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? (step || (max - min) / 100) : -(step || (max - min) / 100);
    const nextVal = Math.max(min, Math.min(max, value + delta));
    onChange(nextVal);
  };

  const handleDoubleClick = () => {
    onChange(defaultValue);
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => handlePointerMove(e);
    const onUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    }
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging, handlePointerMove]);

  // Format value display
  const displayVal =
    step < 0.1 ? value.toFixed(2) : step < 1 ? value.toFixed(1) : Math.round(value).toString();

  return (
    <div className="knob-control" title={`Double-click to reset (${defaultValue}${unit})`}>
      <div
        className="knob-dial-wrap"
        style={{ width: size, height: size }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        {/* Pointer needle */}
        <div
          className="knob-pointer"
          style={{
            transform: `rotate(${angle}deg)`,
            background: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>

      <span className="knob-label">{label}</span>
      <span className="knob-value" style={{ color }}>
        {displayVal}
        {unit}
      </span>
    </div>
  );
};
