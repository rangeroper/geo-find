import AddressAutocomplete from './AddressAutocomplete';
import { Navigation } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function SearchControls({
  address,
  setAddress,
  category,
  setCategory,
  distance,
  setDistance,
  view,
  setView,
  onUseMyLocation,
}) {
  
  const { darkMode } = useTheme();

  return (
    <section className="w-full mt-6 space-y-4">
      {/* Address + Location Button */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1 min-w-0 relative z-50">
          <AddressAutocomplete
            address={address}
            setAddress={setAddress}
            placeholder="Enter address or location"
          />
        </div>
        <button
          onClick={onUseMyLocation}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-2"
          aria-label="Use My Location"
        >
          <Navigation size={20} />
          <span className="hidden sm:inline">Use My Location</span>
        </button>
      </div>

      {/* Filters & View Controls */}
      <div className="flex flex-wrap gap-3 w-full">
        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`flex-1 min-w-[150px] border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
            darkMode
              ? "border-gray-700 bg-gray-900 text-gray-100 focus:ring-blue-400"
              : "border border-gray-300 bg-white text-gray-900 focus:ring-blue-500"
          }`}
        >
          <option value="">Choose Category</option>
          <option value="park">Parks</option>
          <option value="sports">Sports Fields</option>
          <option value="library">Libraries</option>
          <option value="cafe">Cafés</option>
          <option value="restaurant">Restaurants</option>
          <option value="school">Schools</option>
          <option value="hospital">Hospitals</option>
          <option value="bank">Banks</option>
        </select>

        {/* Distance Input */}
        <input
          type="number"
          min="1"
          max="50"
          step="1"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          placeholder="Distance (mi)"
          className={`w-full border sm:w-32 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
            darkMode
              ? "border-gray-700 bg-gray-900 text-gray-100 focus:ring-blue-400"
              : "border border-gray-300 bg-white text-gray-900 focus:ring-blue-500"
          }`}
        />

        {/* View Toggle Buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setView('map')}
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              view === 'map'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            🗺️ Map View
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              view === 'list'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            📋 List View
          </button>
        </div>

      </div>
    </section>
  );
}
