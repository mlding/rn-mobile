export const GEO_JSON_TYPE = {
  POINT: 'Point',
  MULTI_POINT: 'MultiPoint',
  LINE_STRING: 'LineString',
  MULTI_LINE_STRING: 'MultiLineString',
  POLYGON: 'Polygon',
  MULTI_POLYGON: 'MultiPolygon',
}

const DEFAULT_PADDING = { top: 120, right: 60, bottom: 120, left: 60 }

export const FIT_TO_COORDINATES_OPTIONS = {
  edgePadding: DEFAULT_PADDING,
  animated: true,
}

export const ZOOM_LEVEL = {
  INIT: 16,
  MAX: 20,
}

export const MAP_POINT_TYPE = {
  CLUSTER: 'cluster',
  NETWORK_ELEMENT: 'network_element',
}

export const GEOCODE_KEY = 'AIzaSyAqA1X4jXuOKc18gehNrt5hcHVM52hCIog'

export const DEFAULT_COORDINATE = {
  longitude: null,
  latitude: null,
}

export const MAP_ICONS_MARGIN_BOTTOM = 15

export const DOUBLE_TAP_OPTION = {
  TIME_DELAY: 300,
  RADIUS: 20,
}

export const NO_NETWORK_ELEMENT_GEOM_TYPE = 'NO_NETWORK_ELEMENT_GEOM_TYPE'
