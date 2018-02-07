import React from 'react'
import PropTypes from 'prop-types'
import { FlatList } from 'react-native'
import { get, reverse } from 'lodash'
import Separator from '../../components/separator'
import { TimesheetLineShape } from '../../shared/shape'
import TimesheetItemLine from './timesheetItemLine'
import ItemListHeader from '../../shared/reportItemListHeader'

const TimesheetItemList = ({ timesheetLines, editable }) => (
  <FlatList
    ItemSeparatorComponent={Separator}
    ListHeaderComponent={<ItemListHeader count={get(timesheetLines, 'length', 0)} />}
    data={reverse([...timesheetLines])}
    keyExtractor={item => (get(item, 'id') ? item.id : item.uuid)}
    renderItem={({ item }) => <TimesheetItemLine item={item} editable={editable} />}
  />
)

TimesheetItemList.propTypes = {
  timesheetLines: PropTypes.arrayOf(TimesheetLineShape),
  editable: PropTypes.bool,
}

TimesheetItemList.defaultProps = {
  timesheetLines: [],
  editable: false,
}

export default TimesheetItemList

