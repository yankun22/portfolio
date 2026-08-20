import React, { useState, useEffect } from 'react';
import type { EditorTab, SandboxLayout, ConsoleMessage, SandboxTemplate } from '../../types/sandbox';
import { SANDBOX_TEMPLATES } from '../../data/sampleTemplates';
import { CodeEditor } from './CodeEditor';
import { IframePreview } from './IframePreview';
import { ConsoleDrawer } from './ConsoleDrawer';
import { CdnPackageModal } from './CdnPackageModal';
import { Columns2, Rows2, Code, Eye } from 'lucide-react';

interface SandboxStudioProps {
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  initialCdns?: string[];
}

export const SandboxStudio: React.FC<SandboxStudioProps> = ({
  initialHtml = SANDBOX_TEMPLATES[0].html,
  initialCss = SANDBOX_TEMPLATES[0].css,
  initialJs = SANDBOX_TEMPLATES[0].js,
  initialCdns = []
}) => {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [cdns, setCdns] = useState<string[]>(initialCdns);
  const [activeTab, setActiveTab] = useState<EditorTab>('html');
  const [layout, setLayout] = useState<SandboxLayout>('split-horizontal');
  const [executionKey, setExecutionKey] = useState(1);
  const [isCdnModalOpen, setIsCdnModalOpen] = useState(false);
  const [logs, setLogs] = useState<ConsoleMessage[]>([]);

  // Listen for console logs forwarded from sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CODEFORGE_CONSOLE_LOG') {
        const payload = event.data.payload;
        setLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            level: payload.level,
            args: payload.args,
            formattedText: payload.formattedText,
            timestamp: payload.timestamp,
            count: 1
          }
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRunCode = () => {
    setExecutionKey((k) => k + 1);
  };

  const handleSelectTemplate = (tmpl: SandboxTemplate) => {
    setHtml(tmpl.html);
    setCss(tmpl.css);
    setJs(tmpl.js);
    if (tmpl.cdns) setCdns(tmpl.cdns);
    setLogs([]);
    setExecutionKey((k) => k + 1);
  };

  const handleToggleCdn = (url: string) => {
    setCdns((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
  };

  const handleAddCustomCdn = (url: string) => {
    if (!cdns.includes(url)) setCdns((prev) => [...prev, url]);
  };

  const handleRemoveCdn = (url: string) => {
    setCdns((prev) => prev.filter((u) => u !== url));
  };

  const isSplitH = layout === 'split-horizontal';
  const isSplitV = layout === 'split-vertical';
  const isEditorOnly = layout === 'editor-only';
  const isPreviewOnly = layout === 'preview-only';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', position: 'relative' }}>
      {/* Sub-toolbar for Layout toggles */}
      <div
        style={{
          height: 36,
          minHeight: 36,
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px'
        }}
      >
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Sandbox: <strong>HTML5 / Vanilla CSS / Modern JS</strong>
        </div>

        {/* Layout Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-input)', padding: 2, borderRadius: 'var(--radius-sm)' }}>
          <button
            className={`btn-icon ${isSplitH ? 'active' : ''}`}
            style={{ width: 24, height: 24, border: 'none', background: isSplitH ? 'var(--bg-surface)' : 'transparent' }}
            onClick={() => setLayout('split-horizontal')}
            title="Split Horizontal (Side by side)"
          >
            <Columns2 size={13} />
          </button>

          <button
            className={`btn-icon ${isSplitV ? 'active' : ''}`}
            style={{ width: 24, height: 24, border: 'none', background: isSplitV ? 'var(--bg-surface)' : 'transparent' }}
            onClick={() => setLayout('split-vertical')}
            title="Split Vertical (Top / Bottom)"
          >
            <Rows2 size={13} />
          </button>

          <button
            className={`btn-icon ${isEditorOnly ? 'active' : ''}`}
            style={{ width: 24, height: 24, border: 'none', background: isEditorOnly ? 'var(--bg-surface)' : 'transparent' }}
            onClick={() => setLayout('editor-only')}
            title="Editor Fullscreen"
          >
            <Code size={13} />
          </button>

          <button
            className={`btn-icon ${isPreviewOnly ? 'active' : ''}`}
            style={{ width: 24, height: 24, border: 'none', background: isPreviewOnly ? 'var(--bg-surface)' : 'transparent' }}
            onClick={() => setLayout('preview-only')}
            title="Preview Fullscreen"
          >
            <Eye size={13} />
          </button>
        </div>
      </div>

      {/* Main Sandbox Workspace Layout */}
      <div className={`sandbox-workspace ${layout}`}>
        {/* Editor Pane */}
        {!isPreviewOnly && (
          <div className="sandbox-pane">
            <CodeEditor
              activeTab={activeTab}
              onTabChange={setActiveTab}
              html={html}
              css={css}
              js={js}
              onHtmlChange={setHtml}
              onCssChange={setCss}
              onJsChange={setJs}
              onSelectTemplate={handleSelectTemplate}
              onOpenCdnModal={() => setIsCdnModalOpen(true)}
              onRunCode={handleRunCode}
              cdnCount={cdns.length}
            />
          </div>
        )}

        {/* Preview & Console Pane */}
        {!isEditorOnly && (
          <div className="preview-pane">
            <IframePreview
              html={html}
              css={css}
              js={js}
              cdns={cdns}
              executionKey={executionKey}
              onRefresh={handleRunCode}
            />

            <ConsoleDrawer logs={logs} onClear={() => setLogs([])} />
          </div>
        )}
      </div>

      {/* CDN Package Modal */}
      <CdnPackageModal
        isOpen={isCdnModalOpen}
        onClose={() => setIsCdnModalOpen(false)}
        selectedCdns={cdns}
        onToggleCdn={handleToggleCdn}
        onAddCustomCdn={handleAddCustomCdn}
        onRemoveCdn={handleRemoveCdn}
      />
    </div>
  );
};
