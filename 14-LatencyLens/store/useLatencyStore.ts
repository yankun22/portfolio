import { create } from 'zustand';
import {
  EdgePoP,
  ClientOrigin,
  WaterfallPhase,
  RuntimeMode,
  CacheStatus,
} from '../types/edge';
import {
  GLOBAL_EDGE_POPS,
  CLIENT_ORIGINS,
  findNearestAnycastPoP,
} from '../data/edgeData';

interface LatencyState {
  // Navigation & Origin
  clientOrigins: ClientOrigin[];
  selectedOrigin: ClientOrigin;
  setSelectedOrigin: (origin: ClientOrigin) => void;
  
  // Target Edge PoP & Routing
  edgePoPs: EdgePoP[];
  targetPoP: EdgePoP;
  geodesicDistanceKm: number;
  fiberRttMs: number;
  transitHops: number;

  // Runtime & Caching Modes
  runtimeMode: RuntimeMode;
  setRuntimeMode: (mode: RuntimeMode) => void;
  cacheStatus: CacheStatus;
  setCacheStatus: (status: CacheStatus) => void;

  // Waterfall Phases & Inspection
  waterfallPhases: WaterfallPhase[];
  totalLatencyMs: number;
  selectedPhaseForInspection: WaterfallPhase | null;
  setSelectedPhaseForInspection: (phase: WaterfallPhase | null) => void;

  // Live Probe Simulation
  isProbing: boolean;
  probeProgress: number;
  activePhaseId: string | null;
  triggerProbe: () => void;

  // Mobile Tabs
  activeMobileTab: 'map' | 'waterfall' | 'runtime';
  setActiveMobileTab: (tab: 'map' | 'waterfall' | 'runtime') => void;
}

