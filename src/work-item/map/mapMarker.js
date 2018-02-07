import React, { Component } from 'react'
import { noop, get, isEmpty } from 'lodash'
import { Text, StyleSheet, ImageBackground, View } from 'react-native'
import MapView from 'react-native-maps'
import PropTypes from 'prop-types'
import groupPinNormal from '../../assets/images/group-pin-normal.png' // eslint-disable-line
import groupPinSelect from '../../assets/images/group-pin-select.png' // eslint-disable-line
import workItemPinNormal from '../../assets/images/workitem-pin-normal.png' // eslint-disable-line
import workItemPinSelect from '../../assets/images/workitem-pin-select.png' // eslint-disable-line
import { MapItemShape } from '../../shared/shape'
import { COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import { IS_ANDROID } from '../../utilities/systemUtil'
import { getShowText } from '../../utilities/dataProcessUtils'
import { isGeomItemSelected } from '../../utilities/mapUtil'
import { scale, verticalScale } from '../../utilities/responsiveDimension'

const GROUPED_PIN_WIDTH = 38
const GROUPED_PIN_HEIGHT = 40
const WORKITEM_PIN_WIDTH = 44
const WORKITEM_PIN_HEIGHT = 35
const ARROW_MARKER_DISTANCE = 6
const GROUPED_Y_OFFSET = -(verticalScale(GROUPED_PIN_HEIGHT / 2 + ARROW_MARKER_DISTANCE)) // eslint-disable-line
const WORKITEM_Y_OFFSET = -(verticalScale(WORKITEM_PIN_HEIGHT / 2 + ARROW_MARKER_DISTANCE)) // eslint-disable-line

const getImageSize = (width, height) => ({
  width: scale(width),
  height: verticalScale(height),
})

const getImageStyle = isGrouped => (
  isGrouped ? getImageSize(GROUPED_PIN_WIDTH, GROUPED_PIN_HEIGHT)
  : getImageSize(WORKITEM_PIN_WIDTH, WORKITEM_PIN_HEIGHT)
)

const styles = StyleSheet.create({
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: {
    textAlign: 'center',
    color: COLOR.WHITE,
    marginTop: -5,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

const pinImageSource = (isSelected, isGrouped) => {
  if (isSelected && isGrouped) return groupPinSelect
  if (isSelected && !isGrouped) return workItemPinSelect
  if (!isSelected && !isGrouped) return workItemPinNormal
  return groupPinNormal
}

class MapMarker extends Component {
  getKey = (isSelected, id) => {
    if (IS_ANDROID) {
      return isSelected ? `selected_marker_${id}` : `marker_${id}`
    }
    return `marker_${id}`
  }

  renderMarkerText = workItems => {
    const workItemsLength = workItems.length
    if (workItemsLength > 1) {
      return (<Text style={[styles.code, { fontSize: FONT.LG }]}>{workItemsLength}</Text>)
    }
    return (<Text style={[styles.code, { fontSize: FONT.MD }]}>
      {getShowText(workItems[0].activity_code)}
    </Text>)
  }

  render() {
    const { pressPoint, geoItem, selected } = this.props
    const isSelected = isGeomItemSelected(selected, geoItem)
    const key = this.getKey(isSelected, geoItem.id)

    const workItems = isSelected ? get(selected, 'workItems') : get(geoItem, 'workItems')
    if (isEmpty(workItems)) {
      return <View key={key} />
    }

    const isGrouped = workItems.length > 1

    const markerCommonProperties = {
      coordinate: geoItem.marker.coordinates,
      onPress: event => pressPoint(event, geoItem, isSelected),
    }
    const offset = IS_ANDROID
      ? { anchor: { x: 0.5, y: 1.2 } }
      : { centerOffset: { x: 0, y: isGrouped ? GROUPED_Y_OFFSET : WORKITEM_Y_OFFSET } }

    return (
      <MapView.Marker
        key={key}
        {...markerCommonProperties}
        {...offset}
      >
        <ImageBackground
          style={[styles.pin, getImageStyle(isGrouped)]}
          source={pinImageSource(isSelected, isGrouped)}
          onLoad={IS_ANDROID ? () => { this.forceUpdate() } : noop}
        >
          {this.renderMarkerText(workItems)}
        </ImageBackground>
      </MapView.Marker>
    )
  }
}

MapMarker.propTypes = {
  pressPoint: PropTypes.func,
  selected: MapItemShape,
  geoItem: MapItemShape,
}

MapMarker.defaultProps = {
  selected: null,
  geoItem: null,
  pressPoint: noop,
}

export default MapMarker
