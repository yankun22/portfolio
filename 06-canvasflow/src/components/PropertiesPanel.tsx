import React from 'react';
import { useCanvas } from '../context/CanvasContext';
import type { ConnectorStyle } from '../types/canvas';
import {
  Sliders,
  Copy,
  Trash2,
  BringToFront,
  SendToBack,
  Spline,
  GitCommit,
  Minus,
  X,
} from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const {
    selectedElement,
    updateElement,
    duplicateSelected,
    deleteSelected,
    bringToFront,
    sendToBack,
    activeColor,
    setActiveColor,
    activeStrokeWidth,
    setActiveStrokeWidth,
    activeStrokeStyle,
    setActiveStrokeStyle,
    activeConnectorStyle,
    setActiveConnectorStyle,
    isPropertiesOpen,
    setIsPropertiesOpen,
  } = useCanvas();

  if (!isPropertiesOpen) return null;

  const colorPalette = [
    { label: 'Cyan', color: '#38bdf8' },
    { label: 'Violet', color: '#8b5cf6' },
    { label: 'Emerald', color: '#10b981' },
    { label: 'Amber', color: '#f59e0b' },
    { label: 'Rose', color: '#f43f5e' },
    { label: 'Pink', color: '#ec4899' },
    { label: 'White', color: '#f8fafc' },
    { label: 'Slate', color: '#64748b' },
  ];

  const fillPalette = [
    { label: 'Transparent', fill: 'transparent' },
    { label: 'Subtle Tint', fill: 'rgba(56, 189, 248, 0.12)' },
    { label: 'Solid Slate', fill: 'rgba(18, 27, 44, 0.85)' },
    { label: 'Sticky Yellow', fill: '#fef08a' },
    { label: 'Sticky Cyan', fill: '#cffafe' },
    { label: 'Sticky Rose', fill: '#ffe4e6' },
  ];

  const strokeWidths = [1, 2, 4, 6];
  const strokeStyles: Array<'solid' | 'dashed' | 'dotted'> = ['solid', 'dashed', 'dotted'];

  const currentColor = selectedElement ? selectedElement.stroke : activeColor;
  const currentStrokeWidth = selectedElement ? selectedElement.strokeWidth : activeStrokeWidth;
  const currentStrokeStyle = selectedElement ? selectedElement.strokeStyle : activeStrokeStyle;

  const handleColorSelect = (color: string) => {
    setActiveColor(color);
    if (selectedElement) {
      updateElement(selectedElement.id, { stroke: color }, true);
    }
  };

  const handleFillSelect = (fill: string) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { fill }, true);
    }
  };

  const handleStrokeWidthSelect = (w: number) => {
    setActiveStrokeWidth(w);
    if (selectedElement) {
      updateElement(selectedElement.id, { strokeWidth: w }, true);
    }
  };

  const handleStrokeStyleSelect = (style: 'solid' | 'dashed' | 'dotted') => {
    setActiveStrokeStyle(style);
    if (selectedElement) {
      updateElement(selectedElement.id, { strokeStyle: style }, true);
    }
  };

  const handleConnectorStyleSelect = (style: ConnectorStyle) => {
    setActiveConnectorStyle(style);
    if (selectedElement && selectedElement.type === 'connector') {
      updateElement(selectedElement.id, { connectorStyle: style }, true);
    }
  };

  return (
    <div className="hud-glass properties-panel-dock">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={13} color="#38bdf8" />
          <span>{selectedElement ? `${selectedElement.type.toUpperCase()} STYLES` : 'STROKE & FILL DEFAULTS'}</span>
        </div>

        <button
          onClick={() => setIsPropertiesOpen(false)}
          className="btn-icon mobile-only-close"
          style={{ padding: '2px' }}
        >
          <X size={14} />
        </button>
      </div>

      {/* 1. Stroke Color Palette */}
      <div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
          Stroke Color
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {colorPalette.map((c) => {
            const isSelected = currentColor === c.color;
            return (
              <button
                key={c.color}
                onClick={() => handleColorSelect(c.color)}
                style={{
                  height: '24px',
                  borderRadius: '6px',
                  background: c.color,
                  border: isSelected ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? `0 0 8px ${c.color}` : 'none',
                }}
                title={c.label}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Fill Options */}
      {(!selectedElement || selectedElement.type !== 'freedraw') && (
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Background Fill
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
            {fillPalette.map((f, idx) => (
              <button
                key={idx}
                onClick={() => handleFillSelect(f.fill)}
                style={{
                  height: '22px',
                  borderRadius: '5px',
                  background: f.fill === 'transparent' ? 'repeating-conic-gradient(#334155 0% 25%, #1e293b 0% 50%) 50% / 10px 10px' : f.fill,
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
                title={f.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Stroke Width */}
      <div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
          Stroke Width
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {strokeWidths.map((w) => {
            const isSelected = currentStrokeWidth === w;
            return (
              <button
                key={w}
                onClick={() => handleStrokeWidthSelect(w)}
                className="btn btn-sm"
                style={{
                  flex: 1,
                  padding: '4px 0',
                  background: isSelected ? 'rgba(56, 189, 248, 0.25)' : undefined,
                  borderColor: isSelected ? '#38bdf8' : undefined,
                  color: isSelected ? '#38bdf8' : undefined,
                }}
              >
                {w}px
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Stroke Style (Solid, Dashed, Dotted) */}
      <div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
          Line Style
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {strokeStyles.map((style) => {
            const isSelected = currentStrokeStyle === style;
            return (
              <button
                key={style}
                onClick={() => handleStrokeStyleSelect(style)}
                className="btn btn-sm"
                style={{
                  flex: 1,
                  padding: '4px 0',
                  textTransform: 'capitalize',
                  fontSize: '0.7rem',
                  background: isSelected ? 'rgba(56, 189, 248, 0.25)' : undefined,
                  borderColor: isSelected ? '#38bdf8' : undefined,
                  color: isSelected ? '#38bdf8' : undefined,
                }}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Connector Routing (Only for Connectors or Default) */}
      {(!selectedElement || selectedElement.type === 'connector') && (
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Arrow Curve Style
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => handleConnectorStyleSelect('bezier')}
              className="btn btn-sm"
              style={{
                flex: 1,
                padding: '4px 0',
                background: (selectedElement?.connectorStyle || activeConnectorStyle) === 'bezier' ? 'rgba(56, 189, 248, 0.25)' : undefined,
                borderColor: (selectedElement?.connectorStyle || activeConnectorStyle) === 'bezier' ? '#38bdf8' : undefined,
              }}
              title="Smooth Bézier"
            >
              <Spline size={13} />
            </button>
            <button
              onClick={() => handleConnectorStyleSelect('orthogonal')}
              className="btn btn-sm"
              style={{
                flex: 1,
                padding: '4px 0',
                background: (selectedElement?.connectorStyle || activeConnectorStyle) === 'orthogonal' ? 'rgba(56, 189, 248, 0.25)' : undefined,
                borderColor: (selectedElement?.connectorStyle || activeConnectorStyle) === 'orthogonal' ? '#38bdf8' : undefined,
              }}
              title="Orthogonal Right-Angle"
            >
              <GitCommit size={13} />
            </button>
            <button
              onClick={() => handleConnectorStyleSelect('straight')}
              className="btn btn-sm"
              style={{
                flex: 1,
                padding: '4px 0',
                background: (selectedElement?.connectorStyle || activeConnectorStyle) === 'straight' ? 'rgba(56, 189, 248, 0.25)' : undefined,
                borderColor: (selectedElement?.connectorStyle || activeConnectorStyle) === 'straight' ? '#38bdf8' : undefined,
              }}
              title="Straight Line"
            >
              <Minus size={13} />
            </button>
          </div>
        </div>
      )}

      {/* 6. Context Actions for Selected Element */}
      {selectedElement && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={bringToFront} className="btn btn-sm" style={{ flex: 1 }} title="Bring to Front">
              <BringToFront size={13} />
            </button>
            <button onClick={sendToBack} className="btn btn-sm" style={{ flex: 1 }} title="Send to Back">
              <SendToBack size={13} />
            </button>
            <button onClick={duplicateSelected} className="btn btn-sm" style={{ flex: 1 }} title="Duplicate (Ctrl+D)">
              <Copy size={13} />
            </button>
            <button onClick={deleteSelected} className="btn btn-sm" style={{ flex: 1, color: '#f87171' }} title="Delete">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
