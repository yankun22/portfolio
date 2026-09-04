export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SVGCoords {
  x: number;
  y: number;
}

export interface EdgePoP {
  id: string;
  city: string;
  iata: string;
  region: string;
  coordinates: Coordinates;
  svgCoords: SVGCoords;
  ipPrefix: string;
  asn: string;
  tier1Peers: number;
  capacityTbps: number;
  status: 'OPERATIONAL' | 'DEGRADED';
}

export interface ClientOrigin {
  id: string;
  city: string;
  country: string;
  coordinates: Coordinates;
  svgCoords: SVGCoords;
  isp: string;
  asn: string;
  ip: string;
}

export type PhaseCategory = 'NETWORK' | 'SECURITY' | 'EDGE' | 'COMPUTE' | 'TRANSFER';

export interface PhaseDetail {
  label: string;
  value: string;
}

export interface WaterfallPhase {
  id: string;
  name: string;
  category: PhaseCategory;
  baseDurationMs: number;
  actualDurationMs: number;
  startOffsetMs: number;
  status: 'OPTIMAL' | 'COLD_START' | 'CACHE_MISS' | 'FAST_PATH';
  protocol: string;
  details: PhaseDetail[];
  explanation: string;
}

export type RuntimeMode = 'ISOLATE' | 'CONTAINER';

export type CacheStatus = 'HIT' | 'MISS';

export interface ProbeSimulation {
  isProbing: boolean;
  progress: number;
  activePhaseId: string | null;
  totalDurationMs: number;
  geodesicDistanceKm: number;
  fiberRttMs: number;
  transitHops: number;
  timestamp: string;
}
