import React from 'react'
import { View, StyleSheet } from 'react-native'
import { COLOR } from '../constants/styleGuide'

export const SEPARATOR_HEIGHT = 5

const styles = StyleSheet.create({
  separator: {
    height: SEPARATOR_HEIGHT,
  },
  greySeparator: {
    height: SEPARATOR_HEIGHT,
    backgroundColor: COLOR.DARK_WHITE,
  },
  listSeparator: {
    height: 1,
    backgroundColor: COLOR.DIVIDER_GREY,
  },
})

const Separator = () => <View style={styles.separator} />

export const GreySeparator = () => <View style={styles.greySeparator} />

export const ListSeparator = () => <View style={styles.listSeparator} />

export default Separator
