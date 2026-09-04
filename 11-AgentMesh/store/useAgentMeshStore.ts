import { create } from 'zustand';
import { AgentNode, PromptTrace, SystemParameters } from '../types/agent';
import { Scenario, ParticleBeam } from '../types/scenario';
import { INITIAL_AGENTS } from '../data/archetypes';
import { SCENARIOS } from '../data/scenarios';

interface GlobalMetrics {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  p99LatencyMs: number;
  latencyHistory: number[];
  quorumCount: number;
  consensusState: string;
  systemStatus: 'OPTIMAL' | 'ANOMALY_DETECTED' | 'QUORUM_VOTING' | 'RECONCILED';
}

interface AgentMeshState {
  agents: AgentNode[];
  selectedAgentId: string | null;
  scenarios: Scenario[];
  activeScenarioId: string;
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: 1 | 2 | 4;
  simulationStatus: 'idle' | 'running' | 'paused' | 'completed';
  activeBeams: ParticleBeam[];
  globalMetrics: GlobalMetrics;
  lastEventLog: string;

  activeMobileTab: 'topology' | 'controls' | 'pipeline' | 'inspector';

  // Actions
  selectAgent: (id: string | null) => void;
  setActiveMobileTab: (tab: 'topology' | 'controls' | 'pipeline' | 'inspector') => void;
  setActiveScenario: (id: string) => void;
  triggerScenario: (scenarioId?: string) => void;
  stepForward: () => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: 1 | 2 | 4) => void;
  resetSimulation: () => void;
  addTraceToAgent: (agentId: string, trace: PromptTrace) => void;
  updateAgentSystemParams: (agentId: string, params: Partial<SystemParameters>) => void;
}

const INITIAL_METRICS: GlobalMetrics = {
  totalTokens: 28590,
  promptTokens: 21450,
  completionTokens: 7140,
  cachedTokens: 14200,
  p99LatencyMs: 16,
  latencyHistory: [14, 18, 15, 16, 17, 15, 16, 18, 16, 15, 14, 17, 16, 15, 18, 16],
  quorumCount: 0,
  consensusState: 'IDLE_MONITORING',
  systemStatus: 'OPTIMAL',
};

const createParticleArray = (count = 14) => {
  return Array.from({ length: count }, (_, i) => ({
    progress: (i / count) % 1,
    speed: 0.006 + Math.random() * 0.006,
    size: 2 + Math.random() * 3,
    tailAlpha: 0.35 + Math.random() * 0.45,
    offsetY: (Math.random() - 0.5) * 6,
  }));
};

