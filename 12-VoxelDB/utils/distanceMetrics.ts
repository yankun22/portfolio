import { DistanceMetric, VectorEmbedding, NeighborResult, HNSWProbe } from '../types/vector';

/**
 * Computes Cosine Distance: 1 - (dot(a, b) / (norm(a) * norm(b)))
 * Returns value in range [0, 2] where 0 means identical direction.
 */
export function cosineDistance(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 1.0;

  const similarity = Math.max(-1.0, Math.min(1.0, dot / denominator));
  return 1.0 - similarity;
}

/**
 * Computes Euclidean (L2) Distance: sqrt(sum((a_i - b_i)^2))
 */
export function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

/**
 * Computes Manhattan (L1) Distance: sum(|a_i - b_i|)
 */
export function manhattanDistance(a: number[], b: number[]): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);

  for (let i = 0; i < len; i++) {
    sum += Math.abs(a[i] - b[i]);
  }

  return sum;
}

/**
 * Unified distance function for metric switching
 */
export function calculateVectorDistance(
  a: number[],
  b: number[],
  metric: DistanceMetric
): number {
  switch (metric) {
    case 'cosine':
      return cosineDistance(a, b);
    case 'euclidean':
      return euclideanDistance(a, b);
    case 'manhattan':
      return manhattanDistance(a, b);
  }
}

/**
 * Performs HNSW Top-K Nearest Neighbor search with multi-layer traversal simulation
 */
export function findTopKNearest(
  source: VectorEmbedding,
  candidates: VectorEmbedding[],
  k: number,
  metric: DistanceMetric
): HNSWProbe {
  const startTime = performance.now();

  // Exclude self from candidate search
  const filtered = candidates.filter((c) => c.id !== source.id);

  // Calculate distance for all candidates
  const scored = filtered.map((candidate) => {
    // We calculate distance using the high-dimensional vector representations
    const dist = calculateVectorDistance(source.vector768, candidate.vector768, metric);

    // Compute intuitive similarity percentage
    let simPct = 0;
    if (metric === 'cosine') {
      simPct = Math.max(0, Math.min(100, Math.round((1 - dist) * 100)));
    } else if (metric === 'euclidean') {
      simPct = Math.max(0, Math.min(100, Math.round(100 / (1 + dist))));
    } else {
      simPct = Math.max(0, Math.min(100, Math.round(100 / (1 + dist * 0.5))));
    }

    return {
      id: candidate.id,
      targetVector: candidate,
      distance: dist,
      similarityPct: simPct,
    };
  });

  // Sort by ascending distance (nearest first)
  scored.sort((a, b) => a.distance - b.distance);

  const topK = scored.slice(0, k).map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  const endTime = performance.now();
  const rawElapsed = endTime - startTime;
  // Realistic sub-3ms HNSW p99 latency simulation
  const latency = Math.max(1.4, Number((rawElapsed * 0.18 + 1.2 + Math.random() * 0.8).toFixed(2)));

  return {
    sourceId: source.id,
    metric,
    neighbors: topK,
    searchLatencyMs: latency,
    visitedNodesCount: Math.min(candidates.length, 64 + k * 4),
    hnswTraversedLayers: [3, 2, 1, 0],
  };
}
