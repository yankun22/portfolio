import React from 'react';
import type { EditorTab, SandboxTemplate } from '../../types/sandbox';
import { SANDBOX_TEMPLATES } from '../../data/sampleTemplates';
import { Package, Play } from 'lucide-react';

interface CodeEditorProps {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  html: string;
  css: string;
  js: string;
  onHtmlChange: (val: string) => void;
  onCssChange: (val: string) => void;
  onJsChange: (val: string) => void;
  onSelectTemplate: (template: SandboxTemplate) => void;
  onOpenCdnModal: () => void;
  onRunCode: () => void;
  cdnCount: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeTab,
  onTabChange,
  html,
  css,
  js,
  onHtmlChange,
  onCssChange,
  onJsChange,
  onSelectTemplate,
  onOpenCdnModal,
  onRunCode,
  cdnCount
}) => {
  const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (activeTab === 'html') onHtmlChange(val);
    else if (activeTab === 'css') onCssChange(val);
    else onJsChange(val);
  };

  // Support Tab key indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      const nextVal = val.substring(0, start) + '  ' + val.substring(end);

      if (activeTab === 'html') onHtmlChange(nextVal);
      else if (activeTab === 'css') onCssChange(nextVal);
      else onJsChange(nextVal);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunCode();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Editor Header Bar */}
      <div className="editor-header-bar">
        <div className="editor-tabs-group">
          <button
            className={`editor-tab-pill ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => onTabChange('html')}
          >
            <span style={{ color: '#38bdf8' }}>&lt;/&gt;</span>
            <span>HTML</span>
          </button>

          <button
            className={`editor-tab-pill ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => onTabChange('css')}
          >
            <span style={{ color: '#f43f5e' }}>#</span>
            <span>CSS</span>
          </button>

          <button
            className={`editor-tab-pill ${activeTab === 'js' ? 'active' : ''}`}
            onClick={() => onTabChange('js')}
          >
            <span style={{ color: '#f59e0b' }}>JS</span>
            <span>JavaScript</span>
          </button>
        </div>

        {/* Templates & CDN Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <select
            className="form-select"
            style={{ padding: '3px 8px', fontSize: '0.72rem', width: 'auto', background: 'var(--bg-card)' }}
            onChange={(e) => {
              const tmpl = SANDBOX_TEMPLATES.find((t) => t.id === e.target.value);
              if (tmpl) onSelectTemplate(tmpl);
            }}
            defaultValue=""
          >
            <option value="" disabled>
              ⚡ Starter Templates
            </option>
            {SANDBOX_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <button
            className="btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
            onClick={onOpenCdnModal}
            title="Manage external CDN libraries"
          >
            <Package size={12} />
            <span>CDNs {cdnCount > 0 ? `(${cdnCount})` : ''}</span>
          </button>

          <button
            className="btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            onClick={onRunCode}
            title="Execute Code (Ctrl + Enter)"
          >
            <Play size={12} />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Code Textarea Viewport */}
      <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
        <textarea
          className="code-textarea"
          value={currentCode}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={`Write ${activeTab.toUpperCase()} code here...`}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
