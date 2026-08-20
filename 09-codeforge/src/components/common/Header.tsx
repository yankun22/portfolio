import React from 'react';
import { Code2, Search, Database, Bookmark, Share2, Sun, Moon, Sparkles } from 'lucide-react';

export type AppStudioMode = 'sandbox' | 'regex' | 'sql' | 'snippets';

interface HeaderProps {
  mode: AppStudioMode;
  onModeChange: (mode: AppStudioMode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  isDarkMode,
  onToggleDarkMode,
  onShare
}) => {
  return (
    <>
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="brand-title">CodeForge</div>
          </div>
        </div>

        {/* Studio View Navigation Tabs */}
        <nav className="view-tabs">
          <button
            className={`tab-btn ${mode === 'sandbox' ? 'active' : ''}`}
            onClick={() => onModeChange('sandbox')}
          >
            <Code2 size={15} />
            <span>Sandbox</span>
          </button>

          <button
            className={`tab-btn ${mode === 'regex' ? 'active' : ''}`}
            onClick={() => onModeChange('regex')}
          >
            <Search size={15} />
            <span>Regex Visualizer</span>
          </button>

          <button
            className={`tab-btn ${mode === 'sql' ? 'active' : ''}`}
            onClick={() => onModeChange('sql')}
          >
            <Database size={15} />
            <span>SQLite Studio</span>
          </button>

          <button
            className={`tab-btn ${mode === 'snippets' ? 'active' : ''}`}
            onClick={() => onModeChange('snippets')}
          >
            <Bookmark size={15} />
            <span>Snippet Vault</span>
          </button>
        </nav>

        {/* Global Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn-primary" onClick={onShare} title="Copy shareable permalink with encoded state">
            <Share2 size={14} />
            <span>Share</span>
          </button>

          <button
            className="btn-icon"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-bottom-btn ${mode === 'sandbox' ? 'active' : ''}`}
          onClick={() => onModeChange('sandbox')}
        >
          <Code2 size={18} />
          <span>Sandbox</span>
        </button>

        <button
          className={`mobile-bottom-btn ${mode === 'regex' ? 'active' : ''}`}
          onClick={() => onModeChange('regex')}
        >
          <Search size={18} />
          <span>Regex</span>
        </button>

        <button
          className={`mobile-bottom-btn ${mode === 'sql' ? 'active' : ''}`}
          onClick={() => onModeChange('sql')}
        >
          <Database size={18} />
          <span>SQL</span>
        </button>

        <button
          className={`mobile-bottom-btn ${mode === 'snippets' ? 'active' : ''}`}
          onClick={() => onModeChange('snippets')}
        >
          <Bookmark size={18} />
          <span>Vault</span>
        </button>
      </nav>
    </>
  );
};
