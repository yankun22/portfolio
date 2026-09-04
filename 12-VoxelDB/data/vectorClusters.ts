import { ClusterCategory, ClusterInfo, VectorEmbedding } from '../types/vector';

export const CLUSTERS: ClusterInfo[] = [
  {
    id: 'code',
    name: 'Code Embeddings',
    color: '#06B6D4', // Neon Cyan
    description: 'AST syntaxes, Python/Rust algorithms, kernel drivers & API signatures.',
    center: [-22, 10, -12],
    count: 320,
  },
  {
    id: 'legal',
    name: 'Legal Precedents',
    color: '#A855F7', // Electric Violet
    description: 'Supreme Court briefs, statutory covenants, antitrust & patent filings.',
    center: [20, 16, 8],
    count: 320,
  },
  {
    id: 'biomedical',
    name: 'Biomedical Literature',
    color: '#22C55E', // Emerald Green
    description: 'CRISPR RNA transcripts, pharmacology assays, oncology clinical trials.',
    center: [-14, -18, 16],
    count: 320,
  },
  {
    id: 'finance',
    name: 'Financial Risk Models',
    color: '#EAB308', // Amber Gold
    description: 'Derivatives pricing, credit default swaps, macro yield curves & volatility.',
    center: [18, -16, -14],
    count: 320,
  },
  {
    id: 'creative',
    name: 'Creative & LLM Prompts',
    color: '#F43F5E', // Neon Rose
    description: 'Speculative sci-fi worldbuilding, chain-of-thought system prompts.',
    center: [2, 6, 22],
    count: 320,
  },
];

// Pseudo-random seeded generator for deterministic consistency
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Sample metadata labels per cluster
const SAMPLE_TITLES: Record<ClusterCategory, string[]> = {
  code: [
    'async_tokio_event_loop_poll',
    'quickselect_inplace_partition',
    'bvh_ray_box_intersection_avx2',
    'raft_replicate_log_entries_rpc',
    'linux_epoll_ctl_add_socket',
    'postgres_wal_buffer_flush_sync',
    'tls13_handshake_crypto_verify',
    'llvm_ir_dead_code_elimination',
    'bloom_filter_murmur3_hash_sse',
    'distributed_consistent_hashing',
  ],
  legal: [
    'Antitrust Sherman Act § 2 Monopoly Rule',
    'Chevron Deference Judicial Scope Review',
    'Delaware Corporate Fiduciary Duty Standards',
    'Patent Infringement Doctrine of Equivalents',
    'GDPR Article 17 Right to Erasure Case',
    'Securities Act 1933 Rule 144 Exemption',
    'Fourth Amendment Digital Privacy Precedent',
    'Contractual Force Majeure Allocation',
    'Fair Use Transformative Purpose Ruling',
    'Choice of Law Cross-Border Arbitration',
  ],
  biomedical: [
    'CRISPR-Cas9 Off-Target Cleavage Assay',
    'mRNA Lipid Nanoparticle Encapsulation',
    'HER2+ Receptor Tyrosine Kinase Inhibitor',
    'Single-Cell RNA Sequencing Lymphocyte Atlas',
    'Amyloid Beta Oligomerization Pathway',
    'CAR-T Cell Cytokine Release Profiling',
    'Antibiotic Resistance Plasmid Horizontal Transfer',
    'Protein AlphaFold2 Structure Homology',
    'CRISPR Base Editor Cytidine Deaminase',
    'Cardiovascular MicroRNA Biomarker Screen',
  ],
  finance: [
    'Black-Scholes Volatility Surface Skew',
    'Vasicek Interest Rate Term Structure',
    'Credit Default Swap Tranche Correlation',
    'High-Frequency Limit Order Book Imbalance',
    'Monte Carlo VaR Liquidity Stress Test',
    'FX Cross-Currency Basis Swap Pricing',
    'Crypto Liquidity Pool Impermanent Loss',
    'Stochastic Volatility Heston Model Sim',
    'Basel III Capital Adequacy Tier-1 Ratio',
    'Yield Curve Inversion Recession Forecaster',
  ],
  creative: [
    'Silicon Consciousness Obsidian Monolith',
    'Dyson Swarm Orbital Solar Flux Synthesis',
    'Cyberpunk Neo-Shinjuku Hologram Rain',
    'Quantum Entanglement Telepathic Relay',
    'Supermassive Singularity Event Horizon',
    'Recursive Multi-Agent Chain-of-Thought',
    'Nanite Terraforming Martian Crater Basin',
    'Neural Interface Direct Cortex Memory Upload',
    'Interstellar Ark Vessel Deceleration Burn',
    'Bioluminescent Abyssal Trench Ecology',
  ],
};

