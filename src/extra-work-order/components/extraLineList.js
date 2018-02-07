import React from 'react'
import { FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { reverse, get } from 'lodash'
import ExtraLine from './extraLine'
import Separator from '../../components/separator'
import ItemListHeader from '../../shared/reportItemListHeader'
import { ExtraLineShape } from '../../shared/shape'

const ExtraLineList = ({ extraLines, editable }) => {
  const newExtraLines = [...extraLines]
  return (
    <FlatList
      data={reverse(newExtraLines)}
      renderItem={({ item }) => (
        <ExtraLine item={item} editable={editable} />
      )}
      ItemSeparatorComponent={Separator}
      ListHeaderComponent={<ItemListHeader count={get(extraLines, 'length', 0)} />}
      keyExtractor={item => (get(item, 'id') ? item.id : item.uuid)}
    />
  )
}

ExtraLineList.propTypes = {
  extraLines: PropTypes.arrayOf(ExtraLineShape),
  editable: PropTypes.bool,
}

ExtraLineList.defaultProps = {
  extraLines: [],
  editable: true,
}

export default ExtraLineList
