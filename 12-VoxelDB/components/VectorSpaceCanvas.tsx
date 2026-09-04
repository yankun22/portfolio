'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene3D from './Scene3D';
import { Loader2, Compass, Move, ZoomIn } from 'lucide-react';

export default function VectorSpaceCanvas() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-canvas text-zinc-400 gap-3 font-mono text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-neon-cyan" />
        <span>Initializing WebGL 3D Vector Space...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-canvas overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 18, 52], fov: 50, near: 0.1, far: 600 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        className="w-full h-full block"
      >
        <color attach="background" args={['#030712']} />
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>

      {/* Floating 3D Navigation Hint (Mobile & Desktop) */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-canvas-card/85 backdrop-blur-xl border border-white/10 text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-neon-cyan" />
          <span>Left-Click Drag: Orbit</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div className="flex items-center gap-1">
          <Move className="w-3.5 h-3.5 text-neon-magenta" />
          <span>Right-Click Drag: Pan</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div className="flex items-center gap-1">
          <ZoomIn className="w-3.5 h-3.5 text-neon-emerald" />
          <span>Wheel: Zoom</span>
        </div>
      </div>
    </div>
  );
}
