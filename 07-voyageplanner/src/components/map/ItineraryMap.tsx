import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import type { Activity, Coordinates, ItineraryDay } from '../../types/itinerary';
import type { RouteLeg, TransportMode } from '../../types/routing';
import { MapControls, type TileLayerType } from './MapControls';
import { RouteSimulator } from './RouteSimulator';
import { NavigationHUD } from './NavigationHUD';
import { fetchActualStreetRoute } from '../../services/routingService';
import { formatMoney } from '../../data/currencies';

interface ItineraryMapProps {
  days: ItineraryDay[];
  activities: Activity[];
  selectedDayId: string;
  onSelectActivity?: (activityId: string) => void;
  primaryCurrency: string;
  initialDirectionsLeg?: { fromId: string; toId: string } | null;
}

const TILE_URLS: Record<TileLayerType, { url: string; attribution: string }> = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  },
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  },
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  }
};

const CATEGORY_EMOJIS: Record<string, string> = {
  sightseeing: '🏛️',
  dining: '🍜',
  lodging: '🏨',
  transit: '🚆',
  entertainment: '🎭',
  culture: '⛩️',
  nature: '🌲',
  shopping: '🛍️',
  relaxation: '♨️'
};

const DAY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];

const MODE_COLORS: Record<TransportMode, string> = {
  walking: '#38bdf8', // Neon Sky Blue
  transit: '#f59e0b', // Amber / Orange
  driving: '#ec4899', // Pink / Rose
  cycling: '#34d399'  // Emerald Green
};

