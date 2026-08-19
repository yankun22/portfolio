import React, { useState, useRef } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { exportToPng, exportToSvg, exportToJson } from '../utils/exportUtils';
import {
  Download,
  Upload,
  FileImage,
  FileCode,
  FileJson,
  CheckCircle2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { elements, addElement, pushHistorySnapshot } = useCanvas();
  const [scale, setScale] = useState<number>(2);
  const [diagramTitle, setDiagramTitle] = useState<string>('architecture-diagram');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportPng = async () => {
    await exportToPng(elements, scale);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleExportSvg = () => {
    exportToSvg(elements);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleExportJson = () => {
    exportToJson(elements, diagramTitle);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleJsonImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const importedElements = Array.isArray(data) ? data : data.elements;

      if (Array.isArray(importedElements)) {
        pushHistorySnapshot(elements);
        importedElements.forEach((el) => addElement(el));
        setImportStatus(`Successfully imported ${importedElements.length} elements!`);
        confetti({ particleCount: 50, spread: 60 });
      } else {
        throw new Error('Invalid JSON diagram format.');
      }
    } catch (err: any) {
      setImportStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog hud-glass"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '560px',
          maxWidth: '92vw',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              <Download size={18} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Export Diagram</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Export high-resolution vector and raster assets directly from the infinite canvas.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Title Input */}
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            DIAGRAM FILE NAME
          </label>
          <input
            type="text"
            value={diagramTitle}
            onChange={(e) => setDiagramTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Export Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {/* PNG */}
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(56, 189, 248, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <FileImage size={15} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>PNG Image</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                High-DPI rasterization.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className="btn btn-sm"
                  style={{
                    flex: 1,
                    padding: '2px 0',
                    fontSize: '0.68rem',
                    background: scale === s ? 'rgba(56, 189, 248, 0.25)' : undefined,
                    borderColor: scale === s ? '#38bdf8' : undefined,
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button onClick={handleExportPng} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              Download PNG
            </button>
          </div>

          {/* SVG */}
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(139, 92, 246, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <FileCode size={15} color="#8b5cf6" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>SVG Vector</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Scalable clean vector markup.
              </p>
            </div>

            <button onClick={handleExportSvg} className="btn btn-sm" style={{ width: '100%', borderColor: 'rgba(139,92,246,0.4)', color: '#c084fc' }}>
              Download SVG
            </button>
          </div>

          {/* JSON */}
          <div
            style={{
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(16, 185, 129, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <FileJson size={15} color="#10b981" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>JSON State</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Full structured diagram backup.
              </p>
            </div>

            <button onClick={handleExportJson} className="btn btn-sm" style={{ width: '100%', borderColor: 'rgba(16,185,129,0.4)', color: '#34d399' }}>
              Download JSON
            </button>
          </div>
        </div>

        {/* Import JSON */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            IMPORT DIAGRAM JSON
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleJsonImport}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn"
            style={{ width: '100%', padding: '10px', borderStyle: 'dashed', borderColor: 'var(--border-medium)' }}
          >
            <Upload size={15} color="#38bdf8" />
            <span>Upload .JSON Diagram File</span>
          </button>

          {importStatus && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
              }}
            >
              <CheckCircle2 size={14} />
              <span>{importStatus}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
