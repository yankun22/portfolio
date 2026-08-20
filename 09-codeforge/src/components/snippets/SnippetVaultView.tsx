import React, { useState } from 'react';
import type { CodeSnippet, SnippetLanguage } from '../../types/snippet';
import { SnippetCard } from './SnippetCard';
import { CreateSnippetModal } from './CreateSnippetModal';
import { Plus, Search, Bookmark, Download, Upload } from 'lucide-react';
import { downloadFile } from '../../services/storageService';

interface SnippetVaultViewProps {
  snippets: CodeSnippet[];
  onSaveSnippet: (snippet: CodeSnippet) => void;
  onDeleteSnippet: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onImportSnippets: (imported: CodeSnippet[]) => void;
}

export const SnippetVaultView: React.FC<SnippetVaultViewProps> = ({
  snippets,
  onSaveSnippet,
  onDeleteSnippet,
  onToggleFavorite,
  onImportSnippets
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [langFilter, setLangFilter] = useState<'all' | SnippetLanguage>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredSnippets = snippets.filter((s) => {
    const matchesLang = langFilter === 'all' ? true : s.language === langFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q));

    return matchesLang && matchesSearch;
  });

  const handleExportAll = () => {
    const jsonStr = JSON.stringify(snippets, null, 2);
    downloadFile(jsonStr, `codeforge_vault_backup_${Date.now()}.json`);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportSnippets(parsed);
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="snippets-container">
      {/* Vault Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Code Snippet Vault
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Curated code blocks, regex patterns, and SQL scripts with GitHub Gist exports
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" onClick={handleExportAll} title="Export Vault as JSON">
            <Download size={14} />
            <span>Export All</span>
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer' }} title="Import Vault JSON">
            <Upload size={14} />
            <span>Import</span>
            <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
          </label>

          <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={15} />
            <span>Add Snippet</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        {/* Search Input */}
        <div
          style={{
            flex: 1,
            minWidth: 260,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0 12px'
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search snippets by title, tag, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '9px 0',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.8125rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Language Filter Pills */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', padding: 3, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          {(['all', 'javascript', 'html', 'css', 'sql', 'regex'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLangFilter(lang)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: langFilter === lang ? 'var(--accent-cyan)' : 'transparent',
                color: langFilter === lang ? '#000000' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
        {filteredSnippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onDelete={onDeleteSnippet}
            onToggleFavorite={onToggleFavorite}
          />
        ))}

        {filteredSnippets.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              color: 'var(--text-muted)'
            }}
          >
            <Bookmark size={32} style={{ opacity: 0.4, marginBottom: 8 }} />
            <div style={{ fontWeight: 600 }}>No matching snippets found</div>
            <div style={{ fontSize: '0.75rem', marginTop: 4 }}>
              Try adjusting search terms or language filters, or create a new snippet.
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateSnippetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaveSnippet={onSaveSnippet}
      />
    </div>
  );
};
