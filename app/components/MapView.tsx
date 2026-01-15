"use client";

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import ToggleSwitch from "./ToggleSwitch";

// Fix the default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

export interface MapViewProps {
  center?: LatLngExpression;
  geojson?: any; // You can type this better if needed
  mapClassName?: any;
  showCard?: boolean;
  title?: string;
  total?: any;
  safe?: string;
  h2r?: any;
  onToggle?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  center = [9.082, 8.6753],
  geojson,
  mapClassName,
  showCard = false,
  title = "Population by Accessibility",
  total = 10,
  h2r = 2,
  safe = total - h2r,
  onToggle,
}) => {

  return (
    <div className="relative w-full">
      {showCard && (
        <div className="bg-white rounded-xl shadow-md p-4 w-auto mb-4">
          <h2 className="text-lg font-semibold text-green-800 mb-3 text-center">
            {title}
            <ToggleSwitch initial={true} onToggle={() => onToggle} />
          </h2>
          <div className="flex justify-between text-sm gap-4 text-gray-700">
            <span className="text-blue-600 font-medium">Total: {total}</span>
            <span className="text-green-600 font-medium">Safe: {safe}</span>
            <span className="text-red-600 font-medium">
              Hard to reach: {h2r}
            </span>
          </div>
        </div>
      )}
      <MapContainer
        center={center} // Example: center on Nigeria
        zoom={6}
        style={{ height: "500px", width: "100%" }}
        className={mapClassName}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojson && (
          <GeoJSON
            data={geojson}
            style={(feature) => {
              const status = feature?.properties?.status;
              return {
                color: status === "bad" ? "red" : "green",
                fillColor: status === "bad" ? "red" : "green",
                fillOpacity: 0.4,
                weight: 1,
              };
            }}
          />
        )}
        <Marker position={center} >
          <Popup>Selected Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
