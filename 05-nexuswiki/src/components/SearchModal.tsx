import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useWiki } from '../context/WikiContext';
import type { SearchMatch } from '../types/wiki';
import { Search, FileText, Tag, Heading, X } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { notes, isSearchOpen, setIsSearchOpen, setActiveNoteId } = useWiki();
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSearchOpen]);

  // Compute fuzzy search matches
  const searchResults: SearchMatch[] = useMemo(() => {
    if (!query.trim()) {
      // Return recent notes by default
      return notes.slice(0, 8).map((n) => ({
        noteId: n.id,
        noteTitle: n.title,
        matchType: 'title',
        snippet: n.content.slice(0, 110).replace(/[#*`]/g, ''),
        score: 1,
      }));
    }

    const q = query.toLowerCase().trim();
    const results: SearchMatch[] = [];

    notes.forEach((note) => {
      const lowerTitle = note.title.toLowerCase();
      const lowerContent = note.content.toLowerCase();

      // 1. Title match (highest score)
      if (lowerTitle.includes(q)) {
        results.push({
          noteId: note.id,
          noteTitle: note.title,
          matchType: 'title',
          snippet: note.content.slice(0, 110).replace(/[#*`]/g, ''),
          score: lowerTitle === q ? 100 : 80,
        });
        return;
      }

      // 2. Tag match
      const matchedTag = note.tags.find((t) => t.toLowerCase().includes(q));
      if (matchedTag) {
        results.push({
          noteId: note.id,
          noteTitle: note.title,
          matchType: 'tag',
          snippet: `Tagged with #${matchedTag}`,
          score: 60,
        });
        return;
      }

      // 3. Header match
      const lines = note.content.split('\n');
      const headerLine = lines.find((l) => l.startsWith('#') && l.toLowerCase().includes(q));
      if (headerLine) {
        results.push({
          noteId: note.id,
          noteTitle: note.title,
          matchType: 'header',
          snippet: headerLine.replace(/^#+\s*/, ''),
          score: 50,
        });
        return;
      }

      // 4. Content body match
      const contentIdx = lowerContent.indexOf(q);
      if (contentIdx > -1) {
        const start = Math.max(0, contentIdx - 35);
        const end = Math.min(note.content.length, contentIdx + q.length + 65);
        const snippet = (start > 0 ? '...' : '') + note.content.slice(start, end).replace(/[#*`]/g, '') + '...';

        results.push({
          noteId: note.id,
          noteTitle: note.title,
          matchType: 'content',
          snippet,
          score: 30,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }, [query, notes]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < searchResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const match = searchResults[selectedIndex];
      if (match) {
        setActiveNoteId(match.noteId);
        setIsSearchOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsSearchOpen(false)}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '640px',
          maxWidth: '92vw',
          maxHeight: '75vh',
          background: '#0c121e',
          border: '1px solid var(--border-medium)',
          borderRadius: '14px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 30px rgba(139,92,246,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Search Header Input */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          <Search size={18} color="#8b5cf6" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search vault by title, body, #tag, or header..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
            }}
          />
          <button onClick={() => setIsSearchOpen(false)} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {searchResults.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No notes or tags matching "<span style={{ color: '#ffffff' }}>{query}</span>".
            </div>
          ) : (
            searchResults.map((res, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${res.noteId}-${idx}`}
                  onClick={() => {
                    setActiveNoteId(res.noteId);
                    setIsSearchOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                    border: isSelected ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {res.matchType === 'tag' ? (
                        <Tag size={14} color="#10b981" />
                      ) : res.matchType === 'header' ? (
                        <Heading size={14} color="#06b6d4" />
                      ) : (
                        <FileText size={14} color="#8b5cf6" />
                      )}
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                        {res.noteTitle}
                      </span>
                    </div>

                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {res.matchType}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, paddingLeft: '22px' }}>
                    {res.snippet}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            background: 'rgba(0, 0, 0, 0.4)',
          }}
        >
          <span>Use ↑ ↓ to navigate · Enter to select · Esc to close</span>
          <span>{searchResults.length} results</span>
        </div>
      </div>
    </div>
  );
};
