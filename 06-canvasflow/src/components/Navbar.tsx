import React, { useState } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { STARTER_TEMPLATES } from '../data/templates';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  LayoutTemplate,
  Trash2,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    viewport,
    setZoom,
    resetViewport,
    fitToContent,
    canUndo,
    canRedo,
    undo,
    redo,
    setIsExportModalOpen,
    loadTemplate,
    clearCanvas,
  } = useCanvas();

  const [title, setTitle] = useState<string>('System Architecture Flow');
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState<boolean>(false);

  const zoomPercent = Math.round(viewport.zoom * 100);

  return (
    <header
      className="hud-glass"
      style={{
        position: 'absolute',
        top: '14px',
        left: '14px',
        right: '14px',
        height: '52px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 100,
      }}
    >
      {/* Brand & Document Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={18} color="#38bdf8" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Canvas<span style={{ color: '#38bdf8' }}>Flow</span>
          </span>
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Diagram"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#cbd5e1',
            maxWidth: '260px',
          }}
        />
      </div>

      {/* Center Action Controls (Undo, Redo, Zoom) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Undo / Redo */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0, 0, 0, 0.25)', padding: '2px 4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={undo}
            disabled={!canUndo}
            className="btn-icon"
            style={{ opacity: canUndo ? 1 : 0.4 }}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="btn-icon"
            style={{ opacity: canRedo ? 1 : 0.4 }}
            title="Redo (Ctrl+Shift+Z / Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />

        {/* Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0, 0, 0, 0.25)', padding: '2px 4px', borderRadius: '8px', border: '1px solid var(--border-subtle)', gap: '2px' }}>
          <button
            onClick={() => setZoom(viewport.zoom - 0.15)}
            className="btn-icon"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          <span
            onClick={resetViewport}
            className="font-mono"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#38bdf8',
              padding: '2px 8px',
              cursor: 'pointer',
              minWidth: '52px',
              textAlign: 'center',
            }}
            title="Reset Zoom to 100%"
          >
            {zoomPercent}%
          </span>

          <button
            onClick={() => setZoom(viewport.zoom + 0.15)}
            className="btn-icon"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>

          <button
            onClick={fitToContent}
            className="btn-icon"
            title="Fit Diagram to View"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Right Tools (Templates & Export) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
        {/* Templates Picker */}
        <button
          onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
          className="btn btn-sm"
          style={{ gap: '6px' }}
        >
          <LayoutTemplate size={14} color="#8b5cf6" />
          <span>Templates</span>
          <ChevronDown size={12} />
        </button>

        {showTemplatesDropdown && (
          <div
            className="hud-glass"
            style={{
              position: 'absolute',
              top: '44px',
              right: '110px',
              width: '280px',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              zIndex: 200,
            }}
          >
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', padding: '4px 8px', fontWeight: 700 }}>
              CHOOSE ARCHITECTURE TEMPLATE
            </div>
            {STARTER_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  loadTemplate(tmpl.id);
                  setShowTemplatesDropdown(false);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.03)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
              >
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
                  {tmpl.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {tmpl.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export Button */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <Download size={14} />
          <span>Export</span>
        </button>

        {/* Clear Canvas */}
        <button
          onClick={clearCanvas}
          className="btn-icon"
          title="Clear Canvas"
          style={{ color: 'var(--text-dim)' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </header>
  );
};
