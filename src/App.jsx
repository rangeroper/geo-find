import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Header from "./components/Header";
import SearchControls from "./components/SearchControls";
import MapView from "./components/MapView";
import useNearbyPlaces from "./hooks/useNearbyPlaces";
import ListView from "./components/ListView";

export default function App() {
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [view, setView] = useState("map");
  const [location, setLocation] = useState([41.8781, -87.6298]); // Chicago coords default
  const [distance, setDistance] = useState(10); // default 10 miles

  const [debouncedLocation] = useDebounce(location, 500);
  const [debouncedCategory] = useDebounce(category, 500);
  const [debouncedDistance] = useDebounce(distance, 500);

  const [debouncedAddress] = useDebounce(address, 700);

  // Geocode address when debouncedAddress changes
  useEffect(() => {
    if (!debouncedAddress) return;

    async function geocode() {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedAddress
          )}&format=json&limit=1`
        );
        const data = await res.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setLocation([parseFloat(lat), parseFloat(lon)]);
          setView("map");
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }

    geocode();
  }, [debouncedAddress]);

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setView("map");
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error(error);
      }
    );
  }

  const { places, loading, error } = useNearbyPlaces(
    debouncedLocation,
    debouncedCategory,
    debouncedDistance,
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Header />

      <SearchControls
        address={address}
        setAddress={setAddress}
        category={category}
        setCategory={setCategory}
        distance={distance}
        setDistance={setDistance}
        view={view}
        setView={setView}
        onUseMyLocation={handleUseMyLocation}
      />

      {view === "map" ? (
        <div className="mt-8 relative z-25">
          <MapView
            location={debouncedLocation}
            category={debouncedCategory}
            places={places}
            loading={loading}
            error={error}
            onSetView={setView}
            onUseMyLocation={handleUseMyLocation}
          />
        </div>
      ) : (
        <div className="mt-6">
          <ListView places={places} />
        </div>
      )}
    </div>
  );
}
