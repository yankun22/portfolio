import React from 'react';
import { Route, DollarSign, Activity as ActivityIcon, Footprints } from 'lucide-react';
import type { DayRouteSummary } from '../../services/geoService';
import { formatMoney } from '../../data/currencies';
import type { TravelPace } from '../../types/itinerary';

interface DaySummaryBarProps {
  dayTitle: string;
  dayDate: string;
  routeSummary: DayRouteSummary;
  totalDayCost: number;
  activityCount: number;
  primaryCurrency: string;
}

export function computeTravelPace(activityCount: number, distanceKm: number): TravelPace {
  if (activityCount >= 5 || distanceKm >= 18) {
    return {
      level: 'Packed',
      color: '#fb7185',
      description: 'High-energy day with intensive sightseeing & transit'
    };
  }
  if (activityCount >= 3 || distanceKm >= 6) {
    return {
      level: 'Moderate',
      color: '#fbbf24',
      description: 'Balanced pace with plenty of time for meals & strolls'
    };
  }
  return {
    level: 'Relaxed',
    color: '#34d399',
    description: 'Leisurely pace with open flexibility'
  };
}

export const DaySummaryBar: React.FC<DaySummaryBarProps> = ({
  dayTitle,
  dayDate,
  routeSummary,
  totalDayCost,
  activityCount,
  primaryCurrency
}) => {
  const pace = computeTravelPace(activityCount, routeSummary.totalDistanceKm);

  return (
    <div className="day-header-meta">
      <div>
        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {dayTitle}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dayDate}</div>
      </div>

      <div className="day-stats-row">
        <div className="day-stat-item" title="Estimated day travel distance">
          <Route size={13} color="var(--accent-primary)" />
          <span>
            <strong>{routeSummary.totalDistanceKm} km</strong> ({routeSummary.totalDistanceMiles} mi)
          </span>
        </div>

        {routeSummary.totalDistanceKm > 0 && (
          <div className="day-stat-item" title="Estimated walking time between waypoints">
            <Footprints size={13} color="#10b981" />
            <span>~{routeSummary.estimatedWalkTimeMinutes}m</span>
          </div>
        )}

        <div className="day-stat-item" title="Total scheduled cost for this day">
          <DollarSign size={13} color="#f59e0b" />
          <span>{formatMoney(totalDayCost, primaryCurrency)}</span>
        </div>

        <div className="day-stat-item" title="Number of scheduled activities">
          <ActivityIcon size={13} color="#8b5cf6" />
          <span>{activityCount} stops</span>
        </div>

        <div
          className={`pace-badge pace-${pace.level.toLowerCase()}`}
          title={pace.description}
        >
          {pace.level}
        </div>
      </div>
    </div>
  );
};
