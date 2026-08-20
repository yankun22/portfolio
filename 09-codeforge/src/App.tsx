import { useState, useEffect } from 'react';
import type { AppStudioMode } from './components/common/Header';
import type { CodeSnippet } from './types/snippet';
import {
  loadSnippetsFromStorage,
  saveSnippetsToStorage
} from './services/storageService';
import {
  encodeSharePayloadToUrl,
  decodeSharePayloadFromUrl
} from './services/urlShareService';
import { Header } from './components/common/Header';
import { Toast, type ToastMessage } from './components/common/Toast';
import { SandboxStudio } from './components/sandbox/SandboxStudio';
import { RegexStudio } from './components/regex/RegexStudio';
import { SqlStudio } from './components/sql/SqlStudio';
import { SnippetVaultView } from './components/snippets/SnippetVaultView';
import confetti from 'canvas-confetti';

export function App() {
  const [mode, setMode] = useState<AppStudioMode>('sandbox');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => loadSnippetsFromStorage());
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Persist snippets
  useEffect(() => {
    saveSnippetsToStorage(snippets);
  }, [snippets]);

  // Check URL hash on initial load
  useEffect(() => {
    const shared = decodeSharePayloadFromUrl();
    if (shared) {
      if (shared.mode === 'regex') setMode('regex');
      else if (shared.mode === 'sql') setMode('sql');
      else setMode('sandbox');

      setToast({
        id: `toast-${Date.now()}`,
        type: 'info',
        text: 'Loaded shared configuration from URL permalink.'
      });
    }
  }, []);

  const handleShare = () => {
    const permalink = encodeSharePayloadToUrl({ mode });
    navigator.clipboard.writeText(permalink);
    setToast({
      id: `toast-${Date.now()}`,
      type: 'success',
      text: 'Shareable permalink copied to clipboard! 🔗'
    });
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleSaveSnippet = (snippet: CodeSnippet) => {
    setSnippets((prev) => [snippet, ...prev]);
    setToast({
      id: `toast-${Date.now()}`,
      type: 'success',
      text: `Snippet "${snippet.title}" saved to vault.`
    });
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
    setToast({
      id: `toast-${Date.now()}`,
      type: 'info',
      text: 'Snippet removed from vault.'
    });
  };

  const handleToggleFavorite = (id: string) => {
    setSnippets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s))
    );
  };

  const handleImportSnippets = (imported: CodeSnippet[]) => {
    setSnippets((prev) => [...imported, ...prev]);
    setToast({
      id: `toast-${Date.now()}`,
      type: 'success',
      text: `Successfully imported ${imported.length} snippets into vault!`
    });
  };

  return (
    <div className="app-container">
      <Header
        mode={mode}
        onModeChange={setMode}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onShare={handleShare}
      />

      <main className="main-content">
        {mode === 'sandbox' && <SandboxStudio />}
        {mode === 'regex' && <RegexStudio />}
        {mode === 'sql' && <SqlStudio />}
        {mode === 'snippets' && (
          <SnippetVaultView
            snippets={snippets}
            onSaveSnippet={handleSaveSnippet}
            onDeleteSnippet={handleDeleteSnippet}
            onToggleFavorite={handleToggleFavorite}
            onImportSnippets={handleImportSnippets}
          />
        )}
      </main>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

export default App;
