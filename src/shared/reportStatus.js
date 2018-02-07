import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { capitalize, findKey } from 'lodash'
import { COLOR, FONT, FONT_WEIGHT, STATUS_COLOR } from '../constants/styleGuide'
import STATUS from '../constants/status'

const styles = StyleSheet.create({
  statusText: {
    fontSize: FONT.SM,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLOR.WHITE,
    lineHeight: 14,
  },
  statusContainer: {
    height: 17,
    paddingHorizontal: 4,
    paddingTop: 1,
    borderRadius: 2,
  },
})

const getBackgroundColor = status => {
  const key = findKey(STATUS, it => it.toLowerCase() === status.toLowerCase())
  return STATUS_COLOR[key]
}

const ReportStatus = ({ status }) => (
  <View style={[styles.statusContainer, { backgroundColor: getBackgroundColor(status) }]}>
    <Text style={styles.statusText}>{ capitalize(status) }</Text>
  </View>
)

ReportStatus.propTypes = {
  status: PropTypes.string,
}

ReportStatus.defaultProps = {
  status: STATUS.DRAFT,
}

export default ReportStatus
