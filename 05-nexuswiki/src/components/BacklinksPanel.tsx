import React, { useState } from 'react';
import { useWiki } from '../context/WikiContext';
import { extractWikiLinks } from '../utils/wikiParser';
import { KnowledgeGraph } from './KnowledgeGraph';
import {
  Link2,
  Unlink2,
  ArrowUpRight,
  FileText,
  Clock,
  Network,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react';

export const BacklinksPanel: React.FC = () => {
  const {
    activeNote,
    backlinks,
    unlinkedMentions,
    notes,
    setActiveNoteId,
    linkUnlinkedMention,
    openNoteByTitle,
  } = useWiki();

  const [showGraph, setShowGraph] = useState<boolean>(true);
  const [isLinkedExpanded, setIsLinkedExpanded] = useState<boolean>(true);
  const [isUnlinkedExpanded, setIsUnlinkedExpanded] = useState<boolean>(true);
  const [isOutgoingExpanded, setIsOutgoingExpanded] = useState<boolean>(true);

  if (!activeNote) return null;

  // Extract outgoing links from active note
  const outgoingLinks = extractWikiLinks(activeNote.content);
  const existingNoteTitles = new Set(notes.map((n) => n.title.toLowerCase()));

  // Word count & Reading Time
  const wordsCount = activeNote.content.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMins = Math.max(1, Math.ceil(wordsCount / 200));

  return (
    <aside
      style={{
        width: '340px',
        minWidth: '340px',
        height: '100vh',
        background: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      {/* Mini Interactive Graph Pane (Collapsible) */}
      <div
        style={{
          height: showGraph ? '220px' : '42px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          transition: 'height 0.25s ease',
        }}
      >
        <div
          onClick={() => setShowGraph(!showGraph)}
          style={{
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
            zIndex: 5,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#c084fc' }}>
            <Network size={14} color="#8b5cf6" />
            <span>KNOWLEDGE GRAPH</span>
          </div>
          <button className="btn-icon" style={{ padding: '2px' }}>
            {showGraph ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showGraph && (
          <div style={{ flex: 1, position: 'relative' }}>
            <KnowledgeGraph />
          </div>
        )}
      </div>

      {/* Backlinks & Mentions Tabs (Scrollable) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 1. Linked Mentions Section */}
        <div>
          <div
            onClick={() => setIsLinkedExpanded(!isLinkedExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
              <Link2 size={13} color="#8b5cf6" />
              <span>LINKED BACKLINKS</span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#c084fc',
                }}
              >
                {backlinks.length}
              </span>
            </div>
            {isLinkedExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>

          {isLinkedExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {backlinks.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                  No incoming backlinks referencing this note yet.
                </p>
              ) : (
                backlinks.map((item) => (
                  <div
                    key={item.sourceNoteId}
                    onClick={() => setActiveNoteId(item.sourceNoteId)}
                    style={{
                      background: 'rgba(10, 16, 28, 0.7)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                      e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.background = 'rgba(10, 16, 28, 0.7)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <FileText size={12} color="#8b5cf6" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                        {item.sourceNoteTitle}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      "{item.matchedSnippet}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 2. Unlinked Mentions Section */}
        <div>
          <div
            onClick={() => setIsUnlinkedExpanded(!isUnlinkedExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
              <Unlink2 size={13} color="#f59e0b" />
              <span>UNLINKED MENTIONS</span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                }}
              >
                {unlinkedMentions.length}
              </span>
            </div>
            {isUnlinkedExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>

          {isUnlinkedExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {unlinkedMentions.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                  No unlinked text mentions detected across the vault.
                </p>
              ) : (
                unlinkedMentions.map((mention, idx) => (
                  <div
                    key={`${mention.sourceNoteId}-${idx}`}
                    style={{
                      background: 'rgba(245, 158, 11, 0.05)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        onClick={() => setActiveNoteId(mention.sourceNoteId)}
                        style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc', cursor: 'pointer' }}
                      >
                        {mention.sourceNoteTitle}
                      </span>
                      <button
                        onClick={() => linkUnlinkedMention(mention.sourceNoteId, activeNote.title)}
                        className="btn btn-sm btn-cyan"
                        style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                        title="Convert plain text into [[WikiLink]]"
                      >
                        <Plus size={11} />
                        <span>Link</span>
                      </button>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      "{mention.matchedSnippet}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 3. Outgoing Links Section */}
        <div>
          <div
            onClick={() => setIsOutgoingExpanded(!isOutgoingExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              cursor: 'pointer',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
              <ArrowUpRight size={13} color="#06b6d4" />
              <span>OUTGOING LINKS</span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.2)',
                  color: '#38bdf8',
                }}
              >
                {outgoingLinks.length}
              </span>
            </div>
            {isOutgoingExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>

          {isOutgoingExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {outgoingLinks.length === 0 ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                  No outgoing links in this note.
                </p>
              ) : (
                outgoingLinks.map((link, idx) => {
                  const isExisting = existingNoteTitles.has(link.target.toLowerCase());
                  return (
                    <div
                      key={`${link.target}-${idx}`}
                      onClick={() => openNoteByTitle(link.target)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        color: isExisting ? '#cbd5e1' : '#94a3b8',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{isExisting ? '📄' : '✨'}</span>
                        <span style={{ fontWeight: 500 }}>{link.target}</span>
                      </div>
                      {!isExisting && (
                        <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontStyle: 'italic' }}>
                          Ghost
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Note Telemetry Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
        }}
      >
        <span>{wordsCount} words · {readingTimeMins}m read</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={11} />
          <span>Updated {new Date(activeNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </aside>
  );
};
