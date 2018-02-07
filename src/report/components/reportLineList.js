import React from 'react'
import { FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { reverse, get } from 'lodash'
import Separator from '../../components/separator'
import ReportLineContainer from '../detail/reportLine'
import EditableReportLine from './editableReportLine'
import ItemListHeader from '../../shared/reportItemListHeader'
import { ReportLinesShape } from '../../shared/shape'
import { getActiveReportLines } from '../utilities'

const ReportLineList = ({ reportLines, editable }) => {
  const activeReportLines = getActiveReportLines(reportLines)
  return (
    <FlatList
      data={reverse([...activeReportLines])}
      renderItem={({ item }) => (
        editable ?
          <EditableReportLine reportLine={item} /> : <ReportLineContainer reportLine={item} />
      )}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={<ItemListHeader count={get(reportLines, 'length', 0)} text="Work Items" />}
      keyExtractor={item => item.work_item}
    />
  )
}

ReportLineList.propTypes = {
  reportLines: PropTypes.arrayOf(ReportLinesShape),
  editable: PropTypes.bool,
}

ReportLineList.defaultProps = {
  reportLines: [],
  editable: false,
}

export default ReportLineList
