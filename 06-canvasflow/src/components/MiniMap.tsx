import React, { useRef } from 'react';
import { useCanvas } from '../context/CanvasContext';
import { Compass } from 'lucide-react';

export const MiniMap: React.FC = () => {
  const { elements, viewport, setViewport } = useCanvas();
  const miniMapWidth = 190;
  const miniMapHeight = 130;
  const mapRef = useRef<HTMLDivElement>(null);

  // Compute total elements bounding box
  let minX = -400;
  let minY = -300;
  let maxX = 1200;
  let maxY = 800;

  elements.forEach((e) => {
    minX = Math.min(minX, e.x - 100);
    minY = Math.min(minY, e.y - 100);
    maxX = Math.max(maxX, e.x + (e.width || 100) + 100);
    maxY = Math.max(maxY, e.y + (e.height || 100) + 100);
  });

  const worldWidth = maxX - minX;
  const worldHeight = maxY - minY;

  const scaleX = miniMapWidth / worldWidth;
  const scaleY = miniMapHeight / worldHeight;
  const mapScale = Math.min(scaleX, scaleY);

  // Screen viewport rect projected to world
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const viewWorldX = -viewport.panX / viewport.zoom;
  const viewWorldY = -viewport.panY / viewport.zoom;
  const viewWorldW = screenW / viewport.zoom;
  const viewWorldH = screenH / viewport.zoom;

  // Viewport box on minimap
  const boxX = (viewWorldX - minX) * mapScale;
  const boxY = (viewWorldY - minY) * mapScale;
  const boxW = Math.max(viewWorldW * mapScale, 10);
  const boxH = Math.max(viewWorldH * mapScale, 10);

  const handleMiniMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = clickX / mapScale + minX;
    const targetWorldY = clickY / mapScale + minY;

    setViewport((prev) => ({
      ...prev,
      panX: screenW / 2 - targetWorldX * prev.zoom,
      panY: screenH / 2 - targetWorldY * prev.zoom,
    }));
  };

  return (
    <div
      ref={mapRef}
      onClick={handleMiniMapClick}
      className="hud-glass"
      style={{
        position: 'absolute',
        bottom: '14px',
        right: '14px',
        width: `${miniMapWidth}px`,
        height: `${miniMapHeight}px`,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'crosshair',
        zIndex: 90,
      }}
    >
      {/* Mini-map Radar Label */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '8px',
          fontSize: '0.62rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 5,
        }}
      >
        <Compass size={11} color="#38bdf8" />
        <span>RADAR MINI-MAP</span>
      </div>

      {/* Shapes Thumbnail Layer */}
      <svg
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          background: 'rgba(6, 10, 18, 0.75)',
        }}
      >
        {elements.map((elem) => {
          if (elem.type === 'connector' || elem.type === 'freedraw') return null;
          const ex = (elem.x - minX) * mapScale;
          const ey = (elem.y - minY) * mapScale;
          const ew = Math.max((elem.width || 60) * mapScale, 4);
          const eh = Math.max((elem.height || 40) * mapScale, 4);

          return (
            <rect
              key={elem.id}
              x={ex}
              y={ey}
              width={ew}
              height={eh}
              rx="2"
              fill={elem.stroke || '#38bdf8'}
              opacity={0.7}
            />
          );
        })}
      </svg>

      {/* Draggable Viewport Viewfinder Rect */}
      <div
        style={{
          position: 'absolute',
          left: `${boxX}px`,
          top: `${boxY}px`,
          width: `${boxW}px`,
          height: `${boxH}px`,
          border: '1.5px solid #38bdf8',
          background: 'rgba(56, 189, 248, 0.15)',
          borderRadius: '4px',
          boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
