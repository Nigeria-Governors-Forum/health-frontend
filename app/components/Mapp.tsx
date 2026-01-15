"use client";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { useEffect } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix the default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

export interface MappViewProps {
  center?: LatLngExpression;
  geojson?: any; // GeoJSON FeatureCollection
  mapClassName?: any;
  showCard?: boolean;
  title?: string;
  total?: any;
  safe?: any;
  h2r?: any;
  onToggle?: () => void;
}

// 🔹 Helper component to fit bounds
const FitBounds: React.FC<{ geojson: any }> = ({ geojson }) => {
  const map = useMap();

  useEffect(() => {
    if (!geojson || !geojson.features?.length) return;
    const layer = L.geoJSON(geojson);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.15), { maxZoom: 10 });
    }
  }, [geojson, map]);

  return null;
};

export const MappView: React.FC<MappViewProps> = ({
  center = [9.082, 8.6753], // fallback (Nigeria)
  geojson,
  mapClassName,
  showCard = false,
  title = "Population by Accessibility",
  total = 10,
  h2r = 2,
  safe = total - h2r,
}) => {
  const styleForFeature = (feature: any) => {
    const status = feature?.properties?.status;
    if (status === "bad") {
      return { color: "red", fillColor: "red", fillOpacity: 0.4, weight: 1 };
    } else if (status === "good") {
      return {
        color: "#2ecc71",
        fillColor: "#2ecc71",
        fillOpacity: 0.35,
        weight: 1,
      };
    } else {
      return {
        color: "#999",
        fillColor: "#ccc",
        fillOpacity: 0.08,
        weight: 0.6,
      };
    }
  };

  const onEachFeature = (feature: any, layer: any) => {
    const stateName =
      feature?.properties?.NAME_1 ?? feature?.properties?.state ?? "";
    const lgaName =
      feature?.properties?.NAME_2 ?? feature?.properties?.lga ?? "Unknown LGA";
    const population = feature?.properties?.population ?? null;
    const statusReadable =
      feature?.properties?.status === "bad"
        ? "Hard to reach"
        : feature?.properties?.status === "good"
          ? "Safe"
          : "Unknown";

    const popFormatted = population
      ? new Intl.NumberFormat("en-US").format(population)
      : "N/A";

    const html = `
      <div>
        <strong>${lgaName}</strong><br/>
        State: ${stateName}<br/>
        Population: ${popFormatted}<br/>
        Status: ${statusReadable}
      </div>
    `;
    layer.bindPopup(html);
    layer.on({
      mouseover: () => layer.setStyle({ weight: 2 }),
      mouseout: () => layer.setStyle(styleForFeature(feature)),
    });
  };

  return (
    <div className="relative w-full">
      {showCard && (
        <div className="bg-white rounded-xl shadow-md p-4 w-auto mb-4">
          <h2 className="text-lg font-semibold text-green-800 mb-3 text-center">
            {title}
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
        center={center} // fallback center
        zoom={6}
        style={{ height: "500px", width: "100%" }}
        className={mapClassName}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geojson && (
          <>
            <GeoJSON
              data={geojson}
              style={styleForFeature}
              onEachFeature={onEachFeature}
            />
            <FitBounds geojson={geojson} />
          </>
        )}

        <Marker position={center}>
          <Popup>Selected Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MappView;
