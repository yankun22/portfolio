import React from 'react';
import type { RailroadNode } from '../../types/regex';
import { GROUP_COLORS } from '../../services/regexParser';

interface RailroadDiagramProps {
  ast: RailroadNode;
}

export const RailroadDiagram: React.FC<RailroadDiagramProps> = ({ ast }) => {
  const nodes = ast.children || [];

  if (nodes.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '20px 0' }}>
        Enter a regular expression pattern to generate the railroad syntax diagram.
      </div>
    );
  }

  // Calculate layout dimensions
  const nodeWidth = 110;
  const nodeHeight = 44;
  const nodeGap = 36;
  const startX = 40;
  const startY = 60;

  const totalWidth = startX + nodes.length * (nodeWidth + nodeGap) + 60;
  const totalHeight = 120;

  return (
    <div style={{ width: '100%', overflowX: 'auto', padding: '10px 0' }}>
      <svg
        viewBox={`0 0 ${Math.max(600, totalWidth)} ${totalHeight}`}
        style={{ height: 120, width: Math.max(600, totalWidth), display: 'block' }}
      >
        <defs>
          <linearGradient id="railGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Start Station Circle */}
        <circle cx="20" cy={startY} r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
        <line x1="28" y1={startY} x2={startX} y2={startY} stroke="#06b6d4" strokeWidth="2.5" />

        {/* Connecting Rails & Node Blocks */}
        {nodes.map((node, idx) => {
          const x = startX + idx * (nodeWidth + nodeGap);
          const y = startY - nodeHeight / 2;
          const nextX = x + nodeWidth + nodeGap;

          const isGroup = node.type === 'group';
          const isRange = node.type === 'range';
          const isAnchor = node.type === 'anchor';
          const groupColor = node.groupNumber ? GROUP_COLORS[(node.groupNumber - 1) % GROUP_COLORS.length] : '#8b5cf6';

          const strokeColor = isGroup ? groupColor : isRange ? '#10b981' : isAnchor ? '#f59e0b' : '#38bdf8';

          return (
            <g key={idx}>
              {/* Connecting rail line to next node */}
              <line
                x1={x + nodeWidth}
                y1={startY}
                x2={nextX}
                y2={startY}
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Loop Track for Quantifier (+) or (*) */}
              {node.quantifier && (
                <path
                  d={`M ${x + nodeWidth} ${startY} C ${x + nodeWidth + 14} ${startY + 26}, ${x - 14} ${startY + 26}, ${x} ${startY}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                  strokeDasharray={node.quantifier.greedy ? 'none' : '3,3'}
                />
              )}

              {/* Node Capsule Box */}
              <rect
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                rx={isGroup ? 8 : isRange ? 6 : 10}
                fill="var(--bg-card)"
                stroke={strokeColor}
                strokeWidth={isGroup ? 2 : 1.5}
              />

              {/* Node Title */}
              <text
                x={x + nodeWidth / 2}
                y={y + (node.subLabel || node.quantifier ? 18 : 26)}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="var(--text-primary)"
                fontFamily="var(--font-mono)"
              >
                {node.label.length > 13 ? node.label.slice(0, 12) + '…' : node.label}
              </text>

              {/* Node SubLabel / Quantifier note */}
              {(node.subLabel || node.quantifier) && (
                <text
                  x={x + nodeWidth / 2}
                  y={y + 32}
                  textAnchor="middle"
                  fontSize="8.5"
                  fill={node.quantifier ? '#f59e0b' : 'var(--text-muted)'}
                  fontFamily="var(--font-sans)"
                  fontWeight="600"
                >
                  {node.quantifier ? node.quantifier.text.split(' ')[0] : node.subLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* End Station Double Circle */}
        <circle cx={totalWidth - 30} cy={startY} r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
        <circle cx={totalWidth - 30} cy={startY} r="4" fill="#ffffff" />
      </svg>
    </div>
  );
};
