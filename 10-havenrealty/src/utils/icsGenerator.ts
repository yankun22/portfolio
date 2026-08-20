import { TourBooking } from '../types/property';

export function formatIcsDate(dateStr: string, timeStr?: string): string {
  // dateStr in YYYY-MM-DD
  const cleanedDate = dateStr.replace(/-/g, '');
  if (!timeStr) {
    return `${cleanedDate}T090000Z`;
  }

  // Expect timeStr like "10:00 AM" or "14:30"
  let hours = 10;
  let minutes = 0;
  
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridian = match[3]?.toUpperCase();
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${cleanedDate}T${pad(hours)}${pad(minutes)}00Z`;
}

export function generateTourIcs(booking: TourBooking): string {
  const dtStart = formatIcsDate(booking.date, booking.timeSlot);
  // Add 1 hour for end time
  const [datePart, timePart] = dtStart.split('T');
  let endHour = parseInt(timePart.substring(0, 2), 10) + 1;
  if (endHour >= 24) endHour = 23;
  const dtEnd = `${datePart}T${String(endHour).padStart(2, '0')}${timePart.substring(2)}`;

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = `haven-${booking.id}@havenrealty.luxury`;

  const tourTypeLabel =
    booking.tourType === 'live_video'
      ? 'Live 4K Drone & Video Walkthrough'
      : booking.tourType === 'in_person'
      ? 'Private VIP In-Person Walkthrough'
      : 'Lead Architect Design Consultation';

  const summary = `Haven Realty: ${tourTypeLabel} — ${booking.propertyTitle}`;
  const description = [
    `Architectural Walkthrough for ${booking.propertyTitle}`,
    `Specialist: ${booking.specialistName} (${booking.specialistTitle})`,
    `Client: ${booking.clientName} (${booking.clientEmail})`,
    `Tour Format: ${tourTypeLabel}`,
    `Timezone: ${booking.timezone}`,
    booking.notes ? `Special Inquiries: ${booking.notes}` : '',
    `Confirmation ID: ${booking.id}`,
    `Access Link: https://havenrealty.luxury/tour/${booking.id}`,
  ]
    .filter(Boolean)
    .join('\\n');

  const location =
    booking.tourType === 'in_person'
      ? booking.propertyAddress
      : `Haven Virtual Studio (Encrypted 4K Stream)`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HavenRealty Luxury//Architectural Platform//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Haven Realty Tour in 30 minutes`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcsFile(icsContent: string, filename: string = 'havenrealty-tour.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
