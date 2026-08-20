import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { BookedDateRange, Property } from '../../types/property';
import {
  formatDateToIso,
  hasDateRangeConflict,
  isDateBlocked,
  parseDateString,
  getSeasonalMultiplier
} from '../../utils/bookingMath';
import { formatDate } from '../../utils/formatters';

interface DateBookingCalendarProps {
  property: Property;
  checkIn: string;
  checkOut: string;
  onSelectRange: (checkIn: string, checkOut: string) => void;
}

export const DateBookingCalendar: React.FC<DateBookingCalendarProps> = ({
  property,
  checkIn,
  checkOut,
  onSelectRange,
}) => {
  // Calendar current view (defaulting to Aug 2026 or current active date)
  const initialDate = checkIn ? parseDateString(checkIn) : new Date(2026, 7, 1);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Generate days matrix for a month
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const days: (string | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push(iso);
    }

    return days;
  };

  const currentMonthDays = getDaysInMonth(viewYear, viewMonth);
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('en-US', { month: 'long' });

  // Handle day click for range selection
  const handleDateClick = (dateStr: string) => {
    if (isDateBlocked(dateStr, property.bookedDateRanges)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start fresh selection with check-in
      onSelectRange(dateStr, '');
    } else if (checkIn && !checkOut) {
      const start = parseDateString(checkIn).getTime();
      const end = parseDateString(dateStr).getTime();

      if (end < start) {
        // Reset check-in to earlier date
        onSelectRange(dateStr, '');
      } else if (end === start) {
        // Same date
        onSelectRange(dateStr, '');
      } else {
        // Check if intervening dates contain conflicts
        if (hasDateRangeConflict(checkIn, dateStr, property.bookedDateRanges)) {
          // If conflict, reset check-in to this date instead
          onSelectRange(dateStr, '');
        } else {
          onSelectRange(checkIn, dateStr);
        }
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px' }}>
      {/* Calendar Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={18} color="#c5a059" />
          <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', fontWeight: 600 }}>
            {monthName} {viewYear}
          </h4>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={prevMonth}
            className="btn-ghost"
            style={{ padding: '6px' }}
            title="Previous Month"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={nextMonth}
            className="btn-ghost"
            style={{ padding: '6px' }}
            title="Next Month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          marginBottom: '8px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#8e97a6',
        }}
      >
        <span>SU</span>
        <span>MO</span>
        <span>TU</span>
        <span>WE</span>
        <span>TH</span>
        <span>FR</span>
        <span>SA</span>
      </div>

      {/* Days grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
        }}
      >
        {currentMonthDays.map((dateStr, idx) => {
          if (!dateStr) {
            return <div key={`empty-${idx}`} style={{ height: '40px' }} />;
          }

          const dayNumber = parseInt(dateStr.split('-')[2], 10);
          const isBlocked = isDateBlocked(dateStr, property.bookedDateRanges);
          const isCheckIn = checkIn === dateStr;
          const isCheckOut = checkOut === dateStr;

          // Range calculation
          let isInRange = false;
          if (checkIn && checkOut) {
            const cur = parseDateString(dateStr).getTime();
            const start = parseDateString(checkIn).getTime();
            const end = parseDateString(checkOut).getTime();
            isInRange = cur > start && cur < end;
          } else if (checkIn && !checkOut && hoveredDate) {
            const cur = parseDateString(dateStr).getTime();
            const start = parseDateString(checkIn).getTime();
            const hover = parseDateString(hoveredDate).getTime();
            if (hover > start) {
              isInRange = cur > start && cur <= hover;
            }
          }

          const { multiplier, seasonName } = getSeasonalMultiplier(dateStr, property);
          const isPeak = multiplier > 1.2;

          return (
            <button
              key={dateStr}
              id={`cal-day-${dateStr}`}
              disabled={isBlocked}
              onClick={() => handleDateClick(dateStr)}
              onMouseEnter={() => setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
              style={{
                height: '42px',
                borderRadius: isCheckIn ? '8px 0 0 8px' : isCheckOut ? '0 8px 8px 0' : isInRange ? '0' : '8px',
                background: isCheckIn || isCheckOut
                  ? '#c5a059'
                  : isInRange
                  ? 'rgba(197, 160, 89, 0.2)'
                  : isBlocked
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(255, 255, 255, 0.04)',
                color: isCheckIn || isCheckOut
                  ? '#0c0e12'
                  : isBlocked
                  ? '#475569'
                  : '#f8fafc',
                fontWeight: isCheckIn || isCheckOut ? 700 : 500,
                fontSize: '0.85rem',
                border: isCheckIn || isCheckOut ? '1px solid #dfba73' : '1px solid transparent',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isBlocked ? 'not-allowed' : 'pointer',
                opacity: isBlocked ? 0.35 : 1,
                textDecoration: isBlocked ? 'line-through' : 'none',
                transition: 'background 0.15s ease',
              }}
              title={isBlocked ? 'Unavailable / Reserved' : `${formatDate(dateStr)} (${seasonName})`}
            >
              <span>{dayNumber}</span>
              {isPeak && !isBlocked && !isCheckIn && !isCheckOut && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#dfba73',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Guidance */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.75rem',
          color: '#8e97a6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c5a059' }} /> Selected
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dfba73' }} /> Peak Rate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#475569' }} /> Reserved
          </span>
        </div>

        {checkIn && (
          <button
            onClick={() => onSelectRange('', '')}
            style={{ color: '#dfba73', textDecoration: 'underline', fontSize: '0.75rem' }}
          >
            Clear Dates
          </button>
        )}
      </div>
    </div>
  );
};