// Generate waterfall phases based on distance, fiber RTT, runtime mode, and cache status
function generatePhases(
  fiberRtt: number,
  mode: RuntimeMode,
  cache: CacheStatus
): { phases: WaterfallPhase[]; totalMs: number } {
  // RTT scaling factor
  const rttFactor = Math.max(0.6, fiberRtt / 25);

  // Phase 1: DNS
  const dnsMs = Math.round(1.8 * 10) / 10;

  // Phase 2: TCP Handshake (1 RTT)
  const tcpMs = Math.round(Math.max(4.2, fiberRtt * 0.9) * 10) / 10;

  // Phase 3: TLS 1.3 Handshake (1 RTT)
  const tlsMs = Math.round(Math.max(5.1, fiberRtt * 1.05) * 10) / 10;

  // Phase 4: Edge Cache Lookup
  const cacheMs = Math.round(0.8 * 10) / 10;

  // Phase 5: Compute Execution & Cold Start
  let computeMs = 0;
  let computeStatus: WaterfallPhase['status'] = 'OPTIMAL';
  let computeExplanation = '';

  if (cache === 'HIT') {
    computeMs = 0.0;
    computeStatus = 'FAST_PATH';
    computeExplanation =
      'Zero backend compute required. Edge in-memory LRU served static asset at wire speed.';
  } else {
    // Cache MISS
    if (mode === 'ISOLATE') {
      computeMs = 3.4;
      computeStatus = 'OPTIMAL';
      computeExplanation =
        'V8 Edge Isolate spun up in <0.5ms with 0ms cold start. Pure WebAssembly / JS evaluation within 128MB sandbox.';
    } else {
      // Standard Container Cold Start
      computeMs = 142.0;
      computeStatus = 'COLD_START';
      computeExplanation =
        'Container instance initialized. Linux kernel namespace creation + Node.js process boot induced 142ms cold start penalty.';
    }
  }

  // Phase 6: Response Streaming (TTFB + Body)
  const streamMs = Math.round(Math.max(3.5, fiberRtt * 0.45) * 10) / 10;

  const rawPhases: Omit<WaterfallPhase, 'startOffsetMs'>[] = [
    {
      id: 'dns',
      name: 'DNS Resolution',
      category: 'NETWORK',
      baseDurationMs: 1.8,
      actualDurationMs: dnsMs,
      status: 'OPTIMAL',
      protocol: 'DoH / Quad9 Anycast',
      explanation:
        'Client resolved edge.anycast.latencylens.io using DNS over HTTPS (RFC 8484) with 0-TTL edge caching.',
      details: [
        { label: 'Query Type', value: 'A / AAAA (Dual Stack)' },
        { label: 'Resolver', value: '1.1.1.1 (Anycast)' },
        { label: 'EDNS Client Subnet', value: 'Enabled (ecs: /24)' },
        { label: 'Recursion Time', value: `${dnsMs}ms` },
      ],
    },
    {
      id: 'tcp',
      name: 'TCP Handshake',
      category: 'NETWORK',
      baseDurationMs: 11.4,
      actualDurationMs: tcpMs,
      status: 'OPTIMAL',
      protocol: 'TCP / BBRv3 Congestion Control',
      explanation:
        'SYN / SYN-ACK / ACK 1-RTT roundtrip over optimized optical transit peering at the nearest Edge IXP.',
      details: [
        { label: 'Window Size', value: '65,535 bytes' },
        { label: 'Congestion Alg', value: 'BBRv3 Probing' },
        { label: 'MSS', value: '1,460 bytes' },
        { label: 'Round Trips', value: '1-RTT' },
      ],
    },
    {
      id: 'tls',
      name: 'TLS 1.3 Handshake',
      category: 'SECURITY',
      baseDurationMs: 14.2,
      actualDurationMs: tlsMs,
      status: 'OPTIMAL',
      protocol: 'TLS 1.3 / X25519',
      explanation:
        'Zero-round-trip session ticket negotiation. Diffie-Hellman ephemeral key exchange secured with AES-256-GCM.',
      details: [
        { label: 'Cipher Suite', value: 'TLS_AES_256_GCM_SHA384' },
        { label: 'Key Exchange', value: 'X25519 (ECDH)' },
        { label: 'ALPN', value: 'h3, h2, http/1.1' },
        { label: 'Session Ticket', value: '0-RTT Resumption' },
      ],
    },
    {
      id: 'cache',
      name: 'Edge Cache Check',
      category: 'EDGE',
      baseDurationMs: 0.9,
      actualDurationMs: cacheMs,
      status: cache === 'HIT' ? 'FAST_PATH' : 'CACHE_MISS',
      protocol: 'L1 In-Memory LRU / L2 NVMe',
      explanation:
        cache === 'HIT'
          ? 'Cache Tag HIT! Found warm compiled response in PoP in-memory cluster storage.'
          : 'Cache MISS. Purged or dynamic request bypassed L1 cache, requiring downstream runtime invocation.',
      details: [
        { label: 'Cache Status', value: cache === 'HIT' ? 'HIT (L1 Memory)' : 'MISS (Origin Forward)' },
        { label: 'TTL', value: cache === 'HIT' ? '3,600s' : '0s (Bypass)' },
        { label: 'Cache Key', value: 'SHA256(req_url + accept_encoding)' },
        { label: 'Tier', value: 'NVMe Multi-Region' },
      ],
    },
    {
      id: 'compute',
      name: cache === 'HIT' ? 'Compute Bypassed (Hit)' : mode === 'ISOLATE' ? 'V8 Isolate Execution' : 'Container Cold Start',
      category: 'COMPUTE',
      baseDurationMs: mode === 'ISOLATE' ? 3.4 : 142.0,
      actualDurationMs: computeMs,
      status: computeStatus,
      protocol: mode === 'ISOLATE' ? 'V8 SnapStart v12.4' : 'OCI Linux cgroup v2',
      explanation: computeExplanation,
      details: [
        { label: 'Runtime', value: mode === 'ISOLATE' ? 'Cloudflare / Deno V8 Worker' : 'Docker Container (Node.js 22)' },
        { label: 'Memory Ceiling', value: mode === 'ISOLATE' ? '128 MB' : '1,024 MB' },
        { label: 'Cold Boot Latency', value: mode === 'ISOLATE' ? '0ms' : '142ms' },
        { label: 'Isolation Model', value: mode === 'ISOLATE' ? 'Process Heap Isolates' : 'Linux Kernel Namespaces' },
      ],
    },
    {
      id: 'stream',
      name: 'Response Streaming (TTFB)',
      category: 'TRANSFER',
      baseDurationMs: 6.8,
      actualDurationMs: streamMs,
      status: 'OPTIMAL',
      protocol: 'HTTP/3 QUIC Multiplex',
      explanation:
        'Payload delivered via QUIC UDP datagrams with zero head-of-line blocking and adaptive flow control.',
      details: [
        { label: 'Protocol', value: 'HTTP/3 (QUIC)' },
        { label: 'Transfer Size', value: '4.8 KB' },
        { label: 'Content Encoding', value: 'zstd (Level 3)' },
        { label: 'Flow Control', value: 'Adaptive Stream Credit' },
      ],
    },
  ];

  // Calculate cumulative offsets
  let currentOffset = 0;
  const phases: WaterfallPhase[] = rawPhases.map((phase) => {
    const startOffsetMs = Math.round(currentOffset * 10) / 10;
    currentOffset += phase.actualDurationMs;
    return {
      ...phase,
      startOffsetMs,
    };
  });

  const totalMs = Math.round(currentOffset * 10) / 10;
  return { phases, totalMs };
}