/**
 * Generates 1,600 high-dimensional vector embeddings deterministically
 */
export function generateClusteredVectors(): VectorEmbedding[] {
  const totalVectors: VectorEmbedding[] = [];
  let globalSeed = 42;
  let idCounter = 1;

  CLUSTERS.forEach((cluster) => {
    const titles = SAMPLE_TITLES[cluster.id];

    for (let i = 0; i < cluster.count; i++) {
      globalSeed++;
      // Gaussian-like offset around cluster center
      const u1 = pseudoRandom(globalSeed++);
      const u2 = pseudoRandom(globalSeed++);
      const u3 = pseudoRandom(globalSeed++);
      const u4 = pseudoRandom(globalSeed++);
      const u5 = pseudoRandom(globalSeed++);
      const u6 = pseudoRandom(globalSeed++);

      const radius = 9.5;
      const offsetX = (u1 + u2 - 1) * radius;
      const offsetY = (u3 + u4 - 1) * radius;
      const offsetZ = (u5 + u6 - 1) * radius;

      const posX = Number((cluster.center[0] + offsetX).toFixed(2));
      const posY = Number((cluster.center[1] + offsetY).toFixed(2));
      const posZ = Number((cluster.center[2] + offsetZ).toFixed(2));

      // Synthetic 768-dim sample vector with cluster bias
      const sampleDimCount = 16;
      const vector768: number[] = [];
      const clusterBias =
        cluster.id === 'code'
          ? 0.4
          : cluster.id === 'legal'
          ? -0.3
          : cluster.id === 'biomedical'
          ? 0.2
          : cluster.id === 'finance'
          ? -0.5
          : 0.1;

      for (let d = 0; d < sampleDimCount; d++) {
        const val =
          (pseudoRandom(globalSeed + d * 7) - 0.5) * 0.8 +
          (d % 3 === 0 ? clusterBias : 0);
        vector768.push(Number(val.toFixed(4)));
      }

      // HNSW layer assignment
      const layerRoll = pseudoRandom(globalSeed + 99);
      const hnswLayer =
        layerRoll > 0.985 ? 3 : layerRoll > 0.94 ? 2 : layerRoll > 0.75 ? 1 : 0;

      const titleBase = titles[i % titles.length];
      const title = `${titleBase} #${(i % 50) + 1}`;

      totalVectors.push({
        id: `vec-${cluster.id.slice(0, 2)}-${String(idCounter).padStart(4, '0')}`,
        index: idCounter - 1,
        title,
        category: cluster.id,
        position: [posX, posY, posZ],
        vector768,
        tokenCount: Math.floor(128 + pseudoRandom(globalSeed + 50) * 384),
        metadata: {
          domain: cluster.name,
          sourceDataset: `${cluster.id}-embeddings-v3-768d`,
          dimension: 768,
          norm: Number((0.95 + pseudoRandom(globalSeed + 30) * 0.1).toFixed(4)),
          license: 'MIT Open-Embeddings',
          tags: [cluster.id, 'dense-vector', `layer-${hnswLayer}`, '768-dim'],
        },
        clusterColor: cluster.color,
        hnswLayer,
      });

      idCounter++;
    }
  });

  return totalVectors;
}
