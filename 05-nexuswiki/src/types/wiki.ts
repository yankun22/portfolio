import type { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  pinned?: boolean;
}

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  title: string;
  degree: number;
  tags: string[];
  radius: number;
  isGhost?: boolean;
  color?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value?: number;
}

export interface BacklinkItem {
  sourceNoteId: string;
  sourceNoteTitle: string;
  matchedSnippet: string;
  isExplicit: boolean; // true = [[Link]], false = plain text mention
  lineIndex?: number;
}

export interface SearchMatch {
  noteId: string;
  noteTitle: string;
  matchType: 'title' | 'tag' | 'header' | 'content';
  snippet: string;
  score: number;
}

export type ViewMode = 'split' | 'editor' | 'preview' | 'graph-full';

export interface GraphPhysicsSettings {
  chargeStrength: number; // e.g. -180
  linkDistance: number;   // e.g. 80
  collisionRadius: number;// e.g. 24
  particleFlow: boolean;
  showOrphans: boolean;
  colorByTag: boolean;
  is3dPerspective: boolean;
}
