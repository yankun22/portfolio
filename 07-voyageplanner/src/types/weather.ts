export interface DailyForecast {
  date: string;
  dayName: string;
  tempMaxC: number;
  tempMinC: number;
  tempMaxF: number;
  tempMinF: number;
  condition: string;
  icon: string;
  rainProbability: number; // percentage 0 - 100
  uvIndex: number;
  windSpeedKmh: number;
  humidity: number;
  summary: string;
}

export interface WeatherAlert {
  id: string;
  type: 'rain' | 'extreme_heat' | 'extreme_cold' | 'storm' | 'uv_high' | 'clear';
  title: string;
  message: string;
  recommendation: string;
  severity: 'info' | 'warning' | 'caution';
  affectedDate?: string;
}

export interface DestinationWeather {
  city: string;
  country: string;
  lat: number;
  lng: number;
  currentTempC: number;
  currentTempF: number;
  currentCondition: string;
  currentIcon: string;
  forecast: DailyForecast[];
  alerts: WeatherAlert[];
  packingTips: string[];
  lastUpdated: string;
}
