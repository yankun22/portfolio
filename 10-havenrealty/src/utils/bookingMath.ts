import { BookedDateRange, Property } from '../types/property';

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDateBlocked(dateStr: string, bookedRanges: BookedDateRange[]): boolean {
  const target = parseDateString(dateStr).getTime();
  return bookedRanges.some((range) => {
    const start = parseDateString(range.start).getTime();
    const end = parseDateString(range.end).getTime();
    return target >= start && target <= end;
  });
}

export function hasDateRangeConflict(
  checkIn: string,
  checkOut: string,
  bookedRanges: BookedDateRange[]
): boolean {
  if (!checkIn || !checkOut) return false;
  const start = parseDateString(checkIn).getTime();
  const end = parseDateString(checkOut).getTime();

  if (end <= start) return true; // Invalid range

  return bookedRanges.some((range) => {
    const rangeStart = parseDateString(range.start).getTime();
    const rangeEnd = parseDateString(range.end).getTime();
    // Overlap condition: start < rangeEnd && end > rangeStart
    return start < rangeEnd && end > rangeStart;
  });
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = parseDateString(checkIn).getTime();
  const end = parseDateString(checkOut).getTime();
  const diffTime = end - start;
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getSeasonalMultiplier(dateStr: string, property: Property): { multiplier: number; seasonName: string } {
  if (!dateStr) return { multiplier: 1.0, seasonName: 'Standard' };
  const month = parseDateString(dateStr).getMonth() + 1; // 1-12
  const rule = property.seasonalRules.find((r) => r.months.includes(month));
  if (rule) {
    return { multiplier: rule.multiplier, seasonName: rule.name };
  }
  return { multiplier: 1.0, seasonName: 'Standard Season' };
}

export interface BookingBreakdown {
  nights: number;
  baseRatePerNight: number;
  seasonalMultiplier: number;
  effectiveRatePerNight: number;
  baseTotal: number;
  extraGuestFee: number;
  cleaningFee: number;
  preservationFee: number;
  lengthOfStayDiscount: number;
  discountPercentage: number;
  subtotal: number;
  grandTotal: number;
  seasonName: string;
  isValid: boolean;
  validationError?: string;
}

export function calculateBookingPrice(
  property: Property,
  checkIn: string,
  checkOut: string,
  guests: number
): BookingBreakdown {
  const nights = calculateNights(checkIn, checkOut);

  if (!checkIn || !checkOut || nights <= 0) {
    return {
      nights: 0,
      baseRatePerNight: property.nightlyRate,
      seasonalMultiplier: 1.0,
      effectiveRatePerNight: property.nightlyRate,
      baseTotal: 0,
      extraGuestFee: 0,
      cleaningFee: property.cleaningFee,
      preservationFee: property.preservationFee,
      lengthOfStayDiscount: 0,
      discountPercentage: 0,
      subtotal: 0,
      grandTotal: property.cleaningFee + property.preservationFee,
      seasonName: 'Standard',
      isValid: false,
      validationError: 'Please select valid check-in and check-out dates',
    };
  }

  // Conflict validation
  if (hasDateRangeConflict(checkIn, checkOut, property.bookedDateRanges)) {
    return {
      nights,
      baseRatePerNight: property.nightlyRate,
      seasonalMultiplier: 1.0,
      effectiveRatePerNight: property.nightlyRate,
      baseTotal: 0,
      extraGuestFee: 0,
      cleaningFee: property.cleaningFee,
      preservationFee: property.preservationFee,
      lengthOfStayDiscount: 0,
      discountPercentage: 0,
      subtotal: 0,
      grandTotal: 0,
      seasonName: 'Conflict',
      isValid: false,
      validationError: 'Selected dates overlap with an existing reservation.',
    };
  }

  const { multiplier: seasonalMultiplier, seasonName } = getSeasonalMultiplier(checkIn, property);
  const effectiveRatePerNight = Math.round(property.nightlyRate * seasonalMultiplier);
  const baseTotal = effectiveRatePerNight * nights;

  // Extra guest fee: $75 per guest per night beyond 2 guests
  const extraGuests = Math.max(0, guests - 2);
  const extraGuestFee = extraGuests * 75 * nights;

  // Length of stay discount: 7+ nights -> 10%, 28+ nights -> 20%
  let discountPercentage = 0;
  if (nights >= 28) {
    discountPercentage = 0.20;
  } else if (nights >= 7) {
    discountPercentage = 0.10;
  }
  const lengthOfStayDiscount = Math.round(baseTotal * discountPercentage);

  const subtotal = baseTotal - lengthOfStayDiscount + extraGuestFee;
  const cleaningFee = property.cleaningFee;
  const preservationFee = property.preservationFee;
  const grandTotal = subtotal + cleaningFee + preservationFee;

  return {
    nights,
    baseRatePerNight: property.nightlyRate,
    seasonalMultiplier,
    effectiveRatePerNight,
    baseTotal,
    extraGuestFee,
    cleaningFee,
    preservationFee,
    lengthOfStayDiscount,
    discountPercentage: discountPercentage * 100,
    subtotal,
    grandTotal,
    seasonName,
    isValid: true,
  };
}
