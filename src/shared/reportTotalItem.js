import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { TOTAL_ITEM_HEIGHT, COLOR, FONT, FONT_WEIGHT, SHADOW_STYLE } from '../constants/styleGuide'

const styles = StyleSheet.create({
  totalItems: {
    height: TOTAL_ITEM_HEIGHT,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOW_STYLE,
    backgroundColor: COLOR.DARK_WHITE,
    borderColor: COLOR.BORDER,
    borderTopWidth: 1,
  },
  items: {
    fontSize: FONT.LG,
    fontWeight: FONT_WEIGHT.LIGHT,
  },
  total: {
    fontSize: FONT.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

const ReportTotalItem = ({ itemsCount, totalText }) => (
  <View style={[styles.totalItems]}>
    <Text style={styles.items}>{itemsCount} Items</Text>
    <Text style={styles.total}>Total {totalText}</Text>
  </View>
)

ReportTotalItem.propTypes = {
  itemsCount: PropTypes.number,
  totalText: PropTypes.string,
}

ReportTotalItem.defaultProps = {
  itemsCount: 0,
  totalText: '',
}

export default ReportTotalItem
