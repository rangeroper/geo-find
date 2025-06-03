import {
  TreePine as Tree,
  Hospital,
  Coffee,
  BookOpen,
  Landmark as Bank,
  School,
  Landmark as Football,
  Utensils,
} from "lucide-react";

const categoryIcons = {
  park: Tree,
  hospital: Hospital,
  cafe: Coffee,
  library: BookOpen,
  bank: Bank,
  school: School,
  sports: Football,
  restaurant: Utensils,
};

export default function ListView({ places = [] }) {
  if (!places.length) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-6">
        No places found.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {places.map((place) => {
        const Icon = categoryIcons[place.category?.toLowerCase()] || Tree;

        return (
          <li key={place.id} className="flex items-start gap-4 py-4">
            {/* Icon */}
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {place.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {place.address || "No address provided"}
              </p>
            </div>

            {/* Optional Metadata */}
            <div className="hidden sm:block text-sm text-gray-400 dark:text-gray-500">
              {place.distance ? `${place.distance.toFixed(1)} mi` : ""}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
