import React from 'react';
import { WikiProvider, useWiki } from './context/WikiContext';
import { Sidebar } from './components/Sidebar';
import { MarkdownEditor } from './components/MarkdownEditor';
import { KnowledgeGraph } from './components/KnowledgeGraph';
import { BacklinksPanel } from './components/BacklinksPanel';
import { SearchModal } from './components/SearchModal';
import { VaultExportModal } from './components/VaultExportModal';
import { ArrowLeft, Network } from 'lucide-react';

const AppContent: React.FC = () => {
  const { viewMode, setViewMode, isExportOpen, setIsExportOpen } = useWiki();

  return (
    <div className="app-layout">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar onOpenExportModal={() => setIsExportOpen(true)} />

      {/* 2. Central Workspace (Editor or Fullscreen Graph) */}
      <main style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        {viewMode === 'graph-full' ? (
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
                onClick={() => setViewMode('split')}
                className="btn btn-sm"
                style={{ gap: '6px' }}
              >
                <ArrowLeft size={14} />
                <span>Return to Editor</span>
              </button>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Network size={13} /> Fullscreen Force-Directed Neural Mesh
              </span>
            </div>
            <KnowledgeGraph />
          </div>
        ) : (
          <MarkdownEditor />
        )}
      </main>

      {/* 3. Right Backlinks & Mentions Panel */}
      {viewMode !== 'graph-full' && <BacklinksPanel />}

      {/* 4. Global Search Modal (Ctrl+P / Cmd+K) */}
      <SearchModal />

      {/* 5. Vault Portability Modal */}
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
