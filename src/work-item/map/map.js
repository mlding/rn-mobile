import React, { Component } from 'react'
import { filter, get, isEmpty, map, find, isEqual, noop, chain, groupBy, round } from 'lodash'
import PropTypes from 'prop-types'
import { Image, LayoutAnimation, StyleSheet, View, Animated, PanResponder } from 'react-native'
import MapView from 'react-native-maps'
import supercluster from 'supercluster'
import {
  getAllCoordinates,
  getGeomItems,
  isCoordinateNotEmpty,
  isGeomItemSelected,
  getClusterGeomItem,
} from '../../utilities/mapUtil'
import point from '../../assets/images/point.png' // eslint-disable-line
import selectedPoint from '../../assets/images/selectedPoint.png' // eslint-disable-line
import groupPinNormal from '../../assets/images/group-pin-normal.png' // eslint-disable-line
import groupPinSelect from '../../assets/images/group-pin-select.png' // eslint-disable-line
import workItemPinNormal from '../../assets/images/workitem-pin-normal.png' // eslint-disable-line
import workItemPinSelect from '../../assets/images/workitem-pin-select.png' // eslint-disable-line
import { CoordinateShape, WorkItemShape } from '../../shared/shape'
import { SHOW_WORKITEM_DETAIL_ANIMA } from '../../utilities/animaUtil'
import { IS_ANDROID, IS_IOS } from '../../utilities/systemUtil'
import InteractableWorkItems, { SNAP_POSITION_INDEX } from './interactableWorkItems'
import Button from '../../components/button'
import { MAP_LINE_WIDTH, MAP_COLOR, COLOR, OPACITY } from '../../constants/styleGuide'
import mapBase from '../../components/mapBase'
import {
  FIT_TO_COORDINATES_OPTIONS,
  MAP_ICONS_MARGIN_BOTTOM,
  MAP_POINT_TYPE, ZOOM_LEVEL,
  GEO_JSON_TYPE,
  DOUBLE_TAP_OPTION,
} from '../../constants/map'
import MapMarker from './mapMarker'
import Icon from '../../components/icon'

const LOCATION_ICON_SIZE = 40

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  iconsWrapper: {
    position: 'absolute',
    right: 10,
  },
  iconButton: {
    marginBottom: 10,
    backgroundColor: COLOR.WHITE,
    width: LOCATION_ICON_SIZE,
    height: LOCATION_ICON_SIZE,
    borderRadius: LOCATION_ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLOR.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  locationIconButton: {
    marginBottom: 0,
  },
  icon: {
    color: COLOR.DARK_GRAY,
  },
  transparent: {
    opacity: 0,
  },
})

const getCluster = geomItems => {
  const middleGeoJsonPoints = map(geomItems, 'marker.geomJsonPoint')
  if (isEmpty(middleGeoJsonPoints)) {
    return null
  }
  const cluster = supercluster({
    radius: 40,
    maxZoom: ZOOM_LEVEL.MAX,
  })
  cluster.load(middleGeoJsonPoints)
  return cluster
}


class Map extends Component {
  constructor(props) {
    super(props)
    this.mapViewRef = null
    this.interactableRef = null
    this.state = {
      selectedGeomItem: null,
      isOpen: true,
      shouldIconsAtBottom: true,
      zoomLevel: ZOOM_LEVEL.INIT,
    }
    this.calculateMapValues(this.props.workItems)
    this.initPanResponder()
    this.prevTouchInfo = {
      touchX: 0,
      touchY: 0,
      touchTimeStamp: 0,
    }
    this.firstLayout = true
  }

