import {
  getMiddleMarkerCord,
  getGeomItems,
  makePoint,
  getAllCoordinates,
  isCoordinateNotEmpty,
  isGeomItemSelected,
  getClusterGeomItem,
} from '../mapUtil'
import { workItemsForMap, workItemsForMapGroup } from '../../work-item/fixture'
import { GEO_JSON_TYPE, MAP_POINT_TYPE, NO_NETWORK_ELEMENT_GEOM_TYPE } from '../../constants/map'

describe('mapDataProcess utils ', () => {
  describe('#makePoint', () => {
    it('should return marker when use makePoint', () => {
      expect(makePoint([-91.9055637002339, 39.1523655221646])).toEqual(
        { latitude: 39.1523655221646, longitude: -91.9055637002339 })
    })
  })

  describe('#getGeomItems', () => {
    const geomItemNE01 = {
      id: 'ne-01',
      geomJsonType: GEO_JSON_TYPE.POINT,
      coordinates: { latitude: 39.148406432505595, longitude: -91.90216779871662 },
      marker: {
        coordinates: { latitude: 39.148406432505595, longitude: -91.90216779871662 },
        geomJsonPoint: {
          type: 'Feature',
          properties: { id: 'ne-01' },
          geometry: {
            coordinates: [-91.90216779871662, 39.148406432505595],
            type: 'Point',
          },
        },
      },
    }
    const geomItemNE03 = {
      id: 'ne-03',
      geomJsonType: GEO_JSON_TYPE.LINE_STRING,
      coordinates: [
        { latitude: 39.148406432505595, longitude: -91.90216779871632 },
        { latitude: 30.509236, longitude: 114.404546 },
      ],
      marker: {
        coordinates: { latitude: 34.8288212162528, longitude: 11.251189100641838 },
        geomJsonPoint: {
          type: 'Feature',
          properties: { id: 'ne-03' },
          geometry: {
            coordinates: [11.251189100641838, 34.8288212162528],
            type: 'Point',
          },
        },
      },
    }
    const geomItemNE04 = {
      id: 'ne-04',
      geomJsonType: GEO_JSON_TYPE.MULTI_LINE_STRING,
      coordinates: [[
        { latitude: 39.148406432505595, longitude: -91.90316779871362 },
        { latitude: 30.509236, longitude: 114.404546 },
      ]],
      marker: {
        coordinates: { latitude: 34.8288212162528, longitude: 11.250689100643186 },
        geomJsonPoint: {
          type: 'Feature',
          properties: { id: 'ne-04' },
          geometry: {
            coordinates: [11.250689100643186, 34.8288212162528],
            type: 'Point',
          },
        },
      },
    }
    const geomItemNE05 = {
      id: '6125',
      geomJsonType: NO_NETWORK_ELEMENT_GEOM_TYPE,
      coordinates: { latitude: 50.2532723340837, longitude: -119.248605897669 },
      marker: {
        coordinates: { latitude: 50.2532723340837, longitude: -119.248605897669 },
        geomJsonPoint: {
          type: 'Feature',
          properties: { id: '6125' },
          geometry: {
            coordinates: [-119.248605897669, 50.2532723340837],
            type: 'Point',
          },
        },
      },
    }
    it('should return geom work items with maker and only contain geom type Point LineString, MultiLineString', () => {
      const geomItems = [
        {
          ...geomItemNE05,
          workItems: [workItemsForMap[6]],
        },
        {
          ...geomItemNE01,
          workItems: [workItemsForMap[0]],
        },
        {
          ...geomItemNE03,
          workItems: [workItemsForMap[2]],
        },
        {
          ...geomItemNE04,
          workItems: [workItemsForMap[3]],
        },
      ]
      expect(getGeomItems(workItemsForMap)).toEqual(geomItems)
    })

    it('should return group geom work items', () => {
      const geomItems = [
        {
          ...geomItemNE05,
          workItems: [workItemsForMap[6]],
        },
        {
          ...geomItemNE01,
          workItems: [workItemsForMapGroup[0], workItemsForMapGroup[7]],
        },
        {
          ...geomItemNE03,
          workItems: [workItemsForMapGroup[2], workItemsForMapGroup[9]],
        },
        {
          ...geomItemNE04,
          workItems: [workItemsForMapGroup[3], workItemsForMapGroup[10]],
        },
      ]
      expect(getGeomItems(workItemsForMapGroup)).toEqual(geomItems)
    })
  })

  describe('#getAllCoordinates', () => {
    it('should return all coordinates', () => {
      const geomItems = [
        {
          id: 4313,
          workItems: [workItemsForMap[0]],
          geomJsonType: GEO_JSON_TYPE.POINT,
          coordinates: { latitude: 39.148406432505595, longitude: -91.90216779871662 },
        }, {
          id: 4314,
          workItems: [workItemsForMap[1]],
          geomJsonType: GEO_JSON_TYPE.POINT,
          coordinates: { latitude: 39.148406432505595, longitude: -91.90216779871663 },
        },
        {
          id: 4315,
          workItems: [workItemsForMap[2]],
          geomJsonType: GEO_JSON_TYPE.LINE_STRING,
          coordinates: [
            { latitude: 39.148406432505595, longitude: -91.90216779871632 },
            { latitude: 30.509236, longitude: 114.404546 },
          ],
        },
        {
          id: 4317,
          workItems: [workItemsForMap[4]],
          geomJsonType: GEO_JSON_TYPE.MULTI_LINE_STRING,
          coordinates: [[
            { latitude: 30.518331, longitude: 114.399202 },
            { latitude: 30.507257, longitude: 114.396433 },
            { latitude: 30.503381, longitude: 114.408338 },
          ]],
        },
      ]

      const allCoordinates = [
        { latitude: 39.148406432505595, longitude: -91.90216779871662 },
        { latitude: 39.148406432505595, longitude: -91.90216779871663 },
        { latitude: 39.148406432505595, longitude: -91.90216779871632 },
        { latitude: 30.509236, longitude: 114.404546 },
        { latitude: 30.518331, longitude: 114.399202 },
        { latitude: 30.507257, longitude: 114.396433 },
        { latitude: 30.503381, longitude: 114.408338 },
      ]
      expect(getAllCoordinates(geomItems)).toEqual(allCoordinates)
    })
  })

  describe('#isCoordinateNotEmpty', () => {
    it('should return true when when coordinate latitude and longitude has value', () => {
      const coordinate = { latitude: 30.509236, longitude: 114.404546 }
      expect(isCoordinateNotEmpty(coordinate)).toEqual(true)
    })

    it('should return false when when coordinate latitude or longitude do not has value', () => {
      const coordinate = { latitude: null, longitude: null }
      expect(isCoordinateNotEmpty(coordinate)).toEqual(false)
    })
  })

  describe('#getMiddleMarkerCordForLine', () => {
    it('should get middle marker coordinate for line', () => {
      const coordinates = [{ latitude: 39.148406432505595, longitude: -91.90216779871662 },
        { latitude: 39.1484064325, longitude: -91.90216779871668 }]

      const middleMarkerCord = {
        latitude: 39.148406432502796,
        longitude: -91.90216779871665,
      }

      expect(getMiddleMarkerCord(coordinates)).toEqual(middleMarkerCord)
    })
  })

  describe('#isGeomItemSelected', () => {
    const clusterGeoItems = {
      type: MAP_POINT_TYPE.CLUSTER,
      id: '01',
      workItems: [workItemsForMapGroup[0], workItemsForMapGroup[2], workItemsForMapGroup[6]],
    }

    const normalGeoItemsInCluster = {
      type: MAP_POINT_TYPE.NETWORK_ELEMENT,
      id: workItemsForMapGroup[0].network_element.id,
      workItems: [workItemsForMapGroup[0], workItemsForMapGroup[6]],
    }

    const normalGeoItemsNotInCluster = {
      type: MAP_POINT_TYPE.NETWORK_ELEMENT,
      id: workItemsForMapGroup[3].network_element.id,
      workItems: [workItemsForMapGroup[3]],
    }

    it('should return false when selectedItem is null', () => {
      expect(isGeomItemSelected(null, clusterGeoItems)).toEqual(false)
      expect(isGeomItemSelected(null, normalGeoItemsInCluster)).toEqual(false)
    })

    it('should return true when selectedItem is null', () => {
      expect(isGeomItemSelected(clusterGeoItems, clusterGeoItems)).toEqual(true)
      expect(isGeomItemSelected(normalGeoItemsInCluster, normalGeoItemsInCluster)).toEqual(true)
    })

    it('should return true when selectedItem is cluster and include the current geomItem', () => {
      expect(isGeomItemSelected(clusterGeoItems, normalGeoItemsInCluster)).toEqual(true)
    })

    it('should return true when current geomItem is cluster and include the current selectedItem', () => {
      expect(isGeomItemSelected(normalGeoItemsInCluster, clusterGeoItems)).toEqual(true)
    })

    it('should return false when selectedItem is cluster but not include the current geomItem', () => {
      expect(isGeomItemSelected(clusterGeoItems, normalGeoItemsNotInCluster)).toEqual(false)
    })

    it('should return false when current geomItem is cluster but not include the current selectedItem', () => {
      expect(isGeomItemSelected(normalGeoItemsNotInCluster, clusterGeoItems)).toEqual(false)
    })
  })

  describe('#getClusterGeomItem', () => {
    const clusterElement = {
      properties: {
        cluster_id: 1,
      },
      geometry: {
        coordinates: [-91.90216779871662, 39.148406432505595],
      },
    }

    const geomItems = [
      {
        id: workItemsForMapGroup[0].network_element.id,
        workItems: [workItemsForMapGroup[0], workItemsForMapGroup[6]],
      },
      {
        id: workItemsForMapGroup[2].network_element.id,
        workItems: [workItemsForMapGroup[2], workItemsForMapGroup[8]],
      },

    ]
    it('should return a cluster geomItem', () => {
      const geomItemIds = [workItemsForMapGroup[2].network_element.id]
      const clusterGeomItem = {
        id: '1',
        type: MAP_POINT_TYPE.CLUSTER,
        workItems: [workItemsForMapGroup[2], workItemsForMapGroup[8]],
        marker: {
          coordinates: { latitude: 39.148406432505595, longitude: -91.90216779871662 },
        },
      }
      expect(getClusterGeomItem(clusterElement, geomItems, geomItemIds)).toEqual(clusterGeomItem)
    })
  })
})
