import { chain, get, includes, isArray, isEmpty, map, toString } from 'lodash'
import { GEO_JSON_TYPE, MAP_POINT_TYPE, NO_NETWORK_ELEMENT_GEOM_TYPE } from '../constants/map'

export const makePoint = c => ({ latitude: c[1], longitude: c[0] })

export const isCoordinateNotEmpty = coordinate => (
  !isEmpty(coordinate) && coordinate.latitude !== null && coordinate.longitude !== null
)

const makeCoordinates = geom => {
  switch (geom.type) {
  case GEO_JSON_TYPE.POINT:
    return makePoint(geom.coordinates)
  case GEO_JSON_TYPE.LINE_STRING:
    return map(geom.coordinates, makePoint)
  case GEO_JSON_TYPE.MULTI_LINE_STRING:
    return map(geom.coordinates, coordinates => map(coordinates, makePoint))
  case NO_NETWORK_ELEMENT_GEOM_TYPE:
    return geom.coordinates
  default:
    return []
  }
}
const getLowMidIndex = length => Math.floor((length - 1) / 2)
const getHighMidIndex = length => Math.ceil((length - 1) / 2)

export const getMiddleMarkerCord = coordinates => {
  const cordsLength = coordinates.length
  const lowMidIndex = getLowMidIndex(cordsLength)
  const highMidIndex = getHighMidIndex(cordsLength)
  const lowMidCord = coordinates[lowMidIndex]
  const highMidCord = coordinates[highMidIndex]
  const middleMarkerCord = {
    latitude: ((lowMidCord.latitude + highMidCord.latitude) / 2),
    longitude: ((lowMidCord.longitude + highMidCord.longitude) / 2),
  }
  return middleMarkerCord
}

const getMarkerCoordinate = coordinates => {
  let middleMarkerCord
  if (!isArray(coordinates)) {
    middleMarkerCord = coordinates
  } else if (coordinates[0].constructor === Array) {
    const lowMidIndex = getLowMidIndex(coordinates.length)
    middleMarkerCord = getMiddleMarkerCord(coordinates[lowMidIndex])
  } else {
    middleMarkerCord = getMiddleMarkerCord(coordinates)
  }

  return middleMarkerCord
}

const parseToGeometry = coordinate => ({
  type: 'Point',
  coordinates: [coordinate.longitude, coordinate.latitude],
})

const toGeoJsonPoint = (id, coordinate) => ({
  type: 'Feature',
  properties: {
    id: id,
  },
  geometry: parseToGeometry(coordinate),
})

const generateMarker = (id, coordinate) => {
  if (isEmpty(coordinate)) {
    return null
  }

  const markerCoordinate = getMarkerCoordinate(coordinate)
  return {
    coordinates: getMarkerCoordinate(coordinate),
    geomJsonPoint: toGeoJsonPoint(id, markerCoordinate),
  }
}

const getNoElementWorkItemGeom = items => ({
  type: NO_NETWORK_ELEMENT_GEOM_TYPE,
  coordinates: {
    longitude: get(items, '[0].region_center_position_longitude'),
    latitude: get(items, '[0].region_center_position_latitude'),
  },
})

export const getGeomItems = workItems => chain(workItems)
  .groupBy(workItem => (
    isEmpty(get(workItem, 'network_element.the_geom')) ?
      get(workItem, 'id') :
      get(workItem, 'network_element.id')
  ))
  .map((items, networkElementId) => {
    let geom = ''
    try {
      geom = JSON.parse(get(items, '[0].network_element.the_geom', '{}'))
      if (isEmpty(geom)) {
        geom = getNoElementWorkItemGeom(items)
      }
    } catch (error) {
      console.log('getGeomItems json parse network_element.the_geom error') // eslint-disable-line
    }
    return { id: networkElementId, workItems: items, geom: geom }
  })
  .filter(item => !isEmpty(item.geom))
  .map(({ id, workItems: items, geom }) => {
    const coordinates = makeCoordinates(geom)

    return {
      id: id,
      workItems: items,
      geomJsonType: geom.type,
      coordinates: coordinates,
      marker: generateMarker(id, coordinates),
    }
  })
  .filter(({ coordinates }) => !isEmpty(coordinates))
  .value()

export const getAllCoordinates = geomItems => (
  chain(geomItems)
    .map(item => item.coordinates)
    .flattenDeep()
    .value()
)
export const isGeomItemSelected = (selectedGeomItem, currentGeomItem) => {
  if (isEmpty(selectedGeomItem)) {
    return false
  }
  if (selectedGeomItem.type === currentGeomItem.type) {
    return selectedGeomItem.id === currentGeomItem.id
  }

  let clusterGeoItem = null
  let normalGeoItem = null

  if (selectedGeomItem.type === MAP_POINT_TYPE.CLUSTER) {
    clusterGeoItem = selectedGeomItem
    normalGeoItem = currentGeomItem
  } else {
    clusterGeoItem = currentGeomItem
    normalGeoItem = selectedGeomItem
  }
  const networkElementIds = chain(clusterGeoItem.workItems)
    .map('network_element.id')
    .value()
  return includes(networkElementIds, normalGeoItem.id)
}

const getClusterWorkItems = (geomItems, geomItemIds) => (
  chain(geomItems)
    .filter(({ id }) => includes(geomItemIds, id))
    .map('workItems')
    .flatten()
    .without(undefined)
    .value()
)

export const getClusterGeomItem = (element, geomItems, geomItemIds) => (
  {
    id: toString(element.properties.cluster_id),
    type: MAP_POINT_TYPE.CLUSTER,
    workItems: getClusterWorkItems(geomItems, geomItemIds),
    marker: {
      coordinates: makePoint(element.geometry.coordinates),
    },
  }
)
