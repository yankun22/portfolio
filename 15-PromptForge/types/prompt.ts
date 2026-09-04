export interface PromptCandidate {
  id: 'A' | 'B';
  name: string;
  badge: string;
  systemMessage: string;
  template: string;
  temperature: number;
  tokensPerSec: number;
  output: string;
  isStreaming: boolean;
  isCompleted: boolean;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}

export interface VariableSet {
  id: string;
  label: string;
  customerQuery: string;
  retrievedContext: string;
  tone: string;
  userId: string;
  isMaliciousInjection?: boolean;
}

export interface EvalTestCase {
  id: string;
  title: string;
  rubric: string;
  description: string;
  targetCriterion: string;
  scoreA: number; // 0 - 100
  scoreB: number; // 0 - 100
  statusA: 'PASS' | 'FAIL' | 'PENDING';
  statusB: 'PASS' | 'FAIL' | 'PENDING';
  diagnosticA: string;
  diagnosticB: string;
  guardrailTriggeredA: boolean;
  guardrailTriggeredB: boolean;
}

export interface DiffToken {
  type: 'SAME' | 'ADDED' | 'REMOVED';
  text: string;
}

export interface ModelPricingTier {
  id: string;
  name: string;
  provider: string;
  inputPer1M: number;
  cachedInputPer1M: number;
  outputPer1M: number;
}
