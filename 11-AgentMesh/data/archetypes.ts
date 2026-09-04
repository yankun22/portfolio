import { AgentNode } from '../types/agent';

export const INITIAL_AGENTS: AgentNode[] = [
  {
    id: 'router-01',
    name: 'Atlas-01',
    archetype: 'ROUTER',
    roleTitle: 'Ingress & Intent Classifier',
    tagline: 'Deconstructs raw network streams and distributes high-dimensional intent payloads.',
    color: '#38BDF8',
    accentColor: '#0284C7',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    position: { x: -0.58, y: -0.32 },
    status: 'idle',
    confidence: 94,
    currentTask: 'Listening on multi-region telemetry ingress & FIX protocol feed',
    tokenCount: 4210,
    latencyMs: 14,
    memoryBufferKB: 128,
    systemParams: {
      model: 'Atlas-Routing-Engine-v2.8 (Speculative)',
      temperature: 0.1,
      topP: 0.95,
      maxContextTokens: 32768,
      isolationLevel: 'Hardware Enclave L1',
      governancePolicy: 'Zero-Trust Payload Routing Policy v4.2',
      systemPrompt: `You are Atlas-01, the Ingress & Intent Classifier in the AgentMesh cluster.
Your objective is to ingest high-frequency telemetry events, classify operational anomalies, decompose threats into directed acyclic graph (DAG) task specifications, and route atomic payloads with cryptographic session nonces to specialized mesh peers.
Always validate header checksums before routing. Enforce priority queues for high-severity signals.`
    },
    tools: [
      {
        name: 'classify_telemetry_intent',
        description: 'Decomposes raw network stream anomalies into actionable DAG sub-tasks.',
        parameters: {
          type: 'object',
          properties: {
            telemetryStreamId: { type: 'string', description: 'Unique stream identifier' },
            sampleVector: { type: 'array', items: { type: 'number' }, description: '128-dim normalized telemetry vector' },
            riskThreshold: { type: 'number', description: 'Significance score threshold (0.0 - 1.0)' }
          },
          required: ['telemetryStreamId', 'riskThreshold']
        },
        returnType: '{ dagId: string, priority: "P0"|"P1"|"P2", routingPlan: string[] }'
      },
      {
        name: 'dispatch_payload_envelope',
        description: 'Cryptographically wraps and transmits state payload to target agent node.',
        parameters: {
          type: 'object',
          properties: {
            destinationNode: { type: 'string', description: 'Target node archetype identifier' },
            payloadHash: { type: 'string', description: 'SHA-256 integrity hash' },
            nonce: { type: 'string', description: 'Monotonic cryptographic nonce' }
          },
          required: ['destinationNode', 'payloadHash', 'nonce']
        },
        returnType: '{ status: "ENQUEUED", deliveryAck: string, latencyMs: number }'
      }
    ],
    vectorContext: [
      {
        id: 'vec-rt-101',
        content: 'FIX 4.4 Financial protocol packet headers parsing heuristics for high-frequency liquidity pools.',
        similarity: 0.962,
        dimension: 1536,
        embeddingPreview: [0.034, -0.129, 0.284, -0.015, 0.088, -0.211, 0.342, 0.076],
        tier: 'L1 Working RAM',
        timestamp: '14ms ago',
        source: 'telemetry_spec_fix44.json',
        tokens: 48
      },
      {
        id: 'vec-rt-102',
        content: 'Consensus dispatch topology: Guardrail gatekeeper must clear payload before Specialist compute.',
        similarity: 0.891,
        dimension: 1536,
        embeddingPreview: [0.112, -0.045, 0.176, 0.312, -0.087, 0.054, -0.198, 0.143],
        tier: 'L2 KV Cache',
        timestamp: '2.4s ago',
        source: 'mesh_governance_rules.md',
        tokens: 36
      }
    ],
    traces: [
      {
        id: 'trace-rt-01',
        stepNumber: 1,
        timestamp: '10:41:02.108',
        type: 'thought',
        content: 'Ingress stream batch #8849 contains elevated latency variance (p99 > 320ms). Inspecting signature...',
        latencyMs: 12
      },
      {
        id: 'trace-rt-02',
        stepNumber: 1,
        timestamp: '10:41:02.124',
        type: 'tool_call',
        content: 'classify_telemetry_intent(telemetryStreamId="fix-sg-liquidity-09", riskThreshold=0.85)',
        toolName: 'classify_telemetry_intent',
        toolArgs: { telemetryStreamId: 'fix-sg-liquidity-09', riskThreshold: 0.85 },
        toolResult: { dagId: 'dag-fin-9912', priority: 'P0', routingPlan: ['guardrail-02', 'specialist-03'] },
        latencyMs: 16
      }
    ]
  },
  {
    id: 'guardrail-02',
    name: 'Aegis-02',
    archetype: 'GUARDRAIL',
    roleTitle: 'Policy & Boundary Validator',
    tagline: 'Enforces statutory compliance, security bounds, and halts catastrophic side-effects.',
    color: '#F59E0B',
    accentColor: '#D97706',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    position: { x: 0.0, y: -0.68 },
    status: 'idle',
    confidence: 99,
    currentTask: 'Enforcing SOX Section 404 & zero-day containment sandbox boundaries',
    tokenCount: 5120,
    latencyMs: 22,
    memoryBufferKB: 256,
    systemParams: {
      model: 'Aegis-Compliance-Kernel-v4 (Deterministic)',
      temperature: 0.0,
      topP: 1.0,
      maxContextTokens: 65536,
      isolationLevel: 'Ring-0 Virtualized Boundary',
      governancePolicy: 'Strict Non-Repudiation & Zero-Data-Loss Invariant',
      systemPrompt: `You are Aegis-02, the Safety & Guardrail Sentinel of the AgentMesh.
Your mission is to strictly enforce safety boundaries, compliance statutes (SOX, GDPR, AML, SEC Rule 15c3-5), and security isolation invariants.
You have absolute veto authority. If any proposed plan risks data loss, unauthorized fund withdrawal, or unverified memory modification, you must freeze the affected subsystem and flag a quarantine order.`
    },
    tools: [
      {
        name: 'assert_safety_invariants',
        description: 'Verifies statutory policies and system boundaries against the proposed payload.',
        parameters: {
          type: 'object',
          properties: {
            subsystem: { type: 'string', description: 'Target subsystem identifier' },
            invariants: { type: 'array', items: { type: 'string' }, description: 'List of formal invariant assertions' },
            riskBudget: { type: 'number', description: 'Maximum acceptable exposure in USD or error %' }
          },
          required: ['subsystem', 'invariants']
        },
        returnType: '{ passed: boolean, violatedRules: string[], sandboxLockAcquired: boolean }'
      },
      {
        name: 'lock_subsystem_quarantine',
        description: 'Isolates affected accounts, shards, or worker pods into an immutable read-only state.',
        parameters: {
          type: 'object',
          properties: {
            targetScope: { type: 'string', description: 'Scope identifier to lock' },
            reason: { type: 'string', description: 'Audit rationale log' },
            durationSec: { type: 'number', description: 'Lock duration or 0 for indefinite' }
          },
          required: ['targetScope', 'reason']
        },
        returnType: '{ lockId: string, status: "LOCKED_IMMUTABLE", timestamp: string }'
      }
    ],
    vectorContext: [
      {
        id: 'vec-gd-201',
        content: 'Sarbanes-Oxley Section 404 internal control controls for financial ledger integrity verification.',
        similarity: 0.984,
        dimension: 1536,
        embeddingPreview: [0.201, 0.089, -0.312, 0.145, -0.023, 0.287, -0.098, 0.176],
        tier: 'L1 Working RAM',
        timestamp: '32ms ago',
        source: 'sox_sec404_statutes.pdf',
        tokens: 64
      },
      {
        id: 'vec-gd-202',
        content: 'Zero-day quarantine rule: any stack pointer offset deviation > 64 bytes triggers instant cgroup freeze.',
        similarity: 0.923,
        dimension: 1536,
        embeddingPreview: [-0.078, 0.219, 0.143, -0.198, 0.267, -0.045, 0.089, -0.165],
        tier: 'L1 Working RAM',
        timestamp: '1.2s ago',
        source: 'ebpf_kernel_defense_matrix.conf',
        tokens: 52
      }
    ],
    traces: [
      {
        id: 'trace-gd-01',
        stepNumber: 1,
        timestamp: '10:41:02.138',
        type: 'thought',
        content: 'Received priority P0 anomaly notification from Atlas-01. Checking liquidity transfer volume against SOX threshold...',
        latencyMs: 14
      },
      {
        id: 'trace-gd-02',
        stepNumber: 1,
        timestamp: '10:41:02.156',
        type: 'tool_call',
        content: 'assert_safety_invariants(subsystem="vault-contract-0x7b", invariants=["max_delta_limit", "dual_custody"])',
        toolName: 'assert_safety_invariants',
        toolArgs: { subsystem: 'vault-contract-0x7b', invariants: ['max_delta_limit', 'dual_custody'], riskBudget: 500000 },
        toolResult: { passed: false, violatedRules: ['MAX_DELTA_EXCEEDED: $4.82M vs limit $500k'], sandboxLockAcquired: true },
        latencyMs: 18
      }
    ]
  },
  {
    id: 'specialist-03',
    name: 'Nexus-03',
    archetype: 'SPECIALIST',
    roleTitle: 'Deep Domain Engine',
    tagline: 'Executes complex domain computation, cryptographic proof parsing, and AST analysis.',
    color: '#A855F7',
    accentColor: '#9333EA',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    position: { x: 0.58, y: -0.32 },
    status: 'idle',
    confidence: 91,
    currentTask: 'Decoding zero-knowledge nonces & inspecting distributed lock wait-for graph',
    tokenCount: 8940,
    latencyMs: 84,
    memoryBufferKB: 512,
    systemParams: {
      model: 'Nexus-DeepReasoning-Engine-Pro (32B-FP8)',
      temperature: 0.2,
      topP: 0.9,
      maxContextTokens: 131072,
      isolationLevel: 'WASM Isolated Compute Container',
      governancePolicy: 'Domain Expert Mathematical Proof Standard',
      systemPrompt: `You are Nexus-03, the Specialist Domain Engine in the AgentMesh.
You possess deep formal execution capabilities across cryptography (ZK-SNARKs, Groth16, BLS signatures), distributed systems (Raft, Paxos, Spanner two-phase commit lock graphs), and binary disassembly.
Your task is to mathematically isolate root causes, detect corrupted states, and provide formal proofs to the Synthesizer.`
    },
    tools: [
      {
        name: 'verify_zk_snark_proof',
        description: 'Cryptographically verifies Groth16 / Plonk state transition proofs.',
        parameters: {
          type: 'object',
          properties: {
            publicInputs: { type: 'array', items: { type: 'string' }, description: 'Hex-encoded public inputs' },
            proofBytes: { type: 'string', description: 'Base64 encoded proof payload' },
            verificationKeyHash: { type: 'string', description: 'Registered verification key SHA-256' }
          },
          required: ['publicInputs', 'proofBytes', 'verificationKeyHash']
        },
        returnType: '{ isValid: boolean, isolatedCorruptedNonce: string, deltaVerifiedUSD: number }'
      },
      {
        name: 'traverse_distributed_wait_graph',
        description: 'Analyzes cross-region distributed lock graph to identify circular deadlocks.',
        parameters: {
          type: 'object',
          properties: {
            clusterNodes: { type: 'array', items: { type: 'string' }, description: 'Active shard endpoints' },
            timeoutThresholdMs: { type: 'number', description: 'Lock wait threshold' }
          },
          required: ['clusterNodes', 'timeoutThresholdMs']
        },
        returnType: '{ cycleFound: boolean, cycleTransactions: string[], minCostVictimTx: string }'
      }
    ],
    vectorContext: [
      {
        id: 'vec-sp-301',
        content: 'Groth16 bilinear pairing equation: e(A, B) = e(alpha, beta) * e(x, gamma) * e(C, delta).',
        similarity: 0.957,
        dimension: 1536,
        embeddingPreview: [0.187, -0.245, 0.098, 0.321, -0.112, 0.045, 0.298, -0.176],
        tier: 'L1 Working RAM',
        timestamp: '52ms ago',
        source: 'groth16_elliptic_pairing.c',
        tokens: 72
      },
      {
        id: 'vec-sp-302',
        content: 'Distributed deadlocks: Tarjan cycle-finding algorithm on directed transaction wait-for graph.',
        similarity: 0.914,
        dimension: 1536,
        embeddingPreview: [0.045, 0.178, -0.098, 0.245, 0.112, -0.321, 0.187, 0.023],
        tier: 'L2 KV Cache',
        timestamp: '4.8s ago',
        source: 'distributed_systems_algorithms.rs',
        tokens: 60
      }
    ],
    traces: [
      {
        id: 'trace-sp-01',
        stepNumber: 1,
        timestamp: '10:41:02.172',
        type: 'thought',
        content: 'Quarantine order acknowledged. Commencing zero-knowledge cryptographic proof audit across block 18,940,221...',
        latencyMs: 42
      },
      {
        id: 'trace-sp-02',
        stepNumber: 1,
        timestamp: '10:41:02.248',
        type: 'tool_call',
        content: 'verify_zk_snark_proof(publicInputs=["0x7b...f12a", "0x04e1"], proofBytes="b64:Aw7Q...", verificationKeyHash="sha256:88fa...")',
        toolName: 'verify_zk_snark_proof',
        toolArgs: { publicInputs: ['0x7b...f12a', '0x04e1'], proofBytes: 'b64:Aw7Q...', verificationKeyHash: 'sha256:88fa...' },
        toolResult: { isValid: false, isolatedCorruptedNonce: '0x992B4F81', deltaVerifiedUSD: 4829100 },
        latencyMs: 76
      }
    ]
  },
  {
    id: 'synthesizer-04',
    name: 'Synapse-04',
    archetype: 'SYNTHESIZER',
    roleTitle: 'Multi-Agent Aggregator',
    tagline: 'Fuses multi-agent telemetry, reconciles state diffs, and synthesizes unified atomic patches.',
    color: '#2EE59D',
    accentColor: '#10B981',
    glowColor: 'rgba(46, 229, 157, 0.45)',
    position: { x: 0.38, y: 0.54 },
    status: 'idle',
    confidence: 96,
    currentTask: 'Synthesizing ledger reconciliation diff & compensation commit package',
    tokenCount: 6430,
    latencyMs: 38,
    memoryBufferKB: 384,
    systemParams: {
      model: 'Synapse-Synthesis-Pipeline-v3.2',
      temperature: 0.15,
      topP: 0.92,
      maxContextTokens: 65536,
      isolationLevel: 'High-Concurrency Shared Context Buffer',
      governancePolicy: 'Lossless Conflict Resolution & Reversible Rollback Protocol',
      systemPrompt: `You are Synapse-04, the Aggregator and Context Synthesizer of the AgentMesh.
Your core competency is reconciling disparate findings from Specialists and Guardrails into an atomic, deterministic state transition patch.
Construct minimal diff proposals with explicit rollback receipts before forwarding to the Arbiter for Byzantine quorum confirmation.`
    },
    tools: [
      {
        name: 'synthesize_reconciliation_patch',
        description: 'Constructs an atomic state mutation patch with compensatory rollback actions.',
        parameters: {
          type: 'object',
          properties: {
            isolatedFault: { type: 'string', description: 'Fault description or nonce' },
            stateDiffTable: { type: 'string', description: 'Target ledger or database entity' },
            compensatingActions: { type: 'array', items: { type: 'string' }, description: 'Compensating transactions' }
          },
          required: ['isolatedFault', 'stateDiffTable', 'compensatingActions']
        },
        returnType: '{ patchId: string, diffBytes: number, isDeterministic: boolean, rollbackScript: string }'
      },
      {
        name: 'compile_ebpf_hotpatch',
        description: 'Generates kernel-level dynamic packet filter for instant zero-downtime mitigation.',
        parameters: {
          type: 'object',
          properties: {
            signaturePattern: { type: 'string', description: 'Byte pattern to drop' },
            targetInterface: { type: 'string', description: 'Network interface or cgroup' }
          },
          required: ['signaturePattern', 'targetInterface']
        },
        returnType: '{ programId: string, instructionsCount: number, bytecodeHash: string }'
      }
    ],
    vectorContext: [
      {
        id: 'vec-sy-401',
        content: 'CRDT 2P-Set state reconciliation with monotonic timestamp vector clocks.',
        similarity: 0.941,
        dimension: 1536,
        embeddingPreview: [0.089, -0.143, 0.267, -0.045, 0.198, 0.078, -0.219, 0.112],
        tier: 'L1 Working RAM',
        timestamp: '68ms ago',
        source: 'crdt_vector_clock_spec.md',
        tokens: 44
      },
      {
        id: 'vec-sy-402',
        content: 'Saga compensation pattern: every debit state mutation must define an inverse signed credit.',
        similarity: 0.887,
        dimension: 1536,
        embeddingPreview: [0.145, 0.023, -0.176, 0.287, -0.089, 0.198, 0.045, -0.212],
        tier: 'L2 KV Cache',
        timestamp: '3.1s ago',
        source: 'enterprise_saga_patterns.json',
        tokens: 56
      }
    ],
    traces: [
      {
        id: 'trace-sy-01',
        stepNumber: 1,
        timestamp: '10:41:02.264',
        type: 'thought',
        content: 'Corrupted nonce 0x992B4F81 confirmed by Nexus-03. Aggregating 14 sub-ledger entries to generate reconciliation patch...',
        latencyMs: 24
      },
      {
        id: 'trace-sy-02',
        stepNumber: 1,
        timestamp: '10:41:02.312',
        type: 'tool_call',
        content: 'synthesize_reconciliation_patch(isolatedFault="0x992B4F81", stateDiffTable="ledger_settlements", compensatingActions=["ROLLBACK_ESCROW_TX_881", "REFUND_LP_POOL_02"])',
        toolName: 'synthesize_reconciliation_patch',
        toolArgs: { isolatedFault: '0x992B4F81', stateDiffTable: 'ledger_settlements', compensatingActions: ['ROLLBACK_ESCROW_TX_881', 'REFUND_LP_POOL_02'] },
        toolResult: { patchId: 'patch-reconcile-98214', diffBytes: 4280, isDeterministic: true, rollbackScript: 'SAFE_STATE_COMMIT_0x9A' },
        latencyMs: 48
      }
    ]
  },
  {
    id: 'arbiter-05',
    name: 'Kharon-05',
    archetype: 'ARBITER',
    roleTitle: 'Consensus & Finality Authority',
    tagline: 'Verifies Byzantine quorum, signs cryptographic finality, and executes state commits.',
    color: '#F43F5E',
    accentColor: '#E11D48',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    position: { x: -0.38, y: 0.54 },
    status: 'idle',
    confidence: 100,
    currentTask: 'Validating Byzantine Quorum (5/5 Agreement) & authorizing immutable state commit',
    tokenCount: 3890,
    latencyMs: 18,
    memoryBufferKB: 192,
    systemParams: {
      model: 'Kharon-Byzantine-Finalizer-v5 (Hardware HSM)',
      temperature: 0.0,
      topP: 1.0,
      maxContextTokens: 32768,
      isolationLevel: 'Hardware Security Module (HSM) Level 4',
      governancePolicy: 'Byzantine Fault Tolerant Quorum Finality (2f + 1)',
      systemPrompt: `You are Kharon-05, the Finality Authority and Arbiter of the AgentMesh.
You hold the cryptographic signing keys for atomic state commits.
You never execute a commit without verifying:
1. Proof correctness from the Specialist.
2. Safety clearance from the Guardrail.
3. Deterministic patch generation from the Synthesizer.
4. Complete Byzantine quorum agreement (>= 80% consensus threshold).`
    },
    tools: [
      {
        name: 'verify_byzantine_quorum',
        description: 'Gathers cryptographic votes from all active mesh agent archetypes.',
        parameters: {
          type: 'object',
          properties: {
            proposalPatchId: { type: 'string', description: 'Proposed patch ID' },
            requiredSignatures: { type: 'number', description: 'Minimum number of agreeing peer nodes' }
          },
          required: ['proposalPatchId', 'requiredSignatures']
        },
        returnType: '{ quorumReached: boolean, collectedSignatures: number, byzantineFaultTolerance: "OPTIMAL" }'
      },
      {
        name: 'execute_immutable_commit',
        description: 'Signs and broadcasts irreversible state mutation block to the distributed ledger.',
        parameters: {
          type: 'object',
          properties: {
            proposalPatchId: { type: 'string', description: 'Verified patch ID' },
            merkleRoot: { type: 'string', description: 'Computed state Merkle root hash' },
            hsmKeySlot: { type: 'number', description: 'Hardware HSM signing slot' }
          },
          required: ['proposalPatchId', 'merkleRoot', 'hsmKeySlot']
        },
        returnType: '{ finalityReceipt: string, blockHeight: number, commitStatus: "COMMITTED_PERMANENT" }'
      }
    ],
    vectorContext: [
      {
        id: 'vec-ar-501',
        content: 'PBFT consensus: 3f+1 total nodes tolerates f arbitrary Byzantine failures with 2f+1 quorum.',
        similarity: 0.978,
        dimension: 1536,
        embeddingPreview: [0.312, 0.045, -0.212, 0.187, -0.098, 0.245, -0.045, 0.178],
        tier: 'L1 Working RAM',
        timestamp: '44ms ago',
        source: 'pbft_quorum_proof_v2.pdf',
        tokens: 58
      },
      {
        id: 'vec-ar-502',
        content: 'Secp256k1 and Ed25519 multi-signature aggregation scheme for atomic mesh finality.',
        similarity: 0.902,
        dimension: 1536,
        embeddingPreview: [-0.112, 0.287, 0.045, -0.176, 0.201, 0.089, -0.312, 0.145],
        tier: 'L2 KV Cache',
        timestamp: '5.2s ago',
        source: 'hsm_multisig_standards.conf',
        tokens: 62
      }
    ],
    traces: [
      {
        id: 'trace-ar-01',
        stepNumber: 1,
        timestamp: '10:41:02.328',
        type: 'thought',
        content: 'Reconciliation patch patch-reconcile-98214 received from Synapse-04. Poll quorum signatures across all 5 nodes...',
        latencyMs: 16
      },
      {
        id: 'trace-ar-02',
        stepNumber: 1,
        timestamp: '10:41:02.368',
        type: 'tool_call',
        content: 'verify_byzantine_quorum(proposalPatchId="patch-reconcile-98214", requiredSignatures=5)',
        toolName: 'verify_byzantine_quorum',
        toolArgs: { proposalPatchId: 'patch-reconcile-98214', requiredSignatures: 5 },
        toolResult: { quorumReached: true, collectedSignatures: 5, byzantineFaultTolerance: 'OPTIMAL' },
        latencyMs: 40
      }
    ]
  }
];
