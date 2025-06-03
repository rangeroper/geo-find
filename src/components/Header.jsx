import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, MapPin } from "lucide-react";

export default function Header() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <header className="w-full">
      <div className="max-w-screen-lg mx-auto px-6 py-5 flex items-center justify-between">
        <h1
          className="flex items-center gap-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400"
          style={{ textShadow: darkMode ? "0 1px 3px rgba(0,0,0,0.6)" : "none" }}
        >
          <MapPin size={32} className="text-blue-500 dark:text-blue-300" />
          Geo-Find
        </h1>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className={`
            p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-transform duration-200
            ${darkMode ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
          `}
          aria-label="Toggle Theme"
          title="Toggle Light/Dark Mode"
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>
    </header>
  );
}
