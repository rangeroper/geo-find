import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import { useEffect } from 'react';
import { useTheme } from "../context/ThemeContext";

// Helper to map distance in miles to zoom level (fallback if no places)
function getZoomLevel(distanceMiles) {
    if (distanceMiles <= 1) return 13;
    if (distanceMiles <= 2) return 12;
    if (distanceMiles <= 4) return 11;
    if (distanceMiles <= 8) return 10;
    if (distanceMiles <= 16) return 9;
    if (distanceMiles <= 32) return 8;
    return 7;
}

// Update map view based on places or fallback to center/zoom
function ChangeMapView({ center, places, distance }) {
    const map = useMap();

    useEffect(() => {
        if (places.length > 0) {
        // Calculate bounds from all places
        const bounds = latLngBounds(places.map((p) => p.position));
        map.fitBounds(bounds, { padding: [50, 50] });
        } else if (center) {
        const zoom = getZoomLevel(distance);
        map.setView(center, zoom, { animate: true });
        }
    }, [center, places, distance, map]);

    return null;
}

export default function MapView({
    location = [41.8781, -87.6298],
    category = '',
    places = [],
    distance = 5,
    loading = false,
    error = null,
    onSetView,
    onUseMyLocation,
    }) {

    const { darkMode } = useTheme();

    const headingCategory = category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : 'Places';

    const tileLayerUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    return (
    <div>
        <h2
        className="mb-6 font-extrabold tracking-tight"
        style={{
            color: darkMode ? '#e0e0e0' : '#000000',
            fontSize: '1.75rem',
            lineHeight: 1.1,
        }}
        >
        Nearby {headingCategory}
        </h2>


      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400 mb-2">
          Loading places...
        </p>
      )}
      {error && (
        <p className="text-center text-red-600 dark:text-red-400 mb-2">
          Error loading places: {error.message}
        </p>
      )}

      <div
        className={`h-[500px] rounded-lg overflow-hidden border relative ${
            darkMode
            ? 'bg-[#101828] border-gray-700 shadow-[0_0_20px_#3b82f6]'
            : 'bg-white border-gray-300 shadow-lg'
        }`}
        >
        <MapContainer
          center={location}
          zoom={getZoomLevel(distance)}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeMapView center={location} places={places} distance={distance} />

          <TileLayer
            key={darkMode ? 'dark' : 'light'} 
            attribution="&copy; OpenStreetMap contributors"
            url={tileLayerUrl}
          />

          {places.map((place) => (
            <Marker key={place.id} position={place.position}>
              <Popup>{place.label}</Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
          <button
            onClick={() => onSetView('list')}
            className="bg-white dark:bg-[#1f2937] text-gray-900 dark:text-gray-100 p-2 rounded shadow hover:shadow-lg hover:scale-105 transition-transform duration-200"
          >
            List View
          </button>
          <button
            onClick={onUseMyLocation}
            className="bg-white dark:bg-[#1f2937] text-gray-900 dark:text-gray-100 p-2 rounded shadow hover:shadow-lg hover:scale-105 transition-transform duration-200"
          >
            My Location
          </button>
        </div>
      </div>
    </div>
  );
}
