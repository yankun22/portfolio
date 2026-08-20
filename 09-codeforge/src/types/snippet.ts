export type SnippetLanguage = 'html' | 'css' | 'javascript' | 'sql' | 'regex' | 'json';

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: SnippetLanguage;
  code: string;
  secondaryCode?: string; // e.g. CSS/JS companion or sample text
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorite?: boolean;
}

export interface SharePayload {
  mode: 'sandbox' | 'regex' | 'sql' | 'snippets';
  sandbox?: {
    html: string;
    css: string;
    js: string;
    cdns?: string[];
  };
  regex?: {
    pattern: string;
    flags: string;
    testText: string;
  };
  sql?: {
    query: string;
    dbPreset?: string;
  };
}
