export type AgentArchetype =
  | 'ROUTER'
  | 'SPECIALIST'
  | 'SYNTHESIZER'
  | 'GUARDRAIL'
  | 'ARBITER';

export type AgentStatus =
  | 'idle'
  | 'analyzing'
  | 'verifying'
  | 'synthesizing'
  | 'quorum_voting'
  | 'committed'
  | 'error';

export interface VectorChunk {
  id: string;
  content: string;
  similarity: number;
  dimension: number;
  embeddingPreview: number[];
  tier: 'L1 Working RAM' | 'L2 KV Cache' | 'Cold Snapshot';
  timestamp: string;
  source: string;
  tokens: number;
}

export interface PromptTrace {
  id: string;
  stepNumber: number;
  timestamp: string;
  type: 'thought' | 'tool_call' | 'tool_result' | 'agent_output';
  content: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: Record<string, unknown>;
  latencyMs: number;
  confidenceScore?: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  returnType: string;
}

export interface SystemParameters {
  model: string;
  temperature: number;
  topP: number;
  maxContextTokens: number;
  systemPrompt: string;
  isolationLevel: string;
  governancePolicy: string;
}

export interface AgentNode {
  id: string;
  name: string;
  archetype: AgentArchetype;
  roleTitle: string;
  tagline: string;
  color: string;
  accentColor: string;
  glowColor: string;
  position: { x: number; y: number }; // normalized -1..1 or pixel relative
  status: AgentStatus;
  confidence: number; // 0 - 100
  currentTask: string;
  tokenCount: number;
  latencyMs: number;
  memoryBufferKB: number;
  systemParams: SystemParameters;
  tools: ToolDefinition[];
  vectorContext: VectorChunk[];
  traces: PromptTrace[];
}
