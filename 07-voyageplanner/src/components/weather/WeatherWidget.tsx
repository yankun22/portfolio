import React, { useState, useEffect } from 'react';
import type { Trip } from '../../types/itinerary';
import type { DestinationWeather } from '../../types/weather';
import { fetchDestinationWeather } from '../../services/weatherService';
import { WeatherAlerts } from './WeatherAlerts';
import { CloudSun, Droplets, Wind, Sun, RefreshCw, MapPin } from 'lucide-react';

interface WeatherWidgetProps {
  trip: Trip;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ trip }) => {
  const [weather, setWeather] = useState<DestinationWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  const destinations = React.useMemo(() => {
    const map = new Map<string, { city: string; country: string; lat: number; lng: number }>();

    trip.activities.forEach((act) => {
      if (act.location?.coords) {
        const city = act.location.city || trip.destination;
        if (!map.has(city)) {
          map.set(city, {
            city,
            country: act.location.country || trip.country,
            lat: act.location.coords.lat,
            lng: act.location.coords.lng
          });
        }
      }
    });

    if (map.size === 0) {
      map.set(trip.destination, {
        city: trip.destination,
        country: trip.country,
        lat: 35.6812,
        lng: 139.7671
      });
    }

    return Array.from(map.values());
  }, [trip]);

  const activeDest = destinations[selectedCityIndex] || destinations[0];

  const loadWeather = async () => {
    if (!activeDest) return;
    setLoading(true);
    const data = await fetchDestinationWeather(
      activeDest.city,
      activeDest.country,
      activeDest.lat,
      activeDest.lng
    );
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWeather();
  }, [activeDest]);

  return (
    <div className="weather-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <CloudSun size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              Location Weather & Packing Forecast
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Live Open-Meteo climate telemetry & rain advisory
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {destinations.length > 1 && (
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', padding: 3, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {destinations.map((d, idx) => (
                <button
                  key={d.city}
                  className={`tab-btn ${selectedCityIndex === idx ? 'active' : ''}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  onClick={() => setSelectedCityIndex(idx)}
                >
                  <MapPin size={12} />
                  <span>{d.city}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 2, background: 'var(--bg-card)', padding: 3, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              className={`tab-btn ${unit === 'C' ? 'active' : ''}`}
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              onClick={() => setUnit('C')}
            >
              °C
            </button>
            <button
              className={`tab-btn ${unit === 'F' ? 'active' : ''}`}
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              onClick={() => setUnit('F')}
            >
              °F
            </button>
          </div>

          <button
            className="btn-icon"
            onClick={loadWeather}
            title="Refresh forecast data"
          >
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      {loading && !weather ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading live weather forecasts...
        </div>
      ) : weather ? (
        <>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 20
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ fontSize: '3.5rem', lineHeight: 1 }}>{weather.currentIcon}</div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffffff' }}>
                  {unit === 'C' ? `${weather.currentTempC}°C` : `${weather.currentTempF}°F`}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#93c5fd' }}>
                  {weather.currentCondition}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  📍 {weather.city}, {weather.country} • Updated {weather.lastUpdated}
                </div>
              </div>
            </div>

            {weather.forecast[0] && (
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div className="metric-pill" style={{ padding: '8px 14px' }}>
                  <Droplets size={16} color="#38bdf8" />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>RAIN RISK</div>
                    <strong>{weather.forecast[0].rainProbability}%</strong>
                  </div>
                </div>

                <div className="metric-pill" style={{ padding: '8px 14px' }}>
                  <Sun size={16} color="#fbbf24" />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>UV INDEX</div>
                    <strong>{weather.forecast[0].uvIndex}</strong>
                  </div>
                </div>

                <div className="metric-pill" style={{ padding: '8px 14px' }}>
                  <Wind size={16} color="#a78bfa" />
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>WIND</div>
                    <strong>{weather.forecast[0].windSpeedKmh} km/h</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>7-Day Trip Forecast</h4>
            <div className="weather-forecast-grid">
              {weather.forecast.map((day) => {
                const max = unit === 'C' ? `${day.tempMaxC}°` : `${day.tempMaxF}°`;
                const min = unit === 'C' ? `${day.tempMinC}°` : `${day.tempMinF}°`;

                return (
                  <div key={day.date} className="daily-forecast-card">
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{day.dayName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {day.date.slice(5)}
                    </div>
                    <div style={{ fontSize: '2rem', margin: '4px 0' }}>{day.icon}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                      <span>{max}</span>{' '}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{min}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {day.condition}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: '0.7rem',
                        color: day.rainProbability > 40 ? '#38bdf8' : 'var(--text-muted)',
                        fontWeight: day.rainProbability > 40 ? 700 : 500
                      }}
                    >
                      <Droplets size={11} />
                      <span>{day.rainProbability}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <WeatherAlerts alerts={weather.alerts} packingTips={weather.packingTips} />
        </>
      ) : null}
    </div>
  );
};
