import React from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import { COLOR, INTERACTABLE_MARGIN, Z_INDEX } from '../constants/styleGuide'
import { scale, verticalScale } from '../utilities/responsiveDimension'

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: scale(75),
    height: verticalScale(60),
    borderRadius: scale(8),
    opacity: 0.7,
    left: (Screen.width - scale(75)) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: Z_INDEX.MAX,
    backgroundColor: COLOR.DARK_GRAY,
  },
})

const MapLoading = props => {
  const top = ((Screen.height - verticalScale(60)) / 2)
    - (props.isReportMap ? INTERACTABLE_MARGIN : 0)
  return (
    <View style={[styles.container, { top: top }]}>
      <ActivityIndicator
        animating
        color={COLOR.WHITE}
        size="small"
      />
    </View>
  )
}

MapLoading.propTypes = {
  isReportMap: PropTypes.bool,
}

MapLoading.defaultProps = {
  isReportMap: false,
}

export default MapLoading
