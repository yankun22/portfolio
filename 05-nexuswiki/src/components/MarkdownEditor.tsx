import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useWiki } from '../context/WikiContext';
import { renderMarkdown } from '../utils/wikiParser';
import {
  Bold,
  Italic,
  Code,
  Sigma,
  Link2,
  CheckSquare,
  Heading,
  Quote,
  Eye,
  Columns,
  Edit3,
  Pin,
} from 'lucide-react';

export const MarkdownEditor: React.FC = () => {
  const {
    activeNote,
    updateNote,
    renameNote,
    notes,
    openNoteByTitle,
    viewMode,
    setViewMode,
  } = useWiki();

  const [titleInput, setTitleInput] = useState<string>('');
  const [autocompleteQuery, setAutocompleteQuery] = useState<string | null>(null);
  const [autocompleteIndex, setAutocompleteIndex] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Sync title input with active note
  useEffect(() => {
    if (activeNote) {
      setTitleInput(activeNote.title);
    }
  }, [activeNote]);

  // Set of all existing note titles for Wikilink highlighting
  const existingNoteTitles = useMemo(() => {
    return new Set(notes.map((n) => n.title));
  }, [notes]);

  // Autocomplete suggestions for [[WikiLinks]]
  const autocompleteSuggestions = useMemo(() => {
    if (autocompleteQuery === null) return [];

    const filtered = notes
      .filter((n) => n.title.toLowerCase().includes(autocompleteQuery.toLowerCase()))
      .map((n) => n.title);

    // If query is not empty and not matching exactly, include "+ Create note"
    const exactMatch = filtered.some((t) => t.toLowerCase() === autocompleteQuery.toLowerCase());
    if (autocompleteQuery.trim().length > 0 && !exactMatch) {
      return [...filtered, `+ Create [[${autocompleteQuery.trim()}]]`];
    }
    return filtered;
  }, [notes, autocompleteQuery]);

  // Handle textarea input changes and check for [[ trigger
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeNote) return;
    const val = e.target.value;
    const selStart = e.target.selectionStart;
    setCursorPos(selStart);
    updateNote(activeNote.id, { content: val });

    // Check if cursor is right after `[[`
    const textBeforeCursor = val.slice(0, selStart);
    const lastOpenBracketIdx = textBeforeCursor.lastIndexOf('[[');
    const lastCloseBracketIdx = textBeforeCursor.lastIndexOf(']]');

    if (lastOpenBracketIdx > -1 && lastOpenBracketIdx > lastCloseBracketIdx) {
      const query = textBeforeCursor.slice(lastOpenBracketIdx + 2);
      // Check if query contains newline (cancel if multiline)
      if (!query.includes('\n')) {
        setAutocompleteQuery(query);
        setAutocompleteIndex(0);
        return;
      }
    }
    setAutocompleteQuery(null);
  };

  // Insert autocompleted WikiLink into textarea
  const insertWikiLink = (selectedItem: string) => {
    if (!activeNote || !textareaRef.current) return;
    const rawVal = activeNote.content;
    const textBeforeCursor = rawVal.slice(0, cursorPos);
    const lastOpenBracketIdx = textBeforeCursor.lastIndexOf('[[');
    if (lastOpenBracketIdx === -1) return;

    let targetTitle = selectedItem;
    if (selectedItem.startsWith('+ Create [[')) {
      targetTitle = selectedItem.replace(/^\+ Create \[\[/, '').replace(/\]\]$/, '');
    }

    const before = rawVal.slice(0, lastOpenBracketIdx);
    const after = rawVal.slice(cursorPos);
    const inserted = `[[${targetTitle}]]`;
    const newContent = before + inserted + after;

    updateNote(activeNote.id, { content: newContent });
    setAutocompleteQuery(null);

    // Reposition cursor after the inserted link
    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = lastOpenBracketIdx + inserted.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 20);
  };

  // Handle Keyboard navigation for Autocomplete dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (autocompleteQuery !== null && autocompleteSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutocompleteIndex((prev) => (prev + 1 < autocompleteSuggestions.length ? prev + 1 : 0));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutocompleteIndex((prev) => (prev - 1 >= 0 ? prev - 1 : autocompleteSuggestions.length - 1));
        return;
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertWikiLink(autocompleteSuggestions[autocompleteIndex]);
        return;
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setAutocompleteQuery(null);
        return;
      }
    }
  };

  // Quick formatting toolbar insertion helpers
  const wrapSelection = (startTag: string, endTag = startTag, placeholder = 'text') => {
    if (!activeNote || !textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end) || placeholder;

    const replacement = `${startTag}${selected}${endTag}`;
    const newContent = el.value.slice(0, start) + replacement + el.value.slice(end);
    updateNote(activeNote.id, { content: newContent });

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + startTag.length, start + startTag.length + selected.length);
    }, 20);
  };

  // Intercept click on [[WikiLinks]] in the HTML Preview pane
  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('.wikilink') as HTMLElement | null;
    if (target) {
      const targetTitle = decodeURIComponent(target.dataset.target || '');
      if (targetTitle) {
        e.preventDefault();
        openNoteByTitle(targetTitle);
      }
    }
  };

  if (!activeNote) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
        Select or create a note to begin writing.
      </div>
    );
  }

  const renderedHtml = renderMarkdown(activeNote.content, existingNoteTitles);

  return (
    <div
      style={{
        flex: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-editor)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Note Header Bar */}
      <div
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 16, 27, 0.9)',
          backdropFilter: 'blur(12px)',
          gap: '16px',
        }}
      >
        {/* Title Inline Editor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={() => {
              if (titleInput.trim() && titleInput !== activeNote.title) {
                renameNote(activeNote.id, titleInput.trim());
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            placeholder="Note Title..."
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#ffffff',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              letterSpacing: '-0.02em',
              width: '100%',
              maxWidth: '480px',
            }}
          />

          {/* Pinned toggle */}
          <button
            onClick={() => updateNote(activeNote.id, { pinned: !activeNote.pinned })}
            className="btn-icon"
            style={{ color: activeNote.pinned ? '#8b5cf6' : 'var(--text-dim)' }}
            title={activeNote.pinned ? 'Unpin note' : 'Pin note to top'}
          >
            <Pin size={15} />
          </button>
        </div>

        {/* View Mode Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(6, 9, 14, 0.8)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setViewMode('editor')}
            className="btn btn-sm"
            style={{
              padding: '4px 8px',
              border: 'none',
              background: viewMode === 'editor' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              color: viewMode === 'editor' ? '#c084fc' : 'var(--text-secondary)',
            }}
            title="Edit Only"
          >
            <Edit3 size={13} />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className="btn btn-sm"
            style={{
              padding: '4px 8px',
              border: 'none',
              background: viewMode === 'split' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              color: viewMode === 'split' ? '#c084fc' : 'var(--text-secondary)',
            }}
            title="Split Screen"
          >
            <Columns size={13} />
            <span>Split</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className="btn btn-sm"
            style={{
              padding: '4px 8px',
              border: 'none',
              background: viewMode === 'preview' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              color: viewMode === 'preview' ? '#c084fc' : 'var(--text-secondary)',
            }}
            title="Preview Only"
          >
            <Eye size={13} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div
        style={{
          padding: '6px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(8, 12, 20, 0.6)',
        }}
      >
        <button onClick={() => wrapSelection('**', '**', 'bold text')} className="btn-icon" title="Bold (**text**)">
          <Bold size={14} />
        </button>
        <button onClick={() => wrapSelection('*', '*', 'italic text')} className="btn-icon" title="Italic (*text*)">
          <Italic size={14} />
        </button>
        <button onClick={() => wrapSelection('`', '`', 'inline code')} className="btn-icon" title="Inline Code (`code`)">
          <Code size={14} />
        </button>
        <button onClick={() => wrapSelection('$$\n', '\n$$', '\\int f(x) dx')} className="btn-icon" title="KaTeX Equation ($$...$$)">
          <Sigma size={14} color="#8b5cf6" />
        </button>
        <button onClick={() => wrapSelection('[[', ']]', 'Note Title')} className="btn-icon" title="WikiLink ([[Note]])">
          <Link2 size={14} color="#06b6d4" />
        </button>
        <button onClick={() => wrapSelection('- [ ] ', '', 'Task item')} className="btn-icon" title="Checklist (- [ ])">
          <CheckSquare size={14} color="#10b981" />
        </button>
        <button onClick={() => wrapSelection('## ', '', 'Heading')} className="btn-icon" title="Heading (## Title)">
          <Heading size={14} />
        </button>
        <button onClick={() => wrapSelection('> ', '', 'Quote')} className="btn-icon" title="Blockquote (> quote)">
          <Quote size={14} />
        </button>
      </div>

      {/* Main Workspace (Editor / Preview / Split) */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, position: 'relative' }}>
        {/* Editor Left Pane */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div
            style={{
              flex: viewMode === 'split' ? 1 : 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRight: viewMode === 'split' ? '1px solid var(--border-subtle)' : 'none',
              position: 'relative',
            }}
          >
            <textarea
              ref={textareaRef}
              value={activeNote.content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              placeholder="Type markdown, [[WikiLinks]], KaTeX math, or #tags..."
              className="font-mono"
              style={{
                flex: 1,
                width: '100%',
                padding: '20px 24px',
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-mono)',
              }}
            />

            {/* WikiLink Autocomplete Menu */}
            {autocompleteQuery !== null && (
              <div
                style={{
                  position: 'absolute',
                  left: '40px',
                  top: '120px',
                  width: '320px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  background: '#090e17',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '10px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(139,92,246,0.2)',
                  zIndex: 100,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', padding: '4px 8px', fontWeight: 700 }}>
                  LINK TO NOTE (ENTER TO SELECT)
                </div>
                {autocompleteSuggestions.map((item, idx) => {
                  const isSelected = idx === autocompleteIndex;
                  return (
                    <div
                      key={item}
                      onClick={() => insertWikiLink(item)}
                      onMouseEnter={() => setAutocompleteIndex(idx)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        color: isSelected ? '#ffffff' : '#cbd5e1',
                        background: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ color: '#c084fc' }}>[[</span>
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item}
                      </span>
                      <span style={{ color: '#c084fc' }}>]]</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Live Preview Right Pane */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            ref={previewRef}
            onClick={handlePreviewClick}
            className="md-preview"
            style={{
              flex: viewMode === 'split' ? 1 : 1,
              height: '100%',
              overflowY: 'auto',
              padding: '24px 32px',
              background: 'rgba(10, 15, 26, 0.4)',
            }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}
      </div>
    </div>
  );
};
