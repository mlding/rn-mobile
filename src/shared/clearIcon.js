import React from 'react'
import { StyleSheet } from 'react-native'
import { noop } from 'lodash'
import PropTypes from 'prop-types'
import Icon from '../components/icon'
import { COLOR, FONT } from '../constants/styleGuide'
import Button from '../components/button'
import { StyleShape } from './shape'

const styles = StyleSheet.create({
  clearButton: {
    position: 'absolute',
    right: 0,
    padding: 15,
  },
  clearIcon: {
    fontSize: FONT.MD,
    color: COLOR.SILVER,
  },
})

const ClearIcon = props => (
  <Button
    onPress={props.onPress}
    style={[styles.clearButton, props.style]}
  >
    <Icon name="close-icon" style={styles.clearIcon} />
  </Button>
)

ClearIcon.propTypes = {
  style: StyleShape,
  onPress: PropTypes.func,
}

ClearIcon.defaultProps = {
  style: null,
  onPress: noop,
}


export default ClearIcon
