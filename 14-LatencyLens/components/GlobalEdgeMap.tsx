'use client';

import React, { useState } from 'react';
import { useLatencyStore } from '../store/useLatencyStore';
import {
  REAL_WORLD_LAND_PATH,
  REAL_WORLD_BORDERS_PATH,
  REAL_WORLD_GRATICULE_PATH,
} from '../data/edgeData';
import { EdgePoP, ClientOrigin } from '../types/edge';
import {
  Globe,
  Radio,
  MapPin,
  Route,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Server,
} from 'lucide-react';

export default function GlobalEdgeMap() {
  const clientOrigins = useLatencyStore((state) => state.clientOrigins);
  const selectedOrigin = useLatencyStore((state) => state.selectedOrigin);
  const setSelectedOrigin = useLatencyStore((state) => state.setSelectedOrigin);
  const edgePoPs = useLatencyStore((state) => state.edgePoPs);
  const targetPoP = useLatencyStore((state) => state.targetPoP);
  const geodesicDistanceKm = useLatencyStore((state) => state.geodesicDistanceKm);
  const fiberRttMs = useLatencyStore((state) => state.fiberRttMs);
  const transitHops = useLatencyStore((state) => state.transitHops);
  const isProbing = useLatencyStore((state) => state.isProbing);

  const [hoveredPoP, setHoveredPoP] = useState<EdgePoP | null>(null);

  // Bezier curve control points between origin and target PoP
  const x1 = selectedOrigin.svgCoords.x;
  const y1 = selectedOrigin.svgCoords.y;
  const x2 = targetPoP.svgCoords.x;
  const y2 = targetPoP.svgCoords.y;

  // Midpoint with curve arc
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - Math.min(80, Math.abs(x2 - x1) * 0.25 + 30);
  const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

  return (
    <div className="w-full rounded-2xl bg-canvas-card border border-canvas-border shadow-telemetry-card p-4 sm:p-6 select-none space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-canvas-borderSubtle pb-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-telemetry-teal" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Global Anycast Routing & Edge Topology
            </h2>
            <p className="text-xs text-zinc-400">
              Select a client origin to trace BGP Anycast ingress to the lowest-latency edge data center.
            </p>
          </div>
        </div>

        {/* Anycast Route HUD pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-canvas-surface border border-canvas-border text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-telemetry-teal animate-pulse" />
          <span className="text-zinc-400">Ingress:</span>
          <span className="text-white font-bold">{selectedOrigin.city}</span>
          <ArrowRight className="w-3.5 h-3.5 text-telemetry-teal" />
          <span className="text-telemetry-tealNeon font-bold">{targetPoP.iata}</span>
        </div>
      </div>

      {/* Origin Selection Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-mono text-zinc-400 mr-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-telemetry-cyan" /> Origin:
        </span>
        {clientOrigins.map((origin) => {
          const isSelected = selectedOrigin.id === origin.id;
          return (
            <button
              key={origin.id}
              onClick={() => setSelectedOrigin(origin)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
                isSelected
                  ? 'bg-telemetry-teal/20 text-telemetry-tealNeon border-telemetry-teal shadow-glow-teal font-bold'
                  : 'bg-canvas-surface text-zinc-400 border-canvas-border hover:text-white hover:border-zinc-500'
              }`}
            >
              {origin.city} <span className="text-[10px] text-zinc-500">({origin.asn})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive World Map Canvas Container */}
      <div className="relative w-full aspect-[960/480] min-h-[280px] max-h-[460px] rounded-xl bg-canvas-deep border border-canvas-border overflow-hidden flex items-center justify-center">
        {/* Subtle Background Graticule Grid */}
        <div className="absolute inset-0 bg-telemetry-grid opacity-30 pointer-events-none" />

        {/* SVG World Map */}
        <svg
          viewBox="0 0 960 500"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradient for Anycast flight paths */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="1" />
            </linearGradient>

            {/* Radial glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Authentic Geographic Graticules (Parallels & Meridians) */}
          <path
            d={REAL_WORLD_GRATICULE_PATH}
            fill="none"
            stroke="#21262D"
            strokeWidth="0.6"
            strokeDasharray="2 2"
            opacity="0.8"
          />

          {/* Real World Landmasses (Natural Earth Coastlines & Islands) */}
          <path
            d={REAL_WORLD_LAND_PATH}
            fill="#161B22"
            stroke="#30363D"
            strokeWidth="0.9"
            strokeLinejoin="round"
            className="transition-colors hover:fill-[#1b222c]"
          />

          {/* Real World International Country Borders */}
          <path
            d={REAL_WORLD_BORDERS_PATH}
            fill="none"
            stroke="#262C36"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.85"
          />

          {/* Inter-PoP Optical Backbone Mesh (Thin Fiber Lines) */}
          <g stroke="#14B8A6" strokeWidth="0.75" strokeOpacity="0.18" strokeDasharray="3 3">
            <line x1={edgePoPs[0].svgCoords.x} y1={edgePoPs[0].svgCoords.y} x2={edgePoPs[1].svgCoords.x} y2={edgePoPs[1].svgCoords.y} />
            <line x1={edgePoPs[1].svgCoords.x} y1={edgePoPs[1].svgCoords.y} x2={edgePoPs[2].svgCoords.x} y2={edgePoPs[2].svgCoords.y} />
            <line x1={edgePoPs[2].svgCoords.x} y1={edgePoPs[2].svgCoords.y} x2={edgePoPs[5].svgCoords.x} y2={edgePoPs[5].svgCoords.y} />
            <line x1={edgePoPs[5].svgCoords.x} y1={edgePoPs[5].svgCoords.y} x2={edgePoPs[4].svgCoords.x} y2={edgePoPs[4].svgCoords.y} />
            <line x1={edgePoPs[4].svgCoords.x} y1={edgePoPs[4].svgCoords.y} x2={edgePoPs[3].svgCoords.x} y2={edgePoPs[3].svgCoords.y} />
            <line x1={edgePoPs[3].svgCoords.x} y1={edgePoPs[3].svgCoords.y} x2={edgePoPs[0].svgCoords.x} y2={edgePoPs[0].svgCoords.y} />
          </g>

          {/* Active Geodesic Anycast Route (Flight Arc) */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="anycast-flow-line"
          />

          {/* Glowing Animated Beacon along the curve */}
          <circle r="4" fill="#5EEAD4" filter="url(#glow)">
            <animateMotion
              path={pathD}
              dur="1.8s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </circle>

          {/* Ingress Client Origin Point */}
          <g transform={`translate(${selectedOrigin.svgCoords.x}, ${selectedOrigin.svgCoords.y})`}>
            <circle r="12" fill="none" stroke="#06B6D4" strokeWidth="1.5" className="beacon-pulse" />
            <circle r="5" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="1.5" />
            <text
              x="0"
              y="-10"
              textAnchor="middle"
              className="text-[10px] font-mono font-bold fill-cyan-300"
              style={{ textShadow: '0 0 4px #000' }}
            >
              {selectedOrigin.city}
            </text>
          </g>

          {/* 6 Global Edge PoP Points */}
          {edgePoPs.map((pop) => {
            const isTarget = targetPoP.id === pop.id;
            return (
              <g
                key={pop.id}
                transform={`translate(${pop.svgCoords.x}, ${pop.svgCoords.y})`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredPoP(pop)}
                onMouseLeave={() => setHoveredPoP(null)}
              >
                {/* Active Target Radar Waves */}
                {isTarget && (
                  <>
                    <circle r="20" fill="none" stroke="#14B8A6" strokeWidth="1.5" className="beacon-pulse" />
                    <circle r="10" fill="none" stroke="#2DD4BF" strokeWidth="1" opacity="0.6" />
                  </>
                )}

                {/* PoP Core Node */}
                <circle
                  r={isTarget ? 6 : 4.5}
                  fill={isTarget ? '#14B8A6' : '#2DD4BF'}
                  stroke="#FFFFFF"
                  strokeWidth={isTarget ? 2 : 1}
                  className="transition-all group-hover:scale-125"
                  filter={isTarget ? 'url(#glow)' : undefined}
                />

                {/* PoP Badge / IATA Code */}
                <rect
                  x="-18"
                  y="9"
                  width="36"
                  height="16"
                  rx="4"
                  fill="#0D1117"
                  stroke={isTarget ? '#14B8A6' : '#30363D'}
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x="0"
                  y="21"
                  textAnchor="middle"
                  className={`text-[9px] font-mono font-bold ${
                    isTarget ? 'fill-[#5EEAD4]' : 'fill-zinc-300'
                  }`}
                >
                  {pop.iata}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered PoP Overlay Card */}
        {hoveredPoP && (
          <div className="absolute bottom-3 left-3 p-3 rounded-xl bg-canvas-surface/95 border border-telemetry-teal/40 shadow-glow-teal backdrop-blur-md text-xs font-mono space-y-1 z-20 pointer-events-none">
            <div className="flex items-center gap-2 text-white font-bold">
              <Server className="w-3.5 h-3.5 text-telemetry-teal" />
              <span>{hoveredPoP.city} ({hoveredPoP.iata})</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                {hoveredPoP.status}
              </span>
            </div>
            <div className="text-zinc-400 text-[11px]">
              Region: {hoveredPoP.region} | Capacity: {hoveredPoP.capacityTbps} Tbps
            </div>
            <div className="text-telemetry-tealLight text-[11px]">
              {hoveredPoP.asn} • {hoveredPoP.tier1Peers} Tier-1 IXP Peers
            </div>
          </div>
        )}
      </div>

      {/* Anycast Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs font-mono">
        <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border">
          <span className="text-zinc-500 block text-[10px] uppercase">Geodesic Distance</span>
          <span className="text-white font-bold text-sm flex items-center gap-1.5 mt-0.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            {geodesicDistanceKm.toLocaleString()} km
          </span>
        </div>

        <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border">
          <span className="text-zinc-500 block text-[10px] uppercase">Fiber Optic RTT</span>
          <span className="text-telemetry-tealNeon font-bold text-sm flex items-center gap-1.5 mt-0.5">
            <Zap className="w-3.5 h-3.5 text-telemetry-teal" />
            {fiberRttMs} ms
          </span>
        </div>

        <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border">
          <span className="text-zinc-500 block text-[10px] uppercase">Transit BGP Hops</span>
          <span className="text-telemetry-cyan font-bold text-sm flex items-center gap-1.5 mt-0.5">
            <Route className="w-3.5 h-3.5 text-telemetry-cyan" />
            {transitHops} Autonomous Systems
          </span>
        </div>

        <div className="p-3 rounded-xl bg-canvas-surface border border-canvas-border">
          <span className="text-zinc-500 block text-[10px] uppercase">Anycast Subnet</span>
          <span className="text-white font-bold text-sm flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {targetPoP.ipPrefix}
          </span>
        </div>
      </div>
    </div>
  );
}
