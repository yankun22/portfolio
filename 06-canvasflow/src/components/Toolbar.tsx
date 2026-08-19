import React from 'react';
import { useCanvas } from '../context/CanvasContext';
import type { ToolType } from '../types/canvas';
import {
  MousePointer,
  Hand,
  Square,
  Diamond,
  Circle,
  StickyNote,
  Database,
  Type,
  ArrowUpRight,
  PenTool,
  Highlighter,
  Eraser,
  Palette,
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool, isPropertiesOpen, setIsPropertiesOpen } = useCanvas();

  const tools: Array<{ id: ToolType; label: string; icon: React.ReactNode; shortcut: string }> = [
    { id: 'select', label: 'Select & Move (V)', icon: <MousePointer size={17} />, shortcut: 'V' },
    { id: 'pan', label: 'Hand Pan (H / Space)', icon: <Hand size={17} />, shortcut: 'H' },
    { id: 'rectangle', label: 'Rectangle (R)', icon: <Square size={17} />, shortcut: 'R' },
    { id: 'diamond', label: 'Diamond / Decision (D)', icon: <Diamond size={17} />, shortcut: 'D' },
    { id: 'circle', label: 'Circle (C)', icon: <Circle size={17} />, shortcut: 'C' },
    { id: 'sticky', label: 'Sticky Note', icon: <StickyNote size={17} />, shortcut: 'S' },
    { id: 'cylinder', label: 'Database Cylinder', icon: <Database size={17} />, shortcut: 'B' },
    { id: 'text', label: 'Text Block (T)', icon: <Type size={17} />, shortcut: 'T' },
    { id: 'connector', label: 'Smart Connector Arrow', icon: <ArrowUpRight size={18} />, shortcut: 'A' },
    { id: 'pen', label: 'Freehand Pen (P)', icon: <PenTool size={17} />, shortcut: 'P' },
    { id: 'highlighter', label: 'Highlighter', icon: <Highlighter size={17} />, shortcut: 'G' },
    { id: 'eraser', label: 'Eraser', icon: <Eraser size={17} />, shortcut: 'E' },
  ];

  return (
    <div
      className="hud-glass floating-toolbar-dock"
    >
      {tools.map((tool, idx) => {
        const isActive = activeTool === tool.id;
        // Insert subtle divider before shapes, before connectors, and before drawing tools
        const isDividerBefore = idx === 2 || idx === 8 || idx === 9;

        return (
          <React.Fragment key={tool.id}>
            {isDividerBefore && (
              <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 2px' }} />
            )}
            <button
              onClick={() => setActiveTool(tool.id)}
              className={`tool-btn ${isActive ? 'active' : ''}`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          </React.Fragment>
        );
      })}

      <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 2px' }} />

      {/* Toggle Style/Properties Drawer */}
      <button
        onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
        className={`tool-btn ${isPropertiesOpen ? 'active' : ''}`}
        title="Toggle Style & Color Palette"
      >
        <Palette size={17} />
      </button>
    </div>
  );
};
