import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { COLOR, FONT } from '../constants/styleGuide'
import Status from './reportStatus'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER_GREY,
    borderTopWidth: 1,
    borderTopColor: COLOR.BORDER_GREY,
    backgroundColor: COLOR.WHITE,
  },
  labelWrapper: {
    marginVertical: 8,
    marginRight: 10,
    flex: 1,
  },
  label: {
    fontSize: FONT.M,
    color: COLOR.MEDIUM_BLACK,
  },
  line: {
    height: 1,
    alignItems: 'stretch',
    backgroundColor: COLOR.DARK_WHITE,
  },
})

const ReportStatusRow = ({ nameContent, status }) => (
  <View style={styles.container}>
    <View style={styles.labelWrapper}>
      <Text style={styles.label} numberOfLines={2}>{nameContent} </Text>
    </View>
    <Status status={status} />
  </View>
)

ReportStatusRow.propTypes = {
  nameContent: PropTypes.string,
  status: PropTypes.string,
}

ReportStatusRow.defaultProps = {
  nameContent: '',
  status: '',
}

export default ReportStatusRow
