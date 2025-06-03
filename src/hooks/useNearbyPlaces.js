import { useState, useEffect } from 'react';

// Haversine formula to calculate distance (in miles) between two lat/lon points
function getDistanceInMiles(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 3958.8; // Radius of Earth in miles

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Translate category to OpenStreetMap key-value pair
function getOverpassTag(category) {
  const mapping = {
    park: { key: 'leisure', value: 'park' },
    hospital: { key: 'amenity', value: 'hospital' },
    restaurant: { key: 'amenity', value: 'restaurant' },
    school: { key: 'amenity', value: 'school' },
    sports: { key: 'leisure', value: 'pitch' },
    cafe: { key: 'amenity', value: 'cafe' },
    library: { key: 'amenity', value: 'library' },
    bank: { key: 'amenity', value: 'bank' },
  };

  return mapping[category.toLowerCase()] || null;
}

export default function useNearbyPlaces(location, category, distance, refreshTrigger = 0) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !category || !distance) {
      setPlaces([]);
      return;
    }

    async function fetchPlaces() {
      setLoading(true);
      setError(null);

      try {
        const [lat, lon] = location;
        const radiusMeters = distance * 1609.34; // miles → meters

        const tag = getOverpassTag(category);
        if (!tag) {
          throw new Error(`Unsupported category: ${category}`);
        }

        const query = `
          [out:json][timeout:25];
          (
            node["${tag.key}"="${tag.value}"](around:${radiusMeters},${lat},${lon});
            way["${tag.key}"="${tag.value}"](around:${radiusMeters},${lat},${lon});
            relation["${tag.key}"="${tag.value}"](around:${radiusMeters},${lat},${lon});
          );
          out center;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ data: query }),
        });

        if (!response.ok) throw new Error('Overpass API request failed');
        const data = await response.json();


        const filteredPlaces = data.elements
          .map((el, index) => {
            const lat2 = el.lat || el.center?.lat;
            const lon2 = el.lon || el.center?.lon;
            if (lat2 === undefined || lon2 === undefined) return null;

            const dist = getDistanceInMiles(lat, lon, lat2, lon2);

            return {
              id: el.id || index,
              position: [lat2, lon2],
              label: el.tags?.name || `${category} (Unnamed)`,
              category,
              distance: dist,
            };
          })
          .filter(Boolean)
          .filter((place) => place.distance <= distance + 0.01)
          .sort((a, b) => a.distance - b.distance);

        console.log(`Overpass returned ${filteredPlaces.length} filtered places`);
        console.log('Filtered places data:', filteredPlaces);
        setPlaces(filteredPlaces);
      } catch (err) {
        console.error('useNearbyPlaces error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlaces();
  }, [location, category, distance, refreshTrigger]);

  return { places, loading, error };
}
