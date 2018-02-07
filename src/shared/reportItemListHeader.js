import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { FONT, COLOR, FONT_WEIGHT } from '../constants/styleGuide'

const styles = StyleSheet.create({
  itemsTextWrapper: {
    paddingHorizontal: 15,
    height: 38,
    justifyContent: 'center',
  },
  itemsText: {
    fontSize: FONT.MD,
    color: COLOR.STEEL_GREY,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

const ReportItemListHeader = ({ count, text }) => {
  if (count === 0) return null
  return (
    <View
      style={styles.itemsTextWrapper}
    >
      <Text style={styles.itemsText}>
        {text}
      </Text>
    </View>
  )
}

ReportItemListHeader.propTypes = {
  count: PropTypes.number,
  text: PropTypes.string,
}

ReportItemListHeader.defaultProps = {
  count: 0,
  text: 'Items',
}
export default ReportItemListHeader
