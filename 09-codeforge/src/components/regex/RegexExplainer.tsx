import React from 'react';
import { explainRegex } from '../../services/regexParser';

interface RegexExplainerProps {
  pattern: string;
}

export const RegexExplainer: React.FC<RegexExplainerProps> = ({ pattern }) => {
  const explanations = explainRegex(pattern);

  if (explanations.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '14px 0', fontSize: '0.8125rem' }}>
        No pattern tokens to explain.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {explanations.map((exp, idx) => (
        <div
          key={idx}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: '0.8125rem'
          }}
        >
          <code
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              color: '#06b6d4',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {exp.token}
          </code>

          <span style={{ color: 'var(--text-secondary)' }}>{exp.description}</span>
        </div>
      ))}
    </div>
  );
};
