# Geo Find

A React-based web app to find nearby places with an interactive map and light/dark theme support.

## 🌐 Demo

**Live URL:**  
[https://rangeroper.github.io/geo-find/](https://rangeroper.github.io/geo-find/)

## Technologies Used

- **React** — Frontend UI library  
- **React Leaflet** — Interactive maps with Leaflet.js in React  
- **Leaflet** — Open-source JavaScript library for mobile-friendly maps  
- **Tailwind CSS** — Utility-first CSS framework for styling  
- **Material UI Icons** — Icon components for categories  
- **Custom Theme Context** — React Context API for light/dark theme toggle  
- **OpenStreetMap** — Open map tiles used for light mode  
- **Carto Maps** — Dark-themed map tiles for dark mode   

## Features

- 🔍 **Autocomplete search** – Smart location input with live suggestions  
- 📍 **User location** – Automatically centers map to user’s position  
- 📦 **Category filters** – Easily switch between types like parks, restaurants, hospitals, and more  
- 🗺️ **Interactive map** – Clickable markers with tooltips and popups  
- 🧩 **Marker grouping by proximity** – Places clustered in congested areas to reduce clutter, expanding on zoom or click  
- 🔄 **Zoom-aware updates** – Map dynamically updates markers and groups when zoom level changes  
- 🌙 **Dark/light mode** – Toggle with persistent preference saved in localStorage  
- 🧭 **Responsive UI** – Clean, mobile-friendly layout using Tailwind CSS  
- 🎨 **Custom icons** – Category-specific icons rendered as SVG markers for better visual distinction  
- ⚙️ **Smooth map view changes** – Auto-zoom and fit bounds to show all relevant markers


## Setup & Running Locally

1. Clone the repository:  
   ```bash
   git clone https://github.com/rangeroper/geo-find.git
2. Change Directories
   ```bash
   cd geo-find
3. Install dependencies/packages
   ```bash
   npm install
4. Start dev environment
   ```bash
   npm run dev

## Coming Soon

- 🧠 Enhanced map data (e.g., more detailed metadata, named results)
- 🌄 Advanced visual styling (terrain shading, layers, gradients)
- 🖼️ Additional custom marker icons for even more distinct categories

## 🤝 Contributing

Have feedback, ideas, or found a bug?

[![Open an Issue](https://img.shields.io/badge/%F0%9F%91%89%20Open%20an%20Issue-blue?style=for-the-badge)](https://github.com/rangeroper/geo-find/issues/new)

We welcome contributions of any kind—whether it's code, UI tweaks, or suggestions!
