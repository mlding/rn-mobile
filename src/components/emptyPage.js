import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'
import Icon from './icon'
import { COLOR, FONT } from '../constants/styleGuide'
import { WindowHeight, NavBarHeight } from '../utilities/responsiveDimension'
import { StyleShape } from '../shared/shape'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: WindowHeight() - NavBarHeight,
  },

  icon: {
    marginBottom: 25,
    fontSize: 58,
    color: COLOR.SILVER,
  },
  text: {
    fontSize: FONT.LG,
    color: COLOR.SILVER,
    lineHeight: 22,
  },
})

const EmptyPage = ({ label, style }) => (
  <View style={[styles.container, style]}>
    <Icon
      name="no-result"
      style={styles.icon}
    />
    <Text style={styles.text}>{`No ${label}`}.</Text>
  </View>
)

EmptyPage.propTypes = {
  label: PropTypes.string,
  style: StyleShape,
}

EmptyPage.defaultProps = {
  label: 'Result',
  style: null,
}

export default EmptyPage
