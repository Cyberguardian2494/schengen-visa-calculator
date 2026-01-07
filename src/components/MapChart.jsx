import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { useState } from "react";

// Reliable Map Source
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Translator: 3-letter code -> Numeric ID
const geoIdMap = {
  "AUT": "040", "BEL": "056", "HRV": "191", "CZE": "203", "DNK": "208", 
  "EST": "233", "FIN": "246", "FRA": "250", "DEU": "276", "GRC": "300", 
  "HUN": "348", "ISL": "352", "ITA": "380", "LVA": "428", "LIE": "438", 
  "LTU": "440", "LUX": "442", "MLT": "470", "NLD": "528", "NOR": "578", 
  "POL": "616", "PRT": "620", "SVK": "703", "SVN": "705", "ESP": "724", 
  "SWE": "752", "CHE": "756"
};

const CAPITALS = [
  { name: "Berlin", coords: [13.405, 52.52] },
  { name: "Paris", coords: [2.3522, 48.8566] },
  { name: "Rome", coords: [12.4964, 41.9028] },
  { name: "Madrid", coords: [-3.7038, 40.4168] },
  { name: "Prague", coords: [14.4378, 50.0755] },
  { name: "Vienna", coords: [16.3738, 48.2082] },
  { name: "Amsterdam", coords: [4.9041, 52.3676] },
  { name: "Lisbon", coords: [-9.1393, 38.7223] },
  { name: "Stockholm", coords: [18.0686, 59.3293] },
  { name: "Warsaw", coords: [21.0122, 52.2297] },
  { name: "Athens", coords: [23.7275, 37.9838] },
  { name: "Budapest", coords: [19.0402, 47.4979] },
];

const MapChart = ({ trips }) => {
  const [position, setPosition] = useState({ coordinates: [10, 50], zoom: 2.5 }); 
  const [tooltip, setTooltip] = useState("");
  // New State: Controls if the map is fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const visitedCodes = [...new Set(trips.flatMap(t => t.countries || [t.country]))].filter(Boolean);
  const visitedIds = visitedCodes.map(code => geoIdMap[code]);
  const progress = Math.min(100, Math.round((visitedCodes.length / 27) * 100));

  return (
    // CONDITIONAL STYLING:
    // If Fullscreen: Fixed position covering entire screen (z-50 puts it on top)
    // If Normal: Standard margin and rounded corners
    <div className={`transition-all duration-300 bg-white ${
      isFullscreen 
        ? "fixed inset-0 z-50 w-screen h-screen p-2 flex flex-col" 
        : "mt-8 p-6 rounded-xl shadow-lg relative"
    }`}>
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-4 z-10">
        <div>
          <h3 className="font-bold text-lg text-gray-800">Travel Map 🗺️</h3>
          <p className="text-xs text-gray-500">
            {isFullscreen ? "Pinch to zoom • Drag to move" : "Tap expand for full view"}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {!isFullscreen && (
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-bold text-blue-600">{progress}%</div>
              <div className="text-xs text-gray-500">Conquest</div>
            </div>
          )}

          {/* THE EXPAND/CLOSE BUTTON */}
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full font-bold shadow-sm transition-colors"
          >
            {isFullscreen ? "✕ Close Map" : "⤢ Expand"}
          </button>
        </div>
      </div>

      {/* MAP CONTAINER */}
      {/* If Fullscreen: Take all remaining height (flex-1). If Normal: fixed height (500px) */}
      <div className={`border border-gray-100 rounded-lg overflow-hidden bg-blue-50 relative ${
        isFullscreen ? "flex-1 w-full" : "h-[500px]"
      }`}>
        
        {tooltip && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded pointer-events-none z-20 backdrop-blur-sm">
            {tooltip}
          </div>
        )}

        <ComposableMap projectionConfig={{ scale: 700 }} height={isFullscreen ? 600 : 500}>
          <ZoomableGroup 
            zoom={position.zoom} 
            center={position.coordinates} 
            onMoveEnd={(pos) => setPosition(pos)}
            minZoom={1}
            maxZoom={10}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = visitedIds.includes(String(geo.id));
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setTooltip(geo.properties.name)}
                      onMouseLeave={() => setTooltip("")}
                      style={{
                        default: {
                          fill: isVisited ? "#3b82f6" : "#E5E7EB",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none"
                        },
                        hover: {
                          fill: isVisited ? "#2563eb" : "#D1D5DB",
                          outline: "none"
                        },
                        pressed: { fill: "#1d4ed8", outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {position.zoom > 3 && CAPITALS.map(({ name, coords }) => (
              <Marker key={name} coordinates={coords}>
                <circle r={3 / position.zoom} fill="#EF4444" stroke="#fff" strokeWidth={1} />
                <text
                  textAnchor="middle"
                  y={-10 / position.zoom}
                  style={{ 
                    fontFamily: "system-ui", 
                    fill: "#1F2937", 
                    fontSize: `${12 / position.zoom}px`, 
                    fontWeight: "bold",
                    textShadow: "0px 0px 2px white"
                  }}
                >
                  {name}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* FLOATING ZOOM CONTROLS (Always visible) */}
        <div className="absolute bottom-6 right-4 flex flex-col gap-3">
           <button className="bg-white w-10 h-10 rounded-full shadow-lg text-gray-600 hover:text-black font-bold text-xl flex items-center justify-center border border-gray-200" onClick={() => setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }))}>+</button>
           <button className="bg-white w-10 h-10 rounded-full shadow-lg text-gray-600 hover:text-black font-bold text-xl flex items-center justify-center border border-gray-200" onClick={() => setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }))}>-</button>
        </div>
      </div>
    </div>
  );
};

export default MapChart;