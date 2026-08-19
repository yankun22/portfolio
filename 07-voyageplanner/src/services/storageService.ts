import type { Trip } from '../types/itinerary';
import type { Companion, Expense } from '../types/budget';
import type { PackingItem } from '../types/packing';
import { SAMPLE_TRIPS, SAMPLE_COMPANIONS, SAMPLE_EXPENSES } from '../data/sampleTrips';
import { generateDefaultPackingList } from '../data/defaultPacking';

const STORAGE_KEYS = {
  TRIPS: 'voyageplanner_trips_v1',
  ACTIVE_TRIP_ID: 'voyageplanner_active_trip_id_v1',
  COMPANIONS: 'voyageplanner_companions_v1',
  EXPENSES: 'voyageplanner_expenses_v1',
  PACKING: 'voyageplanner_packing_v1',
  DARK_MODE: 'voyageplanner_dark_mode_v1'
};

export interface AppStateSnapshot {
  trips: Trip[];
  activeTripId: string;
  companions: Record<string, Companion[]>;
  expenses: Record<string, Expense[]>;
  packing: Record<string, PackingItem[]>;
}

export function loadInitialAppState(): AppStateSnapshot {
  try {
    const rawTrips = localStorage.getItem(STORAGE_KEYS.TRIPS);
    const rawActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRIP_ID);
    const rawCompanions = localStorage.getItem(STORAGE_KEYS.COMPANIONS);
    const rawExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const rawPacking = localStorage.getItem(STORAGE_KEYS.PACKING);

    const trips: Trip[] = rawTrips ? JSON.parse(rawTrips) : SAMPLE_TRIPS;
    const activeTripId: string = rawActiveId && trips.some(t => t.id === rawActiveId)
      ? rawActiveId
      : trips[0]?.id || 'trip-tokyo-kyoto';

    const companions: Record<string, Companion[]> = rawCompanions
      ? JSON.parse(rawCompanions)
      : SAMPLE_COMPANIONS;

    const expenses: Record<string, Expense[]> = rawExpenses
      ? JSON.parse(rawExpenses)
      : SAMPLE_EXPENSES;

    let packing: Record<string, PackingItem[]> = {};
    if (rawPacking) {
      packing = JSON.parse(rawPacking);
    } else {
      trips.forEach(t => {
        packing[t.id] = generateDefaultPackingList(t.id);
      });
    }

    return {
      trips,
      activeTripId,
      companions,
      expenses,
      packing
    };
  } catch (err) {
    console.error('Failed to load from storage, using defaults', err);
    return {
      trips: SAMPLE_TRIPS,
      activeTripId: 'trip-tokyo-kyoto',
      companions: SAMPLE_COMPANIONS,
      expenses: SAMPLE_EXPENSES,
      packing: {
        'trip-tokyo-kyoto': generateDefaultPackingList('trip-tokyo-kyoto')
      }
    };
  }
}

export function saveTripsToStorage(trips: Trip[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  } catch (e) {
    console.error('Storage save error', e);
  }
}

export function saveActiveTripId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRIP_ID, id);
  } catch (_e) {}
}

export function saveCompanionsToStorage(companions: Record<string, Companion[]>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPANIONS, JSON.stringify(companions));
  } catch (_e) {}
}

export function saveExpensesToStorage(expenses: Record<string, Expense[]>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (_e) {}
}

export function savePackingToStorage(packing: Record<string, PackingItem[]>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PACKING, JSON.stringify(packing));
  } catch (_e) {}
}

export function exportTripToJson(tripId: string, state: AppStateSnapshot): string {
  const trip = state.trips.find(t => t.id === tripId);
  const bundle = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    trip,
    companions: state.companions[tripId] || [],
    expenses: state.expenses[tripId] || [],
    packing: state.packing[tripId] || []
  };
  return JSON.stringify(bundle, null, 2);
}

export function downloadJsonFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
