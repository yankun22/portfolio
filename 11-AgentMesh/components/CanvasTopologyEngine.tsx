'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAgentMeshStore } from '../store/useAgentMeshStore';
import { AgentNode } from '../types/agent';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Activity,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export default function CanvasTopologyEngine() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Store bindings
  const agents = useAgentMeshStore((state) => state.agents);
  const activeBeams = useAgentMeshStore((state) => state.activeBeams);
  const selectedAgentId = useAgentMeshStore((state) => state.selectedAgentId);
  const selectAgent = useAgentMeshStore((state) => state.selectAgent);
  const playbackSpeed = useAgentMeshStore((state) => state.playbackSpeed);
  const simulationStatus = useAgentMeshStore((state) => state.simulationStatus);

  // Viewport transforms
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [hoveredAgent, setHoveredAgent] = useState<AgentNode | null>(null);
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });

  // Idle background particles for ambient living network effect
  const ambientParticlesRef = useRef<
    { edgeIdx: number; progress: number; speed: number; size: number }[]
  >([]);

  useEffect(() => {
    ambientParticlesRef.current = Array.from({ length: 30 }, () => ({
      edgeIdx: Math.floor(Math.random() * 8),
      progress: Math.random(),
      speed: 0.0015 + Math.random() * 0.003,
      size: 1.5 + Math.random() * 2,
    }));
  }, []);

  // Compute node screen positions based on canvas center & zoom/pan
  const getNodeScreenPos = useCallback(
    (agent: AgentNode, width: number, height: number): Point => {
      const centerX = width / 2 + pan.x;
      const centerY = height / 2 + pan.y;
      const baseRadius = Math.min(width, height) * 0.38 * zoom;

      return {
        x: centerX + agent.position.x * baseRadius,
        y: centerY + agent.position.y * baseRadius,
      };
    },
    [pan, zoom]
  );

  // Handle canvas sizing and main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Clear with deep canvas void
      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2 + pan.x;
      const centerY = height / 2 + pan.y;

      // 2. Render Holographic Radar Grid & Orbital Rings
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;

      // Subtle radial grid lines
      const gridSize = 60 * zoom;
      const startX = (pan.x % gridSize) + (width % gridSize) / 2;
      const startY = (pan.y % gridSize) + (height % gridSize) / 2;

      for (let x = startX - gridSize; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = startY - gridSize; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Orbital Concentric Rings
      const baseRadius = Math.min(width, height) * 0.38 * zoom;
      [0.4, 0.75, 1.05, 1.35].forEach((rFactor, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * rFactor, 0, Math.PI * 2);
        ctx.strokeStyle =
          idx === 1 ? 'rgba(46, 229, 157, 0.08)' : 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = idx === 1 ? 1.5 : 1;
        if (idx % 2 === 0) {
          ctx.setLineDash([4, 8]);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.restore();

      // 3. Precompute agent positions
      const positions: { [id: string]: Point } = {};
      agents.forEach((ag) => {
        positions[ag.id] = getNodeScreenPos(ag, width, height);
      });

      // Fixed mesh topology topology edges (Ring + Cross links)
      const meshEdges: [string, string][] = [
        ['router-01', 'guardrail-02'],
        ['guardrail-02', 'specialist-03'],
        ['specialist-03', 'synthesizer-04'],
        ['synthesizer-04', 'arbiter-05'],
        ['arbiter-05', 'router-01'],
        ['router-01', 'specialist-03'],
        ['guardrail-02', 'arbiter-05'],
        ['router-01', 'synthesizer-04'],
      ];

      // Draw standard static/ambient mesh links
      meshEdges.forEach(([fromId, toId]) => {
        const p1 = positions[fromId];
        const p2 = positions[toId];
        if (!p1 || !p2) return;

        const isConnectedActive = activeBeams.some(
          (b) =>
            (b.fromNodeId === fromId && b.toNodeId === toId) ||
            (b.fromNodeId === toId && b.toNodeId === fromId)
        );

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);

        // Slight curved tension towards center
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const ctrlX = midX + (centerX - midX) * 0.15;
        const ctrlY = midY + (centerY - midY) * 0.15;

        ctx.quadraticCurveTo(ctrlX, ctrlY, p2.x, p2.y);

        if (isConnectedActive) {
          ctx.strokeStyle = 'rgba(46, 229, 157, 0.35)';
          ctx.lineWidth = 2.5 * zoom;
          ctx.shadowColor = '#2EE59D';
          ctx.shadowBlur = 12;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1.2 * zoom;
        }
        ctx.stroke();
        ctx.restore();
      });

      // 4. Ambient idle particles flowing along mesh edges
      ctx.save();
      ambientParticlesRef.current.forEach((ap) => {
        const edge = meshEdges[ap.edgeIdx % meshEdges.length];
        const p1 = positions[edge[0]];
        const p2 = positions[edge[1]];
        if (!p1 || !p2) return;

        ap.progress = (ap.progress + ap.speed * playbackSpeed) % 1;
        const t = ap.progress;
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const ctrlX = midX + (centerX - midX) * 0.15;
        const ctrlY = midY + (centerY - midY) * 0.15;

        // Quadratic bezier formula
        const px = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * ctrlX + t * t * p2.x;
        const py = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * ctrlY + t * t * p2.y;

        ctx.beginPath();
        ctx.arc(px, py, ap.size * zoom, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(46, 229, 157, 0.22)';
        ctx.fill();
      });
      ctx.restore();

      // 5. Active Directional Particle Beams (When exchanging payloads)
      activeBeams.forEach((beam) => {
        const p1 = positions[beam.fromNodeId];
        const p2 = positions[beam.toNodeId];
        if (!p1 || !p2) return;

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const ctrlX = midX + (centerX - midX) * 0.25;
        const ctrlY = midY + (centerY - midY) * 0.25;

        // Glowing Laser Conduit
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(ctrlX, ctrlY, p2.x, p2.y);

        ctx.strokeStyle = beam.color;
        ctx.lineWidth = 3.5 * zoom;
        ctx.shadowColor = beam.color;
        ctx.shadowBlur = 18;
        ctx.stroke();

        // Inner intense white core
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2 * zoom;
        ctx.shadowBlur = 4;
        ctx.stroke();
        ctx.restore();

        // Directional Particles along the bezier path
        beam.particles.forEach((particle) => {
          particle.progress = (particle.progress + particle.speed * playbackSpeed) % 1;
          const t = particle.progress;

          // Position on quadratic bezier
          const px = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * ctrlX + t * t * p2.x;
          const py = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * ctrlY + t * t * p2.y;

          // Tangent vector for directional tail
          const dx = 2 * (1 - t) * (ctrlX - p1.x) + 2 * t * (p2.x - ctrlX);
          const dy = 2 * (1 - t) * (ctrlY - p1.y) + 2 * t * (p2.y - ctrlY);
          const length = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = dx / length;
          const ny = dy / length;

          const tailLen = 18 * zoom;

          ctx.save();
          // Tail streak
          const grad = ctx.createLinearGradient(px, py, px - nx * tailLen, py - ny * tailLen);
          grad.addColorStop(0, beam.color);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - nx * tailLen, py - ny * tailLen);
          ctx.strokeStyle = grad;
          ctx.lineWidth = particle.size * zoom;
          ctx.stroke();

          // Glowing Particle Head
          ctx.beginPath();
          ctx.arc(px, py, particle.size * zoom, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = beam.color;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.restore();
        });

        // Floating dynamic payload badge over the conduit center
        ctx.save();
        const badgeX = (p1.x + 2 * ctrlX + p2.x) / 4;
        const badgeY = (p1.y + 2 * ctrlY + p2.y) / 4 - 18 * zoom;

        ctx.font = `600 ${Math.max(10, 11 * zoom)}px JetBrains Mono, monospace`;
        const textWidth = ctx.measureText(beam.label).width;
        const padX = 10 * zoom;
        const padY = 5 * zoom;

        ctx.fillStyle = 'rgba(8, 9, 12, 0.88)';
        ctx.strokeStyle = beam.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
          badgeX - textWidth / 2 - padX,
          badgeY - 10 * zoom - padY,
          textWidth + padX * 2,
          18 * zoom + padY * 2,
          6 * zoom
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(beam.label, badgeX, badgeY);
        ctx.restore();
      });

      // 6. Render Agent Nodes
      agents.forEach((agent) => {
        const pos = positions[agent.id];
        if (!pos) return;

        const isSelected = selectedAgentId === agent.id;
        const isHovered = hoveredAgent?.id === agent.id;
        const isActive = agent.status !== 'idle';
        const nodeRadius = (isSelected ? 46 : isHovered ? 43 : 38) * zoom;

        ctx.save();

        // Dynamic Outer Pulse / Aura
        if (isActive || isSelected) {
          const pulseTime = Date.now() * 0.003;
          const pulseR = nodeRadius + (Math.sin(pulseTime) + 1) * 8 * zoom;

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = agent.glowColor;
          ctx.lineWidth = 2 * zoom;
          ctx.stroke();
        }

        // Confidence Arc Ring (0% - 100%)
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius + 7 * zoom, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)';
        ctx.lineWidth = 3.5 * zoom;
        ctx.stroke();

        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (agent.confidence / 100) * (Math.PI * 2);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius + 7 * zoom, startAngle, endAngle);
        ctx.strokeStyle = agent.color;
        ctx.lineWidth = 3.5 * zoom;
        ctx.shadowColor = agent.color;
        ctx.shadowBlur = 10;
        ctx.stroke();

        // Main Node Glass Disk
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected
          ? 'rgba(20, 27, 38, 0.95)'
          : isHovered
          ? 'rgba(16, 21, 30, 0.92)'
          : 'rgba(11, 15, 22, 0.88)';
        ctx.fill();

        ctx.strokeStyle = isSelected
          ? '#FFFFFF'
          : isHovered
          ? agent.color
          : 'rgba(255, 255, 255, 0.16)';
        ctx.lineWidth = (isSelected ? 2.5 : 1.5) * zoom;
        ctx.stroke();

        // Inner archetype icon/symbol representation
        ctx.save();
        ctx.fillStyle = agent.color;
        ctx.shadowColor = agent.color;
        ctx.shadowBlur = 8;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `700 ${14 * zoom}px JetBrains Mono, monospace`;

        const shortCode =
          agent.archetype === 'ROUTER'
            ? 'RT'
            : agent.archetype === 'SPECIALIST'
            ? 'SP'
            : agent.archetype === 'SYNTHESIZER'
            ? 'SY'
            : agent.archetype === 'GUARDRAIL'
            ? 'GD'
            : 'AR';

        ctx.fillText(shortCode, pos.x, pos.y - 2 * zoom);
        ctx.restore();

        // Agent Name Label below node
        ctx.font = `600 ${12 * zoom}px system-ui, sans-serif`;
        ctx.fillStyle = '#F9FAFB';
        ctx.textAlign = 'center';
        ctx.fillText(agent.name, pos.x, pos.y + nodeRadius + 24 * zoom);

        // Archetype Badge Pill
        const pillY = pos.y + nodeRadius + 38 * zoom;
        ctx.font = `500 ${9.5 * zoom}px JetBrains Mono, monospace`;
        const roleText = agent.archetype;
        const roleWidth = ctx.measureText(roleText).width;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(
          pos.x - roleWidth / 2 - 8 * zoom,
          pillY - 8 * zoom,
          roleWidth + 16 * zoom,
          16 * zoom,
          8 * zoom
        );
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = agent.color;
        ctx.fillText(roleText, pos.x, pillY + 3.5 * zoom);

        // Live status dot
        const statusColor =
          agent.status === 'analyzing'
            ? '#38BDF8'
            : agent.status === 'verifying'
            ? '#F59E0B'
            : agent.status === 'synthesizing'
            ? '#2EE59D'
            : agent.status === 'committed'
            ? '#2EE59D'
            : agent.status === 'quorum_voting'
            ? '#F43F5E'
            : '#71717A';

        ctx.beginPath();
        ctx.arc(pos.x - roleWidth / 2 - 2 * zoom, pillY, 2.5 * zoom, 0, Math.PI * 2);
        ctx.fillStyle = statusColor;
        ctx.fill();

        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    agents,
    activeBeams,
    selectedAgentId,
    hoveredAgent,
    pan,
    zoom,
    playbackSpeed,
    getNodeScreenPos,
  ]);

  // Mouse Interaction: Hover & Click Detection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDragging) {
      setPan((prev) => ({
        x: prev.x + (x - dragStart.x),
        y: prev.y + (y - dragStart.y),
      }));
      setDragStart({ x, y });
      return;
    }

    // Node hit testing
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    let found: AgentNode | null = null;

    for (const ag of agents) {
      const pos = getNodeScreenPos(ag, width, height);
      const dist = Math.hypot(pos.x - x, pos.y - y);
      if (dist <= 48 * zoom) {
        found = ag;
        break;
      }
    }

    setHoveredAgent(found);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (hoveredAgent) {
      selectAgent(hoveredAgent.id);
      return;
    }

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom((z) => Math.min(2.2, Math.max(0.65, z + delta)));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Node hit testing on touch
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    let found: AgentNode | null = null;
    for (const ag of agents) {
      const pos = getNodeScreenPos(ag, width, height);
      const dist = Math.hypot(pos.x - x, pos.y - y);
      if (dist <= 52 * zoom) {
        found = ag;
        break;
      }
    }

    if (found) {
      selectAgent(found.id);
      return;
    }

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isDragging || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setPan((prev) => ({
      x: prev.x + (x - dragStart.x),
      y: prev.y + (y - dragStart.y),
    }));
    setDragStart({ x, y });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] sm:min-h-[520px] overflow-hidden bg-canvas select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair block touch-none"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredAgent(null);
        }}
        onWheel={handleWheel}
      />

      {/* Floating Canvas Controls Toolbar */}
      <div className="absolute bottom-5 left-5 flex items-center gap-1.5 p-1.5 rounded-xl bg-canvas-card/85 backdrop-blur-xl border border-white/10 shadow-glass-card z-10">
        <button
          onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
          title="Zoom In"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.65, z - 0.15))}
          title="Zoom Out"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-0.5" />
        <button
          onClick={handleResetView}
          title="Reset Topology Viewport"
          className="p-2 rounded-lg text-zinc-400 hover:text-mint hover:bg-white/10 transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="px-2 text-[11px] font-mono text-zinc-400">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Top Topology Legend & Status Watermark */}
      <div className="absolute top-5 left-5 pointer-events-none z-10">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-canvas-card/75 backdrop-blur-xl border border-white/10">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                simulationStatus === 'running' ? 'bg-mint' : 'bg-cyan-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                simulationStatus === 'running' ? 'bg-mint' : 'bg-cyan-400'
              }`}
            />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300">
            Topology Engine: 5 Nodes • Canvas 2D Core
          </span>
        </div>
      </div>

      {/* High-Tech HUD Tooltip on Agent Hover */}
      {hoveredAgent && (
        <div
          className="fixed pointer-events-none z-50 p-3.5 rounded-xl bg-canvas-deep/95 backdrop-blur-2xl border border-white/15 shadow-2xl max-w-xs transition-opacity duration-150"
          style={{
            left: `${mousePos.x + 16}px`,
            top: `${mousePos.y + 16}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: hoveredAgent.color }}
              />
              <span className="font-semibold text-sm text-white">
                {hoveredAgent.name}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-300 uppercase">
              {hoveredAgent.archetype}
            </span>
          </div>

          <div className="text-[11px] text-zinc-400 mb-2 leading-relaxed line-clamp-2">
            {hoveredAgent.tagline}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-white/5 p-2 rounded-lg mb-2">
            <div>
              <span className="text-zinc-500">CONFIDENCE</span>
              <div className="text-white font-semibold">
                {hoveredAgent.confidence}%
              </div>
            </div>
            <div>
              <span className="text-zinc-500">LATENCY</span>
              <div className="text-white font-semibold">
                {hoveredAgent.latencyMs}ms
              </div>
            </div>
            <div>
              <span className="text-zinc-500">STATUS</span>
              <div className="text-mint font-semibold uppercase">
                {hoveredAgent.status}
              </div>
            </div>
            <div>
              <span className="text-zinc-500">TOKENS</span>
              <div className="text-white font-semibold">
                {hoveredAgent.tokenCount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-mint font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Click node to open Deep Inspection Panel</span>
          </div>
        </div>
      )}
    </div>
  );
}
