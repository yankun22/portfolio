import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import type { Activity, Trip } from '../../types/itinerary';
import { DayColumn } from './DayColumn';
import { ActivityCard } from './ActivityCard';
import { Plus } from 'lucide-react';

interface TimelineViewProps {
  trip: Trip;
  activities: Activity[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
  onUpdateActivities: (activities: Activity[]) => void;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (activityId: string) => void;
  onAddActivity: (dayId?: string) => void;
  onAddDay: () => void;
  onFocusMap?: (coords: { lat: number; lng: number }) => void;
  onNavigateLeg?: (fromId: string, toId: string) => void;
  primaryCurrency: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  trip,
  activities,
  selectedDayId,
  onSelectDay,
  onUpdateActivities,
  onEditActivity,
  onDeleteActivity,
  onAddActivity,
  onAddDay,
  onFocusMap,
  onNavigateLeg,
  primaryCurrency
}) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const activeActivity = activities.find((a) => a.id === activeDragId);

  const findDayId = (id: string): string | null => {
    if (trip.days.some((d) => d.id === id) || id === 'bucket') {
      return id;
    }
    const act = activities.find((a) => a.id === id);
    return act ? act.dayId : null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeDayId = findDayId(activeId);
    const overDayId = findDayId(overId);

    if (!activeDayId || !overDayId || activeDayId === overDayId) {
      return;
    }

    const updated = activities.map((act) => {
      if (act.id === activeId) {
        return { ...act, dayId: overDayId };
      }
      return act;
    });

    onUpdateActivities(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeDayId = findDayId(activeId);
    const overDayId = findDayId(overId);

    if (!activeDayId || !overDayId) return;

    if (activeDayId === overDayId) {
      const dayActivities = activities
        .filter((a) => a.dayId === activeDayId)
        .sort((a, b) => a.order - b.order);

      const oldIndex = dayActivities.findIndex((a) => a.id === activeId);
      const newIndex = dayActivities.findIndex((a) => a.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = arrayMove(dayActivities, oldIndex, newIndex);
        const reorderedWithOrders = reordered.map((act, idx) => ({
          ...act,
          order: idx + 1
        }));

        const otherActivities = activities.filter((a) => a.dayId !== activeDayId);
        onUpdateActivities([...otherActivities, ...reorderedWithOrders]);
      }
    } else {
      const targetDayActivities = activities
        .filter((a) => a.dayId === overDayId)
        .sort((a, b) => a.order - b.order);

      const updated = activities.map((act) => {
        if (act.id === activeId) {
          return {
            ...act,
            dayId: overDayId,
            order: targetDayActivities.length + 1
          };
        }
        return act;
      });

      onUpdateActivities(updated);
    }
  };

  const bucketActivities = activities.filter((a) => a.dayId === 'bucket');

  const displayedDays =
    selectedDayId === 'all'
      ? trip.days
      : trip.days.filter((d) => d.id === selectedDayId);

  return (
    <div className="timeline-panel">
      <div className="day-selector-bar">
        <button
          className={`day-pill-btn ${selectedDayId === 'all' ? 'active' : ''}`}
          onClick={() => onSelectDay('all')}
        >
          <span className="day-pill-num">All Days</span>
          <span className="day-pill-date">{trip.days.length} Days</span>
        </button>

        {trip.days.map((d) => (
          <button
            key={d.id}
            className={`day-pill-btn ${selectedDayId === d.id ? 'active' : ''}`}
            onClick={() => onSelectDay(d.id)}
          >
            <span className="day-pill-num">Day {d.dayNumber}</span>
            <span className="day-pill-date">{d.date.slice(5)}</span>
          </button>
        ))}

        <button
          className={`day-pill-btn ${selectedDayId === 'bucket' ? 'active' : ''}`}
          onClick={() => onSelectDay('bucket')}
          title="Unscheduled ideas & bucket list"
        >
          <span className="day-pill-num">✨ Ideas</span>
          <span className="day-pill-date">{bucketActivities.length} places</span>
        </button>

        <button
          className="day-pill-btn"
          style={{ borderStyle: 'dashed' }}
          onClick={onAddDay}
          title="Add new day to trip"
        >
          <Plus size={14} />
          <span className="day-pill-date">Add Day</span>
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="timeline-activities-container">
          {selectedDayId === 'bucket' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="day-header-meta">
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ✨ Unscheduled Ideas & Bucket List
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Drag these places onto any day above to schedule them
                  </div>
                </div>
                <button
                  className="btn-primary"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  onClick={() => onAddActivity('bucket')}
                >
                  <Plus size={13} /> Add Idea
                </button>
              </div>

              <DayColumn
                day={{
                  id: 'bucket',
                  dayNumber: 0,
                  date: 'Unscheduled',
                  title: 'Bucket List & Ideas'
                }}
                activities={bucketActivities}
                onEditActivity={onEditActivity}
                onDeleteActivity={onDeleteActivity}
                onAddActivity={onAddActivity}
                onFocusMap={onFocusMap}
                onNavigateLeg={onNavigateLeg}
                primaryCurrency={primaryCurrency}
              />
            </div>
          ) : (
            displayedDays.map((day) => {
              const dayActs = activities.filter((a) => a.dayId === day.id);
              return (
                <DayColumn
                  key={day.id}
                  day={day}
                  activities={dayActs}
                  onEditActivity={onEditActivity}
                  onDeleteActivity={onDeleteActivity}
                  onAddActivity={onAddActivity}
                  onFocusMap={onFocusMap}
                  onNavigateLeg={onNavigateLeg}
                  primaryCurrency={primaryCurrency}
                />
              );
            })
          )}
        </div>

        <DragOverlay>
          {activeActivity ? (
            <div style={{ width: 340 }}>
              <ActivityCard
                activity={activeActivity}
                index={0}
                onEdit={() => {}}
                onDelete={() => {}}
                primaryCurrency={primaryCurrency}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
