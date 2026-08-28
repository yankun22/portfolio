import React, { useRef, useEffect } from 'react';
import { Radio, BarChart3, Orbit } from 'lucide-react';
import { useAudioEngine } from '../../context/useAudioEngine';

export const VisualizerPanel: React.FC = () => {
  const { engine, visualizerMode, setVisualizerMode } = useAudioEngine();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peakLevelsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = engine.analyser;
    const bufferLength = analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark studio background
      ctx.fillStyle = '#080b11';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 30) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      if (visualizerMode === 'oscilloscope') {
        // --- 1. OSCILLOSCOPE TIME-DOMAIN MODE ---
        analyser.getByteTimeDomainData(timeData);

        // Center line
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Waveform
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#d4af37';
        ctx.shadowColor = '#e5c07b';
        ctx.shadowBlur = 10;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0; // 0.0 to 2.0
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (visualizerMode === 'spectrum') {
        // --- 2. REAL-TIME FREQUENCY SPECTRUM (RTA) ---
        analyser.getByteFrequencyData(freqData);

        const numBars = 64;
        const step = Math.floor(bufferLength / numBars);
        const barWidth = (width / numBars) - 2;

        if (peakLevelsRef.current.length !== numBars) {
          peakLevelsRef.current = new Array(numBars).fill(0);
        }

        for (let i = 0; i < numBars; i++) {
          // Average band frequencies
          let sum = 0;
          for (let j = 0; j < step; j++) {
            sum += freqData[i * step + j];
          }
          const val = sum / step; // 0 - 255
          const percent = val / 255;
          const barHeight = percent * (height - 24);
          const x = i * (barWidth + 2);
          const y = height - barHeight;

          // Gradient bar
          const grad = ctx.createLinearGradient(0, height, 0, 0);
          grad.addColorStop(0, '#10b981');
          grad.addColorStop(0.5, '#d4af37');
          grad.addColorStop(0.8, '#f59e0b');
          grad.addColorStop(1, '#ef4444');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Peak hold decay
          if (barHeight > peakLevelsRef.current[i]) {
            peakLevelsRef.current[i] = barHeight;
          } else {
            peakLevelsRef.current[i] = Math.max(0, peakLevelsRef.current[i] - 1.2);
          }

          // Peak dot
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, height - peakLevelsRef.current[i] - 3, barWidth, 2);
        }

        // Frequency range markers at bottom
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('SUB (20-60Hz)', 10, height - 6);
        ctx.fillText('BASS (60-250Hz)', width * 0.15, height - 6);
        ctx.fillText('MID (1kHz)', width * 0.45, height - 6);
        ctx.fillText('PRESENCE (4kHz)', width * 0.7, height - 6);
        ctx.fillText('AIR (16kHz)', width - 80, height - 6);
      } else if (visualizerMode === 'phase') {
        // --- 3. PHASE / LISSAJOUS VECTOR SCOPE ---
        analyser.getByteTimeDomainData(timeData);

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#e5c07b';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < bufferLength - 1; i += 2) {
          const xVal = (timeData[i] - 128) / 128;
          const yVal = (timeData[i + 1] - 128) / 128;

          const px = centerX + xVal * (width * 0.4);
          const py = centerY - yVal * (height * 0.4);

          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [engine, visualizerMode]);

  return (
    <div className="rack-chassis">
      <div className="rack-header">
        <h2 className="rack-title">
          <Radio size={18} color="#d4af37" />
          <span>Real-Time 60fps Oscilloscope & Spectrum Analyzer</span>
        </h2>

        {/* Visualization Mode Selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`btn-studio btn-rack ${visualizerMode === 'oscilloscope' ? 'active' : ''}`}
            style={{ padding: '5px 10px', fontSize: '0.725rem' }}
            onClick={() => setVisualizerMode('oscilloscope')}
          >
            <Radio size={13} />
            <span>Oscilloscope</span>
          </button>
          <button
            type="button"
            className={`btn-studio btn-rack ${visualizerMode === 'spectrum' ? 'active' : ''}`}
            style={{ padding: '5px 10px', fontSize: '0.725rem' }}
            onClick={() => setVisualizerMode('spectrum')}
          >
            <BarChart3 size={13} />
            <span>RTA Spectrum</span>
          </button>
          <button
            type="button"
            className={`btn-studio btn-rack ${visualizerMode === 'phase' ? 'active' : ''}`}
            style={{ padding: '5px 10px', fontSize: '0.725rem' }}
            onClick={() => setVisualizerMode('phase')}
          >
            <Orbit size={13} />
            <span>Phase Scope</span>
          </button>
        </div>
      </div>

      <div className="rack-body" style={{ padding: '16px 20px' }}>
        <div
          style={{
            background: '#07090f',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '160px',
          }}
        >
          <canvas
            ref={canvasRef}
            width={1200}
            height={160}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
};
