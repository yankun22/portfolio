import type { CodeSnippet } from '../types/snippet';
import type { QueryHistoryItem } from '../types/sql';
import { DEFAULT_SNIPPETS } from '../data/defaultSnippets';

const STORAGE_KEYS = {
  SNIPPETS: 'codeforge_snippets_vault',
  QUERY_HISTORY: 'codeforge_sql_query_history',
  THEME: 'codeforge_theme_mode'
};

export function loadSnippetsFromStorage(): CodeSnippet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SNIPPETS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_SNIPPETS;
}

export function saveSnippetsToStorage(snippets: CodeSnippet[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(snippets));
  } catch {}
}

export function loadQueryHistory(): QueryHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUERY_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export function saveQueryHistory(history: QueryHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUERY_HISTORY, JSON.stringify(history.slice(0, 50)));
  } catch {}
}

export function exportSnippetToGistJson(snippet: CodeSnippet): string {
  const filename = `${snippet.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${
    snippet.language === 'javascript'
      ? 'js'
      : snippet.language === 'html'
      ? 'html'
      : snippet.language === 'css'
      ? 'css'
      : snippet.language === 'sql'
      ? 'sql'
      : 'txt'
  }`;

  const gistPayload = {
    description: snippet.description || snippet.title,
    public: true,
    files: {
      [filename]: {
        content: snippet.code
      }
    }
  };

  return JSON.stringify(gistPayload, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string = 'application/json'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
