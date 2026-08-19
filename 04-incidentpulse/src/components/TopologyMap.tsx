import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import type { ServiceNode } from '../types/incident';
import {
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
} from 'lucide-react';

export const TopologyMap: React.FC = () => {
  const { services, selectedService, setSelectedService, triggerAnomaly, healAllServices } = useIncident();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const getNodeColor = (status: ServiceNode['status']) => {
    switch (status) {
      case 'operational':
        return '#10b981';
      case 'degraded':
        return '#f59e0b';
      case 'outage':
        return '#ef4444';
      case 'maintenance':
        return '#8b5cf6';
    }
  };

  const getNodeBg = (status: ServiceNode['status']) => {
    switch (status) {
      case 'operational':
        return 'rgba(16, 185, 129, 0.08)';
      case 'degraded':
        return 'rgba(245, 158, 11, 0.14)';
      case 'outage':
        return 'rgba(239, 68, 68, 0.2)';
      case 'maintenance':
        return 'rgba(139, 92, 246, 0.14)';
    }
  };

  // Node dimensions in SVG coordinate space
  const nodeWidth = 200;
  const nodeHeight = 90;

  // Generate connection links between services based on dependencies
  const links: Array<{
    source: ServiceNode;
    target: ServiceNode;
    isDegraded: boolean;
    isOutage: boolean;
  }> = [];

  services.forEach((src) => {
    src.dependencies.forEach((depId) => {
      const tgt = services.find((s) => s.id === depId);
      if (tgt) {
        links.push({
          source: src,
          target: tgt,
          isDegraded: src.status === 'degraded' || tgt.status === 'degraded',
          isOutage: src.status === 'outage' || tgt.status === 'outage',
        });
      }
    });
  });

  return (
    <div className="card-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header & Fast Chaos Injection Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Microservice Topology Mesh</h2>
            <span
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            >
              10 Services · Directed Dependency Graph
            </span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Interactive dependency map with animated live traffic flow. Click any service to inspect metrics or trigger pod remediation.
          </p>
        </div>

        {/* Action Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => triggerAnomaly('anomaly-5xx-payments')}
            className="btn btn-sm"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)' }}
            title="Simulate 504 Gateway Flood on Payments Service"
          >
            <Zap size={13} />
            <span>504 Flood (Payments)</span>
          </button>

          <button
            onClick={() => triggerAnomaly('anomaly-latency-auth')}
            className="btn btn-sm"
            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.08)' }}
            title="Simulate Latency Spike on Auth Service"
          >
            <Zap size={13} />
            <span>Latency Surge (Auth)</span>
          </button>

          <button
            onClick={() => triggerAnomaly('anomaly-deadlock-postgres')}
            className="btn btn-sm"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171', background: 'rgba(239, 68, 68, 0.08)' }}
            title="Simulate PostgreSQL Lock Contention"
          >
            <Zap size={13} />
            <span>DB Deadlock (Postgres)</span>
          </button>

          <button
            onClick={healAllServices}
            className="btn btn-sm btn-emerald"
            title="Reset and stabilize all services to operational"
          >
            <RotateCcw size={13} />
            <span>Heal All</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '620px',
          background: 'radial-gradient(ellipse at center, rgba(14, 23, 38, 0.8) 0%, rgba(6, 9, 14, 0.95) 100%)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        {/* Background Grid Lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Tier Columns Header Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 80px 0 60px',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            INGRESS / EDGE
          </span>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginLeft: '-40px' }}>
            CORE DOMAIN SERVICES
          </span>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            STATE & STORAGE MESH
          </span>
        </div>

        {/* Unified SVG Canvas for Wires and Nodes */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 3,
          }}
          viewBox="0 0 1140 620"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="healthyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="degradedFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="outageFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="1" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Render Connection Curves */}
          {links.map((link, idx) => {
            const startX = link.source.x + nodeWidth;
            const startY = link.source.y + nodeHeight / 2;
            const endX = link.target.x;
            const endY = link.target.y + nodeHeight / 2;

            const dx = endX - startX;
            const cpx1 = startX + dx * 0.45;
            const cpy1 = startY;
            const cpx2 = endX - dx * 0.45;
            const cpy2 = endY;

            const pathD = `M ${startX} ${startY} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${endX} ${endY}`;
            const strokeColor = link.isOutage ? '#ef4444' : link.isDegraded ? '#f59e0b' : 'rgba(6, 182, 212, 0.45)';
            const strokeWidth = link.isOutage ? 3 : link.isDegraded ? 2.5 : 1.8;
            const isTargetHovered = hoveredNode === link.target.id || hoveredNode === link.source.id;

            return (
              <g key={`link-${idx}`}>
                {/* Background base wire */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isTargetHovered ? strokeWidth + 1 : strokeWidth}
                  strokeOpacity={link.isOutage ? 0.9 : isTargetHovered ? 0.8 : 0.4}
                />

                {/* Animated dash flow */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={link.isOutage ? '#f87171' : link.isDegraded ? '#fbbf24' : '#38bdf8'}
                  strokeWidth={strokeWidth + 0.5}
                  strokeDasharray="6 14"
                  className="animate-flow"
                  filter={link.isOutage || link.isDegraded ? 'url(#glow)' : undefined}
                />

                {/* Source and Target Connector Pins */}
                <circle
                  cx={startX}
                  cy={startY}
                  r={3.5}
                  fill={strokeColor}
                  stroke="#080d15"
                  strokeWidth={1}
                />
                <circle
                  cx={endX}
                  cy={endY}
                  r={3.5}
                  fill={strokeColor}
                  stroke="#080d15"
                  strokeWidth={1}
                />
              </g>
            );
          })}

          {/* 2. Render Microservice Nodes via foreignObject for 1:1 Coordinate Locking */}
          {services.map((svc) => {
            const isSelected = selectedService?.id === svc.id;
            const isHovered = hoveredNode === svc.id;
            const color = getNodeColor(svc.status);
            const bgColor = getNodeBg(svc.status);
            const isOutage = svc.status === 'outage';
            const isDegraded = svc.status === 'degraded';

            return (
              <foreignObject
                key={svc.id}
                x={svc.x}
                y={svc.y}
                width={nodeWidth}
                height={nodeHeight}
                style={{ overflow: 'visible' }}
              >
                <div
                  onClick={() => setSelectedService(svc)}
                  onMouseEnter={() => setHoveredNode(svc.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    width: `${nodeWidth}px`,
                    height: `${nodeHeight}px`,
                    background: isSelected ? 'rgba(18, 28, 45, 0.96)' : bgColor,
                    border: `1.5px solid ${isSelected ? '#38bdf8' : color}`,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    boxShadow: isOutage
                      ? '0 0 24px rgba(239, 68, 68, 0.45), inset 0 0 12px rgba(239, 68, 68, 0.2)'
                      : isDegraded
                      ? '0 0 16px rgba(245, 158, 11, 0.35)'
                      : isSelected
                      ? '0 0 22px rgba(6, 182, 212, 0.45)'
                      : '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered || isSelected ? 'scale(1.03)' : 'scale(1)',
                    backdropFilter: 'blur(12px)',
                    position: 'relative',
                    boxSizing: 'border-box',
                    userSelect: 'none',
                  }}
                >
                  {/* Outage Radiating Shockwave Ring */}
                  {isOutage && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        borderRadius: '14px',
                        border: '2px solid #ef4444',
                        animation: 'pulse-ring 1.5s infinite ease-out',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Title & Status Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          boxShadow: `0 0 8px ${color}`,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '140px',
                        }}
                      >
                        {svc.name}
                      </span>
                    </div>

                    {isOutage ? (
                      <Flame size={13} color="#ef4444" style={{ flexShrink: 0 }} />
                    ) : isDegraded ? (
                      <AlertTriangle size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
                    ) : (
                      <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0 }} />
                    )}
                  </div>

                  {/* Latency & Error Rate Stats */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span className="font-mono" style={{ color: svc.latencyMs > 200 ? '#ef4444' : svc.latencyMs > 80 ? '#f59e0b' : '#38bdf8', fontWeight: 600 }}>
                      ⚡ {svc.latencyMs}ms
                    </span>
                    <span className="font-mono" style={{ color: svc.errorRate > 1.0 ? '#ef4444' : 'var(--text-muted)' }}>
                      Err: {svc.errorRate}%
                    </span>
                  </div>

                  {/* CPU Load Progress Bar */}
                  <div style={{ marginTop: '5px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${svc.cpuUsage}%`,
                          height: '100%',
                          background: svc.cpuUsage > 80 ? '#ef4444' : svc.cpuUsage > 60 ? '#f59e0b' : '#10b981',
                        }}
                      />
                    </div>
                    <span className="font-mono" style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                      CPU {svc.cpuUsage}%
                    </span>
                  </div>
                </div>
              </foreignObject>
            );
          })}
        </svg>

        {/* Bottom Status Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'rgba(10, 16, 26, 0.88)',
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backdropFilter: 'blur(8px)',
            zIndex: 5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#10b981' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Operational
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#f59e0b' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            Degraded (P99 Spike)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#ef4444' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            Major Outage (5xx Rate)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#8b5cf6' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
            Maintenance / Restart
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '16px',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 5,
          }}
        >
          <Info size={13} />
          <span>Click any node to open Telemetry Inspector & Remediation</span>
        </div>
      </div>
    </div>
  );
};
