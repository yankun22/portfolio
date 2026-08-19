import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Activity, ItineraryDay } from '../../types/itinerary';
import { ActivityCard } from './ActivityCard';
import { DaySummaryBar } from './DaySummaryBar';
import { calculateDayRouteSummary, calculateHaversineDistance } from '../../services/geoService';
import { Plus, Navigation2, Navigation } from 'lucide-react';

interface DayColumnProps {
  day: ItineraryDay;
  activities: Activity[];
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (activityId: string) => void;
  onAddActivity: (dayId: string) => void;
  onFocusMap?: (coords: { lat: number; lng: number }) => void;
  onNavigateLeg?: (fromId: string, toId: string) => void;
  primaryCurrency: string;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  day,
  activities,
  onEditActivity,
  onDeleteActivity,
  onAddActivity,
  onFocusMap,
  onNavigateLeg,
  primaryCurrency
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: day.id,
    data: { dayId: day.id }
  });

  const sortedActivities = [...activities].sort((a, b) => a.order - b.order);

  const waypoints = sortedActivities
    .filter((a) => a.location?.coords)
    .map((a) => ({ name: a.title, coords: a.location.coords }));

  const routeSummary = calculateDayRouteSummary(waypoints);
  const totalDayCost = sortedActivities.reduce((acc, a) => acc + (a.cost || 0), 0);

  return (
    <div
      ref={setNodeRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: isOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
        borderRadius: 'var(--radius-lg)',
        padding: 4,
        transition: 'var(--transition-fast)'
      }}
    >
      <DaySummaryBar
        dayTitle={`Day ${day.dayNumber}: ${day.title}`}
        dayDate={day.date}
        routeSummary={routeSummary}
        totalDayCost={totalDayCost}
        activityCount={sortedActivities.length}
        primaryCurrency={primaryCurrency}
      />

      <SortableContext
        items={sortedActivities.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedActivities.length === 0 ? (
            <div
              style={{
                padding: '32px 20px',
                textAlign: 'center',
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.01)'
              }}
            >
              <Navigation2 size={24} style={{ opacity: 0.4, marginBottom: 8 }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                No destinations scheduled for this day
              </div>
              <div style={{ fontSize: '0.75rem', marginBottom: 12 }}>
                Drag activities here or add a new place
              </div>
              <button
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                onClick={() => onAddActivity(day.id)}
              >
                <Plus size={13} /> Add Stop
              </button>
            </div>
          ) : (
            sortedActivities.map((act, idx) => {
              let transitSnippet: React.ReactNode = null;
              if (idx < sortedActivities.length - 1) {
                const nextAct = sortedActivities[idx + 1];
                if (act.location?.coords && nextAct.location?.coords) {
                  const dist = calculateHaversineDistance(
                    act.location.coords,
                    nextAct.location.coords
                  );
                  const walkMins = Math.round(dist * 13.3);
                  const transitMins = Math.round(dist * 2.5 + 5);

                  transitSnippet = (
                    <div
                      className="transit-leg-divider interactive-transit-leg"
                      key={`transit-${act.id}-${nextAct.id}`}
                      onClick={() => onNavigateLeg && onNavigateLeg(act.id, nextAct.id)}
                      title="Click to view real street navigation & directions on map"
                    >
                      <Navigation size={12} color="var(--accent-primary)" />
                      <span><strong>{dist} km</strong></span>
                      <span>•</span>
                      <span>🚶 ~{walkMins}m walk</span>
                      <span>or</span>
                      <span>🚆 ~{transitMins}m transit</span>
                      <span className="transit-directions-tag">View Route ➔</span>
                    </div>
                  );
                }
              }

              return (
                <React.Fragment key={act.id}>
                  <ActivityCard
                    activity={act}
                    index={idx}
                    onEdit={onEditActivity}
                    onDelete={onDeleteActivity}
                    onFocusMap={onFocusMap}
                    primaryCurrency={primaryCurrency}
                  />
                  {transitSnippet}
                </React.Fragment>
              );
            })
          )}
        </div>
      </SortableContext>
    </div>
  );
};
