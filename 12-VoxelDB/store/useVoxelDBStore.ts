import { create } from 'zustand';
import {
  ClusterCategory,
  DistanceMetric,
  HNSWProbe,
  QuantizationMode,
  VectorEmbedding,
} from '../types/vector';
import { generateClusteredVectors, CLUSTERS } from '../data/vectorClusters';
import { findTopKNearest } from '../utils/distanceMetrics';

interface VoxelDBState {
  vectors: VectorEmbedding[];
  selectedVectorId: string | null;
  hoveredVectorId: string | null;
  activeMetric: DistanceMetric;
  topK: number;
  quantizationMode: QuantizationMode;
  activeProbe: HNSWProbe | null;
  activeClusters: Record<ClusterCategory, boolean>;
  isInspectorOpen: boolean;
  isAutoRotate: boolean;
  activeHNSWLayerFilter: number | 'all';
  p99QueryLatencyMs: number;

  // Actions
  selectVector: (id: string | null) => void;
  setHoveredVector: (id: string | null) => void;
  setMetric: (metric: DistanceMetric) => void;
  setTopK: (k: number) => void;
  setQuantizationMode: (mode: QuantizationMode) => void;
  toggleCluster: (clusterId: ClusterCategory) => void;
  toggleInspector: (open?: boolean) => void;
  toggleAutoRotate: () => void;
  setHNSWLayerFilter: (layer: number | 'all') => void;
  computeProbeForVector: (vector: VectorEmbedding, metric?: DistanceMetric, k?: number) => void;
}

const initialVectors = generateClusteredVectors();
// Default select first code vector as initial probe
const defaultSelected = initialVectors[0];
const defaultProbe = findTopKNearest(defaultSelected, initialVectors, 8, 'cosine');

export const useVoxelDBStore = create<VoxelDBState>((set, get) => ({
  vectors: initialVectors,
  selectedVectorId: defaultSelected.id,
  hoveredVectorId: null,
  activeMetric: 'cosine',
  topK: 8,
  quantizationMode: 'INT8',
  activeProbe: defaultProbe,
  activeClusters: {
    code: true,
    legal: true,
    biomedical: true,
    finance: true,
    creative: true,
  },
  isInspectorOpen: false,
  isAutoRotate: false,
  activeHNSWLayerFilter: 'all',
  p99QueryLatencyMs: 2.38,

  selectVector: (id: string | null) => {
    if (!id) {
      set({ selectedVectorId: null, activeProbe: null });
      return;
    }

    const { vectors, activeMetric, topK } = get();
    const target = vectors.find((v) => v.id === id);
    if (!target) return;

    const probe = findTopKNearest(target, vectors, topK, activeMetric);
    set({
      selectedVectorId: id,
      activeProbe: probe,
      isInspectorOpen: true,
      p99QueryLatencyMs: probe.searchLatencyMs,
    });
  },

  setHoveredVector: (id: string | null) => {
    set({ hoveredVectorId: id });
  },

  setMetric: (metric: DistanceMetric) => {
    const { selectedVectorId, vectors, topK } = get();
    set({ activeMetric: metric });

    if (selectedVectorId) {
      const target = vectors.find((v) => v.id === selectedVectorId);
      if (target) {
        const probe = findTopKNearest(target, vectors, topK, metric);
        set({
          activeProbe: probe,
          p99QueryLatencyMs: probe.searchLatencyMs,
        });
      }
    }
  },

  setTopK: (k: number) => {
    const { selectedVectorId, vectors, activeMetric } = get();
    set({ topK: k });

    if (selectedVectorId) {
      const target = vectors.find((v) => v.id === selectedVectorId);
      if (target) {
        const probe = findTopKNearest(target, vectors, k, activeMetric);
        set({
          activeProbe: probe,
          p99QueryLatencyMs: probe.searchLatencyMs,
        });
      }
    }
  },

  setQuantizationMode: (mode: QuantizationMode) => {
    set({ quantizationMode: mode });
  },

  toggleCluster: (clusterId: ClusterCategory) => {
    set((state) => ({
      activeClusters: {
        ...state.activeClusters,
        [clusterId]: !state.activeClusters[clusterId],
      },
    }));
  },

  toggleInspector: (open?: boolean) => {
    set((state) => ({
      isInspectorOpen: open !== undefined ? open : !state.isInspectorOpen,
    }));
  },

  toggleAutoRotate: () => {
    set((state) => ({
      isAutoRotate: !state.isAutoRotate,
    }));
  },

  setHNSWLayerFilter: (layer: number | 'all') => {
    set({ activeHNSWLayerFilter: layer });
  },

  computeProbeForVector: (vector: VectorEmbedding, metric?: DistanceMetric, k?: number) => {
    const { vectors, activeMetric, topK } = get();
    const useMetric = metric || activeMetric;
    const useK = k || topK;
    const probe = findTopKNearest(vector, vectors, useK, useMetric);
    set({
      selectedVectorId: vector.id,
      activeProbe: probe,
      p99QueryLatencyMs: probe.searchLatencyMs,
    });
  },
}));
