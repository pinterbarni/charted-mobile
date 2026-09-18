import { API_URL } from './api.constants';
import { AppTheme } from './theme.constants';

export const MARTIN_URL = `${API_URL}/tiles`;
export const MAP_SOURCE_ID = 'central-europe';
export const MAP_SOURCE_NAME = 'charted';

export const MARTIN_ENDPOINTS = {
  TILES: `${MARTIN_URL}/${MAP_SOURCE_ID}/{z}/{x}/{y}`,
  GLYPHS: `${MARTIN_URL}/font/{fontstack}/{range}`,
} as const;

//TODO implement more bme pond!
export const MAP_LAYERS = {
  BACKGROUND: 'background',
  EARTH: 'earth',
  LANDCOVER: 'landcover',
  WATER: 'water',
  LANDUSE: 'landuse',
  ROADS: 'roads',
  BUILDINGS: 'buildings',
} as const;

export const MAP_ZOOM = {
  MIN: 0,
  MAX: 15,
  DEFAULT: 12,
  TRACKING: 16,
} as const;

export const DEFAULT_CENTER: [number, number] = [19.0402, 47.4979];

export const getMapStyle = (theme: AppTheme) => ({
  version: 8,
  glyphs: MARTIN_ENDPOINTS.GLYPHS,
  sources: {
    [MAP_SOURCE_NAME]: {
      type: 'vector',
      tiles: [MARTIN_ENDPOINTS.TILES],
      minzoom: MAP_ZOOM.MIN,
      maxzoom: MAP_ZOOM.MAX,
    },
  },
  layers: [
    {
      id: MAP_LAYERS.BACKGROUND,
      type: 'background',
      paint: { 'background-color': theme.mapTiles.mapBackground },
    },
    {
      id: MAP_LAYERS.EARTH,
      type: 'fill',
      source: MAP_SOURCE_NAME,
      'source-layer': MAP_LAYERS.EARTH,
      paint: { 'fill-color': theme.mapTiles.mapEarth },
    },
    {
      id: MAP_LAYERS.LANDCOVER,
      type: 'fill',
      source: MAP_SOURCE_NAME,
      'source-layer': MAP_LAYERS.LANDCOVER,
      paint: { 'fill-color': theme.mapTiles.mapLandcover },
    },
    {
      id: MAP_LAYERS.WATER,
      type: 'fill',
      source: MAP_SOURCE_NAME,
      'source-layer': MAP_LAYERS.WATER,
      paint: { 'fill-color': theme.mapTiles.mapWater },
    },
    {
      id: MAP_LAYERS.LANDUSE,
      type: 'fill',
      source: MAP_SOURCE_NAME,
      'source-layer': MAP_LAYERS.LANDUSE,
      paint: { 'fill-color': theme.mapTiles.mapLanduse },
    },
    {
      id: MAP_LAYERS.ROADS,
      type: 'line',
      source: MAP_SOURCE_NAME,
      'source-layer': MAP_LAYERS.ROADS,
      paint: { 'line-color': theme.mapTiles.mapRoads, 'line-width': 1.5 },
    },
    {
      id: MAP_LAYERS.BUILDINGS,
      type: 'fill',
      source: MAP_SOURCE_NAME,
      'source-layer': MAP_LAYERS.BUILDINGS,
      paint: {
        'fill-color': theme.mapTiles.mapBuildings,
        'fill-outline-color': theme.mapTiles.mapBuildingOutline,
      },
    },
  ],
});
