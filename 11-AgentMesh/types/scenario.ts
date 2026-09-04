import { AgentStatus, PromptTrace, VectorChunk } from './agent';

export interface ScenarioStep {
  stepNumber: number;
  title: string;
  description: string;
  fromAgentId: string;
  toAgentId: string;
  payloadName: string;
  payloadSizeKB: number;
  payloadData: Record<string, unknown>;
  agentUpdates: {
    [agentId: string]: {
      status: AgentStatus;
      confidence: number;
      task: string;
      deltaTokens: number;
      latencyMs: number;
    };
  };
  newTraces?: {
    [agentId: string]: PromptTrace[];
  };
  newVectorChunks?: {
    [agentId: string]: VectorChunk[];
  };
  quorumCount: number; // e.g. 1 to 5
  consensusState: 'PROPOSING' | 'SANDBOXING' | 'ISOLATING' | 'SYNTHESIZING' | 'COMMITTED';
  logSummary: string;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  targetSystem: string;
  initialAnomaly: string;
  estimatedSteps: number;
  steps: ScenarioStep[];
}

export interface ParticleBeam {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  color: string;
  speed: number;
  label: string;
  size: number;
  particles: {
    progress: number;
    speed: number;
    size: number;
    tailAlpha: number;
    offsetY: number;
  }[];
}