const defaultOrigin = CLIENT_ORIGINS[0]; // San Francisco
const initialAnycast = findNearestAnycastPoP(defaultOrigin);
const initialWaterfall = generatePhases(initialAnycast.fiberRttMs, 'ISOLATE', 'HIT');

export const useLatencyStore = create<LatencyState>((set, get) => ({
  clientOrigins: CLIENT_ORIGINS,
  selectedOrigin: defaultOrigin,
  setSelectedOrigin: (origin) => {
    const anycast = findNearestAnycastPoP(origin);
    const { phases, totalMs } = generatePhases(
      anycast.fiberRttMs,
      get().runtimeMode,
      get().cacheStatus
    );
    set({
      selectedOrigin: origin,
      targetPoP: anycast.pop,
      geodesicDistanceKm: anycast.distanceKm,
      fiberRttMs: anycast.fiberRttMs,
      transitHops: anycast.hops,
      waterfallPhases: phases,
      totalLatencyMs: totalMs,
      selectedPhaseForInspection: phases[0],
    });
  },

  edgePoPs: GLOBAL_EDGE_POPS,
  targetPoP: initialAnycast.pop,
  geodesicDistanceKm: initialAnycast.distanceKm,
  fiberRttMs: initialAnycast.fiberRttMs,
  transitHops: initialAnycast.hops,

  runtimeMode: 'ISOLATE',
  setRuntimeMode: (mode) => {
    const { fiberRttMs, cacheStatus } = get();
    const { phases, totalMs } = generatePhases(fiberRttMs, mode, cacheStatus);
    set({
      runtimeMode: mode,
      waterfallPhases: phases,
      totalLatencyMs: totalMs,
    });
  },

  cacheStatus: 'HIT',
  setCacheStatus: (status) => {
    const { fiberRttMs, runtimeMode } = get();
    const { phases, totalMs } = generatePhases(fiberRttMs, runtimeMode, status);
    set({
      cacheStatus: status,
      waterfallPhases: phases,
      totalLatencyMs: totalMs,
    });
  },

  waterfallPhases: initialWaterfall.phases,
  totalLatencyMs: initialWaterfall.totalMs,
  selectedPhaseForInspection: initialWaterfall.phases[0],
  setSelectedPhaseForInspection: (phase) => set({ selectedPhaseForInspection: phase }),

  isProbing: false,
  probeProgress: 0,
  activePhaseId: null,
  triggerProbe: () => {
    if (get().isProbing) return;

    set({ isProbing: true, probeProgress: 0, activePhaseId: 'dns' });

    const phases = get().waterfallPhases;
    const totalMs = get().totalLatencyMs;
    const intervalTime = 40; // update every 40ms
    const totalSteps = 25; // 1 second total animation duration
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const progress = Math.min(100, Math.round((step / totalSteps) * 100));

      // Calculate which phase is active based on progress fraction
      const activeIdx = Math.min(
        phases.length - 1,
        Math.floor((progress / 100) * phases.length)
      );
      const activePhase = phases[activeIdx];

      set({
        probeProgress: progress,
        activePhaseId: activePhase ? activePhase.id : null,
      });

      if (step >= totalSteps) {
        clearInterval(timer);
        set({
          isProbing: false,
          probeProgress: 100,
          activePhaseId: null,
        });
      }
    }, intervalTime);
  },

  activeMobileTab: 'map',
  setActiveMobileTab: (tab) => set({ activeMobileTab: tab }),
}));