export const ItineraryMap: React.FC<ItineraryMapProps> = ({
  days,
  activities,
  selectedDayId,
  onSelectActivity,
  primaryCurrency,
  initialDirectionsLeg
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineLayerRef = useRef<L.LayerGroup | null>(null);
  const streetRouteLayerRef = useRef<L.LayerGroup | null>(null);
  const simulatorMarkerRef = useRef<L.Marker | null>(null);

  const [currentLayer, setCurrentLayer] = useState<TileLayerType>('dark');
  const [showPolylines, setShowPolylines] = useState(true);
  const [filterDayOnly, setFilterDayOnly] = useState(true);
  const [simulatedPos, setSimulatedPos] = useState<Coordinates | null>(null);

  // Turn-by-Turn Navigation & Real Street Routing State
  const [showDirections, setShowDirections] = useState(false);
  const [selectedMode, setSelectedMode] = useState<TransportMode>('walking');
  const [activeLegIndex, setActiveLegIndex] = useState(0);
  const [routeLegs, setRouteLegs] = useState<RouteLeg[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const activeActivities = useMemo(() => {
    if (filterDayOnly && selectedDayId !== 'all') {
      return activities
        .filter((a) => a.dayId === selectedDayId && a.location?.coords)
        .sort((a, b) => a.order - b.order);
    }
    return activities
      .filter((a) => a.dayId !== 'bucket' && a.location?.coords)
      .sort((a, b) => a.order - b.order);
  }, [activities, selectedDayId, filterDayOnly]);

  // Handle external leg trigger (e.g. clicked transit leg in timeline)
  useEffect(() => {
    if (initialDirectionsLeg && activeActivities.length >= 2) {
      const idx = activeActivities.findIndex((a) => a.id === initialDirectionsLeg.fromId);
      if (idx !== -1 && idx < activeActivities.length - 1) {
        setActiveLegIndex(idx);
        setShowDirections(true);
      }
    }
  }, [initialDirectionsLeg, activeActivities]);

  // Fetch real street routes whenever active activities or mode changes
  useEffect(() => {
    if (activeActivities.length < 2) {
      setRouteLegs([]);
      return;
    }

    let isMounted = true;
    setIsLoadingRoute(true);

    const fetchAllLegs = async () => {
      const legs: RouteLeg[] = [];
      for (let i = 0; i < activeActivities.length - 1; i++) {
        const from = activeActivities[i];
        const to = activeActivities[i + 1];
        const leg = await fetchActualStreetRoute(from, to, selectedMode);
        legs.push(leg);
      }

      if (isMounted) {
        setRouteLegs(legs);
        setIsLoadingRoute(false);
      }
    };

    fetchAllLegs();

    return () => {
      isMounted = false;
    };
  }, [activeActivities, selectedMode]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCoord =
        activities[0]?.location?.coords || { lat: 35.6812, lng: 139.7671 };

      const map = L.map(mapContainerRef.current, {
        center: [initialCoord.lat, initialCoord.lng],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const tileConfig = TILE_URLS[currentLayer];
      const tiles = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = tiles;
      markersLayerRef.current = L.layerGroup().addTo(map);
      polylineLayerRef.current = L.layerGroup().addTo(map);
      streetRouteLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_URLS[currentLayer].url);
  }, [currentLayer]);

  // Render Markers & Routes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !polylineLayerRef.current || !streetRouteLayerRef.current)
      return;

    const markersLayer = markersLayerRef.current;
    const polylineLayer = polylineLayerRef.current;
    const streetRouteLayer = streetRouteLayerRef.current;

    markersLayer.clearLayers();
    polylineLayer.clearLayers();
    streetRouteLayer.clearLayers();

    if (activeActivities.length === 0) return;

    const latLngs: L.LatLngExpression[] = [];
    const bounds = L.latLngBounds([]);

    // 1. Draw Map Markers
    activeActivities.forEach((act, idx) => {
      const { lat, lng } = act.location.coords;
      const point: [number, number] = [lat, lng];
      latLngs.push(point);
      bounds.extend(point);

      const dayIndex = days.findIndex((d) => d.id === act.dayId);
      const color = DAY_COLORS[Math.max(0, dayIndex) % DAY_COLORS.length];
      const emoji = CATEGORY_EMOJIS[act.category] || '📍';
      const orderNum = idx + 1;

      const isCurrentLegEndpoint =
        showDirections &&
        (idx === activeLegIndex || idx === activeLegIndex + 1);

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker-wrapper',
        html: `
          <div class="marker-container ${isCurrentLegEndpoint ? 'marker-focused' : ''}">
            <div class="marker-pulse-ring" style="background: ${isCurrentLegEndpoint ? MODE_COLORS[selectedMode] : color}60;"></div>
            <svg class="marker-svg" width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 0C7.611 0 0 7.611 0 17C0 29.5 17 44 17 44C17 44 34 29.5 34 17C34 7.611 26.389 0 17 0Z" fill="${isCurrentLegEndpoint ? MODE_COLORS[selectedMode] : color}" stroke="#ffffff" stroke-width="2.5"/>
              <circle cx="17" cy="16" r="11" fill="#ffffff"/>
              <text x="17" y="20.5" font-family="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="800" fill="${isCurrentLegEndpoint ? MODE_COLORS[selectedMode] : color}" text-anchor="middle">${orderNum}</text>
            </svg>
            <div class="marker-emoji-badge" title="${act.category}">${emoji}</div>
          </div>
        `,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
        popupAnchor: [0, -44]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupHtml = `
        <div class="map-popup-card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span class="map-popup-category" style="color: ${color};">${emoji} ${act.category.toUpperCase()}</span>
            <span style="font-size: 11px; font-weight: 700; color: #94a3b8;">${act.startTime} (${act.durationMinutes}m)</span>
          </div>
          <h4 class="map-popup-title">${act.title}</h4>
          <p style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">📍 ${act.location.name}</p>
          ${act.description ? `<p class="map-popup-desc">${act.description}</p>` : ''}
          <div class="map-popup-footer">
            <span style="font-weight: 700; color: #38bdf8;">${act.cost > 0 ? formatMoney(act.cost, act.currency || primaryCurrency) : 'Free Admission'}</span>
            <span style="font-weight: 600; color: ${act.booked ? '#34d399' : '#fbbf24'};">${act.booked ? '✓ Booked' : '○ Planned'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectActivity) onSelectActivity(act.id);
      });

      marker.addTo(markersLayer);
    });

    // 2. ROUTING LOGIC:
    // If showDirections is TRUE -> Hide overview straight lines and render REAL ROAD-FOLLOWING STREET GEOMETRY
    if (showDirections && routeLegs.length > 0) {
      const activeLeg = routeLegs[activeLegIndex] || routeLegs[0];
      const legCoords = activeLeg.coordinates;

      if (legCoords && legCoords.length >= 2) {
        const modeColor = MODE_COLORS[selectedMode] || '#38bdf8';

        // Outer Neon Glow Polyline
        const streetGlow = L.polyline(legCoords, {
          color: modeColor,
          weight: 10,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        });
        streetGlow.addTo(streetRouteLayer);

        // Inner Sharp Route Polyline
        const streetPath = L.polyline(legCoords, {
          color: modeColor,
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: selectedMode === 'walking' ? '2, 10' : undefined
        });
        streetPath.addTo(streetRouteLayer);

        // Fit bounds specifically around the active road journey
        const legBounds = L.latLngBounds(legCoords);
        if (legBounds.isValid()) {
          mapInstanceRef.current.fitBounds(legBounds, {
            padding: [90, 90],
            maxZoom: 16,
            animate: true
          });
        }
      }
    } else if (showPolylines && latLngs.length >= 2) {
      // 3. Overview Mode: Draw Day Route Polyline
      const dayColor =
        DAY_COLORS[Math.max(0, days.findIndex((d) => d.id === selectedDayId)) % DAY_COLORS.length];

      const polyGlow = L.polyline(latLngs, {
        color: dayColor,
        weight: 6,
        opacity: 0.35,
        smoothFactor: 1
      });
      polyGlow.addTo(polylineLayer);

      const polyLine = L.polyline(latLngs, {
        color: '#ffffff',
        weight: 3,
        opacity: 0.9,
        dashArray: '8, 8',
        smoothFactor: 1
      });
      polyLine.addTo(polylineLayer);

      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 15,
          animate: true
        });
      }
    }
  }, [
    activeActivities,
    showPolylines,
    showDirections,
    routeLegs,
    activeLegIndex,
    selectedMode,
    days,
    selectedDayId,
    primaryCurrency,
    onSelectActivity
  ]);

  // Route Simulator Traveler Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!simulatedPos) {
      if (simulatorMarkerRef.current) {
        simulatorMarkerRef.current.remove();
        simulatorMarkerRef.current = null;
      }
      return;
    }

    if (!simulatorMarkerRef.current) {
      const travelerIcon = L.divIcon({
        className: 'traveler-marker-wrapper',
        html: `
          <div class="traveler-pin-disc">
            ${selectedMode === 'driving' ? '🚗' : selectedMode === 'cycling' ? '🚲' : selectedMode === 'transit' ? '🚆' : '🚶'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const mark = L.marker([simulatedPos.lat, simulatedPos.lng], {
        icon: travelerIcon,
        zIndexOffset: 1000
      }).addTo(mapInstanceRef.current);
      simulatorMarkerRef.current = mark;
    } else {
      simulatorMarkerRef.current.setLatLng([simulatedPos.lat, simulatedPos.lng]);
    }
  }, [simulatedPos, selectedMode]);

  // Waypoints for Route Simulator
  const simulationWaypoints = useMemo(() => {
    // If directions mode is active, simulate along the real street coordinates of the active leg
    if (showDirections && routeLegs[activeLegIndex]?.coordinates) {
      const coords = routeLegs[activeLegIndex].coordinates;
      return coords.map((c, idx) => ({
        name: `Turn ${idx + 1}`,
        coords: { lat: c[0], lng: c[1] },
        order: idx + 1
      }));
    }

    // Otherwise simulate across all day destinations
    return activeActivities.map((a, idx) => ({
      name: a.title,
      coords: a.location.coords,
      order: idx + 1
    }));
  }, [showDirections, routeLegs, activeLegIndex, activeActivities]);

  const handleFitBounds = () => {
    if (!mapInstanceRef.current || activeActivities.length === 0) return;
    const bounds = L.latLngBounds([]);
    activeActivities.forEach((a) => {
      bounds.extend([a.location.coords.lat, a.location.coords.lng]);
    });
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  };

  return (
    <div className="map-panel">
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating HUD Controls */}
      <MapControls
        currentLayer={currentLayer}
        onLayerChange={setCurrentLayer}
        showPolylines={showPolylines}
        onTogglePolylines={() => setShowPolylines(!showPolylines)}
        filterDayOnly={filterDayOnly}
        onToggleFilterDay={() => setFilterDayOnly(!filterDayOnly)}
        onFitBounds={handleFitBounds}
        showDirections={showDirections}
        onToggleDirections={() => setShowDirections(!showDirections)}
        hasMultipleActivities={activeActivities.length >= 2}
      />

      {/* Turn-by-Turn Google Maps Style Navigation HUD */}
      {showDirections && (
        <NavigationHUD
          legs={routeLegs}
          activeLegIndex={activeLegIndex}
          onSelectLegIndex={setActiveLegIndex}
          selectedMode={selectedMode}
          onChangeMode={setSelectedMode}
          onCloseDirections={() => setShowDirections(false)}
          isLoading={isLoadingRoute}
        />
      )}

      {/* Route Simulator Widget */}
      <RouteSimulator
        waypoints={simulationWaypoints}
        onPositionUpdate={setSimulatedPos}
      />
    </div>
  );
};
