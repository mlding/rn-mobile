import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native'
import Icon from '../../components/icon'
import { COLOR, FONT } from '../../constants/styleGuide'
import Button from '../../components/button'
import { FilterItemShape } from '../../shared/shape'
import { FILTER_ITEM_HEIGHT, FILTER_ITEM_SEPARATOR_HEIGHT } from './constants'

const styles = StyleSheet.create({
  itemButtonContainer: {
    height: FILTER_ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    borderWidth: FILTER_ITEM_SEPARATOR_HEIGHT,
    backgroundColor: COLOR.FILTER_SEPARATOR,
    borderColor: COLOR.FILTER_SEPARATOR,
    marginLeft: 15,
  },
  text: {
    fontSize: FONT.M,
    color: COLOR.MEDIUM_BLACK,
  },
  icon: {
    color: COLOR.BORDER,
  },
  selected: {
    color: COLOR.FADE_BLUE,
  },
})

const Separator = () => (
  <View style={styles.separator} />
)

const FilterItem = props => {
  const { item, isMultiSelection, onSelected } = props
  const selectedIcon = isMultiSelection ? 'checkbox-highlight' : 'checkmark'
  const defaultIcon = isMultiSelection ? 'checkbox-normal' : null
  const iconName = item.selected ? selectedIcon : defaultIcon
  return (
    <Button style={styles.itemButtonContainer} onPress={() => onSelected(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.text}>{item.name}</Text>
        {iconName && <Icon
          name={iconName}
          size={isMultiSelection ? 18 : 12}
          style={[styles.icon, item.selected ? styles.selected : null]}
        />}
      </View>
    </Button>
  )
}

FilterItem.propTypes = {
  item: FilterItemShape.isRequired,
  isMultiSelection: PropTypes.bool.isRequired,
  onSelected: PropTypes.func.isRequired,
}

FilterItem.defaultProps = {
  selectedFilters: [],
  regionFilterSource: [],
  categoryFilterSource: [],
}

const FilterList = ({ filterItems, isMultiSelection, onFilterItemSelected }) => (
  <FlatList
    data={filterItems}
    renderItem={({ item }) => (
      <FilterItem
        item={item}
        isMultiSelection={isMultiSelection}
        onSelected={onFilterItemSelected}
      />
    )}
    ItemSeparatorComponent={Separator}
    keyExtractor={item => item.key}
  />
)

FilterList.propTypes = {
  filterItems: PropTypes.arrayOf(FilterItemShape).isRequired,
  isMultiSelection: PropTypes.bool.isRequired,
  onFilterItemSelected: PropTypes.func.isRequired,
}

export default FilterList
