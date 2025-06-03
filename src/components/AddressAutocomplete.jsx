import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

function AddressAutocomplete({ address, setAddress, placeholder = "Enter address" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimeout = useRef(null);

  const { darkMode } = useTheme();

  const fetchSuggestions = (query) => {
    if (!query) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&addressdetails=1&limit=5`
    )
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setShowDropdown(true);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setAddress(val);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (place) => {
    setAddress(place.display_name);
    setSuggestions([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!e.target.closest(".autocomplete-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  return (
    <div className="autocomplete-container relative w-full">
      <input
        type="search"
        value={address}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 ${
          darkMode
            ? "border-gray-700 bg-gray-900 text-gray-100 focus:ring-blue-400"
            : "border-gray-300 bg-white text-gray-900 focus:ring-blue-500"
        }`}
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        role="combobox"
        aria-controls="autocomplete-list"
      />

      {showDropdown && suggestions.length > 0 && (
        <ul
          id="autocomplete-list"
          role="listbox"
          className={`absolute z-50 mt-1 w-full rounded shadow max-h-60 overflow-auto border ${
            darkMode
              ? "bg-gray-900 border-gray-700 text-gray-200"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              role="option"
              onClick={() => handleSelect(place)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSelect(place);
                }
              }}
              className={`cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white ${
                darkMode ? "hover:bg-blue-600" : "hover:bg-blue-100"
              }`}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div
          className={`absolute top-full mt-1 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Loading...
        </div>
      )}
    </div>
  );
}

export default AddressAutocomplete;
