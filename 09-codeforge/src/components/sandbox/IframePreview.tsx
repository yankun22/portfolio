import React, { useEffect, useRef } from 'react';
import { generateSandboxedHtml } from '../../services/consoleBridge';
import { RotateCcw, ExternalLink } from 'lucide-react';

interface IframePreviewProps {
  html: string;
  css: string;
  js: string;
  cdns: string[];
  executionKey: number;
  onRefresh: () => void;
}

export const IframePreview: React.FC<IframePreviewProps> = ({
  html,
  css,
  js,
  cdns,
  executionKey,
  onRefresh
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const fullDoc = generateSandboxedHtml(html, css, js, cdns);
      iframeRef.current.srcdoc = fullDoc;
    }
  }, [html, css, js, cdns, executionKey]);

  const handleOpenNewWindow = () => {
    const fullDoc = generateSandboxedHtml(html, css, js, cdns);
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(fullDoc);
      win.document.close();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Preview Header Bar */}
      <div
        style={{
          height: 42,
          minHeight: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
          <span>Interactive Preview</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className="btn-icon"
            style={{ width: 28, height: 28 }}
            onClick={onRefresh}
            title="Reload Sandbox Frame"
          >
            <RotateCcw size={12} />
          </button>

          <button
            className="btn-icon"
            style={{ width: 28, height: 28 }}
            onClick={handleOpenNewWindow}
            title="Open in Standalone Tab"
          >
            <ExternalLink size={12} />
          </button>
        </div>
      </div>

      {/* Sandboxed iframe */}
      <iframe
        ref={iframeRef}
        title="CodeForge Sandbox Output"
        sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          border: 'none',
          background: '#ffffff'
        }}
      />
    </div>
  );
};
