import React from 'react';
import { Compass } from 'lucide-react';
import type { CameraPresetId } from '../../types/studio';
import { useStudio } from '../../context/useStudio';

const PRESETS: { id: CameraPresetId; label: string }[] = [
  { id: 'iso', label: 'Isometric' },
  { id: 'side', label: 'Profile' },
  { id: 'top', label: 'Top' },
  { id: 'front', label: 'Front' },
  { id: 'heel', label: 'Heel' },
  { id: 'detail', label: 'Detail' },
];

export const CameraViewBar: React.FC = () => {
  const { cameraPreset, setCameraPreset } = useStudio();

  return (
    <div className="floating-camera-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '6px' }}>
        <Compass size={14} color="#00f0ff" />
        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Camera
        </span>
      </div>

      {PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`btn-spatial btn-pill ${cameraPreset === p.id ? 'active' : ''}`}
          style={{ padding: '4px 10px', fontSize: '0.725rem' }}
          onClick={() => setCameraPreset(p.id)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};
