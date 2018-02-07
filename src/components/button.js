import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import { noop } from 'lodash'
import { OPACITY } from '../constants/styleGuide'
import { StyleShape } from '../shared/shape'

class Button extends Component {
  debouncePress = onPress => {
    const clickTime = Date.now()
    if (!this.lastClickTime ||
      Math.abs(this.lastClickTime - clickTime) > this.props.debounceMillisecond) {
      this.lastClickTime = clickTime
      onPress()
    }
  }

  render() {
    const { activeOpacity, onPress, style, disabled, children } = this.props
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={style}
        onPress={() => this.debouncePress(onPress)}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    )
  }
}

Button.propTypes = {
  activeOpacity: PropTypes.number,
  onPress: PropTypes.func,
  style: StyleShape,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  debounceMillisecond: PropTypes.number,
}

Button.defaultProps = {
  activeOpacity: OPACITY.ACTIVE,
  onPress: noop,
  style: null,
  children: null,
  disabled: false,
  debounceMillisecond: 1000,
}

export default Button
