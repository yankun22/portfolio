import React from 'react';
import {
  Layers,
  RotateCw,
  Grid,
  Camera,
} from 'lucide-react';
import type { StudioLightingMode } from '../../types/studio';
import { useStudio } from '../../context/useStudio';

export const StudioToolbar: React.FC = () => {
  const {
    isExploded,
    toggleExploded,
    autoRotate,
    setAutoRotate,
    wireframeMode,
    setWireframeMode,
    lightingMode,
    setLightingMode,
    takeSnapshot,
  } = useStudio();

  const lightingOptions: { id: StudioLightingMode; label: string }[] = [
    { id: 'studio', label: 'Studio White' },
    { id: 'cyberpunk', label: 'Cyber Neon' },
    { id: 'warmSunset', label: 'Sunset Amber' },
    { id: 'monochrome', label: 'Monochrome' },
  ];

  return (
    <div className="floating-hud-toolbar">
      {/* 1. Exploded View Mode Button */}
      <button
        type="button"
        className={`btn-spatial btn-pill ${isExploded ? 'active' : ''}`}
        onClick={toggleExploded}
        title="Toggle Exploded Mechanical Component View"
      >
        <Layers size={15} color={isExploded ? '#00f0ff' : 'var(--text-muted)'} />
        <span>{isExploded ? 'Exploded (Active)' : 'Exploded View'}</span>
      </button>

      {/* 2. Auto-Rotate Button */}
      <button
        type="button"
        className={`btn-spatial btn-pill ${autoRotate ? 'active' : ''}`}
        onClick={() => setAutoRotate(!autoRotate)}
        title="Toggle 360° Studio Turntable Rotation"
      >
        <RotateCw size={15} color={autoRotate ? '#00f0ff' : 'var(--text-muted)'} />
        <span>Auto-Turntable</span>
      </button>

      {/* 3. Wireframe Shader Mode */}
      <button
        type="button"
        className={`btn-spatial btn-pill ${wireframeMode ? 'active' : ''}`}
        onClick={() => setWireframeMode(!wireframeMode)}
        title="Toggle Wireframe Structural Mesh Mode"
      >
        <Grid size={15} color={wireframeMode ? '#00f0ff' : 'var(--text-muted)'} />
        <span>Wireframe</span>
      </button>

      {/* 4. Lighting Environment Dropdown */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          value={lightingMode}
          onChange={(e) => setLightingMode(e.target.value as StudioLightingMode)}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '0.775rem',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {lightingOptions.map((opt) => (
            <option key={opt.id} value={opt.id} style={{ background: '#0f172a', color: '#fff' }}>
              💡 {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Snapshot 4K Capture Button */}
      <button
        type="button"
        className="btn-spatial btn-primary-glow"
        style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.775rem' }}
        onClick={takeSnapshot}
        title="Capture 4K High-Res Branded Render"
      >
        <Camera size={15} />
        <span>4K Snapshot</span>
      </button>
    </div>
  );
};
