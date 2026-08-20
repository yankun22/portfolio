export interface RegexFlags {
  global: boolean; // g
  ignoreCase: boolean; // i
  multiline: boolean; // m
  dotAll: boolean; // s
  unicode: boolean; // u
  sticky: boolean; // y
}

export interface CaptureGroupMatch {
  groupIndex: number;
  groupName?: string;
  value: string;
  start: number;
  end: number;
  color: string;
}

export interface RegexMatchResult {
  fullMatch: string;
  index: number;
  length: number;
  groups: CaptureGroupMatch[];
}

export interface RegexTokenExplanation {
  token: string;
  description: string;
  category: 'literal' | 'quantifier' | 'group' | 'anchor' | 'character_class' | 'assertion';
}

export interface RailroadNode {
  type: 'literal' | 'range' | 'group' | 'branch' | 'quantifier' | 'anchor' | 'root';
  label: string;
  subLabel?: string;
  children?: RailroadNode[];
  branches?: RailroadNode[][];
  quantifier?: { min: number; max?: number; greedy: boolean; text: string };
  isCapturing?: boolean;
  groupNumber?: number;
}

export interface RegexPreset {
  id: string;
  name: string;
  category: 'Web & Network' | 'Validation' | 'Data Parsing' | 'Security';
  pattern: string;
  flags: string;
  description: string;
  sampleText: string;
}
