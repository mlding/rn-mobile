import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'

export const SPACE_LINE_HEIGHT = 15

export const BottomPlaceholder = ({ height }) => (
  <View style={{ height: SPACE_LINE_HEIGHT + height }} />
)

BottomPlaceholder.propTypes = {
  height: PropTypes.number,
}

BottomPlaceholder.defaultProps = {
  height: 0,
}
