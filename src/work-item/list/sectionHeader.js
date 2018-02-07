import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'
import { COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLOR.DARK_WHITE,
    borderColor: COLOR.DIVIDER_GREY,
    paddingLeft: 9,
    paddingRight: 14,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  text: {
    lineHeight: 18,
    paddingVertical: 3,
  },
  title: {
    flex: 1,
    fontSize: FONT.SM,
    fontWeight: FONT_WEIGHT.BOLD,
    paddingRight: 10,
    color: COLOR.FADE_BLUE,
  },
  date: {
    fontSize: FONT.XS,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLOR.MEDIUM_GREY,
  },
})

const SectionHeader = ({ title, date }) => (
  <View style={styles.container}>
    <Text style={[styles.text, styles.title]} numberOfLines={1}>{title}</Text>
    {date && <Text style={[styles.text, styles.date]}>{`Due by ${date}`}</Text>}
  </View>
)

SectionHeader.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string,
}

SectionHeader.defaultProps = {
  title: '',
  date: null,
}

export default SectionHeader
