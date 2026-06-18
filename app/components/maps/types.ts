import type { FeatureCollection } from "geojson";
import type { CSSProperties } from "react";

export type RegionProperties = {
  id: string;
  name: string;
  parentId?: string | null;
  [key: string]: unknown;
};

export type RegionFeatureCollection = FeatureCollection<
  GeoJSON.Geometry,
  RegionProperties
>;

export type ChoroplethData = Record<string, number>;

export type GetColor = (value?: number, min?: number, max?: number) => string;

export type ProjectionBounds = {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
};

export type BaseMapProps = {
  data: RegionFeatureCollection;
  height?: number | string;
  width?: number | string;
  choroplethData?: ChoroplethData;
  getColor?: GetColor;
  colorScale?: string[];
  enableHover?: boolean;
  enableSelection?: boolean;
  selectedRegionId?: string;
  onRegionClick?: (id: string, properties: RegionProperties) => void;
  onRegionHover?: (id: string, properties: RegionProperties) => void;
  showTooltips?: boolean;
  showLabels?: boolean;
  projectionBounds?: ProjectionBounds;
  className?: string;
  containerStyle?: CSSProperties;
  ariaLabel?: string;
  center?: [number, number];
  zoom?: number;
  bounds?: [[number, number], [number, number]];
  tileUrl?: string;
  tileAttribution?: string;
  showBaseLayer?: boolean;
  enableZoomOnClick?: boolean;
};

export type BaseMapTheme = {
  backgroundColor?: string;
  defaultFill?: string;
  strokeColor?: string;
  strokeWidth?: number;
  hoverFill?: string;
  selectedFill?: string;
  labelColor?: string;
  fontFamily?: string;
  fontSize?: number;
};

export type BaseMapWithThemeProps = BaseMapProps & {
  theme?: BaseMapTheme;
};

export type LegendItem = {
  label: string;
  color: string;
};
