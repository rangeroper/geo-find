import React, { useEffect, useMemo } from 'react';
import ReactDOMServer from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import { useTheme } from '../context/ThemeContext';
import L from 'leaflet';

// Material UI icons
import ParkIcon from '@mui/icons-material/Park';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // default fallback icon

function getZoomLevel(distanceMiles) {
  if (distanceMiles <= 1) return 13;
  if (distanceMiles <= 2) return 12;
  if (distanceMiles <= 4) return 11;
  if (distanceMiles <= 8) return 10;
  if (distanceMiles <= 16) return 9;
  if (distanceMiles <= 32) return 8;
  return 7;
}

function ChangeMapView({ center, places, distance }) {
  const map = useMap();

  useEffect(() => {
    if (places.length > 0) {
      const bounds = latLngBounds(places.map((p) => p.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      const zoom = getZoomLevel(distance);
      map.setView(center, zoom, { animate: true });
    }
  }, [center, places, distance, map]);

  return null;
}

// Create icon components with dynamic colors based on darkMode
function getCategoryIconComponents(iconColor) {
  return {
    park: <ParkIcon style={{ color: iconColor, fontSize: 32 }} />,
    sports: <SportsSoccerIcon style={{ color: iconColor, fontSize: 32 }} />,
    library: <LocalLibraryIcon style={{ color: iconColor, fontSize: 32 }} />,
    cafe: <LocalCafeIcon style={{ color: iconColor, fontSize: 32 }} />,
    restaurant: <RestaurantIcon style={{ color: iconColor, fontSize: 32 }} />,
    school: <SchoolIcon style={{ color: iconColor, fontSize: 32 }} />,
    hospital: <LocalHospitalIcon style={{ color: iconColor, fontSize: 32 }} />,
    bank: <AccountBalanceIcon style={{ color: iconColor, fontSize: 32 }} />,
    default: <LocationOnIcon style={{ color: iconColor, fontSize: 32 }} />,
  };
}

// Create a Leaflet DivIcon by rendering React icon component to SVG string
function createCategoryIcon(iconComponent, iconColor) {
  let svgString = ReactDOMServer.renderToStaticMarkup(iconComponent);

  // Inject fill color style or replace fill attributes
  // For example, wrap SVG content in a <span> with style or replace fill="none" or fill="#000" with your color

  // Simplest approach: add a style tag inside svg for fill
  // or add fill attribute on <svg> root

  // Add fill color on <svg> root by replacing first <svg ...>
  svgString = svgString.replace(
    /^<svg/,
    `<svg fill="${iconColor}" style="color:${iconColor}"`
  );

  return L.divIcon({
    className: 'custom-div-icon',
    html: svgString,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
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

  // Memoize icons map so it's not recreated unnecessarily
  const iconsMap = useMemo(() => {
    const iconColor = darkMode ? 'rgb(81, 162, 255)' : 'rgb(0, 0, 0)';
    const categoryIconComponents = getCategoryIconComponents(iconColor);
    const map = {};

    places.forEach((place) => {
      const iconComponent = categoryIconComponents[place.category] || categoryIconComponents.default;
      map[place.category] = createCategoryIcon(iconComponent, iconColor);
    });

    if (!map['default']) {
      map['default'] = createCategoryIcon(categoryIconComponents.default, iconColor);
    }

    return map;
  }, [places, darkMode]);

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
            <Marker
              key={place.id}
              position={place.position}
              icon={iconsMap[place.category] || iconsMap['default']}
            >
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
