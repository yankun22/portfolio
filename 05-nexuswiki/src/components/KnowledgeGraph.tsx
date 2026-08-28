import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useWiki } from '../context/WikiContext';
import type { GraphNode, GraphLink } from '../types/wiki';
import {
  Maximize2,
  Minimize2,
  Sliders,
  Layers,
} from 'lucide-react';

export const KnowledgeGraph: React.FC = () => {
  const {
    graphNodes,
    graphLinks,
    activeNoteId,
    setActiveNoteId,
    setHoveredNodeId,
    physicsSettings,
    setPhysicsSettings,
    viewMode,
    setViewMode,
  } = useWiki();

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState<boolean>(false);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Create container group for zoom & pan
    const g = svg.append('g').attr('class', 'graph-root');

    // Setup D3 Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Filter nodes if hide orphans
    const activeNodes: GraphNode[] = physicsSettings.showOrphans
      ? graphNodes.map((d) => ({ ...d }))
      : graphNodes.filter((d) => d.degree > 0).map((d) => ({ ...d }));

    const nodeIds = new Set(activeNodes.map((n) => n.id));
    const activeLinks: GraphLink[] = graphLinks
      .filter((l) => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        return nodeIds.has(srcId) && nodeIds.has(tgtId);
      })
      .map((l) => ({ ...l }));

    // Adapt simulation parameters for mobile screens
    const isMobile = window.innerWidth < 768;
    const mobileScale = isMobile ? 0.65 : 1;

    // Setup D3 Force Simulation
    const simulation = d3
      .forceSimulation<GraphNode>(activeNodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphLink>(activeLinks)
          .id((d) => d.id)
          .distance(physicsSettings.linkDistance * mobileScale)
      )
      .force('charge', d3.forceManyBody().strength(physicsSettings.chargeStrength * mobileScale))
      .force('collide', d3.forceCollide().radius((d: any) => ((d.radius || 6) * mobileScale) + physicsSettings.collisionRadius * 0.4))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .alphaDecay(0.028);

    // Defs: Gradients and Glow filters
    const defs = svg.append('defs');
    const filter = defs.append('filter').attr('id', 'node-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    filter.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic']).enter().append('feMergeNode').attr('in', (d) => d);

    // 1. Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup
      .selectAll('line')
      .data(activeLinks)
      .enter()
      .append('line')
      .attr('stroke', 'rgba(212, 175, 55, 0.3)')
      .attr('stroke-width', 1.5)
      .attr('stroke-linecap', 'round');

    // 2. Draw Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup
      .selectAll('g')
      .data(activeNodes)
      .enter()
      .append('g')
      .attr('class', 'node-item')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node outer halo for active / ghost notes
    node
      .append('circle')
      .attr('r', (d) => (d.radius || 6) + 4)
      .attr('fill', 'transparent')
      .attr('stroke', (d) => (d.id === activeNoteId ? '#d4af37' : d.isGhost ? '#52525b' : d.color || '#e5c07b'))
      .attr('stroke-width', (d) => (d.id === activeNoteId ? 2 : 1))
      .attr('stroke-opacity', (d) => (d.id === activeNoteId ? 0.95 : 0.35))
      .attr('stroke-dasharray', (d) => (d.isGhost ? '3 3' : 'none'));

    // Node core circle
    node
      .append('circle')
      .attr('r', (d) => d.radius || 6)
      .attr('fill', (d) => (d.isGhost ? '#18181b' : d.id === activeNoteId ? '#d4af37' : d.color || '#e5c07b'))
      .attr('filter', (d) => (d.id === activeNoteId || d.degree >= 3 ? 'url(#node-glow)' : 'none'))
      .attr('stroke', '#060709')
      .attr('stroke-width', 1.5);

    // Node Labels
    node
      .append('text')
      .text((d) => d.title)
      .attr('x', (d) => (d.radius || 6) + 6)
      .attr('y', 4)
      .attr('fill', (d) => (d.id === activeNoteId ? '#ffffff' : '#a1a1aa'))
      .attr('font-size', (d) => (d.id === activeNoteId ? '11px' : '9.5px'))
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('font-weight', (d) => (d.id === activeNoteId ? 700 : 500))
      .attr('pointer-events', 'none')
      .style('text-shadow', '0 1px 4px rgba(0,0,0,0.8)');

    // Node Click & Hover Interactions
    node
      .on('click', (_event, d) => {
        if (!d.isGhost) {
          setActiveNoteId(d.id);
        }
      })
      .on('mouseenter', (_event, d) => {
        setHoveredNodeId(d.id);
        // Highlight connected cluster
        const connectedNodeIds = new Set<string>([d.id]);
        activeLinks.forEach((l: any) => {
          const srcId = l.source.id || l.source;
          const tgtId = l.target.id || l.target;
          if (srcId === d.id) connectedNodeIds.add(tgtId);
          if (tgtId === d.id) connectedNodeIds.add(srcId);
        });

        // Dim non-connected elements
        node.style('opacity', (n) => (connectedNodeIds.has(n.id) ? 1 : 0.18));
        link
          .style('opacity', (l: any) => {
            const srcId = l.source.id || l.source;
            const tgtId = l.target.id || l.target;
            return srcId === d.id || tgtId === d.id ? 1 : 0.08;
          })
          .attr('stroke', (l: any) => {
            const srcId = l.source.id || l.source;
            const tgtId = l.target.id || l.target;
            return srcId === d.id || tgtId === d.id ? '#c084fc' : 'rgba(139, 92, 246, 0.35)';
          })
          .attr('stroke-width', (l: any) => {
            const srcId = l.source.id || l.source;
            const tgtId = l.target.id || l.target;
            return srcId === d.id || tgtId === d.id ? 2.5 : 1.5;
          });
      })
      .on('mouseleave', () => {
        setHoveredNodeId(null);
        node.style('opacity', 1);
        link.style('opacity', 1).attr('stroke', 'rgba(139, 92, 246, 0.35)').attr('stroke-width', 1.5);
      });

    // Simulation Tick Update
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [graphNodes, graphLinks, activeNoteId, physicsSettings, setActiveNoteId, setHoveredNodeId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'radial-gradient(ellipse at center, rgba(14, 21, 35, 0.9) 0%, rgba(6, 9, 14, 0.98) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Grid Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          pointerEvents: 'none',
        }}
      />

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className={physicsSettings.is3dPerspective ? 'graph-3d-perspective' : ''}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      {/* Graph HUD Controls (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setShowControls(!showControls)}
          className="btn btn-sm"
          style={{
            background: showControls ? 'rgba(139, 92, 246, 0.25)' : 'rgba(11, 16, 27, 0.85)',
            borderColor: showControls ? '#8b5cf6' : 'var(--border-subtle)',
            color: showControls ? '#c084fc' : 'var(--text-secondary)',
          }}
          title="Graph Physics Controls"
        >
          <Sliders size={14} />
          <span>Physics HUD</span>
        </button>

        <button
          onClick={() =>
            setPhysicsSettings((prev) => ({ ...prev, is3dPerspective: !prev.is3dPerspective }))
          }
          className="btn btn-sm"
          style={{
            background: physicsSettings.is3dPerspective ? 'rgba(6, 182, 212, 0.25)' : 'rgba(11, 16, 27, 0.85)',
            borderColor: physicsSettings.is3dPerspective ? '#06b6d4' : 'var(--border-subtle)',
            color: physicsSettings.is3dPerspective ? '#38bdf8' : 'var(--text-secondary)',
          }}
          title="Toggle 3D Perspective Tilt"
        >
          <Layers size={14} />
          <span>{physicsSettings.is3dPerspective ? '3D View' : '2D View'}</span>
        </button>

        <button
          onClick={() => setViewMode(viewMode === 'graph-full' ? 'split' : 'graph-full')}
          className="btn btn-sm"
          style={{ background: 'rgba(11, 16, 27, 0.85)' }}
          title={viewMode === 'graph-full' ? 'Exit Fullscreen Graph' : 'Fullscreen Graph'}
        >
          {viewMode === 'graph-full' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* Physics Controls Floating Panel */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            top: '56px',
            right: '16px',
            width: '260px',
            background: 'rgba(10, 15, 26, 0.95)',
            border: '1px solid var(--border-medium)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={14} /> FORCE-DIRECTED PHYSICS
          </div>

          {/* Repulsion / Charge */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Repulsion Charge</span>
              <span className="font-mono">{physicsSettings.chargeStrength}</span>
            </div>
            <input
              type="range"
              min="-400"
              max="-50"
              step="10"
              value={physicsSettings.chargeStrength}
              onChange={(e) => setPhysicsSettings({ ...physicsSettings, chargeStrength: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#8b5cf6' }}
            />
          </div>

          {/* Link Distance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Link Distance</span>
              <span className="font-mono">{physicsSettings.linkDistance}px</span>
            </div>
            <input
              type="range"
              min="40"
              max="200"
              step="5"
              value={physicsSettings.linkDistance}
              onChange={(e) => setPhysicsSettings({ ...physicsSettings, linkDistance: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#8b5cf6' }}
            />
          </div>

          {/* Collision Radius */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Collision Padding</span>
              <span className="font-mono">{physicsSettings.collisionRadius}</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="2"
              value={physicsSettings.collisionRadius}
              onChange={(e) => setPhysicsSettings({ ...physicsSettings, collisionRadius: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#8b5cf6' }}
            />
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={physicsSettings.showOrphans}
                onChange={(e) => setPhysicsSettings({ ...physicsSettings, showOrphans: e.target.checked })}
                style={{ accentColor: '#8b5cf6' }}
              />
              Show Unlinked Orphan Notes
            </label>
          </div>
        </div>
      )}

      {/* Legend Badge (Bottom Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '6px 12px',
          background: 'rgba(10, 15, 26, 0.8)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
          <span>Note Nodes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
          <span>Active Note</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px dashed #64748b', background: '#1e293b' }} />
          <span>Ghost Note</span>
        </div>
      </div>
    </div>
  );
};
