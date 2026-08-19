import type { Coordinates } from '../types/itinerary';
import { type Hotspot, searchHotspots } from '../data/globalHotspots';

/**
 * Calculates the great-circle distance between two points using the Haversine formula (in kilometers).
 */
export function calculateHaversineDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function kmToMiles(km: number): number {
  return Math.round(km * 0.621371 * 10) / 10;
}

export interface RouteLeg {
  fromName: string;
  toName: string;
  distanceKm: number;
  walkMinutes: number;
  transitMinutes: number;
  driveMinutes: number;
}

export interface DayRouteSummary {
  totalDistanceKm: number;
  totalDistanceMiles: number;
  estimatedWalkTimeMinutes: number;
  estimatedTransitTimeMinutes: number;
  estimatedDriveTimeMinutes: number;
  legs: RouteLeg[];
  waypointCount: number;
}

export function calculateDayRouteSummary(
  waypoints: { name: string; coords: Coordinates }[]
): DayRouteSummary {
  if (!waypoints || waypoints.length < 2) {
    return {
      totalDistanceKm: 0,
      totalDistanceMiles: 0,
      estimatedWalkTimeMinutes: 0,
      estimatedTransitTimeMinutes: 0,
      estimatedDriveTimeMinutes: 0,
      legs: [],
      waypointCount: waypoints ? waypoints.length : 0
    };
  }

  let totalKm = 0;
  const legs: RouteLeg[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const dist = calculateHaversineDistance(from.coords, to.coords);
    totalKm += dist;

    const walkMins = Math.round(dist * 13.3);
    const transitMins = Math.round(dist * 2.5 + 5);
    const driveMins = Math.round(dist * 1.8 + 3);

    legs.push({
      fromName: from.name,
      toName: to.name,
      distanceKm: dist,
      walkMinutes: walkMins,
      transitMinutes: transitMins,
      driveMinutes: driveMins
    });
  }

  const roundedKm = Math.round(totalKm * 10) / 10;
  return {
    totalDistanceKm: roundedKm,
    totalDistanceMiles: kmToMiles(roundedKm),
    estimatedWalkTimeMinutes: Math.round(roundedKm * 13.3),
    estimatedTransitTimeMinutes: Math.round(roundedKm * 2.5 + legs.length * 4),
    estimatedDriveTimeMinutes: Math.round(roundedKm * 1.8 + legs.length * 3),
    legs,
    waypointCount: waypoints.length
  };
}

/**
 * Searches places using OpenStreetMap Nominatim with instant fallback to offline database.
 */
export async function searchPlacesOnlineOrOffline(
  query: string
): Promise<Hotspot[]> {
  if (!query || query.trim().length === 0) {
    return searchHotspots('');
  }

  const offlineMatches = searchHotspots(query);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=6&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'VoyagePlanner-App'
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const onlineResults: Hotspot[] = data.map((item: any) => ({
          name: item.name || item.display_name.split(',')[0],
          city:
            item.address?.city ||
            item.address?.town ||
            item.address?.state ||
            item.display_name.split(',')[1]?.trim() ||
            'Destination',
          country: item.address?.country || 'International',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          category: 'sightseeing',
          description: item.display_name
        }));

        const combined = [...onlineResults];
        for (const off of offlineMatches) {
          if (!combined.some(c => c.name.toLowerCase() === off.name.toLowerCase())) {
            combined.push(off);
          }
        }
        return combined.slice(0, 8);
      }
    }
  } catch {
    // Fall back to offline
  }

  return offlineMatches;
}
