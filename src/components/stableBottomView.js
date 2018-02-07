import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { IS_ANDROID } from '../utilities/systemUtil'
import { NavBarHeightOrigin, statusBarHeight, WindowHeight } from '../utilities/responsiveDimension'
import { StyleShape } from '../shared/shape'

const bottomButtonStyles = {
  position: 'absolute',
  left: 0,
  right: 0,
}

const getBottomButtonStyle = (buttonHeight, hasNavBar) => (IS_ANDROID ?
{ ...bottomButtonStyles,
  height: buttonHeight,
  marginTop: WindowHeight() - statusBarHeight -
    (hasNavBar ? NavBarHeightOrigin : 0) - buttonHeight } :
{ ...bottomButtonStyles,
  height: buttonHeight,
  bottom: 0 })

export const StableBottomView = props => ( //eslint-disable-line
  <View
    style={[getBottomButtonStyle(props.height, props.hasNavBar), props.style]}
  >
    {props.children}
  </View>
)

StableBottomView.propTypes = {
  height: PropTypes.number.isRequired,
  children: PropTypes.node,
  hasNavBar: PropTypes.bool,
  style: StyleShape,
}


StableBottomView.defaultProps = {
  hasNavBar: true,
  style: null,
  children: null,
}
