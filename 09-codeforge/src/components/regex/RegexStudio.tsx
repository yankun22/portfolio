import React, { useState, useMemo } from 'react';
import { REGEX_PRESETS } from '../../data/sampleRegex';
import { executeRegex, buildRailroadAST } from '../../services/regexParser';
import { RailroadDiagram } from './RailroadDiagram';
import { MatchTable } from './MatchTable';
import { RegexExplainer } from './RegexExplainer';
import { RegexReplace } from './RegexReplace';
import { Search, CheckCircle2, AlertCircle, ArrowRightLeft, BookOpen, GitBranch } from 'lucide-react';

interface RegexStudioProps {
  initialPattern?: string;
  initialFlags?: string;
  initialText?: string;
}

export const RegexStudio: React.FC<RegexStudioProps> = ({
  initialPattern = REGEX_PRESETS[0].pattern,
  initialFlags = REGEX_PRESETS[0].flags,
  initialText = REGEX_PRESETS[0].sampleText
}) => {
  const [pattern, setPattern] = useState(initialPattern);
  const [flags, setFlags] = useState(initialFlags);
  const [testText, setTestText] = useState(initialText);
  const [activeSubTab, setActiveSubTab] = useState<'matches' | 'railroad' | 'explain' | 'replace'>('matches');

  // Execute regex
  const { matches, error } = useMemo(() => executeRegex(pattern, flags, testText), [pattern, flags, testText]);
  const railroadAst = useMemo(() => buildRailroadAST(pattern), [pattern]);

  const toggleFlag = (flagChar: string) => {
    setFlags((prev) => (prev.includes(flagChar) ? prev.replace(flagChar, '') : prev + flagChar));
  };

  const handleSelectPreset = (presetId: string) => {
    const p = REGEX_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setPattern(p.pattern);
      setFlags(p.flags);
      setTestText(p.sampleText);
    }
  };

  // Render color-coded highlighted text
  const renderedHighlight = useMemo(() => {
    if (!pattern || matches.length === 0 || error) {
      return <span>{testText}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((m, mIdx) => {
      // Plain text before match
      if (m.index > lastIndex) {
        elements.push(<span key={`pre-${mIdx}`}>{testText.substring(lastIndex, m.index)}</span>);
      }

      // If match has capture groups, render nested highlights
      if (m.groups.length > 0) {
        let matchOffset = m.index;
        const groupElements: React.ReactNode[] = [];

        // Sort groups by start index
        const sortedGroups = [...m.groups].sort((a, b) => a.start - b.start);

        sortedGroups.forEach((grp, gIdx) => {
          if (grp.start > matchOffset) {
            groupElements.push(
              <span key={`inter-${gIdx}`}>{testText.substring(matchOffset, grp.start)}</span>
            );
          }

          groupElements.push(
            <mark
              key={`grp-${gIdx}`}
              style={{
                backgroundColor: `${grp.color}35`,
                color: '#ffffff',
                border: `1px solid ${grp.color}`,
                borderRadius: 3,
                padding: '0 3px',
                fontWeight: 700
              }}
              title={`Group $${grp.groupIndex}: ${grp.value}`}
            >
              {grp.value}
            </mark>
          );

          matchOffset = Math.max(matchOffset, grp.end);
        });

        if (matchOffset < m.index + m.length) {
          groupElements.push(
            <span key="post-grp">{testText.substring(matchOffset, m.index + m.length)}</span>
          );
        }

        elements.push(
          <span
            key={`match-${mIdx}`}
            className="match-highlight"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            {groupElements}
          </span>
        );
      } else {
        // Plain full match without capture groups
        elements.push(
          <mark
            key={`match-${mIdx}`}
            className="match-highlight"
            style={{
              backgroundColor: 'rgba(6, 182, 212, 0.25)',
              color: '#38bdf8',
              border: '1px solid #06b6d4',
              fontWeight: 700
            }}
          >
            {m.fullMatch}
          </mark>
        );
      }

      lastIndex = m.index + m.length;
    });

    if (lastIndex < testText.length) {
      elements.push(<span key="tail">{testText.substring(lastIndex)}</span>);
    }

    return elements;
  }, [pattern, flags, testText, matches, error]);

  return (
    <div className="regex-studio-container">
      {/* Pattern Input & Presets Bar */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#06b6d4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Search size={18} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              Regular Expression Testbench
            </h2>
          </div>

          <select
            className="form-select"
            style={{ padding: '5px 12px', fontSize: '0.75rem', width: 'auto', background: 'var(--bg-input)' }}
            onChange={(e) => handleSelectPreset(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              📚 Regex Pattern Presets
            </option>
            {REGEX_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>
        </div>

        {/* Pattern Input Box & Flags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1,
              minWidth: 260,
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-input)',
              border: `1px solid ${error ? '#f43f5e' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '0 12px'
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. ([a-z]+)@([a-z]+)\.com"
              style={{
                flex: 1,
                padding: '10px 8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9375rem',
                outline: 'none'
              }}
            />
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>/</span>
          </div>

          {/* Flags Toggle Pills */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', padding: 3, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {[
              { char: 'g', label: 'global' },
              { char: 'i', label: 'ignore case' },
              { char: 'm', label: 'multiline' },
              { char: 's', label: 'dotAll' }
            ].map((f) => {
              const active = flags.includes(f.char);
              return (
                <button
                  key={f.char}
                  onClick={() => toggleFlag(f.char)}
                  title={`Flag: ${f.label} (${f.char})`}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: active ? 'var(--accent-cyan)' : 'transparent',
                    color: active ? '#000000' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {f.char}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          {error ? (
            <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={14} /> {error}
            </span>
          ) : (
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <CheckCircle2 size={14} /> Pattern Valid • {matches.length} matches found
            </span>
          )}
        </div>
      </div>

      {/* Test String & Highlight Box */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Test String Textarea */}
        <div className="form-group">
          <label className="form-label">Test Subject Text</label>
          <textarea
            className="form-textarea"
            rows={6}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type or paste text to test regex matches..."
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>

        {/* Color-Coded Match Highlighter Viewport */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Live Color-Coded Capture Highlight</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
              $1 (Cyan) • $2 (Emerald) • $3 (Amber) • $4 (Purple)
            </span>
          </label>
          <div className="regex-highlight-box">{renderedHighlight}</div>
        </div>
      </div>

      {/* Sub-Tabs: Match Table | Railroad Diagram | Explainer | Substitution */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
          <button
            className={`tab-btn ${activeSubTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('matches')}
          >
            <Search size={14} />
            <span>Match Matrix ({matches.length})</span>
          </button>

          <button
            className={`tab-btn ${activeSubTab === 'railroad' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('railroad')}
          >
            <GitBranch size={14} />
            <span>Railroad Syntax Diagram</span>
          </button>

          <button
            className={`tab-btn ${activeSubTab === 'explain' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('explain')}
          >
            <BookOpen size={14} />
            <span>Step-by-Step Breakdown</span>
          </button>

          <button
            className={`tab-btn ${activeSubTab === 'replace' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('replace')}
          >
            <ArrowRightLeft size={14} />
            <span>Replace Playground</span>
          </button>
        </div>

        {/* Sub-Tab Content View */}
        {activeSubTab === 'matches' && <MatchTable matches={matches} />}
        {activeSubTab === 'railroad' && <RailroadDiagram ast={railroadAst} />}
        {activeSubTab === 'explain' && <RegexExplainer pattern={pattern} />}
        {activeSubTab === 'replace' && <RegexReplace pattern={pattern} flags={flags} testText={testText} />}
      </div>
    </div>
  );
};
