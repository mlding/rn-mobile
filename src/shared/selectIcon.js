import React from 'react'
import { Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import selectGreyIcon from '../assets/images/select-grey.png' //eslint-disable-line
import selectGreenIcon from '../assets/images/select-green.png' //eslint-disable-line
import { StyleShape } from './shape'

const styles = StyleSheet.create({
  image: {
    width: 20,
    height: 20,
  },
})

const SelectIcon = ({ selected, style }) => (
  <Image
    source={selected ? selectGreenIcon : selectGreyIcon}
    style={[styles.image, style]}
  />
)

SelectIcon.propTypes = {
  selected: PropTypes.bool,
  style: StyleShape,
}

SelectIcon.defaultProps = {
  selected: false,
  style: null,
}

export default SelectIcon
