import React from 'react';
import { Scissors, Download, X, Layers, Sparkles, Loader2 } from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';

export const RegionSliceToolbar: React.FC = () => {
  const {
    selectedRegion,
    setSelectedRegion,
    trimToRegion,
    exportTrimmedWav,
    exportProcessedWav,
    isExporting,
  } = useAudioEngine();

  if (!selectedRegion) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <Layers size={14} color="#06b6d4" />
        <span>Click & drag on waveform to select a region for slicing or FX export</span>
      </div>
    );
  }

  const regionLength = Math.max(0, selectedRegion.end - selectedRegion.start);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      {/* Selected Region Duration Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.775rem',
          fontFamily: 'var(--font-mono)',
          color: '#22d3ee',
        }}
      >
        <span>
          {selectedRegion.start.toFixed(2)}s → {selectedRegion.end.toFixed(2)}s
        </span>
        <span style={{ color: 'var(--text-muted)' }}>({regionLength.toFixed(2)}s)</span>
      </div>

      {/* Trim to Selection Button */}
      <button
        type="button"
        className="btn-studio btn-rack"
        style={{ padding: '6px 12px', fontSize: '0.775rem' }}
        onClick={trimToRegion}
        disabled={isExporting}
        title="Crop audio buffer to selected region"
      >
        <Scissors size={14} color="#f59e0b" />
        <span>Trim Audio</span>
      </button>

      {/* Export Raw WAV Slice Button */}
      <button
        type="button"
        className="btn-studio btn-rack"
        style={{ padding: '6px 12px', fontSize: '0.775rem' }}
        onClick={exportTrimmedWav}
        disabled={isExporting}
        title="Download raw trimmed audio slice as 16-bit PCM WAV (dry)"
      >
        <Download size={14} />
        <span>Export Raw (.WAV)</span>
      </button>

      {/* Export Slice WITH ALL FX BAKE IN */}
      <button
        type="button"
        className="btn-studio btn-play"
        style={{ padding: '6px 14px', fontSize: '0.775rem', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', color: '#fff' }}
        onClick={() => exportProcessedWav(true)}
        disabled={isExporting}
        title="Render and export selected region with all active FX Rack effects (EQ, Reverb, Distortion, Pitch)"
      >
        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} color="#fef08a" />}
        <span>{isExporting ? 'Rendering...' : 'Export Slice with FX (.WAV)'}</span>
      </button>

      {/* Clear Selection */}
      <button
        type="button"
        className="btn-studio btn-rack"
        style={{ padding: '6px 8px' }}
        onClick={() => setSelectedRegion(null)}
        disabled={isExporting}
        title="Deselect region"
      >
        <X size={14} />
      </button>
    </div>
  );
};
