import { create } from 'zustand';
import {
  PromptCandidate,
  VariableSet,
  EvalTestCase,
  ModelPricingTier,
} from '../types/prompt';
import {
  INITIAL_CANDIDATE_A,
  INITIAL_CANDIDATE_B,
  PRESET_VARIABLE_SETS,
  PREDEFINED_EVAL_TESTS,
  MODEL_PRICING_TIERS,
  SIMULATED_RESPONSES,
} from '../data/promptData';

interface PromptForgeState {
  // Candidates A & B
  candidateA: PromptCandidate;
  candidateB: PromptCandidate;
  updateCandidate: (id: 'A' | 'B', updates: Partial<PromptCandidate>) => void;

  // Variables
  variableSets: VariableSet[];
  activeVariableSet: VariableSet;
  setActiveVariableSet: (vSet: VariableSet) => void;

  // Evals & Guardrails
  evalTests: EvalTestCase[];
  selectedEvalTest: EvalTestCase | null;
  setSelectedEvalTest: (test: EvalTestCase | null) => void;

  // Economics & Prompt Caching
  modelPricingTiers: ModelPricingTier[];
  selectedPricingTier: ModelPricingTier;
  setSelectedPricingTier: (tier: ModelPricingTier) => void;
  monthlyTokensMillion: number;
  setMonthlyTokensMillion: (val: number) => void;
  promptCacheHitRate: number; // e.g. 85%
  setPromptCacheHitRate: (val: number) => void;

  // Streaming Engine
  isStreaming: boolean;
  startStreamingComparison: () => void;
  resetOutputs: () => void;

  // Mobile Tabs
  activeMobileTab: 'arena' | 'evals' | 'diff';
  setActiveMobileTab: (tab: 'arena' | 'evals' | 'diff') => void;
}

export const usePromptForgeStore = create<PromptForgeState>((set, get) => ({
  candidateA: {
    ...INITIAL_CANDIDATE_A,
    output: SIMULATED_RESPONSES.CandidateA.billing_duplicate,
    outputTokens: 78,
    isCompleted: true,
  },
  candidateB: {
    ...INITIAL_CANDIDATE_B,
    output: SIMULATED_RESPONSES.CandidateB.billing_duplicate,
    outputTokens: 64,
    isCompleted: true,
  },

  updateCandidate: (id, updates) => {
    if (id === 'A') {
      set({ candidateA: { ...get().candidateA, ...updates } });
    } else {
      set({ candidateB: { ...get().candidateB, ...updates } });
    }
  },

  variableSets: PRESET_VARIABLE_SETS,
  activeVariableSet: PRESET_VARIABLE_SETS[0],
  setActiveVariableSet: (vSet) => {
    set({
      activeVariableSet: vSet,
    });
    // Immediately trigger fresh streaming comparison for the new variable context
    get().startStreamingComparison();
  },

  evalTests: PREDEFINED_EVAL_TESTS,
  selectedEvalTest: PREDEFINED_EVAL_TESTS[0],
  setSelectedEvalTest: (test) => set({ selectedEvalTest: test }),

  modelPricingTiers: MODEL_PRICING_TIERS,
  selectedPricingTier: MODEL_PRICING_TIERS[0],
  setSelectedPricingTier: (tier) => set({ selectedPricingTier: tier }),

  monthlyTokensMillion: 25,
  setMonthlyTokensMillion: (val) => set({ monthlyTokensMillion: val }),

  promptCacheHitRate: 85,
  setPromptCacheHitRate: (val) => set({ promptCacheHitRate: val }),

  isStreaming: false,

  resetOutputs: () => {
    set({
      candidateA: { ...get().candidateA, output: '', outputTokens: 0, isStreaming: false, isCompleted: false },
      candidateB: { ...get().candidateB, output: '', outputTokens: 0, isStreaming: false, isCompleted: false },
      isStreaming: false,
    });
  },

  startStreamingComparison: () => {
    if (get().isStreaming) return;

    const { activeVariableSet } = get();
    const targetKey = (activeVariableSet.id as keyof typeof SIMULATED_RESPONSES.CandidateA) || 'billing_duplicate';

    const fullResponseA = SIMULATED_RESPONSES.CandidateA[targetKey] || SIMULATED_RESPONSES.CandidateA.billing_duplicate;
    const fullResponseB = SIMULATED_RESPONSES.CandidateB[targetKey] || SIMULATED_RESPONSES.CandidateB.billing_duplicate;

    const wordsA = fullResponseA.split(' ');
    const wordsB = fullResponseB.split(' ');

    set({
      isStreaming: true,
      candidateA: { ...get().candidateA, output: '', outputTokens: 0, isStreaming: true, isCompleted: false },
      candidateB: { ...get().candidateB, output: '', outputTokens: 0, isStreaming: true, isCompleted: false },
    });

    let indexA = 0;
    let indexB = 0;

    // Timer A: interval based on tokensPerSec
    const speedA = Math.max(10, Math.round(1000 / get().candidateA.tokensPerSec));
    const timerA = setInterval(() => {
      indexA += 1;
      const currentTextA = wordsA.slice(0, indexA).join(' ');
      const tokenCountA = Math.round(indexA * 1.3);

      set({
        candidateA: {
          ...get().candidateA,
          output: currentTextA,
          outputTokens: tokenCountA,
          isCompleted: indexA >= wordsA.length,
          isStreaming: indexA < wordsA.length,
        },
      });

      if (indexA >= wordsA.length) {
        clearInterval(timerA);
        if (indexB >= wordsB.length) {
          set({ isStreaming: false });
        }
      }
    }, speedA);

    // Timer B: interval based on tokensPerSec
    const speedB = Math.max(10, Math.round(1000 / get().candidateB.tokensPerSec));
    const timerB = setInterval(() => {
      indexB += 1;
      const currentTextB = wordsB.slice(0, indexB).join(' ');
      const tokenCountB = Math.round(indexB * 1.3);

      set({
        candidateB: {
          ...get().candidateB,
          output: currentTextB,
          outputTokens: tokenCountB,
          isCompleted: indexB >= wordsB.length,
          isStreaming: indexB < wordsB.length,
        },
      });

      if (indexB >= wordsB.length) {
        clearInterval(timerB);
        if (indexA >= wordsA.length) {
          set({ isStreaming: false });
        }
      }
    }, speedB);
  },

  activeMobileTab: 'arena',
  setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),
}));
