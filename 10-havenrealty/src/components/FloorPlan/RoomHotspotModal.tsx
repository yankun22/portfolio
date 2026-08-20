import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Compass,
  Sun,
  Maximize2,
  Minimize2,
  Volume2,
  Wind,
  Layers,
  Sparkles,
  RotateCw,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { RoomHotspot, UnitSystem } from '../../types/property';
import { formatArea } from '../../utils/formatters';

interface RoomHotspotModalProps {
  hotspot: RoomHotspot;
  onClose: () => void;
  unitSystem: UnitSystem;
  onToggleUnit: () => void;
}

export const RoomHotspotModal: React.FC<RoomHotspotModalProps> = ({
  hotspot,
  onClose,
  unitSystem,
  onToggleUnit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [yaw, setYaw] = useState(0); // Horizontal angle in degrees
  const [pitch, setPitch] = useState(0); // Vertical angle in degrees
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedMood, setSelectedMood] = useState<'dawn' | 'midday' | 'goldenHour' | 'night'>('goldenHour');
  const [activeTab, setActiveTab] = useState<'360' | 'specs' | 'lighting'>('360');

  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Load 360 Panorama image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = hotspot.panoramaImage;
    img.onload = () => {
      imageObjRef.current = img;
      renderCanvas();
    };
  }, [hotspot.panoramaImage]);

  // Auto-rotate animation
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (autoRotate && !isDragging) {
        setYaw((prev) => (prev + delta * 12) % 360);
      }

      renderCanvas();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoRotate, isDragging, yaw, pitch, zoom, selectedMood]);

  // Canvas rendering with perspective projection & lighting mood filters
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#080a0f';
    ctx.fillRect(0, 0, width, height);

    const img = imageObjRef.current;
    if (img && img.complete) {
      // Cylindrical projection wrapping
      const normYaw = (yaw % 360 + 360) % 360;
      const srcWidth = img.width;
      const srcHeight = img.height;
      const xOffset = (normYaw / 360) * srcWidth;

      // Draw two slices to handle seamless wrap-around
      const fovWidth = (srcWidth * 0.45) / zoom;
      const fovHeight = (srcHeight * 0.6) / zoom;
      const yOffset = Math.max(0, Math.min(srcHeight - fovHeight, (srcHeight - fovHeight) / 2 - (pitch / 90) * (srcHeight * 0.2)));

      // First slice
      ctx.drawImage(
        img,
        xOffset, yOffset, Math.min(srcWidth - xOffset, fovWidth), fovHeight,
        0, 0, width, height
      );

      // Wrap-around slice if required
      if (xOffset + fovWidth > srcWidth) {
        const remainingSrc = fovWidth - (srcWidth - xOffset);
        const remainingDest = (remainingSrc / fovWidth) * width;
        ctx.drawImage(
          img,
          0, yOffset, remainingSrc, fovHeight,
          width - remainingDest, 0, remainingDest, height
        );
      }
    } else {
      // Loading placeholder
      ctx.fillStyle = '#1e2430';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#c5a059';
      ctx.font = '14px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading 360° Architectural Panorama...', width / 2, height / 2);
    }

    // Apply Lighting Mood Overlay Filter
    ctx.save();
    if (selectedMood === 'goldenHour') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(255, 170, 60, 0.22)');
      grad.addColorStop(1, 'rgba(218, 120, 30, 0.35)');
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(0, 0, width, height);
    } else if (selectedMood === 'dawn') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(120, 180, 255, 0.18)');
      grad.addColorStop(1, 'rgba(255, 200, 150, 0.25)');
      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(0, 0, width, height);
    } else if (selectedMood === 'night') {
      ctx.fillStyle = 'rgba(10, 15, 30, 0.45)';
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillRect(0, 0, width, height);
      // Subtle warm interior point lights
      const radial = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 1.5);
      radial.addColorStop(0, 'rgba(255, 210, 120, 0.25)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = radial;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();

    // Subtle Vignette for cinematic editorial feel
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, width / 3,
      width / 2, height / 2, width / 1.3
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  };

  // Pointer / Touch handlers for dragging 360 panorama
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setYaw((prev) => (prev - dx * 0.3 + 360) % 360);
    setPitch((prev) => Math.max(-45, Math.min(45, prev + dy * 0.25)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '1000px', background: '#0e1219', border: '1px solid #c5a059' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(18, 22, 29, 0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="gold-badge" style={{ fontSize: '0.7rem' }}>
              <Eye size={12} /> 360° Hotspot Inspector
            </span>
            <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', fontWeight: 600 }}>{hotspot.name}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#8e97a6',
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '12px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(14, 18, 24, 0.6)',
          }}
        >
          <button
            onClick={() => setActiveTab('360')}
            className={`pill-tag ${activeTab === '360' ? 'active' : ''}`}
            style={{ padding: '6px 14px' }}
          >
            <RotateCw size={14} /> Interactive 360° View
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pill-tag ${activeTab === 'specs' ? 'active' : ''}`}
            style={{ padding: '6px 14px' }}
          >
            <Sliders size={14} /> Architectural Specs & Materials
          </button>
          <button
            onClick={() => setActiveTab('lighting')}
            className={`pill-tag ${activeTab === 'lighting' ? 'active' : ''}`}
            style={{ padding: '6px 14px' }}
          >
            <Sun size={14} /> Solar Azimuth & Lighting
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px' }}>
          {activeTab === '360' && (
            <div>
              {/* 360 Canvas Viewport */}
              <div
                className="panorama-viewport"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ touchAction: 'none' }}
              >
                <canvas
                  ref={canvasRef}
                  width={900}
                  height={380}
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />

                {/* 360 Control Bar Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    right: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    background: 'rgba(12, 14, 18, 0.75)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#dfba73', fontWeight: 600 }}>
                      LIGHTING MOOD:
                    </span>
                    {(['dawn', 'midday', 'goldenHour', 'night'] as const).map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          textTransform: 'capitalize',
                          background: selectedMood === mood ? '#c5a059' : 'rgba(255,255,255,0.06)',
                          color: selectedMood === mood ? '#0c0e12' : '#c7cbd3',
                          fontWeight: selectedMood === mood ? 600 : 400,
                        }}
                      >
                        {mood === 'goldenHour' ? 'Golden Hour' : mood}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: autoRotate ? 'rgba(197, 160, 89, 0.2)' : 'rgba(255,255,255,0.06)',
                        color: autoRotate ? '#dfba73' : '#c7cbd3',
                        border: autoRotate ? '1px solid #c5a059' : 'none',
                      }}
                    >
                      {autoRotate ? 'Auto-Pan ON' : 'Auto-Pan OFF'}
                    </button>
                    <button
                      onClick={() => setZoom((z) => Math.min(2.0, z + 0.2))}
                      className="btn-ghost"
                      style={{ padding: '4px' }}
                      title="Zoom In"
                    >
                      <Maximize2 size={15} />
                    </button>
                    <button
                      onClick={() => setZoom((z) => Math.max(0.8, z - 0.2))}
                      className="btn-ghost"
                      style={{ padding: '4px' }}
                      title="Zoom Out"
                    >
                      <Minimize2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Drag hint */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: '#8e97a6',
                    pointerEvents: 'none',
                  }}
                >
                  Drag to look around 360° • Yaw: {Math.round(yaw)}°
                </div>
              </div>

              {/* Quick Specs Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  marginTop: '18px',
                }}
              >
                <div className="glass-card" style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>
                    Floor Area
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 600 }} className="font-mono">
                      {formatArea(hotspot.sqft, unitSystem)}
                    </span>
                    <button
                      onClick={onToggleUnit}
                      style={{ fontSize: '0.72rem', color: '#c5a059', textDecoration: 'underline' }}
                    >
                      {unitSystem === 'imperial' ? 'Switch to m²' : 'Switch to sq ft'}
                    </button>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>
                    Dimensions & Height
                  </span>
                  <div style={{ marginTop: '4px', fontSize: '0.95rem', color: '#f8fafc', fontWeight: 500 }} className="font-mono">
                    {hotspot.dimensions} • {hotspot.ceilingHeight}
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>
                    Solar Orientation
                  </span>
                  <div style={{ marginTop: '4px', fontSize: '0.95rem', color: '#dfba73', fontWeight: 500 }}>
                    {hotspot.sunOrientation.facing} ({hotspot.sunOrientation.azimuth}°)
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>
                    Acoustic Rating
                  </span>
                  <div style={{ marginTop: '4px', fontSize: '0.95rem', color: '#10b981', fontWeight: 500 }} className="font-mono">
                    {hotspot.acousticRating}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="responsive-two-col">
              <div className="glass-card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', color: '#dfba73', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} /> Materiality & Custom Millwork
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {hotspot.materials.map((mat, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        borderLeft: '3px solid #c5a059',
                      }}
                    >
                      <Sparkles size={14} color="#dfba73" />
                      <span style={{ fontSize: '0.88rem', color: '#f8fafc' }}>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', color: '#dfba73', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wind size={16} /> Environmental & Mechanical Specs
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>
                      HVAC & Climate Zoning
                    </span>
                    <p style={{ fontSize: '0.9rem', color: '#f8fafc', marginTop: '2px' }}>{hotspot.hvacZone}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>
                      Acoustic Sound Isolation
                    </span>
                    <p style={{ fontSize: '0.9rem', color: '#10b981', marginTop: '2px' }}>{hotspot.acousticRating}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#8e97a6', textTransform: 'uppercase' }}>
                      Glazing Specification
                    </span>
                    <p style={{ fontSize: '0.9rem', color: '#f8fafc', marginTop: '2px' }}>
                      {hotspot.sunOrientation.windowType} (SHGC: {hotspot.sunOrientation.solarHeatGainCoeff})
                    </p>
                  </div>
                </div>
              </div>

              {/* Architectural features list */}
              <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', color: '#dfba73', marginBottom: '12px' }}>
                  Signature Room Features
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  {hotspot.features.map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        color: '#c7cbd3',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      • {feat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lighting' && (
            <div className="responsive-two-col">
              {/* Solar compass and azimuth visual */}
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', color: '#dfba73', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Compass size={18} /> Solar Azimuth & Sun Path
                </h4>
                <div
                  style={{
                    position: 'relative',
                    width: '180px',
                    height: '180px',
                    margin: '0 auto',
                    borderRadius: '50%',
                    border: '2px dashed rgba(197,160,89,0.4)',
                    background: 'radial-gradient(circle, rgba(197,160,89,0.08) 0%, transparent 70%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ position: 'absolute', top: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#8e97a6' }}>N</span>
                  <span style={{ position: 'absolute', right: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#8e97a6' }}>E</span>
                  <span style={{ position: 'absolute', bottom: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#8e97a6' }}>S</span>
                  <span style={{ position: 'absolute', left: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#8e97a6' }}>W</span>

                  {/* Sun pointer arrow */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '4px',
                      height: '70px',
                      background: 'linear-gradient(to top, transparent, #dfba73)',
                      transformOrigin: 'bottom center',
                      transform: `rotate(${hotspot.sunOrientation.azimuth}deg)`,
                      bottom: '50%',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '-6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#dfba73',
                        boxShadow: '0 0 12px #dfba73',
                      }}
                    />
                  </div>
                  <div style={{ zIndex: 2, fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }} className="font-mono">
                    {hotspot.sunOrientation.azimuth}° {hotspot.sunOrientation.facing}
                  </div>
                </div>

                <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#c7cbd3' }}>
                  Peak Natural Daylight Window:
                  <div style={{ fontWeight: 600, color: '#dfba73', marginTop: '4px' }}>
                    {hotspot.sunOrientation.peakHours}
                  </div>
                </div>
              </div>

              {/* Lighting Mood Descriptions */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', color: '#dfba73', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sun size={16} /> Diurnal Lighting Choreography
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(hotspot.lightingMoods).map(([mood, desc]) => (
                    <div
                      key={mood}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '6px',
                        borderLeft: `3px solid ${mood === 'goldenHour' ? '#c5a059' : mood === 'dawn' ? '#60a5fa' : mood === 'night' ? '#818cf8' : '#fbbf24'}`,
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#8e97a6', fontWeight: 600 }}>
                        {mood === 'goldenHour' ? 'Golden Hour' : mood}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#f8fafc', marginTop: '2px' }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
