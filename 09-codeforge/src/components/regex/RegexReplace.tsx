import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft } from 'lucide-react';

interface RegexReplaceProps {
  pattern: string;
  flags: string;
  testText: string;
}

export const RegexReplace: React.FC<RegexReplaceProps> = ({
  pattern,
  flags,
  testText
}) => {
  const [replacement, setReplacement] = useState('[$1 -> $2]');
  const [copied, setCopied] = useState(false);

  let replacedText = testText;
  let error: string | null = null;

  if (pattern) {
    try {
      const reg = new RegExp(pattern, flags);
      replacedText = testText.replace(reg, replacement);
    } catch (err: unknown) {
      error = (err as Error).message || 'Invalid replace operation';
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(replacedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ArrowRightLeft size={14} color="#06b6d4" />
          <span>Substitution Replacement String</span>
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. $1-$2 or [$&] or REPLACE"
          value={replacement}
          onChange={(e) => setReplacement(e.target.value)}
          style={{ fontFamily: 'var(--font-mono)' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            SUBSTITUTION OUTPUT
          </span>
          <button
            className="btn-secondary"
            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
            onClick={handleCopy}
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>
        </div>

        {error ? (
          <div style={{ padding: '12px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', borderRadius: 'var(--radius-md)', fontSize: '0.78rem' }}>
            {error}
          </div>
        ) : (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: 180,
              overflowY: 'auto'
            }}
          >
            {replacedText}
          </div>
        )}
      </div>
    </div>
  );
};
