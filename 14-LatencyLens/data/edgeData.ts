import { EdgePoP, ClientOrigin } from '../types/edge';
import worldGeo from './worldGeo.json';

// Authentic Equirectangular projection matching Natural Earth ViewBox 960 x 500
export function projectGeoToSVG(lat: number, lng: number): { x: number; y: number } {
  const s = 152.78874536821953;
  const x = 480 + ((lng * Math.PI) / 180) * s;
  const y = 250 - ((lat * Math.PI) / 180) * s;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

// 6 Core Global Edge PoPs requested
export const GLOBAL_EDGE_POPS: EdgePoP[] = [
  {
    id: 'iad',
    city: 'Virginia (US East)',
    iata: 'IAD',
    region: 'North America',
    coordinates: { lat: 38.9072, lng: -77.0369 },
    svgCoords: projectGeoToSVG(38.9072, -77.0369),
    ipPrefix: '198.51.100.12/24',
    asn: 'AS13335 (Anycast Core)',
    tier1Peers: 64,
    capacityTbps: 180,
    status: 'OPERATIONAL',
  },
  {
    id: 'lhr',
    city: 'London',
    iata: 'LHR',
    region: 'Europe West',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    svgCoords: projectGeoToSVG(51.5074, -0.1278),
    ipPrefix: '198.51.100.18/24',
    asn: 'AS13335 (LINX IXP)',
    tier1Peers: 58,
    capacityTbps: 165,
    status: 'OPERATIONAL',
  },
  {
    id: 'fra',
    city: 'Frankfurt',
    iata: 'FRA',
    region: 'Europe Central',
    coordinates: { lat: 50.1109, lng: 8.6821 },
    svgCoords: projectGeoToSVG(50.1109, 8.6821),
    ipPrefix: '198.51.100.22/24',
    asn: 'AS13335 (DE-CIX)',
    tier1Peers: 72,
    capacityTbps: 210,
    status: 'OPERATIONAL',
  },
  {
    id: 'nrt',
    city: 'Tokyo',
    iata: 'NRT',
    region: 'Asia Pacific',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    svgCoords: projectGeoToSVG(35.6762, 139.6503),
    ipPrefix: '198.51.100.45/24',
    asn: 'AS13335 (JPIX / BBIX)',
    tier1Peers: 48,
    capacityTbps: 140,
    status: 'OPERATIONAL',
  },
  {
    id: 'sin',
    city: 'Singapore',
    iata: 'SIN',
    region: 'Southeast Asia',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    svgCoords: projectGeoToSVG(1.3521, 103.8198),
    ipPrefix: '198.51.100.67/24',
    asn: 'AS13335 (SGIX Subsea)',
    tier1Peers: 52,
    capacityTbps: 155,
    status: 'OPERATIONAL',
  },
  {
    id: 'bom',
    city: 'Mumbai',
    iata: 'BOM',
    region: 'South Asia',
    coordinates: { lat: 19.076, lng: 72.8777 },
    svgCoords: projectGeoToSVG(19.076, 72.8777),
    ipPrefix: '198.51.100.89/24',
    asn: 'AS13335 (NIXI Mumbai)',
    tier1Peers: 44,
    capacityTbps: 120,
    status: 'OPERATIONAL',
  },
];

// Predefined Global Client Origins for dynamic Anycast routing tests
export const CLIENT_ORIGINS: ClientOrigin[] = [
  {
    id: 'sfo',
    city: 'San Francisco',
    country: 'United States',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    svgCoords: projectGeoToSVG(37.7749, -122.4194),
    isp: 'Comcast Fiber / AS7922',
    asn: 'AS7922',
    ip: '73.189.44.11',
  },
  {
    id: 'gru',
    city: 'São Paulo',
    country: 'Brazil',
    coordinates: { lat: -23.5505, lng: -46.6333 },
    svgCoords: projectGeoToSVG(-23.5505, -46.6333),
    isp: 'Claro Brasil / AS28573',
    asn: 'AS28573',
    ip: '177.136.21.84',
  },
  {
    id: 'ber',
    city: 'Berlin',
    country: 'Germany',
    coordinates: { lat: 52.52, lng: 13.405 },
    svgCoords: projectGeoToSVG(52.52, 13.405),
    isp: 'Deutsche Telekom / AS3320',
    asn: 'AS3320',
    ip: '84.144.19.202',
  },
  {
    id: 'dxb',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    svgCoords: projectGeoToSVG(25.2048, 55.2708),
    isp: 'du Telecom / AS15802',
    asn: 'AS15802',
    ip: '94.200.78.15',
  },
  {
    id: 'syd',
    city: 'Sydney',
    country: 'Australia',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    svgCoords: projectGeoToSVG(-33.8688, 151.2093),
    isp: 'Telstra Global / AS1221',
    asn: 'AS1221',
    ip: '110.142.61.9',
  },
  {
    id: 'cpt',
    city: 'Cape Town',
    country: 'South Africa',
    coordinates: { lat: -33.9249, lng: 18.4241 },
    svgCoords: projectGeoToSVG(-33.9249, 18.4241),
    isp: 'Liquid Intelligent / AS30844',
    asn: 'AS30844',
    ip: '105.234.90.14',
  },
  {
    id: 'icn',
    city: 'Seoul',
    country: 'South Korea',
    coordinates: { lat: 37.5665, lng: 126.978 },
    svgCoords: projectGeoToSVG(37.5665, 126.978),
    isp: 'KT Corporation / AS4766',
    asn: 'AS4766',
    ip: '121.134.50.2',
  },
];

// Calculate Haversine Geodesic Distance in Kilometers
export function calculateHaversineKm(
  coord1: { lat: number; lng: number },
  coord2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Anycast Decision: Find the closest Edge PoP
export function findNearestAnycastPoP(origin: ClientOrigin): {
  pop: EdgePoP;
  distanceKm: number;
  fiberRttMs: number;
  hops: number;
} {
  let closest = GLOBAL_EDGE_POPS[0];
  let minDistance = Infinity;

  for (const pop of GLOBAL_EDGE_POPS) {
    const dist = calculateHaversineKm(origin.coordinates, pop.coordinates);
    if (dist < minDistance) {
      minDistance = dist;
      closest = pop;
    }
  }

  // Speed of light in fiber optic glass: ~204 km/ms
  // Terrestrial + subsea routing tortuosity factor: 1.32
  // Round trip (RTT) = (distance * 2 * 1.32) / 204
  const rawFiberRtt = (minDistance * 2 * 1.32) / 204;
  const fiberRttMs = Math.max(1.2, Math.round(rawFiberRtt * 10) / 10);

  // Simulated transit BGP autonomous system hops
  const hops = Math.min(9, Math.max(3, Math.round(minDistance / 1400) + 3));

  return {
    pop: closest,
    distanceKm: minDistance,
    fiberRttMs,
    hops,
  };
}

// Authentic Natural Earth Real-World Map Vector Paths
export const REAL_WORLD_LAND_PATH = worldGeo.landPath;
export const REAL_WORLD_BORDERS_PATH = worldGeo.bordersPath;
export const REAL_WORLD_GRATICULE_PATH = worldGeo.graticulePath;
