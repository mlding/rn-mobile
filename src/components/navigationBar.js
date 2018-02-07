import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { COLOR } from '../constants/styleGuide'
import { NavBarHeightOrigin, statusBarHeight } from '../utilities/responsiveDimension'
import { IS_IOS } from '../utilities/systemUtil'
import BackButton from '../shared/backButton'
import { StyleShape } from '../shared/shape'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.HEADER,
    height: NavBarHeightOrigin,
    paddingTop: IS_IOS ? statusBarHeight : 0,
  },
})

const NavigationBar = props => (
  <View style={[styles.container, props.style]} >
    {props.hasBackButton && <BackButton />}
    {props.children}
  </View>
  )

NavigationBar.propTypes = {
  children: PropTypes.node,
  style: StyleShape,
  hasBackButton: PropTypes.bool,
}

NavigationBar.defaultProps = {
  children: null,
  style: null,
  hasBackButton: false,
}

export default NavigationBar
