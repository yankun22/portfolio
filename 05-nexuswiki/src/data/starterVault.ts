import type { Note } from '../types/wiki';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const STARTER_VAULT: Note[] = [
  {
    id: 'note-transformers',
    title: 'Transformer Architecture',
    content: `---
tags: [ai, deep-learning, nlp]
created: 2026-08-19
status: active
---

# Transformer Architecture

The **Transformer** is a deep learning architecture introduced in the landmark paper *"Attention Is All You Need"* (Vaswani et al., 2017). It dispenses entirely with recurrence and convolutions, relying solely on [[Attention Mechanism]] to model global dependencies between input and output tokens.

## 📐 Mathematical Formulation

The core innovation is **Scaled Dot-Product Attention**, defined as:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

Where:
- $Q \\in \\mathbb{R}^{n \\times d_k}$ is the Queries matrix
- $K \\in \\mathbb{R}^{m \\times d_k}$ is the Keys matrix
- $V \\in \\mathbb{R}^{m \\times d_v}$ is the Values matrix
- $\\sqrt{d_k}$ is the scaling factor mitigating vanishing gradients in softmax

## 🧬 Architectural Components

1. **Multi-Head Self-Attention**: Projects queries, keys, and values $h$ times into distinct subspaces:
   $$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O$$
2. **Positional Encoding**: Sinusoidal frequency embeddings injecting sequence order:
   $$PE_{(pos, 2i)} = \\sin(pos / 10000^{2i/d_{\\text{model}}})$$
3. **Feed-Forward Networks**: Pointwise position-wise transformations
4. **Layer Normalization & Residual Connections**: Facilitating deep gradient flow through [[Neural Networks]]

## 🔗 Related Notes
- [[Attention Mechanism]]
- [[Neural Networks]]
- [[Large Language Models]]
- [[Linear Algebra]]

- [x] Implement multi-head attention module in PyTorch
- [x] Benchmark KV-cache memory overhead
- [ ] Explore sparse flash-attention kernels
`,
    tags: ['ai', 'deep-learning', 'nlp'],
    createdAt: hoursAgo(48),
    updatedAt: hoursAgo(2),
    pinned: true,
  },
  {
    id: 'note-attention',
    title: 'Attention Mechanism',
    content: `---
tags: [ai, math, deep-learning]
---

# Attention Mechanism

In neural computational systems, the **Attention Mechanism** allows networks to dynamically focus on relevant parts of the input representation regardless of token distance.

## Key Properties
- **Global Receptive Field**: Unlike convolutional layers limited by kernel window sizes, self-attention has an effective path length of $\\mathcal{O}(1)$ operations.
- **Computational Complexity**: Standard self-attention scales quadratically $\\mathcal{O}(N^2)$ with sequence length $N$.

### Cross-Attention vs Self-Attention
- **Self-Attention**: Computes interactions within the same sequence ($Q, K, V$ from encoder).
- **Cross-Attention**: Queries come from decoder while Keys and Values stem from encoder.

See also: [[Transformer Architecture]], [[Linear Algebra]], and [[Neural Networks]].
`,
    tags: ['ai', 'math', 'deep-learning'],
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(6),
  },
  {
    id: 'note-neural-networks',
    title: 'Neural Networks',
    content: `---
tags: [ai, foundational, deep-learning]
---

# Neural Networks

Universal function approximators composed of layered parameterized non-linear affine transformations.

## Core Pillars
- **Objective Loss Optimization**: Minimizing empirical risk $\\mathcal{L}(\\theta) = \\frac{1}{N} \\sum_{i=1}^N \\ell(f(x_i; \\theta), y_i)$
- **Gradient Computation**: Automatic reverse-mode differentiation via backpropagation.
- **Modern Architectures**:
  - Feed-Forward Multilayer Perceptrons (MLPs)
  - Convolutional Networks (CNNs)
  - [[Transformer Architecture]] for sequence modeling and reasoning
  - Graph Neural Networks for [[Force-Directed Graphs]]

Connected domains: [[Linear Algebra]], [[Transformer Architecture]], [[Attention Mechanism]].
`,
    tags: ['ai', 'foundational', 'deep-learning'],
    createdAt: hoursAgo(96),
    updatedAt: hoursAgo(12),
  },
  {
    id: 'note-quantum-computing',
    title: 'Quantum Computing',
    content: `---
tags: [quantum, physics, computation]
---

# Quantum Computing

Quantum computing harnesses the fundamental principles of quantum mechanics—namely **superposition**, **entanglement**, and **quantum interference**—to process information in state spaces that grow exponentially with qubit count.

## State Space & Hilbert Vectors

A pure single-qubit quantum state $|\\psi\\rangle$ exists in a 2-dimensional complex Hilbert space $\\mathbb{C}^2$:

$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle, \\quad |\\alpha|^2 + |\\beta|^2 = 1$$

Where $\\alpha, \\beta \\in \\mathbb{C}$ represent probability amplitudes.

## Key Concepts
- [[Qubits & Superposition]]: The fundamental unit of quantum information.
- [[Quantum Entanglement]]: Non-local state correlations enabling algorithms like Shor's and Grover's.
- [[Linear Algebra]]: Unitary matrices $U^{\\dagger} U = I$ governing reversible quantum gate dynamics.

- [x] Review Bloch sphere state transformations
- [ ] Simulate Bell state teleportation circuit
`,
    tags: ['quantum', 'physics', 'computation'],
    createdAt: hoursAgo(120),
    updatedAt: hoursAgo(8),
    pinned: true,
  },
  {
    id: 'note-qubits',
    title: 'Qubits & Superposition',
    content: `---
tags: [quantum, physics]
---

# Qubits & Superposition

Unlike classical bits that are strictly binary ($0$ or $1$), a **qubit** (quantum bit) can occupy an arbitrary linear combination of basis eigenstates until measurement.

## The Bloch Sphere Representation

Any single qubit state can be parameterized on the surface of a unit sphere:

$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$

Where $\\theta \\in [0, \\pi]$ and $\\phi \\in [0, 2\\pi)$ describe polar and azimuthal coordinates.

Connected with: [[Quantum Computing]], [[Linear Algebra]], and [[Quantum Entanglement]].
`,
    tags: ['quantum', 'physics'],
    createdAt: hoursAgo(140),
    updatedAt: hoursAgo(24),
  },
  {
    id: 'note-linear-algebra',
    title: 'Linear Algebra',
    content: `---
tags: [math, foundational]
---

# Linear Algebra

The universal language of modern computation, bridging machine learning vector spaces and quantum state mechanics.

## Core Constructs
- **Eigenvalues & Eigenvectors**: $A v = \\lambda v$
- **Singular Value Decomposition (SVD)**: $A = U \\Sigma V^T$
- **Inner Products & Norms**: $\\langle u, v \\rangle = u^{\\dagger} v$

Central foundation for:
- [[Neural Networks]] & [[Transformer Architecture]]
- [[Quantum Computing]] & [[Qubits & Superposition]]
- [[Force-Directed Graphs]] layout spectral decomposition
`,
    tags: ['math', 'foundational'],
    createdAt: hoursAgo(200),
    updatedAt: hoursAgo(30),
  },
  {
    id: 'note-distributed-consensus',
    title: 'Distributed Systems Consensus',
    content: `---
tags: [systems, distributed, backend]
---

# Distributed Systems Consensus

The problem of reaching agreement among a cluster of unreliable, asynchronous nodes over an imperfect network.

## Theoretical Constraints
- **FLM Impossibility Theorem**: No deterministic consensus protocol can guarantee safety and liveness in an asynchronous network in the presence of even a single unannounced crash failure.
- **CAP Theorem**: Systems must trade off Consistency vs Availability during network Partitions.

## Key Protocols
- [[Raft Algorithm]]: Understandable leader-based consensus with randomized election timers.
- [[Paxos Protocol]]: Generalized multi-decree quorum consensus.

Related to: [[NexusWiki Architecture]].
`,
    tags: ['systems', 'distributed', 'backend'],
    createdAt: hoursAgo(150),
    updatedAt: hoursAgo(18),
  },
  {
    id: 'note-raft',
    title: 'Raft Algorithm',
    content: `---
tags: [systems, distributed]
---

# Raft Algorithm

Designed by Ongaro and Ousterhout (Stanford, 2014) to replace the notoriously complex Multi-Paxos with an equivalent, highly intuitive consensus protocol.

## Protocol Subproblems
1. **Leader Election**: Heartbeat timeouts trigger randomized candidate election terms.
2. **Log Replication**: Leader forces follower logs to match its own via append-entries RPCs.
3. **Safety Guarantee**: State machine commits are strictly monotone and term-ordered.

See: [[Distributed Systems Consensus]], [[NexusWiki Architecture]].
`,
    tags: ['systems', 'distributed'],
    createdAt: hoursAgo(180),
    updatedAt: hoursAgo(20),
  },
  {
    id: 'note-zettelkasten',
    title: 'Zettelkasten Method',
    content: `---
tags: [pkm, productivity, philosophy]
---

# Zettelkasten Method

The **Zettelkasten** (German for "slip box") is a knowledge management and non-linear thinking methodology developed by sociologist Niklas Luhmann, who generated over 70 books and 400 scholarly articles using his paper-based system.

## Fundamental Principles
1. **Principle of Atomicity**: Each note contains exactly one self-contained concept.
2. **Bi-Directional Network Density**: The value of a note is determined by its links, not its folder hierarchy.
3. **Bottom-Up Synthesis**: Structure emerges organically through clusters in the [[Force-Directed Graphs]].

Interlinked with: [[Second Brain]], [[Bi-Directional Linking]], [[NexusWiki Architecture]].
`,
    tags: ['pkm', 'productivity', 'philosophy'],
    createdAt: hoursAgo(220),
    updatedAt: hoursAgo(14),
    pinned: true,
  },
  {
    id: 'note-second-brain',
    title: 'Second Brain',
    content: `---
tags: [pkm, productivity]
---

# Second Brain

A digital repository for externalizing human cognition, organizing ideas, and enabling creative associative discovery.

## The CODE Framework
- **Capture**: Save what resonates.
- **Organize**: Group by actionability.
- **Distill**: Extract core atomized thesis.
- **Express**: Synthesize output and publish.

Powered by [[Zettelkasten Method]], [[Bi-Directional Linking]], and [[NexusWiki Architecture]].
`,
    tags: ['pkm', 'productivity'],
    createdAt: hoursAgo(240),
    updatedAt: hoursAgo(10),
  },
  {
    id: 'note-nexus-wiki',
    title: 'NexusWiki Architecture',
    content: `---
tags: [engineering, architecture, graph]
---

# NexusWiki Architecture

**NexusWiki** is an interconnected personal wiki and force-directed knowledge graph built with React 19, D3.js, and TypeScript.

## Core Capabilities
- **Bi-Directional Links**: Live parsing of \`[[WikiLink]]\` syntax and contextual backlink indexing.
- **Force-Directed Graph**: Real-time D3 physics simulation with clustering, degree-based node scaling, and 3D spatial perspective via [[Force-Directed Graphs]].
- **KaTeX Equations**: Instant rendering of mathematical formulas.
- **Vault Portability**: Zero-lockin import/export of zip archives and unified JSON representations.

Derived from principles of the [[Zettelkasten Method]] and [[Second Brain]].
`,
    tags: ['engineering', 'architecture', 'graph'],
    createdAt: hoursAgo(260),
    updatedAt: hoursAgo(1),
    pinned: true,
  },
  {
    id: 'note-force-directed-graphs',
    title: 'Force-Directed Graphs',
    content: `---
tags: [math, visualization, d3]
---

# Force-Directed Graphs

**Force-directed graph drawing** algorithms simulate physical systems to position nodes in aesthetic two- or three-dimensional configurations without manual layout.

## Physical Forces Modeled
- **Coulomb Repulsion**: Like electric charges, all node pairs repel each other ($F \\propto -\\frac{1}{r^2}$).
- **Hooke's Spring Law**: Connected edges act like physical springs pulling connected vertices together ($F = -k(x - x_0)$).
- **Gravitational Centering**: Keeps disconnected clusters from drifting to infinity.

Implemented in [[NexusWiki Architecture]] using D3-force simulation routines.
`,
    tags: ['math', 'visualization', 'd3'],
    createdAt: hoursAgo(300),
    updatedAt: hoursAgo(5),
  },
];
