import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native'
import MapView from 'react-native-maps'
import { get, noop, filter, isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import mapBase from '../../components/mapBase'
import { CoordinateShape, MapPickerLocationShape } from '../../shared/shape'
import { isCoordinateNotEmpty } from '../../utilities/mapUtil'
import { DEFAULT_COORDINATE, FIT_TO_COORDINATES_OPTIONS, ZOOM_LEVEL } from '../../constants/map'
import { getGeoAddress } from '../../api/geocode'
import { COLOR, FONT, FONT_WEIGHT, SHADOW_STYLE } from '../../constants/styleGuide'
import LabelTextView from '../../components/labelTextView'
import { locationSelector } from '../selector'
import { setLocationEntrance, updateLocation } from '../actions'
import { ADDRESS_NOT_RETRIEVED, DEFAULT_LOCATION, DEFAULT_LOCATION_ENTRANCE, LOCATION_ENTRANCE } from '../constants'
import locationIcon from '../../assets/images/location.png' // eslint-disable-line

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  addressContainer: {
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: COLOR.WHITE,
    shadowColor: COLOR.BLACK,
    ...SHADOW_STYLE,
  },
  reminderContainer: {
    position: 'absolute',
    left: 88,
    right: 88,
    top: 15,
    backgroundColor: COLOR.YELLOW,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 2,
    ...SHADOW_STYLE,
  },
  reminderText: {
    color: COLOR.WHITE,
    fontSize: FONT.M,
    fontWeight: FONT_WEIGHT.BOLD,
    textAlign: 'center',
    lineHeight: 22,
  },
})

class MapPicker extends PureComponent {
  constructor(props) {
    super(props)
    this.mapRef = null
    this.state = {
      firstFitToCoordinates: true,
      shouldShowReminder: true,
      maxZoomLevel: ZOOM_LEVEL.INIT,
    }
  }

  componentDidMount() {
    const { coordinate, address, locationEntrance, readonly } = this.props
    this.props.setLocationEntrance(readonly ? LOCATION_ENTRANCE.VIEW_MAP : locationEntrance)
    this.props.updateLocation({ coordinate: coordinate, address: address, inProgress: true })
  }

  componentWillReceiveProps() {
    this.fitToCoordinates()
  }

  updateAddress = coordinate => {
    this.props.updateLocation({ inProgress: true })
    getGeoAddress(coordinate)
      .then(response => {
        this.props.updateLocation({
          address: get(response, 'results[0].formatted_address'),
          inProgress: false,
        })
      }).catch(error => {
        this.props.updateLocation({
          address: ADDRESS_NOT_RETRIEVED,
          inProgress: false,
        })
        console.log('error: could not get address from coordinate', coordinate, error) // eslint-disable-line
      })
  }

  fitToCoordinates = () => {
    const { myLocation, location, isMyLocationLoaded } = this.props
    const coordinates = filter([myLocation, location.coordinate], isCoordinateNotEmpty)
    if (!isEmpty(coordinates) && this.state.firstFitToCoordinates && isMyLocationLoaded) {
      this.mapRef.fitToCoordinates(coordinates, FIT_TO_COORDINATES_OPTIONS)
      this.setState({
        firstFitToCoordinates: false,
        maxZoomLevel: ZOOM_LEVEL.MAX,
      })
    }
  }

  handlePress = event => {
    const { readonly } = this.props
    if (readonly) return
    const coordinate = event.nativeEvent.coordinate
    this.props.updateLocation({ coordinate })
    this.updateAddress(coordinate)
    this.setState({
      shouldShowReminder: false,
    })
  }

  renderMarker() {
    const { coordinate } = this.props.location
    if (!isCoordinateNotEmpty(coordinate)) return null
    return (
      <MapView.Marker
        coordinate={coordinate}
        image={locationIcon}
      />
    )
  }

  renderReminder() {
    if (this.props.readonly || !this.state.shouldShowReminder) return null
    return (
      <View style={styles.reminderContainer}>
        <Text style={styles.reminderText}>Please click on the map to choose location</Text>
      </View>
    )
  }

  renderAddress() {
    const { address } = this.props.location
    if (!address) return null
    return (
      <LabelTextView label="Location" value={address} containerStyle={styles.addressContainer} />
    )
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <MapView
          ref={ref => { this.mapRef = ref }}
          style={styles.mapView}
          showsUserLocation
          onLayout={this.fitToCoordinates}
          onPress={this.handlePress}
          maxZoomLevel={this.state.maxZoomLevel}
        >
          {this.renderMarker()}
        </MapView>
        {this.renderReminder()}
        {this.renderAddress()}
      </View>
    )
  }
}

MapPicker.propTypes = {
  readonly: PropTypes.bool,
  myLocation: CoordinateShape,
  coordinate: CoordinateShape,
  address: PropTypes.string,
  location: MapPickerLocationShape,
  locationEntrance: PropTypes.string,
  isMyLocationLoaded: PropTypes.bool,
  updateLocation: PropTypes.func,
  setLocationEntrance: PropTypes.func,
}

MapPicker.defaultProps = {
  readonly: false,
  myLocation: DEFAULT_COORDINATE,
  coordinate: DEFAULT_COORDINATE,
  address: '',
  location: DEFAULT_LOCATION,
  locationEntrance: DEFAULT_LOCATION_ENTRANCE,
  isMyLocationLoaded: false,
  updateLocation: noop,
  setLocationEntrance: noop,
}

export default connect(
  createStructuredSelector({ location: locationSelector }),
  { updateLocation, setLocationEntrance },
)(mapBase(MapPicker))
