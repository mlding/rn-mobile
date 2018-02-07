import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ReportLinesShape } from '../../shared/shape'
import WorkItemCell from '../../shared/workItemCell'
import ReportLineDetailContainer from '../components/reportLineDetail'
import { COLOR } from '../../constants/styleGuide'

const styles = StyleSheet.create({
  container: {
    borderColor: COLOR.BORDER_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
})

const ReportLine = ({ reportLine }) => (
  <View style={styles.container}>
    <WorkItemCell item={reportLine} isReportLine linesOfName={1} />
    <ReportLineDetailContainer reportLine={reportLine} />
  </View>
  )

ReportLine.propTypes = {
  reportLine: ReportLinesShape.isRequired,
}

export default ReportLine