  componentWillReceiveProps(nextProps) {
    const { listVisibility, workItems } = this.props
    if (nextProps.listVisibility !== listVisibility && nextProps.listVisibility) {
      this.setState({
        selectedGeomItem: null,
        shouldIconsAtBottom: false,
      })
    }

    if (!isEqual(workItems, nextProps.workItems)) {
      this.calculateMapValues(nextProps.workItems)
      this.showAllCoordinates(this.coordinates)

      if (!isEmpty(this.selectedGeomOrWorkItem)) {
        this.resetSelect()
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedGeomItem } = this.state
    const { selectedWorkItem } = this.props
    const selected = this.selectedGeomOrWorkItem
    if (isEmpty(selected)) return

    if (!isEqual(prevProps.selectedWorkItem, selectedWorkItem) ||
      !isEqual(prevState.selectedGeomItem, selectedGeomItem)) {
      this.mapViewRef.animateToCoordinate(selected.marker.coordinates)
    }
  }

  onChangeRegionComplete = region => {
    if (isEqual(region, this.state.region)) return
    this.setState({ region })
  }

  get selectedGeomOrWorkItem() {
    const { selectedWorkItem } = this.props
    if (isEmpty(selectedWorkItem)) return this.state.selectedGeomItem
    return this.transformSelectedWorkItemToGeomItem(selectedWorkItem)
  }

  getZoomLevel(region = this.state.region, decimal = 0) {
    const angle = region.longitudeDelta
    return round((Math.log(360 / angle) / Math.LN2), decimal)
  }

  getPolylineProperties = geomItem => ({
    lineCap: 'square',
    lineJoin: 'round',
    strokeWidth: MAP_LINE_WIDTH,
    strokeColor: isGeomItemSelected(this.selectedGeomOrWorkItem, geomItem) ?
      MAP_COLOR.STROKE_ACTIVE : MAP_COLOR.STROKE,
    onPress: event =>
      this.handlePressPolyline(event, { ...geomItem, type: MAP_POINT_TYPE.NETWORK_ELEMENT }),
  })

  getGeomItemMaker(cluster, element) {
    const geomItems = this.geomItems
    if (isEmpty(element.properties.id)) {
      const geomJsonElements = cluster.getLeaves(element.properties.cluster_id)
      const geomItemIds = map(geomJsonElements, 'properties.id')
      return getClusterGeomItem(element, geomItems, geomItemIds)
    }
    const geomItem = find(geomItems, ({ id }) => id === element.properties.id)
    if (isEmpty(geomItem)) {
      return null
    }
    return { ...geomItem, type: MAP_POINT_TYPE.NETWORK_ELEMENT }
  }

  transformSelectedWorkItemToGeomItem = workItem => {
    const networkElementId = get(workItem, 'network_element.id')
    if (isEmpty(networkElementId)) return null
    const selectedGeomWorkItem = find(this.geomItems, geomItem => geomItem.id === networkElementId)
    if (isEmpty(selectedGeomWorkItem)) return null
    return {
      ...selectedGeomWorkItem,
      workItems: [workItem],
    }
  }

  calculateMapValues = workItems => {
    this.geomItems = getGeomItems(workItems)
    this.groupedgeomItems = groupBy(this.geomItems, 'geomJsonType')
    this.coordinates = getAllCoordinates(this.geomItems)
    this.cluster = getCluster(this.geomItems)
  }

  initPanResponder() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderRelease: () => {
        this.handleGesture(this.preRegion, this.mapViewRef.__lastRegion) //eslint-disable-line
      },
      onShouldBlockNativeResponder: () => false,
    })
  }
  createPressHandler = func => (event, geomItem, isSelected = false) => {
    event.stopPropagation()
    if (!this.props.isPointPressable || isSelected) {
      return
    }
    this.props.setSelectedWorkItem()
    this.setState({
      shouldIconsAtBottom: false,
    })
    this.disableListVisibility()
    this.snapToIndex(SNAP_POSITION_INDEX.MIDDLE)
    func(event, geomItem)
    if (!IS_ANDROID) {
      LayoutAnimation.configureNext(SHOW_WORKITEM_DETAIL_ANIMA)
    }
  }

  disableListVisibility() {
    if (this.props.listVisibility) {
      this.props.setListVisibility(false)
    }
  }

  resetSelect() {
    this.setState({ selectedGeomItem: null, shouldIconsAtBottom: true })
    this.props.setSelectedWorkItem()
  }

  snapToIndex = index => {
    this.interactableRef.snapToIndex(index)
  }

  handlePressLocationIcon = coordinates => {
    const selectedGeomOrWorkItem = this.selectedGeomOrWorkItem
    if (isEmpty(selectedGeomOrWorkItem)) {
      this.showAllCoordinates([...coordinates, this.props.myLocation])
    } else {
      const markerCoordinate = selectedGeomOrWorkItem.marker.coordinates
      this.showAllCoordinates([markerCoordinate, this.props.myLocation])
    }
    this.snapToIndex(SNAP_POSITION_INDEX.BOTTOM)
  }

  handlePressPoint = this.createPressHandler((event, geomItem) => {
    this.setState({
      selectedGeomItem: geomItem,
      isOpen: true,
    })
  })

  handlePressPolyline = this.createPressHandler((event, geomItem) => {
    this.setState({
      selectedGeomItem: geomItem,
      isOpen: false,
    })
    setTimeout(() => { this.setState({ isOpen: true }) }, 0)
  })

  distance = (x0, y0, x1, y1) => (
    Math.sqrt(Math.pow((x1 - x0), 2) + Math.pow((y1 - y0), 2))
  )

  isDoubleTap = (currentTouchTimeStamp, { x0, y0 }) => {
    const { touchX, touchY, touchTimeStamp } = this.prevTouchInfo
    const { TIME_DELAY, RADIUS } = DOUBLE_TAP_OPTION
    const dt = currentTouchTimeStamp - touchTimeStamp
    return dt < TIME_DELAY && this.distance(touchX, touchY, x0, y0) < RADIUS
  }

  handlePanResponderGrant = (event, gestureState) => {
    this.preRegion = { ...this.state.region }
    if (IS_IOS) return

    const currentTouchTimeStamp = Date.now()
    if (this.isDoubleTap(currentTouchTimeStamp, gestureState)) {
      this.resetSelect()
    }

    this.prevTouchInfo = {
      touchX: gestureState.x0,
      touchY: gestureState.y0,
      touchTimeStamp: currentTouchTimeStamp,
    }
  }

  handleGesture = (preRegion, region) => {
    if ((!isEmpty(this.props.selectedWorkItem) || !isEmpty(this.state.selectedGeomItem))
      && this.getZoomLevel(preRegion, 2) !== this.getZoomLevel(region, 2)
    ) {
      this.resetSelect()
    }
  }

  clearMap = () => {
    const { isOpen } = this.state
    if (!isOpen) {
      return
    }
    this.interactableRef.snapToIndex(SNAP_POSITION_INDEX.BOTTOM)
    this.resetSelect()
    this.disableListVisibility()
  }

  showAllCoordinates = coordinates => {
    if (isEmpty(coordinates)) {
      return
    }

    this.setState({ zoomLevel: ZOOM_LEVEL.INIT })
    this.mapViewRef.fitToCoordinates(
      filter(coordinates, isCoordinateNotEmpty), FIT_TO_COORDINATES_OPTIONS)
    setTimeout(() => this.setState({ zoomLevel: ZOOM_LEVEL.MAX }), 500)
  }

  prepareImages() {  // eslint-disable-line
    if (IS_IOS) return null
    return (
      <View style={{ width: 0, height: 0 }}>
        <Image source={groupPinNormal} style={styles.transparent} />
        <Image source={groupPinSelect} style={styles.transparent} />
        <Image source={workItemPinNormal} style={styles.transparent} />
        <Image source={workItemPinSelect} style={styles.transparent} />
      </View>
    )
  }

  handleWorkItemCellPress = item => {
    this.props.setSelectedWorkItem(item)
    this.snapToIndex(SNAP_POSITION_INDEX.MIDDLE)
  }

  renderPoints() {
    return map(this.groupedgeomItems[GEO_JSON_TYPE.POINT],
      geomItem => (
        <MapView.Marker
          key={geomItem.id}
          coordinate={geomItem.coordinates}
          image={isGeomItemSelected(this.state.selectedGeomItem, geomItem) ?
            selectedPoint : point}
          onPress={event =>
            this.handlePressPoint(event, { ...geomItem, type: MAP_POINT_TYPE.NETWORK_ELEMENT })}
        />
    ))
  }

  renderPolylines() {
    return map(this.groupedgeomItems[GEO_JSON_TYPE.LINE_STRING],
      geomItem => (
        <MapView.Polyline
          key={geomItem.id}
          coordinates={geomItem.coordinates}
          {...this.getPolylineProperties(geomItem)}
        />),
    )
  }

  renderMultiPolylines() {
    return map(this.groupedgeomItems[GEO_JSON_TYPE.MULTI_LINE_STRING],
      geomItem => (map(geomItem.coordinates, (lineCoordinates, index) => (
        <MapView.Polyline
          key={`${geomItem.id}_${index}`}
          coordinates={lineCoordinates}
          {...this.getPolylineProperties(geomItem)}
        />
      ))),
    )
  }

  renderIcons = coordinates => {
    const animatedStyle = this.state.shouldIconsAtBottom ?
      { bottom: new Animated.Value(MAP_ICONS_MARGIN_BOTTOM) } :
      this.interactableRef && this.interactableRef.getAnimatedStyle()
    return (
      <Animated.View style={[styles.iconsWrapper, animatedStyle]}>
        { !this.props.isReportEntrance &&
        <Button
          onPress={this.props.refreshWorkItems}
          style={styles.iconButton}
          activeOpacity={OPACITY.NORMAL}
        >
          <Icon name="refresh" style={[styles.icon, { fontSize: 19 }]} />
        </Button>
        }
        <Button
          onPress={() => this.handlePressLocationIcon(coordinates)}
          style={[styles.iconButton, styles.locationIconButton]}
          activeOpacity={OPACITY.NORMAL}
        >
          <Icon name="location" style={[styles.icon, { fontSize: 20 }]} />
        </Button>
      </Animated.View>
    )
  }

  renderMarkersForRegion() {
    const cluster = this.cluster
    const { region } = this.state
    const padding = 0.5
    if (!cluster || !region) {
      return null
    }
    let markers = []
    try {
      markers = cluster.getClusters([
        region.longitude - (region.longitudeDelta * padding),
        region.latitude - (region.latitudeDelta * padding),
        region.longitude + (region.longitudeDelta * padding),
        region.latitude + (region.latitudeDelta * padding),
      ], this.getZoomLevel())
    } catch (err) {
      console.log('renderMarkersForRegion err:', err) //eslint-disable-line
      return null
    }
    return chain(markers)
      .map(marker => this.getGeomItemMaker(cluster, marker))
      .without(null)
      .map(geoItem => (
        <MapMarker
          key={geoItem.id}
          selected={this.selectedGeomOrWorkItem}
          geoItem={geoItem}
          pressPoint={this.handlePressPoint}
        />
      ))
      .value()
  }

  renderInteractiveView() {
    const { selectedGeomItem } = this.state
    const {
      rowId, onChangeRowId, workItems, listVisibility, selectedWorkItem,
      setSelectedWorkItem, isReportEntrance,
    } = this.props
    const selectedWorkItems = get(selectedGeomItem, 'workItems', [])
    const mapWorkItems = listVisibility ? workItems : selectedWorkItems

    return (
      <InteractableWorkItems
        ref={ref => {
          this.interactableRef = ref
          this.props.mapInteractableRef(ref)
        }}
        workItems={mapWorkItems}
        selectedWorkItem={selectedWorkItem}
        onChangeRowId={onChangeRowId}
        rowId={rowId}
        listVisibility={listVisibility}
        onClose={isEmpty(selectedWorkItem) ? this.clearMap : () => setSelectedWorkItem()}
        onWorkItemCellPress={this.handleWorkItemCellPress}
        isReportEntrance={isReportEntrance}
      />
    )
  }

  render() {
    const coordinates = this.coordinates

    return (
      <View style={styles.container}>
        {this.prepareImages()}
        <MapView
          {...this.panResponder.panHandlers}
          style={styles.map}
          ref={ref => {
            this.mapViewRef = ref
            this.props.mapRef(ref)
          }}
          onLayout={() => {
            if (this.firstLayout) {
              this.showAllCoordinates(coordinates)
              this.firstLayout = false
            }
          }}
          showsUserLocation
          onPress={this.clearMap}
          moveOnMarkerPress={false}
          onRegionChangeComplete={this.onChangeRegionComplete}
          showsMyLocationButton={false}
          maxZoomLevel={this.state.zoomLevel}
        >
          {this.renderMultiPolylines()}
          {this.renderPolylines()}
          {this.renderPoints()}
          {this.renderMarkersForRegion()}
        </MapView>
        { this.renderIcons(coordinates) }
        { this.renderInteractiveView() }
      </View>
    )
  }
}

Map.propTypes = {
  workItems: PropTypes.arrayOf(WorkItemShape),
  selectedWorkItem: WorkItemShape,
  isPointPressable: PropTypes.bool,
  myLocation: CoordinateShape,
  onChangeRowId: PropTypes.func,
  rowId: PropTypes.number,
  listVisibility: PropTypes.bool,
  setListVisibility: PropTypes.func,
  refreshWorkItems: PropTypes.func,
  setSelectedWorkItem: PropTypes.func,
  isReportEntrance: PropTypes.bool,
  mapInteractableRef: PropTypes.func,
  mapRef: PropTypes.func,
}

Map.defaultProps = {
  workItems: [],
  selectedWorkItem: null,
  isPointPressable: true,
  myLocation: null,
  onChangeRowId: noop,
  rowId: null,
  listVisibility: false,
  setListVisibility: noop,
  refreshWorkItems: noop,
  setSelectedWorkItem: noop,
  isReportEntrance: false,
  mapInteractableRef: noop,
  mapRef: noop,
}

export default mapBase(Map)
