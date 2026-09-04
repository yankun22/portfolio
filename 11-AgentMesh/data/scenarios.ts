import { Scenario } from '../types/scenario';

export const SCENARIOS: Scenario[] = [
  {
    id: 'financial-audit-anomaly',
    title: 'Financial Audit Anomaly',
    subtitle: 'Cross-Border Liquidity Pool Arbitrage & Flash Loan Reentrancy',
    severity: 'CRITICAL',
    targetSystem: 'Ethereum / Solana Liquidity Vault 0x7b...f12a',
    initialAnomaly: 'Unreconciled $4,829,100 delta detected across cross-border settlement pool within 800ms window.',
    estimatedSteps: 5,
    steps: [
      {
        stepNumber: 1,
        title: 'Ingress & FIX Stream Classification',
        description: 'Atlas-01 parses 14,000 FIX protocol micro-transactions and identifies an unbacked collateral withdrawal signature.',
        fromAgentId: 'router-01',
        toAgentId: 'guardrail-02',
        payloadName: 'UNRECONCILED_DELTA_ENVELOPE [4.8MB]',
        payloadSizeKB: 4800,
        payloadData: {
          txOrigin: '0x33b8...91a2',
          deltaUSD: 4829100,
          tokenPool: 'USDC-WBTC-LP',
          mempoolBlock: 18940221,
          urgency: 'IMMEDIATE'
        },
        quorumCount: 1,
        consensusState: 'PROPOSING',
        logSummary: 'Atlas-01 tagged stream as Critical P0 Risk. Dispatched isolation proposal to Aegis-02.',
        agentUpdates: {
          'router-01': { status: 'analyzing', confidence: 97, task: 'Classified P0 anomaly in FIX stream. Routing to Guardrail.', deltaTokens: 520, latencyMs: 24 },
          'guardrail-02': { status: 'verifying', confidence: 92, task: 'Ingesting envelope & verifying regulatory delta bounds.', deltaTokens: 380, latencyMs: 31 },
          'specialist-03': { status: 'idle', confidence: 90, task: 'Standby for cryptographic proof extraction.', deltaTokens: 0, latencyMs: 12 },
          'synthesizer-04': { status: 'idle', confidence: 95, task: 'Awaiting ledger diff inputs.', deltaTokens: 0, latencyMs: 14 },
          'arbiter-05': { status: 'idle', confidence: 100, task: 'Monitoring consensus channel.', deltaTokens: 0, latencyMs: 10 }
        }
      },
      {
        stepNumber: 2,
        title: 'Safety Boundary Enforcement & Account Freeze',
        description: 'Aegis-02 evaluates Sarbanes-Oxley 404 & SEC 15c3-5 limits, triggers a circuit-breaker on vault 0x7b, and delegates deep mathematical audit.',
        fromAgentId: 'guardrail-02',
        toAgentId: 'specialist-03',
        payloadName: 'CIRCUIT_BREAKER_LOCK_ORDER [1.2MB]',
        payloadSizeKB: 1200,
        payloadData: {
          lockStatus: 'VAULT_FROZEN_READONLY',
          riskBudgetViolation: 'EXCEEDED_BY_860%',
          auditTrailReceipt: 'SEC-RULE-15C3-5-VIOLATION-09',
          targetVault: '0x7b...f12a'
        },
        quorumCount: 2,
        consensusState: 'SANDBOXING',
        logSummary: 'Aegis-02 locked affected vault. Transmitted cryptographic proof directive to Nexus-03.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 97, task: 'Monitoring upstream gateway for related replay attacks.', deltaTokens: 140, latencyMs: 18 },
          'guardrail-02': { status: 'analyzing', confidence: 99, task: 'Enforced read-only vault lock. SOX statutory compliance maintained.', deltaTokens: 780, latencyMs: 46 },
          'specialist-03': { status: 'analyzing', confidence: 94, task: 'Extracting Groth16 zero-knowledge state nonces.', deltaTokens: 960, latencyMs: 92 },
          'synthesizer-04': { status: 'idle', confidence: 95, task: 'Preparing CRDT ledger diff template.', deltaTokens: 0, latencyMs: 15 },
          'arbiter-05': { status: 'idle', confidence: 100, task: 'Monitoring Byzantine quorum status (2/5 signatures).', deltaTokens: 80, latencyMs: 11 }
        }
      },
      {
        stepNumber: 3,
        title: 'ZK-SNARK Proof Dissection & Nonce Isolation',
        description: 'Nexus-03 computes elliptic curve pairing over BLS12-381, isolating double-spend nonce 0x992B4F81 and generating formal vulnerability proof.',
        fromAgentId: 'specialist-03',
        toAgentId: 'synthesizer-04',
        payloadName: 'ZK_FAULT_ISOLATION_PROOF [8.4MB]',
        payloadSizeKB: 8400,
        payloadData: {
          corruptedNonce: '0x992B4F81',
          pairingVerified: false,
          attackVector: 'Flash Loan Collateral Reentrancy',
          exactLeakUSD: 4829100.22,
          affectedEscrows: 14
        },
        quorumCount: 3,
        consensusState: 'ISOLATING',
        logSummary: 'Nexus-03 isolated corrupted nonce 0x992B4F81 with formal proof. Dispatched to Synapse-04.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 97, task: 'Routing ingress traffic around quarantined vault.', deltaTokens: 110, latencyMs: 16 },
          'guardrail-02': { status: 'idle', confidence: 99, task: 'Standing by on lock release permissions.', deltaTokens: 120, latencyMs: 19 },
          'specialist-03': { status: 'verifying', confidence: 98, task: 'Formal ZK-SNARK verification complete. Nonce 0x992B4F81 isolated.', deltaTokens: 1680, latencyMs: 118 },
          'synthesizer-04': { status: 'synthesizing', confidence: 96, task: 'Reconciling 14 escrow accounts and synthesizing refund transactions.', deltaTokens: 1120, latencyMs: 64 },
          'arbiter-05': { status: 'quorum_voting', confidence: 100, task: 'Verifying mathematical soundness of Nexus-03 proof.', deltaTokens: 240, latencyMs: 22 }
        }
      },
      {
        stepNumber: 4,
        title: 'State Diff Reconciliation & Compensation Patch',
        description: 'Synapse-04 fuses the 14 escrow deltas, synthesizes an atomic compensating transaction batch, and prepares the rollback commit package.',
        fromAgentId: 'synthesizer-04',
        toAgentId: 'arbiter-05',
        payloadName: 'RECONCILIATION_PATCH_PACKAGE [3.6MB]',
        payloadSizeKB: 3600,
        payloadData: {
          patchId: 'PATCH-FIN-AUDIT-9921',
          compensatingTransactionsCount: 14,
          refundAmountUSD: 4829100.22,
          rollbackScriptHash: 'sha256:4d82...f901',
          reversibleInSeconds: 300
        },
        quorumCount: 4,
        consensusState: 'SYNTHESIZING',
        logSummary: 'Synapse-04 generated deterministic rollback patch. Requested Arbiter Byzantine sign-off.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 98, task: 'Ingress normalized. Zero secondary attempts detected.', deltaTokens: 90, latencyMs: 14 },
          'guardrail-02': { status: 'idle', confidence: 100, task: 'Reviewed compensation patch. Compliance criteria 100% satisfied.', deltaTokens: 210, latencyMs: 22 },
          'specialist-03': { status: 'idle', confidence: 98, task: 'Validating patch bytecode against zk-circuit invariants.', deltaTokens: 420, latencyMs: 38 },
          'synthesizer-04': { status: 'synthesizing', confidence: 99, task: 'Generated atomic refund diff. Transmitted to Kharon-05.', deltaTokens: 890, latencyMs: 52 },
          'arbiter-05': { status: 'quorum_voting', confidence: 100, task: 'Initiating Byzantine quorum tally across 5 peers.', deltaTokens: 540, latencyMs: 28 }
        }
      },
      {
        stepNumber: 5,
        title: 'Byzantine Quorum Sign-off & Immutable Rollback Commit',
        description: 'Kharon-05 verifies 5/5 cryptographic signatures, engages HSM signing slot 0x4, and executes irreversible rollback state commit.',
        fromAgentId: 'arbiter-05',
        toAgentId: 'router-01',
        payloadName: 'BYZANTINE_FINALITY_COMMIT [512KB]',
        payloadSizeKB: 512,
        payloadData: {
          quorumAchieved: '5/5 NODES (100% UNANIMOUS)',
          merkleRootHash: '0x9a8f...4e1b',
          blockHeight: 18940222,
          fundsRecoveredUSD: 4829100.22,
          status: 'COMMITTED_PERMANENT'
        },
        quorumCount: 5,
        consensusState: 'COMMITTED',
        logSummary: 'Kharon-05 signed Merkle root 0x9a8f...4e1b. Quorum 5/5 reached. Funds 100% recovered.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 99, task: 'Quorum consensus complete. Standard traffic resumed.', deltaTokens: 80, latencyMs: 12 },
          'guardrail-02': { status: 'idle', confidence: 100, task: 'Quarantine unlocked. Vault 0x7b operating in safe mode.', deltaTokens: 95, latencyMs: 14 },
          'specialist-03': { status: 'idle', confidence: 100, task: 'ZK-SNARK proof archived to permanent storage.', deltaTokens: 110, latencyMs: 18 },
          'synthesizer-04': { status: 'idle', confidence: 100, task: 'Diff applied. Ledger re-balanced to 0.00 USD discrepancy.', deltaTokens: 130, latencyMs: 16 },
          'arbiter-05': { status: 'committed', confidence: 100, task: 'Immutable state commit verified. Quorum 5/5 sealed.', deltaTokens: 620, latencyMs: 26 }
        }
      }
    ]
  },
  {
    id: 'distributed-database-deadlock',
    title: 'Distributed Database Deadlock',
    subtitle: 'Cross-Region Raft Shard Contention & Circular Wait Cycle',
    severity: 'HIGH',
    targetSystem: 'Spanner-Compatible Raft Cluster (AP-SE1, EU-DE2, US-E1)',
    initialAnomaly: 'Write latency p99 escalated to 4,820ms due to circular lock contention on table ledger_settlements.',
    estimatedSteps: 5,
    steps: [
      {
        stepNumber: 1,
        title: 'Cluster Health Telemetry & Latency Spike Detection',
        description: 'Atlas-01 detects queue saturation (>98%) on shard AP-SE1 with circular transaction dependency signatures.',
        fromAgentId: 'router-01',
        toAgentId: 'guardrail-02',
        payloadName: 'RAFT_LOCK_TELEMETRY [3.2MB]',
        payloadSizeKB: 3200,
        payloadData: {
          p99LatencyMs: 4820,
          pendingTransactions: 1420,
          blockedShards: ['AP-SE1', 'EU-DE2'],
          suspectedDeadlock: true
        },
        quorumCount: 1,
        consensusState: 'PROPOSING',
        logSummary: 'Atlas-01 alerted cluster on 4,820ms p99 latency spike and lock queue saturation.',
        agentUpdates: {
          'router-01': { status: 'analyzing', confidence: 95, task: 'Detecting cross-region lock timeouts. Rerouting read replicas.', deltaTokens: 490, latencyMs: 22 },
          'guardrail-02': { status: 'verifying', confidence: 94, task: 'Assessing RPO=0 and strict serializability invariants.', deltaTokens: 340, latencyMs: 28 },
          'specialist-03': { status: 'idle', confidence: 91, task: 'Preparing Tarjan cycle detection algorithm on shard graph.', deltaTokens: 0, latencyMs: 12 },
          'synthesizer-04': { status: 'idle', confidence: 93, task: 'Standing by for abort schedule construction.', deltaTokens: 0, latencyMs: 14 },
          'arbiter-05': { status: 'idle', confidence: 100, task: 'Monitoring Raft election terms.', deltaTokens: 0, latencyMs: 10 }
        }
      },
      {
        stepNumber: 2,
        title: 'RPO/RTO Invariant Assertion & Safe Execution Boundary',
        description: 'Aegis-02 validates that automated lock aborts will not trigger partial rollbacks or phantom records.',
        fromAgentId: 'guardrail-02',
        toAgentId: 'specialist-03',
        payloadName: 'SERIALIZABILITY_BOUNDARY_RULE [1.8MB]',
        payloadSizeKB: 1800,
        payloadData: {
          rpoTargetSec: 0,
          allowedAbortBudgetUSD: 0,
          isolationLevel: 'STRICT_SERIALIZABLE'
        },
        quorumCount: 2,
        consensusState: 'SANDBOXING',
        logSummary: 'Aegis-02 enforced strict serializability bounds. Forwarded wait-for graph to Nexus-03.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 96, task: 'Applying throttle on write ingress.', deltaTokens: 110, latencyMs: 16 },
          'guardrail-02': { status: 'analyzing', confidence: 99, task: 'Enforced zero data loss invariant on lock resolution.', deltaTokens: 620, latencyMs: 38 },
          'specialist-03': { status: 'analyzing', confidence: 93, task: 'Traversing wait-for graph across Singapore and Frankfurt shards.', deltaTokens: 880, latencyMs: 82 },
          'synthesizer-04': { status: 'idle', confidence: 94, task: 'Awaiting deadlock victim selection.', deltaTokens: 0, latencyMs: 15 },
          'arbiter-05': { status: 'idle', confidence: 100, task: 'Tracking quorum count (2/5 nodes).', deltaTokens: 70, latencyMs: 12 }
        }
      },
      {
        stepNumber: 3,
        title: 'Wait-For Graph Analysis & Cycle Isolation',
        description: 'Nexus-03 traverses the distributed lock dependency graph, pinpointing a circular wait between TX-98412 and TX-98418.',
        fromAgentId: 'specialist-03',
        toAgentId: 'synthesizer-04',
        payloadName: 'DEADLOCK_CYCLE_TOPOLOGY [5.1MB]',
        payloadSizeKB: 5100,
        payloadData: {
          cycleNodes: ['TX-98412 (Singapore)', 'TX-98418 (Frankfurt)'],
          contestedResource: 'table.ledger_settlements.row_key_0x99B',
          optimalVictim: 'TX-98418',
          costUSD: 0.00
        },
        quorumCount: 3,
        consensusState: 'ISOLATING',
        logSummary: 'Nexus-03 isolated cycle between TX-98412 and TX-98418. Designated TX-98418 as minimal victim.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 96, task: 'Holding retries in buffer.', deltaTokens: 90, latencyMs: 15 },
          'guardrail-02': { status: 'idle', confidence: 99, task: 'Guarding against uncommitted state leaks.', deltaTokens: 110, latencyMs: 18 },
          'specialist-03': { status: 'verifying', confidence: 97, task: 'Cycle mathematically isolated. Minimum-cost abort victim selected.', deltaTokens: 1420, latencyMs: 96 },
          'synthesizer-04': { status: 'synthesizing', confidence: 95, task: 'Formulating 2-phase abort and exponential backoff retry.', deltaTokens: 980, latencyMs: 58 },
          'arbiter-05': { status: 'quorum_voting', confidence: 100, task: 'Verifying Raft leader lease validity.', deltaTokens: 210, latencyMs: 20 }
        }
      },
      {
        stepNumber: 4,
        title: 'Two-Phase Abort & Optimistic Compensation Schedule',
        description: 'Synapse-04 drafts the atomic abort payload for TX-98418 and provisions an immediate optimistic replay queue with jittered backoff.',
        fromAgentId: 'synthesizer-04',
        toAgentId: 'arbiter-05',
        payloadName: 'TWO_PHASE_ABORT_MANIFEST [2.4MB]',
        payloadSizeKB: 2400,
        payloadData: {
          abortTx: 'TX-98418',
          retryDelayMs: 45,
          lockReleaseOrder: ['row_key_0x99B', 'row_key_0x99C'],
          unblockedTransactions: 1419
        },
        quorumCount: 4,
        consensusState: 'SYNTHESIZING',
        logSummary: 'Synapse-04 created 2-phase abort manifest. Forwarded to Kharon-05 for Raft cluster commit.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 97, task: 'Ingress ready to absorb unblocked queue.', deltaTokens: 80, latencyMs: 14 },
          'guardrail-02': { status: 'idle', confidence: 100, task: 'Validated that retry sequence preserves serializability.', deltaTokens: 160, latencyMs: 20 },
          'specialist-03': { status: 'idle', confidence: 98, task: 'Checked lock table integrity after simulated abort.', deltaTokens: 320, latencyMs: 34 },
          'synthesizer-04': { status: 'synthesizing', confidence: 98, task: 'Compensating replay manifest generated.', deltaTokens: 790, latencyMs: 48 },
          'arbiter-05': { status: 'quorum_voting', confidence: 100, task: 'Collecting peer voting vectors for Raft cluster execution.', deltaTokens: 460, latencyMs: 26 }
        }
      },
      {
        stepNumber: 5,
        title: 'Atomic Abort Broadcast & Cluster Latency Recovery',
        description: 'Kharon-05 commits the abort, releases contested row locks, and restores p99 write latency to 18ms across all shards.',
        fromAgentId: 'arbiter-05',
        toAgentId: 'router-01',
        payloadName: 'DEADLOCK_CLEARED_FINALITY [640KB]',
        payloadSizeKB: 640,
        payloadData: {
          recoveredLatencyP99Ms: 18,
          unblockedQueueCount: 1420,
          abortedTxRetried: true,
          clusterHealth: '100% HEALTHY'
        },
        quorumCount: 5,
        consensusState: 'COMMITTED',
        logSummary: 'Kharon-05 executed abort on TX-98418. Deadlock resolved. Cluster p99 restored to 18ms.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 99, task: 'Full ingress pipeline active. p99 down to 18ms.', deltaTokens: 80, latencyMs: 12 },
          'guardrail-02': { status: 'idle', confidence: 100, task: 'Zero transactional violations recorded.', deltaTokens: 90, latencyMs: 14 },
          'specialist-03': { status: 'idle', confidence: 100, task: 'Lock graph cleared of all cycles.', deltaTokens: 100, latencyMs: 15 },
          'synthesizer-04': { status: 'idle', confidence: 100, task: 'TX-98418 replayed and successfully settled.', deltaTokens: 110, latencyMs: 16 },
          'arbiter-05': { status: 'committed', confidence: 100, task: 'Byzantine consensus finalized. Shard quorum restored.', deltaTokens: 580, latencyMs: 24 }
        }
      }
    ]
  },
  {
    id: 'zeroday-exploit-quarantine',
    title: 'Zero-Day Exploit Quarantine',
    subtitle: 'WASM Edge Sandbox Heap Corruption & RCE Mitigation',
    severity: 'CRITICAL',
    targetSystem: 'Cloudflare / Fastly Edge WASM Runtime Cluster (Cluster-Zone-B)',
    initialAnomaly: 'Polymorphic shellcode execution attempt detected via integer overflow in Edge WASM memory allocator.',
    estimatedSteps: 5,
    steps: [
      {
        stepNumber: 1,
        title: 'Ingress Signature Extraction & Edge Alert',
        description: 'Atlas-01 detects an illegal memory bounds expansion in HTTP/3 POST payload on edge cluster zone B.',
        fromAgentId: 'router-01',
        toAgentId: 'guardrail-02',
        payloadName: 'ANOMALOUS_STACK_FRAME [6.8MB]',
        payloadSizeKB: 6800,
        payloadData: {
          targetZone: 'Cluster-Zone-B',
          exploitType: 'WASM Linear Memory Out-of-Bounds Write',
          ingressIpRange: '45.134.82.0/24',
          threatClassification: 'ZERO_DAY_RCE'
        },
        quorumCount: 1,
        consensusState: 'PROPOSING',
        logSummary: 'Atlas-01 isolated WASM out-of-bounds frame. Initiated P0 Zero-Day emergency workflow.',
        agentUpdates: {
          'router-01': { status: 'analyzing', confidence: 98, task: 'Isolating tainted HTTP/3 streams and logging packet fingerprints.', deltaTokens: 540, latencyMs: 26 },
          'guardrail-02': { status: 'verifying', confidence: 96, task: 'Evaluating eBPF kernel isolation rules.', deltaTokens: 410, latencyMs: 32 },
          'specialist-03': { status: 'idle', confidence: 90, task: 'Awaiting WASM bytecode binary dump.', deltaTokens: 0, latencyMs: 12 },
          'synthesizer-04': { status: 'idle', confidence: 92, task: 'Preparing hotpatch filter compiler.', deltaTokens: 0, latencyMs: 14 },
          'arbiter-05': { status: 'idle', confidence: 100, task: 'Monitoring node consensus heartbeat.', deltaTokens: 0, latencyMs: 10 }
        }
      },
      {
        stepNumber: 2,
        title: 'Micro-Canary Jail & Hardened Sandbox Isolation',
        description: 'Aegis-02 instantly isolates the affected worker node group into an eBPF restricted cgroup, preventing lateral movement.',
        fromAgentId: 'guardrail-02',
        toAgentId: 'specialist-03',
        payloadName: 'EBPF_SANDBOX_JAIL_DIRECTIVE [2.1MB]',
        payloadSizeKB: 2100,
        payloadData: {
          cgroupId: 'cgroup.sec.wasm_jail_991',
          syscallsBlocked: ['ptrace', 'bpf', 'fork', 'execve', 'socket_raw'],
          lateralMovementRisk: 'CONTAINED'
        },
        quorumCount: 2,
        consensusState: 'SANDBOXING',
        logSummary: 'Aegis-02 locked edge workers in eBPF jail. Lateral spread prevented.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 98, task: 'Null-routing attacker subnet 45.134.82.0/24.', deltaTokens: 120, latencyMs: 16 },
          'guardrail-02': { status: 'analyzing', confidence: 100, task: 'Activated eBPF syscall filter. Lateral movement zeroed.', deltaTokens: 710, latencyMs: 42 },
          'specialist-03': { status: 'analyzing', confidence: 95, task: 'Disassembling WASM module bytecode at offset 0x004F2B.', deltaTokens: 920, latencyMs: 88 },
          'synthesizer-04': { status: 'idle', confidence: 93, task: 'Synthesizing packet filter rules.', deltaTokens: 0, latencyMs: 14 },
          'arbiter-05': { status: 'idle', confidence: 100, task: 'Quorum verification at 2/5 signatures.', deltaTokens: 80, latencyMs: 12 }
        }
      },
      {
        stepNumber: 3,
        title: 'WASM Bytecode Disassembly & Integer Overflow Root Cause',
        description: 'Nexus-03 performs symbolic execution on the WASM payload, locating the integer wrap in `memory.grow` allocation arithmetic.',
        fromAgentId: 'specialist-03',
        toAgentId: 'synthesizer-04',
        payloadName: 'BYTECODE_VULN_SPECIFICATION [7.2MB]',
        payloadSizeKB: 7200,
        payloadData: {
          faultOffset: '0x004F2B',
          instruction: 'i32.add (overflows uint32 max)',
          vulnerability: 'Heap integer wrap bypasses bounds checking',
          mitigationRecommendation: 'Clamped saturating uint64 arithmetic'
        },
        quorumCount: 3,
        consensusState: 'ISOLATING',
        logSummary: 'Nexus-03 proved integer wrap in memory.grow at offset 0x004F2B. Forwarded mitigation to Synapse-04.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 98, task: 'Monitoring global edge nodes.', deltaTokens: 90, latencyMs: 14 },
          'guardrail-02': { status: 'idle', confidence: 100, task: 'Maintained containment jail.', deltaTokens: 110, latencyMs: 18 },
          'specialist-03': { status: 'verifying', confidence: 99, task: 'Symbolic execution complete. Root cause verified.', deltaTokens: 1540, latencyMs: 104 },
          'synthesizer-04': { status: 'synthesizing', confidence: 97, task: 'Compiling dynamic eBPF drop filter and WASM shim hot-patch.', deltaTokens: 1080, latencyMs: 62 },
          'arbiter-05': { status: 'quorum_voting', confidence: 100, task: 'Validating patch safety proof.', deltaTokens: 220, latencyMs: 20 }
        }
      },
      {
        stepNumber: 4,
        title: 'Dynamic eBPF Kernel Filter & Hot-Patch Compilation',
        description: 'Synapse-04 compiles an inline eBPF bytecode filter and generates a zero-downtime memory-saturating runtime shim.',
        fromAgentId: 'synthesizer-04',
        toAgentId: 'arbiter-05',
        payloadName: 'DYNAMIC_EBPF_HOTPATCH [1.9MB]',
        payloadSizeKB: 1900,
        payloadData: {
          ebpfProgramHash: 'sha256:7f3b...19a0',
          dropSignatureLength: 48,
          simulatedPerfImpact: '< 0.002% overhead',
          hotpatchVerified: true
        },
        quorumCount: 4,
        consensusState: 'SYNTHESIZING',
        logSummary: 'Synapse-04 compiled eBPF filter with <0.002% overhead. Ready for canary verification.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 98, task: 'Standby for canary route split.', deltaTokens: 90, latencyMs: 14 },
          'guardrail-02': { status: 'idle', confidence: 100, task: 'Verified eBPF filter bytecode safety.', deltaTokens: 180, latencyMs: 22 },
          'specialist-03': { status: 'idle', confidence: 99, task: 'Verified patched WASM binary against fuzz test suite.', deltaTokens: 380, latencyMs: 36 },
          'synthesizer-04': { status: 'synthesizing', confidence: 99, task: 'Hotpatch compiled. Transmitted to Kharon-05.', deltaTokens: 840, latencyMs: 50 },
          'arbiter-05': { status: 'quorum_voting', confidence: 100, task: 'Gathering consensus for canary rollout authorization.', deltaTokens: 490, latencyMs: 26 }
        }
      },
      {
        stepNumber: 5,
        title: 'Canary Deployment & Global Cluster Immunity Rollout',
        description: 'Kharon-05 executes a progressive rollout (1% -> 100%) across 240 edge datacenters. Zero downtime; threat neutralized.',
        fromAgentId: 'arbiter-05',
        toAgentId: 'router-01',
        payloadName: 'GLOBAL_IMMUNITY_DEPLOYED [820KB]',
        payloadSizeKB: 820,
        payloadData: {
          datacentersProtected: 240,
          exploitAttemptsBlocked: 489,
          clusterDowntimeMs: 0,
          consensusProof: '5/5 NODES CERTIFIED'
        },
        quorumCount: 5,
        consensusState: 'COMMITTED',
        logSummary: 'Kharon-05 rolled out immunity filter to 240 datacenters. Zero downtime. Threat permanently neutralized.',
        agentUpdates: {
          'router-01': { status: 'idle', confidence: 100, task: 'All traffic normal. 489 attack attempts blocked at edge.', deltaTokens: 80, latencyMs: 12 },
          'guardrail-02': { status: 'idle', confidence: 100, task: 'Sandbox jail deactivated. Global rules active.', deltaTokens: 90, latencyMs: 14 },
          'specialist-03': { status: 'idle', confidence: 100, task: 'Vulnerability CVE signature archived.', deltaTokens: 100, latencyMs: 16 },
          'synthesizer-04': { status: 'idle', confidence: 100, task: 'Immunity filter permanently integrated.', deltaTokens: 110, latencyMs: 16 },
          'arbiter-05': { status: 'committed', confidence: 100, task: 'Byzantine consensus finalized. 5/5 signed commit.', deltaTokens: 610, latencyMs: 24 }
        }
      }
    ]
  }
];
