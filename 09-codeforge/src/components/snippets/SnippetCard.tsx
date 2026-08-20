import React, { useState } from 'react';
import type { CodeSnippet } from '../../types/snippet';
import { Copy, Check, Trash2, Tag, Star, Download } from 'lucide-react';
import { exportSnippetToGistJson, downloadFile } from '../../services/storageService';

interface SnippetCardProps {
  snippet: CodeSnippet;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onDelete,
  onToggleFavorite
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportGist = () => {
    const gistJson = exportSnippetToGistJson(snippet);
    downloadFile(gistJson, `gist_${snippet.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`);
  };

  const getLangColor = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return '#f59e0b';
      case 'html':
        return '#38bdf8';
      case 'css':
        return '#f43f5e';
      case 'sql':
        return '#10b981';
      case 'regex':
        return '#06b6d4';
      default:
        return '#8b5cf6';
    }
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'var(--transition-fast)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {snippet.title}
            </h4>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                background: `${getLangColor(snippet.language)}18`,
                color: getLangColor(snippet.language),
                textTransform: 'uppercase'
              }}
            >
              {snippet.language}
            </span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>
            {snippet.description}
          </p>
        </div>

        <button
          onClick={() => onToggleFavorite(snippet.id)}
          style={{
            background: 'transparent',
            border: 'none',
            color: snippet.favorite ? '#f59e0b' : 'var(--text-dim)',
            cursor: 'pointer',
            padding: 2
          }}
          title="Toggle Favorite"
        >
          <Star size={15} fill={snippet.favorite ? '#f59e0b' : 'none'} />
        </button>
      </div>

      {/* Code Snippet Box */}
      <pre
        style={{
          margin: 0,
          padding: '10px 12px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          maxHeight: 120,
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}
      >
        <code>{snippet.code}</code>
      </pre>

      {/* Tags & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', paddingTop: 6, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Tag size={10} /> {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="btn-secondary"
            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
            onClick={handleCopy}
            title="Copy Code to Clipboard"
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            className="btn-icon"
            style={{ width: 26, height: 26 }}
            onClick={handleExportGist}
            title="Export to GitHub Gist JSON"
          >
            <Download size={12} />
          </button>

          <button
            className="btn-icon"
            style={{ width: 26, height: 26, color: '#f43f5e' }}
            onClick={() => onDelete(snippet.id)}
            title="Delete Snippet"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
