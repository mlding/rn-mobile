import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'
import Icon from '../../components/icon'
import { COLOR, FONT } from '../../constants/styleGuide'
import { WindowHeight, NavBarHeight } from '../../utilities/responsiveDimension'

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

const Empty = ({ label }) => (
  <View style={styles.container}>
    <Icon
      name="blank"
      style={styles.icon}
    />
    <Text style={styles.text}>{label}</Text>
  </View>
)

Empty.propTypes = {
  label: PropTypes.string.isRequired,
}

export default Empty
