import React, { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from 'react-leaflet';
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

function ZoomTracker({ onZoomChange }) {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => onZoomChange(map.getZoom());
    map.on('zoomend', handleZoom);
    return () => map.off('zoomend', handleZoom);
  }, [map, onZoomChange]);

  return null;
}

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

function createCategoryIcon(iconComponent, iconColor) {
  let svgString = ReactDOMServer.renderToStaticMarkup(iconComponent);
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

function groupPlacesByProximity(places, zoomLevel) {
  const zoomToRadius = {
    7: 0.1,
    8: 0.075,
    9: 0.05,
    10: 0.035,
    11: 0.025,
    12: 0.015,
    13: 0.005,
    14: 0.003,
    15: 0.0015,
  };

  const radius = zoomToRadius[zoomLevel] || 0.02;
  const groups = [];

  places.forEach((place) => {
    const group = groups.find((g) => {
      const [lat1, lng1] = g.center;
      const [lat2, lng2] = place.position;
      return (
        Math.abs(lat1 - lat2) < radius && Math.abs(lng1 - lng2) < radius
      );
    });

    if (group) {
      group.places.push(place);
    } else {
      groups.push({ center: place.position, places: [place] });
    }
  });

  return groups;
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
  const [zoomLevel, setZoomLevel] = useState(getZoomLevel(distance));

  const tileLayerUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const iconColor = darkMode ? 'rgb(81, 162, 255)' : 'rgb(0, 0, 0)';
  const categoryIcons = useMemo(() => getCategoryIconComponents(iconColor), [iconColor]);

  const iconsMap = useMemo(() => {
    const map = {};
    places.forEach((place) => {
      const icon = categoryIcons[place.category] || categoryIcons.default;
      map[place.category] = createCategoryIcon(icon, iconColor);
    });
    map['default'] = createCategoryIcon(categoryIcons.default, iconColor);
    return map;
  }, [places, categoryIcons, iconColor]);

  const groupedPlaces = useMemo(() => {
    return groupPlacesByProximity(places, zoomLevel);
  }, [places, zoomLevel]);

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
        Nearby {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Places'}
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
          <ZoomTracker onZoomChange={setZoomLevel} />
          <ChangeMapView center={location} places={places} distance={distance} />

          <TileLayer
            key={darkMode ? 'dark' : 'light'}
            attribution="&copy; OpenStreetMap contributors"
            url={tileLayerUrl}
          />

          {zoomLevel >= 13
            ? places.map((place) => (
                <Marker
                  key={place.id}
                  position={place.position}
                  icon={iconsMap[place.category] || iconsMap['default']}
                >
                  <Popup>{place.label}</Popup>
                </Marker>
              ))
            : groupedPlaces.map((group, index) => (
                <Marker
                  key={index}
                  position={group.center}
                  icon={iconsMap[category] || iconsMap['default']}
                  eventHandlers={{
                    click: (e) => {
                      const map = e.target._map;
                      const bounds = latLngBounds(group.places.map((p) => p.position));
                      map.fitBounds(bounds, { padding: [50, 50] });
                    },
                  }}
                >
                  <Popup>
                    {group.places.length === 1
                      ? group.places[0].label
                      : `${group.places.length} ${category}s in this area — click to view`}
                  </Popup>
                  <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                    {group.places.length} nearby
                  </Tooltip>
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
