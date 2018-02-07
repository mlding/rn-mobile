import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet } from 'react-native'
import { COLOR, FONT, FONT_WEIGHT } from '../constants/styleGuide'
import { getShowText } from '../utilities/dataProcessUtils'

const styles = StyleSheet.create({
  roundAvator: {
    marginHorizontal: 10,
    marginTop: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLOR.LINK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatorText: {
    backgroundColor: COLOR.TRANSPARENT,
    fontSize: FONT.MD,
    color: COLOR.WHITE,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

const RoundAvator = ({ activityCode }) => (
  <View style={styles.roundAvator}>
    <Text style={styles.avatorText}>{getShowText(activityCode)}</Text>
  </View>
)

RoundAvator.propTypes = {
  activityCode: PropTypes.string,
}

RoundAvator.defaultProps = {
  activityCode: '--',
}

export default RoundAvator
