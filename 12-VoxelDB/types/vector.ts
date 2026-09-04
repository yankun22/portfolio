export type ClusterCategory =
  | 'code'
  | 'legal'
  | 'biomedical'
  | 'finance'
  | 'creative';

export type DistanceMetric = 'cosine' | 'euclidean' | 'manhattan';

export type QuantizationMode = 'FP32' | 'FP16' | 'INT8';

export interface VectorEmbedding {
  id: string;
  index: number;
  title: string;
  category: ClusterCategory;
  position: [number, number, number]; // 3D coordinates for spatial rendering
  vector768: number[]; // 768-dim sample preview vector
  tokenCount: number;
  metadata: {
    domain: string;
    sourceDataset: string;
    dimension: number;
    norm: number;
    license: string;
    tags: string[];
    [key: string]: unknown;
  };
  clusterColor: string;
  hnswLayer: number; // HNSW hierarchy layer (0 = base, 1 = intermediate, 2 = upper, 3 = top entry)
}

export interface NeighborResult {
  id: string;
  targetVector: VectorEmbedding;
  distance: number;
  similarityPct: number;
  rank: number;
}

export interface HNSWProbe {
  sourceId: string;
  metric: DistanceMetric;
  neighbors: NeighborResult[];
  searchLatencyMs: number;
  visitedNodesCount: number;
  hnswTraversedLayers: number[];
}

export interface ClusterInfo {
  id: ClusterCategory;
  name: string;
  color: string;
  description: string;
  center: [number, number, number];
  count: number;
}
