import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

async function geocodeNominatim(query: string) {
  // const url = `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&limit=1&q=${encodeURIComponent(
  //   query
  // )}`;

  const url =
    `https://nominatim.openstreetmap.org/search?` +
    new URLSearchParams({
      q: query + " state",
      format: "json",
      polygon_geojson: "1",
      limit: "1",
      addressdetails: "1",
    });
  const resp = await fetch(url);
  const data = await resp.json();

  // console.log("🔎 Nominatim result for:", query, data);

  if (data.length === 0) return null;
  return data[0];
}

const FitBounds: React.FC<{ geojson: any }> = ({ geojson }) => {
  const map = useMap();
  useEffect(() => {
    if (!geojson) return;
    const layer = L.geoJSON(geojson);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.15));
    }
  }, [geojson, map]);
  return null;
};

export interface NominatimMapProps {
  center?: LatLngExpression;
  geojson?: any;
  highlightQuery?: string;
}

export const NominatimMap: React.FC<NominatimMapProps> = ({
  center = [9.082, 8.6753],
  geojson,
  highlightQuery,
}) => {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(center);

  useEffect(() => {
    if (!highlightQuery) return;

    // clear previous result while fetching
    setSearchResult(null);

    geocodeNominatim(highlightQuery).then((res) => {
      if (res) {
        setMapCenter([parseFloat(res.lat), parseFloat(res.lon)]);
        setSearchResult(res);
      }
    });
  }, [highlightQuery]);

  const styleForFeature = (feature: any) => {
    const stateName = feature?.properties?.NAME_1 ?? feature?.properties?.state;

    if (
      highlightQuery &&
      stateName &&
      stateName.toLowerCase() === highlightQuery.toLowerCase()
    ) {
      return {
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.5,
        weight: 2,
      };
    }

    return {
      color: "#999",
      fillColor: "#ccc",
      fillOpacity: 0.2,
      weight: 1,
    };
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geojson && <GeoJSON data={geojson} style={styleForFeature} />}

      {searchResult?.geojson && (
        <>
          <GeoJSON
            key={highlightQuery}
            data={{
              type: "Feature",
              geometry: searchResult.geojson,
              properties: {},
            }}
            style={{
              color: "blue",
              fillColor: "blue",
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
          <FitBounds geojson={searchResult.geojson} />
        </>
      )}
    </MapContainer>
  );
};
