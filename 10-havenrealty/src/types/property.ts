export type ArchitecturalStyle =
  | 'Mid-Century Modern'
  | 'Brutalist'
  | 'Scandinavian'
  | 'Minimalist'
  | 'Organic Modernism'
  | 'Bauhaus';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';

export type UnitSystem = 'imperial' | 'metric'; // sq ft vs m²

export interface SunOrientation {
  azimuth: number; // 0 to 360 degrees
  facing: 'North' | 'South' | 'East' | 'West' | 'South-East' | 'South-West' | 'North-West' | 'North-East';
  peakHours: string;
  lux: number;
  windowType: string;
  solarHeatGainCoeff: number;
}

export interface RoomHotspot {
  id: string;
  name: string;
  roomType: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'terrace' | 'atrium' | 'gallery' | 'spa';
  x: number; // percentage 0 - 100 on blueprint
  y: number; // percentage 0 - 100 on blueprint
  sqft: number;
  dimensions: string;
  ceilingHeight: string;
  sunOrientation: SunOrientation;
  materials: string[];
  acousticRating: string;
  hvacZone: string;
  panoramaImage: string;
  panoramaType?: 'render' | 'photo';
  features: string[];
  lightingMoods: {
    dawn: string;
    midday: string;
    goldenHour: string;
    night: string;
  };
}

export interface FloorLevel {
  id: string;
  levelNumber: number;
  name: string;
  elevation: string;
  totalAreaSqFt: number;
  svgFloorLayout: string; // descriptive SVG layout identifier or custom paths
  hotspots: RoomHotspot[];
}

export interface SeasonalRule {
  season: 'Peak' | 'Standard' | 'Off-Peak';
  months: number[]; // 1-12
  multiplier: number;
  name: string;
}

export interface BookedDateRange {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  guest?: string;
  status: 'confirmed' | 'maintenance' | 'private_event';
}

export interface Property {
  id: string;
  title: string;
  subtitle: string;
  architect: string;
  firm: string;
  yearBuilt: number;
  style: ArchitecturalStyle;
  tagline: string;
  location: {
    city: string;
    stateOrCountry: string;
    address: string;
    lat: number;
    lng: number;
    elevation: string;
    climateZone: string;
  };
  purchasePrice: number;
  nightlyRate: number;
  cleaningFee: number;
  preservationFee: number; // Architectural preservation deposit
  hoaMonthly: number;
  propertyTaxRate: number; // Annual percentage (e.g., 0.0125 for 1.25%)
  insuranceAnnual: number;
  projectedMonthlyRent: number;
  estimatedOccupancy: number; // Percentage, e.g. 78%
  heroImage: string;
  gallery: string[];
  bedrooms: number;
  bathrooms: number;
  totalSqFt: number;
  lotSize: string;
  floors: FloorLevel[];
  amenities: string[];
  architecturalStory: string;
  materialityStory: string;
  bookedDateRanges: BookedDateRange[];
  seasonalRules: SeasonalRule[];
  featured: boolean;
}

export interface BookingReservation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  currency: CurrencyCode;
  currencyRate: number;
  nightlyRateAvg: number;
  baseTotal: number;
  seasonalAdjustment: number;
  extraGuestFee: number;
  cleaningFee: number;
  preservationFee: number;
  lengthOfStayDiscount: number;
  grandTotal: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  createdAt: string;
}

export interface MortgageInputs {
  price: number;
  downPaymentPct: number; // e.g. 20
  loanTermYears: number;  // 15 or 30
  interestRate: number;   // e.g. 6.5
  propertyTaxRate: number; // e.g. 1.25
  insuranceAnnual: number;
  hoaMonthly: number;
  monthlyRentalIncome: number;
  occupancyRate: number;  // e.g. 80
}

export interface AmortizationEntry {
  year: number;
  balance: number;
  interestPaidYear: number;
  principalPaidYear: number;
  totalInterestToDate: number;
  equity: number;
}

export interface MortgageResults {
  downPaymentAmount: number;
  loanAmount: number;
  monthlyPrincipalAndInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalLoanCost: number;
  totalInterestPaid: number;
  grossRentalYield: number; // (Annual gross rent / Price) * 100
  netCapRate: number;       // (NOI / Price) * 100
  cashOnCashReturn: number; // (Annual Cash Flow / Total Initial Cash) * 100
  annualGrossRent: number;
  annualOperatingExpenses: number;
  annualNOI: number;
  annualCashFlow: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface TourSpecialist {
  id: string;
  name: string;
  title: string;
  credentials: string;
  avatar: string;
  bio: string;
  availableDays: string[];
}

export interface TourBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  tourType: 'live_video' | 'in_person' | 'architect_consult';
  date: string;
  timeSlot: string;
  timezone: string;
  specialistId: string;
  specialistName: string;
  specialistTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  icsCalendarUrl?: string;
  confirmedAt: string;
}

export interface FilterState {
  styles: ArchitecturalStyle[];
  minPrice: number;
  maxPrice: number;
  priceMode: 'purchase' | 'nightly';
  minBedrooms: number;
  minBathrooms: number;
  minSqFt: number;
  amenities: string[];
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'yield-desc' | 'sqft-desc' | 'year-desc' | 'featured';
  viewMode: 'grid' | 'map' | 'split';
  boundsFilter?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}
