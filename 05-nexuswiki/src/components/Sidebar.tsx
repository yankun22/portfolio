import React, { useState } from 'react';
import { useWiki } from '../context/WikiContext';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  FolderArchive,
  RotateCcw,
  Tag,
  Network,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  onOpenExportModal: () => void;
  onSelectNote?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenExportModal, onSelectNote }) => {
  const {
    notes,
    activeNoteId,
    setActiveNoteId,
    createNote,
    deleteNote,
    graphLinks,
    setIsSearchOpen,
    resetToStarterVault,
    viewMode,
    setViewMode,
  } = useWiki();

  const [filterText, setFilterText] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags across the vault
  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags.map((t) => t.toLowerCase())))
  );

  const filteredNotes = notes.filter((n) => {
    const matchesText =
      n.title.toLowerCase().includes(filterText.toLowerCase()) ||
      n.content.toLowerCase().includes(filterText.toLowerCase());

    const matchesTag = !selectedTag || n.tags.some((t) => t.toLowerCase() === selectedTag);

    return matchesText && matchesTag;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const regularNotes = filteredNotes.filter((n) => !n.pinned);

  return (
    <aside
      style={{
        width: '300px',
        minWidth: '300px',
        height: '100vh',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(139, 92, 246, 0.3)',
            }}
          >
            <Network size={18} color="#c084fc" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Nexus<span style={{ color: '#8b5cf6' }}>Wiki</span>
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '-2px' }}>
              Networked Thought & Graph
            </p>
          </div>
        </div>

        {/* Quick New Note Button */}
        <button
          onClick={() => createNote()}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 10px', gap: '4px' }}
          title="Create New Note"
        >
          <Plus size={14} />
          <span>Note</span>
        </button>
      </div>

      {/* Vault Telemetry Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 16px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <BookOpen size={12} color="#8b5cf6" />
          <span>{notes.length} Notes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Network size={12} color="#06b6d4" />
          <span>{graphLinks.length} Links</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tag size={12} color="#10b981" />
          <span>{allTags.length} Tags</span>
        </div>
      </div>

      {/* Search Input Trigger */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          onClick={() => setIsSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 12px',
            background: 'rgba(6, 9, 14, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={14} color="#8b5cf6" />
            <span>Search vault...</span>
          </div>
          <span
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              padding: '1px 5px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-dim)',
            }}
          >
            Ctrl+P
          </span>
        </div>

        {/* Quick Filter */}
        <input
          type="text"
          placeholder="Filter notes list..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{
            padding: '6px 10px',
            background: 'transparent',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '0.78rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Tag Cloud Pills */}
      {allTags.length > 0 && (
        <div
          style={{
            padding: '0 16px 8px 16px',
            display: 'flex',
            gap: '4px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedTag && (
            <span
              onClick={() => setSelectedTag(null)}
              className="tag-pill"
              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            >
              Clear ✕
            </span>
          )}
          {allTags.map((tag) => (
            <span
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className="tag-pill"
              style={{
                background: selectedTag === tag ? 'rgba(139, 92, 246, 0.35)' : undefined,
                borderColor: selectedTag === tag ? '#c084fc' : undefined,
                color: selectedTag === tag ? '#ffffff' : undefined,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes List (Scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Pinned section */}
        {pinnedNotes.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Pin size={11} color="#8b5cf6" /> PINNED
            </div>
            {pinnedNotes.map((note) => {
              const isActive = activeNoteId === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setActiveNoteId(note.id);
                    onSelectNote?.();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: isActive ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <FileText size={14} color={isActive ? '#c084fc' : 'var(--text-muted)'} />
                    <span
                      style={{
                        fontSize: '0.825rem',
                        color: isActive ? '#ffffff' : '#cbd5e1',
                        fontWeight: isActive ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {note.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Regular Notes section */}
        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', padding: '4px 8px' }}>
          ALL NOTES ({regularNotes.length})
        </div>

        {regularNotes.map((note) => {
          const isActive = activeNoteId === note.id;
          return (
            <div
              key={note.id}
              onClick={() => {
                setActiveNoteId(note.id);
                onSelectNote?.();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: '6px',
                background: isActive ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                border: isActive ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <FileText size={13} color={isActive ? '#c084fc' : 'var(--text-dim)'} />
                <span
                  style={{
                    fontSize: '0.825rem',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {note.title}
                </span>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete "${note.title}"?`)) {
                    deleteNote(note.id);
                  }
                }}
                className="btn-icon"
                style={{ padding: '2px 4px', opacity: 0.6 }}
                title="Delete note"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Vault Management Actions */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={onOpenExportModal}
            className="btn btn-sm"
            style={{ flex: 1, gap: '6px', fontSize: '0.75rem' }}
            title="Import or Export Vault as ZIP or JSON"
          >
            <FolderArchive size={13} color="#06b6d4" />
            <span>Vault ZIP/JSON</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'graph-full' ? 'split' : 'graph-full')}
            className="btn btn-sm"
            style={{
              padding: '6px 10px',
              background: viewMode === 'graph-full' ? 'rgba(139, 92, 246, 0.25)' : undefined,
              borderColor: viewMode === 'graph-full' ? '#8b5cf6' : undefined,
            }}
            title="Toggle Fullscreen Knowledge Graph"
          >
            <Network size={14} color="#8b5cf6" />
          </button>
        </div>

        <button
          onClick={resetToStarterVault}
          className="btn btn-sm"
          style={{ width: '100%', fontSize: '0.72rem', color: 'var(--text-dim)', border: 'none', background: 'transparent' }}
          title="Reload demo starter vault with math and quantum notes"
        >
          <RotateCcw size={12} />
          <span>Reset Starter Vault</span>
        </button>
      </div>
    </aside>
  );
};
