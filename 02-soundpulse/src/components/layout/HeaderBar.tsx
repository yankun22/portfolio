import React, { useRef } from 'react';
import {
  Activity,
  Mic,
  MicOff,
  Upload,
  Radio,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';
import { DEMO_TRACKS } from '../../services/demoAudioGenerator';

export const HeaderBar: React.FC = () => {
  const {
    engine,
    playState,
    activeTrack,
    loadTrackFromBlob,
    loadDemoTrack,
    generateTestToneTrack,
    startMicRecording,
    stopMicRecording,
    exportProcessedWav,
    isExporting,
  } = useAudioEngine();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadTrackFromBlob(file, file.name);
    }
    if (e.target) e.target.value = '';
  };

  const isRecording = playState === 'recording';

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: 'var(--bg-rack)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        flexWrap: 'wrap',
        gap: '14px',
      }}
    >
      {/* Brand & Studio Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
          }}
        >
          <Activity size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
            SoundPulse
          </h1>
          <p style={{ fontSize: '0.675rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            WEB AUDIO DSP & WAVEFORM DAW
          </p>
        </div>
      </div>

      {/* DSP Engine Status Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#0a0d14',
          padding: '6px 14px',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: engine.ctx.state === 'running' ? '#10b981' : '#f59e0b',
              boxShadow: engine.ctx.state === 'running' ? '0 0 8px #10b981' : 'none',
            }}
          />
          <span style={{ fontWeight: 700, color: '#fff' }}>
            {engine.ctx.sampleRate.toLocaleString()} Hz
          </span>
        </div>
        <span style={{ color: 'var(--text-dim)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)' }}>24-Bit Float WebAudio</span>
        {activeTrack && (
          <>
            <span style={{ color: 'var(--text-dim)' }}>|</span>
            <span style={{ color: '#06b6d4', fontWeight: 600 }}>
              {activeTrack.channels === 2 ? 'Stereo' : 'Mono'}
            </span>
          </>
        )}
      </div>

      {/* Controls & Track Loader */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Test Tone Quick Button */}
        <button
          type="button"
          className="btn-studio btn-rack"
          onClick={() => generateTestToneTrack(440)}
          title="Synthesize 440 Hz Sine Calibration Tone"
        >
          <Radio size={15} color="#10b981" />
          <span>440Hz Test Tone</span>
        </button>

        {/* Demo Tracks Dropdown */}
        <div style={{ position: 'relative' }}>
          <select
            style={{
              background: 'var(--bg-module-subtle)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
            onChange={(e) => {
              if (e.target.value) {
                loadDemoTrack(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              ⚡ Load Preset Audio...
            </option>
            {DEMO_TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Audio File */}
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="btn-studio btn-rack"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={15} color="#06b6d4" />
          <span>Upload Audio</span>
        </button>

        {/* Mic Record Button */}
        <button
          type="button"
          className={`btn-studio ${isRecording ? 'btn-record recording' : 'btn-rack'}`}
          onClick={isRecording ? stopMicRecording : startMicRecording}
        >
          {isRecording ? <MicOff size={15} /> : <Mic size={15} color="#ef4444" />}
          <span>{isRecording ? 'Stop Mic' : 'Record Mic'}</span>
        </button>

        {/* Export Master with FX */}
        <button
          type="button"
          className="btn-studio btn-play"
          style={{
            padding: '8px 14px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            color: '#080b11',
            fontWeight: 800,
            boxShadow: '0 0 14px rgba(16, 185, 129, 0.3)',
          }}
          onClick={() => exportProcessedWav(false)}
          disabled={isExporting || !activeTrack}
          title="Render full audio track with all active FX Rack effects and export 16-bit WAV"
        >
          {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          <span>{isExporting ? 'Rendering FX...' : 'Export Master with FX'}</span>
        </button>
      </div>
    </header>
  );
};
