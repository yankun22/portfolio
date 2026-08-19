import type { Activity } from './itinerary';

export type TransportMode = 'walking' | 'transit' | 'driving' | 'cycling';

export interface RouteStep {
  id: string;
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  maneuverType: 'depart' | 'turn-left' | 'turn-right' | 'continue' | 'arrive' | 'board-transit' | 'transfer';
  streetName?: string;
}

export interface RouteLeg {
  id: string;
  fromActivity: Activity;
  toActivity: Activity;
  mode: TransportMode;
  distanceKm: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lng] array along actual roads
  steps: RouteStep[];
  transitDetails?: {
    lineName: string;
    lineColor: string;
    boardingStation: string;
    destinationStation: string;
    stopsCount: number;
  };
  googleMapsUrl: string;
}

export interface DayNavigationState {
  activeLegIndex: number | null; // null = overview mode, number = specific leg active
  selectedMode: TransportMode;
  isDirectionsOpen: boolean;
  legs: RouteLeg[];
}
