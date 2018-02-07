import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import { BOTTOM_BUTTON_HEIGHT, COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import Button from '../../components/button'
import { StyleShape } from '../../shared/shape'

export const REPORT_BUTTON_HEIGHT = BOTTOM_BUTTON_HEIGHT

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLOR.BORDER_GREY,
    backgroundColor: COLOR.DARK_WHITE,
  },
  flagView: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    height: REPORT_BUTTON_HEIGHT,
    backgroundColor: COLOR.WHITE,
  },
  flagText: {
    color: COLOR.FLAGGED,
    fontSize: FONT.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  approveView: {
    flex: 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    height: REPORT_BUTTON_HEIGHT,
    backgroundColor: COLOR.APPROVED,
  },
  approveText: {
    color: COLOR.WHITE,
    fontSize: FONT.LG,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

const ReportButtonGroup = ({ flagOnPress, approveOnPress, style }) => (
  <View style={[styles.container, style]}>
    <Button
      onPress={flagOnPress}
      style={styles.flagView}
    >
      <Text style={styles.flagText}>Flag</Text>
    </Button>

    <Button
      onPress={approveOnPress}
      style={styles.approveView}
    >
      <Text style={styles.approveText}>Approve</Text>
    </Button>
  </View>
)

ReportButtonGroup.propTypes = {
  flagOnPress: PropTypes.func,
  approveOnPress: PropTypes.func,
  style: StyleShape,
}

ReportButtonGroup.defaultProps = {
  flagOnPress: noop,
  approveOnPress: noop,
  style: null,
}

export default ReportButtonGroup