export const useAgentMeshStore = create<AgentMeshState>((set, get) => ({
  agents: JSON.parse(JSON.stringify(INITIAL_AGENTS)),
  selectedAgentId: null,
  scenarios: SCENARIOS,
  activeScenarioId: 'financial-audit-anomaly',
  currentStepIndex: -1,
  isPlaying: false,
  playbackSpeed: 1,
  simulationStatus: 'idle',
  activeBeams: [],
  globalMetrics: INITIAL_METRICS,
  lastEventLog: 'Mesh engine initialized. 5/5 autonomous archetypes synced & listening.',
  activeMobileTab: 'topology',

  selectAgent: (id: string | null) => {
    set({ selectedAgentId: id });
  },

  setActiveMobileTab: (tab: 'topology' | 'controls' | 'pipeline' | 'inspector') => {
    set({ activeMobileTab: tab });
  },

  setActiveScenario: (id: string) => {
    const isPlaying = get().isPlaying;
    if (isPlaying) {
      set({ isPlaying: false });
    }
    set({
      activeScenarioId: id,
      currentStepIndex: -1,
      simulationStatus: 'idle',
      activeBeams: [],
      agents: JSON.parse(JSON.stringify(INITIAL_AGENTS)),
      globalMetrics: {
        ...INITIAL_METRICS,
        consensusState: 'READY_TO_TRIGGER',
        systemStatus: 'OPTIMAL',
      },
      lastEventLog: `Scenario loaded: ${SCENARIOS.find((s) => s.id === id)?.title || id}`,
    });
  },

  triggerScenario: (scenarioId?: string) => {
    const targetId = scenarioId || get().activeScenarioId;
    const targetScenario = get().scenarios.find((s) => s.id === targetId) || get().scenarios[0];

    // Reset agents to base before triggering
    const freshAgents: AgentNode[] = JSON.parse(JSON.stringify(INITIAL_AGENTS));

    // First step
    const firstStep = targetScenario.steps[0];
    const initialBeam: ParticleBeam = {
      id: `beam-${firstStep.fromAgentId}-${firstStep.toAgentId}-0`,
      fromNodeId: firstStep.fromAgentId,
      toNodeId: firstStep.toAgentId,
      color: '#2EE59D',
      speed: 1,
      label: firstStep.payloadName,
      size: 3,
      particles: createParticleArray(16),
    };

    // Apply first step agent updates
    const updatedAgents = freshAgents.map((ag) => {
      const update = firstStep.agentUpdates[ag.id];
      if (update) {
        return {
          ...ag,
          status: update.status,
          confidence: update.confidence,
          currentTask: update.task,
          tokenCount: ag.tokenCount + update.deltaTokens,
          latencyMs: update.latencyMs,
        };
      }
      return ag;
    });

    const stepDeltaTokens = Object.values(firstStep.agentUpdates).reduce(
      (acc, curr) => acc + curr.deltaTokens,
      0
    );
    const maxStepLatency = Math.max(
      ...Object.values(firstStep.agentUpdates).map((u) => u.latencyMs),
      24
    );

    set((state) => ({
      activeScenarioId: targetId,
      currentStepIndex: 0,
      simulationStatus: 'running',
      isPlaying: true,
      agents: updatedAgents,
      activeBeams: [initialBeam],
      globalMetrics: {
        ...state.globalMetrics,
        totalTokens: state.globalMetrics.totalTokens + stepDeltaTokens,
        promptTokens: state.globalMetrics.promptTokens + Math.floor(stepDeltaTokens * 0.7),
        completionTokens: state.globalMetrics.completionTokens + Math.floor(stepDeltaTokens * 0.3),
        p99LatencyMs: maxStepLatency,
        latencyHistory: [...state.globalMetrics.latencyHistory.slice(1), maxStepLatency],
        quorumCount: firstStep.quorumCount,
        consensusState: firstStep.consensusState,
        systemStatus: 'ANOMALY_DETECTED',
      },
      lastEventLog: `[STEP 1/5] ${firstStep.logSummary}`,
    }));
  },

  stepForward: () => {
    const { currentStepIndex, activeScenarioId, scenarios, agents, globalMetrics } = get();
    const scenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
    const nextIndex = currentStepIndex + 1;

    if (nextIndex >= scenario.steps.length) {
      set({
        simulationStatus: 'completed',
        isPlaying: false,
        activeBeams: [],
        globalMetrics: {
          ...globalMetrics,
          systemStatus: 'RECONCILED',
          consensusState: 'COMMITTED_FINAL',
        },
        lastEventLog: `Consensus loop completed. All 5 steps committed. Quorum 5/5 verified.`,
      });
      return;
    }

    const nextStep = scenario.steps[nextIndex];
    const newBeam: ParticleBeam = {
      id: `beam-${nextStep.fromAgentId}-${nextStep.toAgentId}-${nextIndex}`,
      fromNodeId: nextStep.fromAgentId,
      toNodeId: nextStep.toAgentId,
      color: nextIndex === 4 ? '#F43F5E' : nextIndex === 3 ? '#2EE59D' : '#38BDF8',
      speed: 1,
      label: nextStep.payloadName,
      size: 3,
      particles: createParticleArray(16),
    };

    const updatedAgents = agents.map((ag) => {
      const update = nextStep.agentUpdates[ag.id];
      if (update) {
        // Append trace log to active sender or receiver
        const newTrace: PromptTrace = {
          id: `trace-dyn-${Date.now()}-${ag.id}`,
          stepNumber: nextIndex + 1,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
          }),
          type: ag.id === nextStep.fromAgentId ? 'tool_call' : 'thought',
          content:
            ag.id === nextStep.fromAgentId
              ? `Transmitting ${nextStep.payloadName} payload to ${nextStep.toAgentId}. Confidence: ${update.confidence}%`
              : `Ingested payload from ${nextStep.fromAgentId}. Task: ${update.task}`,
          latencyMs: update.latencyMs,
          confidenceScore: update.confidence,
        };

        return {
          ...ag,
          status: update.status,
          confidence: update.confidence,
          currentTask: update.task,
          tokenCount: ag.tokenCount + update.deltaTokens,
          latencyMs: update.latencyMs,
          traces: [newTrace, ...ag.traces.slice(0, 15)],
        };
      }
      return ag;
    });

    const stepDeltaTokens = Object.values(nextStep.agentUpdates).reduce(
      (acc, curr) => acc + curr.deltaTokens,
      0
    );
    const maxStepLatency = Math.max(
      ...Object.values(nextStep.agentUpdates).map((u) => u.latencyMs),
      20
    );

    const isLastStep = nextIndex === scenario.steps.length - 1;

    set({
      currentStepIndex: nextIndex,
      simulationStatus: isLastStep ? 'completed' : 'running',
      isPlaying: !isLastStep && get().isPlaying,
      agents: updatedAgents,
      activeBeams: [newBeam],
      globalMetrics: {
        ...globalMetrics,
        totalTokens: globalMetrics.totalTokens + stepDeltaTokens,
        promptTokens: globalMetrics.promptTokens + Math.floor(stepDeltaTokens * 0.65),
        completionTokens: globalMetrics.completionTokens + Math.floor(stepDeltaTokens * 0.35),
        p99LatencyMs: maxStepLatency,
        latencyHistory: [...globalMetrics.latencyHistory.slice(1), maxStepLatency],
        quorumCount: nextStep.quorumCount,
        consensusState: nextStep.consensusState,
        systemStatus: isLastStep
          ? 'RECONCILED'
          : nextStep.quorumCount >= 3
          ? 'QUORUM_VOTING'
          : 'ANOMALY_DETECTED',
      },
      lastEventLog: `[STEP ${nextIndex + 1}/5] ${nextStep.logSummary}`,
    });
  },

  togglePlay: () => {
    const isPlaying = get().isPlaying;
    const status = get().simulationStatus;
    if (status === 'completed' || get().currentStepIndex === -1) {
      get().triggerScenario();
      return;
    }
    set({
      isPlaying: !isPlaying,
      simulationStatus: !isPlaying ? 'running' : 'paused',
    });
  },

  setPlaybackSpeed: (speed: 1 | 2 | 4) => {
    set({ playbackSpeed: speed });
  },

  resetSimulation: () => {
    set({
      currentStepIndex: -1,
      isPlaying: false,
      simulationStatus: 'idle',
      activeBeams: [],
      agents: JSON.parse(JSON.stringify(INITIAL_AGENTS)),
      globalMetrics: INITIAL_METRICS,
      lastEventLog: 'Consensus engine reset. All agent nodes returned to idle standby state.',
    });
  },

  addTraceToAgent: (agentId: string, trace: PromptTrace) => {
    set((state) => ({
      agents: state.agents.map((ag) =>
        ag.id === agentId ? { ...ag, traces: [trace, ...ag.traces] } : ag
      ),
    }));
  },

  updateAgentSystemParams: (agentId: string, params: Partial<SystemParameters>) => {
    set((state) => ({
      agents: state.agents.map((ag) =>
        ag.id === agentId
          ? { ...ag, systemParams: { ...ag.systemParams, ...params } }
          : ag
      ),
    }));
  },
}));
