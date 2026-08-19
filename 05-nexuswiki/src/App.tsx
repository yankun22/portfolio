import React, { useState } from 'react';
import { WikiProvider, useWiki } from './context/WikiContext';
import { Sidebar } from './components/Sidebar';
import { MarkdownEditor } from './components/MarkdownEditor';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { BacklinksPanel } from './components/BacklinksPanel';
import { SearchModal } from './components/SearchModal';
import { VaultExportModal } from './components/VaultExportModal';
import { ArrowLeft, Network, FileText, Edit3, Link2 } from 'lucide-react';

type MobileTab = 'notes' | 'editor' | 'graph' | 'backlinks';

const AppContent: React.FC = () => {
  const { viewMode, setViewMode, isExportOpen, setIsExportOpen } = useWiki();
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');

  return (
    <div className="app-layout">
      {/* Desktop / Mobile Conditional Rendering */}
      
      {/* 1. Left Navigation Sidebar (always visible on desktop, tab-controlled on mobile) */}
      <div className={`nexus-pane pane-sidebar ${mobileTab === 'notes' ? 'mobile-active' : ''}`}>
        <Sidebar
          onOpenExportModal={() => setIsExportOpen(true)}
          onSelectNote={() => setMobileTab('editor')}
        />
      </div>

      {/* 2. Central Workspace (Editor or Fullscreen Graph) */}
      <main
        className={`nexus-pane pane-editor ${mobileTab === 'editor' || mobileTab === 'graph' ? 'mobile-active' : ''}`}
        style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}
      >
        {viewMode === 'graph-full' || mobileTab === 'graph' ? (
          <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(10, 15, 26, 0.85)',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <button
                onClick={() => {
                  setViewMode('split');
                  setMobileTab('editor');
                }}
                className="btn btn-sm"
                style={{ gap: '6px' }}
              >
                <ArrowLeft size={14} />
                <span>Return to Editor</span>
              </button>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Network size={13} /> Neural Mesh
              </span>
            </div>
            <KnowledgeGraph />
          </div>
        ) : (
          <MarkdownEditor />
        )}
      </main>

      {/* 3. Right Backlinks & Mentions Panel */}
      {viewMode !== 'graph-full' && (
        <div className={`nexus-pane pane-backlinks ${mobileTab === 'backlinks' ? 'mobile-active' : ''}`}>
          <BacklinksPanel />
        </div>
      )}

      {/* 4. Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          onClick={() => setMobileTab('notes')}
          className={`mobile-nav-btn ${mobileTab === 'notes' ? 'active' : ''}`}
        >
          <FileText size={18} />
          <span>Notes</span>
        </button>

        <button
          onClick={() => {
            setMobileTab('editor');
            setViewMode('split');
          }}
          className={`mobile-nav-btn ${mobileTab === 'editor' && viewMode !== 'graph-full' ? 'active' : ''}`}
        >
          <Edit3 size={18} />
          <span>Editor</span>
        </button>

        <button
          onClick={() => {
            setMobileTab('graph');
            setViewMode('graph-full');
          }}
          className={`mobile-nav-btn ${mobileTab === 'graph' || viewMode === 'graph-full' ? 'active' : ''}`}
        >
          <Network size={18} />
          <span>Graph</span>
        </button>

        <button
          onClick={() => {
            setMobileTab('backlinks');
            setViewMode('split');
          }}
          className={`mobile-nav-btn ${mobileTab === 'backlinks' ? 'active' : ''}`}
        >
          <Link2 size={18} />
          <span>Links</span>
        </button>
      </nav>

      {/* 5. Global Search Modal (Ctrl+P / Cmd+K) */}
      <SearchModal />

      {/* 6. Vault Portability Modal */}
      <VaultExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <WikiProvider>
      <AppContent />
    </WikiProvider>
  );
}

export default App;
