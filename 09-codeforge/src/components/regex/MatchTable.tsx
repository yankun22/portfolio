import React from 'react';
import type { RegexMatchResult } from '../../types/regex';

interface MatchTableProps {
  matches: RegexMatchResult[];
}

export const MatchTable: React.FC<MatchTableProps> = ({ matches }) => {
  if (matches.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
        No pattern matches found in the test string.
      </div>
    );
  }

  // Determine max capture groups count
  const maxGroups = matches.reduce((m, item) => Math.max(m, item.groups.length), 0);

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
        <thead>
          <tr style={{ background: 'var(--bg-card)', textAlign: 'left', borderBottom: '1px solid var(--border-medium)' }}>
            <th style={{ padding: '8px 12px', width: 60 }}>#</th>
            <th style={{ padding: '8px 12px' }}>Full Match</th>
            <th style={{ padding: '8px 12px', width: 90 }}>Range</th>
            {Array.from({ length: maxGroups }).map((_, idx) => (
              <th key={idx} style={{ padding: '8px 12px' }}>
                Group ${idx + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matches.map((m, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{idx + 1}</td>
              <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '2px 6px', borderRadius: 4 }}>
                  {m.fullMatch}
                </span>
              </td>
              <td style={{ padding: '8px 12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {m.index}..{m.index + m.length}
              </td>

              {Array.from({ length: maxGroups }).map((_, gIdx) => {
                const grp = m.groups[gIdx];
                return (
                  <td key={gIdx} style={{ padding: '8px 12px' }}>
                    {grp ? (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: `${grp.color}20`,
                          color: grp.color,
                          fontWeight: 700,
                          border: `1px solid ${grp.color}40`
                        }}
                      >
                        {grp.value}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)' }}>—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
