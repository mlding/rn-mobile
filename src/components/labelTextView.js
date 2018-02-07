import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { COLOR, FONT } from '../constants/styleGuide'
import { StyleShape } from '../shared/shape'

const styles = StyleSheet.create({
  fieldWrapper: {
    marginTop: 15,
    marginBottom: 4,
  },
  label: {
    fontSize: FONT.MD,
    color: COLOR.SILVER,
  },
  field: {
    fontSize: FONT.LG,
    color: COLOR.MEDIUM_BLACK,
    paddingTop: 12,
  },
})

const LabelTextView = ({ label, value, containerStyle }) => (
  <View style={containerStyle}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.field}>{value}</Text>
  </View>
)

LabelTextView.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  containerStyle: StyleShape,
}

LabelTextView.defaultProps = {
  containerStyle: styles.fieldWrapper,
}

export default LabelTextView
