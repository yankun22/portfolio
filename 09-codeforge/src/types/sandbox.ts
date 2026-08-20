export type EditorTab = 'html' | 'css' | 'js';

export type SandboxLayout = 'split-horizontal' | 'split-vertical' | 'editor-only' | 'preview-only';

export type ConsoleLogLevel = 'log' | 'info' | 'warn' | 'error' | 'table';

export interface ConsoleMessage {
  id: string;
  level: ConsoleLogLevel;
  args: unknown[];
  formattedText: string;
  timestamp: string;
  count: number;
}

export interface CdnPackage {
  id: string;
  name: string;
  category: 'css' | 'js';
  url: string;
  description: string;
  popular?: boolean;
}

export interface SandboxTemplate {
  id: string;
  title: string;
  description: string;
  category: 'UI Components' | 'Visual FX' | 'Canvas 2D/3D' | 'Logic';
  html: string;
  css: string;
  js: string;
  cdns?: string[];
}

export interface SandboxProjectState {
  html: string;
  css: string;
  js: string;
  cdns: string[];
  autoRun: boolean;
  layout: SandboxLayout;
}
