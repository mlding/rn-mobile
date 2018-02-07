import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  TouchableWithoutFeedback,
  View,
  Text,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { map, filter, find } from 'lodash'
import {
  regionFilterSourceSelector,
  categoryFilterSourceSelector,
  filterConditionsSelector,
} from '../selector'
import { NavBarHeightOrigin } from '../../utilities/responsiveDimension'
import { COLOR, FONT } from '../../constants/styleGuide'
import { FILTER_BAR_HEIGHT, FILTER_TYPE, FILTER_ITEM_HEIGHT, MAX_FILTER_ITEMS, FILTER_BUTTON_GROUP_HEIGHT, FILTER_ITEM_SEPARATOR_HEIGHT } from './constants'
import Button from '../../components/button'
import FilterList from './filterList'
import { getFilterItemsByType, getDraftFilters } from './utilities'
import { setFilterConditions, resetFilterConditions } from '../actions'
import { FilterItemShape } from '../../shared/shape'

const BOTTOM_BUTTON_MARGIN_TOP = 10

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: NavBarHeightOrigin + FILTER_BAR_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
  },
  panelContainer: {
    backgroundColor: COLOR.WHITE,
  },
  text: {
    fontSize: FONT.M,
    color: COLOR.MEDIUM_BLACK,
  },
  buttonContainer: {
    height: FILTER_BUTTON_GROUP_HEIGHT,
    marginTop: BOTTOM_BUTTON_MARGIN_TOP,
    flexDirection: 'row',
    shadowColor: COLOR.BORDER_SHADOW,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1,
    shadowOpacity: 1,
    elevation: 1,
  },
  resetButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: FILTER_BUTTON_GROUP_HEIGHT - 1,
    borderTopWidth: 1,
    borderTopColor: COLOR.BORDER_GREY,
    backgroundColor: COLOR.WHITE,
  },
  resetText: {
    color: COLOR.FADE_BLUE,
  },
  resultButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLOR.FADE_BLUE,
  },
  resultText: {
    color: COLOR.WHITE,
  },
})

const PanelButtonGroup = ({ hidden, onReset, onShowResults }) => {
  if (hidden) return null
  return (
    <View style={styles.buttonContainer}>
      <Button style={styles.resetButton} onPress={onReset}>
        <Text style={[styles.text, styles.resetText]}>Reset</Text>
      </Button>
      <Button style={styles.resultButton} onPress={onShowResults}>
        <Text style={[styles.text, styles.resultText]}>Show Results</Text>
      </Button>
    </View>
  )
}

PanelButtonGroup.propTypes = {
  hidden: PropTypes.bool,
  onReset: PropTypes.func.isRequired,
  onShowResults: PropTypes.func.isRequired,
}

PanelButtonGroup.defaultProps = {
  hidden: true,
}

class FilterPanel extends Component {
  constructor(props) {
    super(props)
    this.animatedHeight = new Animated.Value(0)
    this.animatedColor = new Animated.Value(0)
    this.state = {
      filters: this.allFilters,
    }
  }

  componentDidMount() {
    this.setAnimatedHeightByFilterType(this.props.filterType)
    Animated.timing(this.animatedColor, {
      toValue: 200,
      duration: 100,
    }).start()
  }

  componentWillReceiveProps(nextProps) {
    this.setAnimatedHeightByFilterType(nextProps.filterType)
  }

  componentWillUnmount() {
    this.props.onDismiss()
  }

  onFilterItemSelected = item => {
    const filters = map(this.state.filters, filterItem => {
      if (filterItem.filterType !== item.filterType) return filterItem
      const defaultSelectedStatus = this.isDraftFilter ? false : filterItem.selected
      return {
        ...filterItem,
        selected: filterItem.key === item.key ? !defaultSelectedStatus : defaultSelectedStatus,
      }
    })
    this.setState({ filters }, () => {
      if (this.isDraftFilter) {
        this.showResults()
      }
    })
  }

  setAnimatedHeightByFilterType = filterType => {
    const filterItemsCount = this.getCurrentFilterItems(filterType).length
    const shownItemsCount = filterItemsCount < MAX_FILTER_ITEMS ?
      filterItemsCount : MAX_FILTER_ITEMS
    const itemsHeight = shownItemsCount * (FILTER_ITEM_HEIGHT + FILTER_ITEM_SEPARATOR_HEIGHT)
    Animated.timing(this.animatedHeight, {
      toValue: filterType === FILTER_TYPE.DRAFT ?
        itemsHeight : itemsHeight + FILTER_BUTTON_GROUP_HEIGHT + BOTTOM_BUTTON_MARGIN_TOP,
      duration: 150,
      easing: Easing.linear,
    }).start()
  }

  get isDraftFilter() {
    return this.props.filterType === FILTER_TYPE.DRAFT
  }

  get allFilters() {
    const { regionFilterSource, categoryFilterSource, filterConditions } = this.props
    const initialFilters = [...getDraftFilters(), ...regionFilterSource, ...categoryFilterSource]
    return initialFilters.map(item => {
      const filterItem = find(filterConditions, selectedFilter => selectedFilter.key === item.key)
      if (filterItem) return filterItem
      return item
    })
  }

  getCurrentFilterItems = filterType => getFilterItemsByType(filterType, this.state.filters)

  showResults = () => {
    const currentFilters = filter(this.state.filters, filterItem => filterItem.selected)
    this.props.setFilterConditions(currentFilters)
    this.props.onDismiss()
  }

  resetFilters = () => {
    this.props.resetFilterConditions(this.props.filterType)
    this.props.onDismiss()
  }

  render() {
    const { filterType, onDismiss } = this.props
    const filterItems = this.getCurrentFilterItems(filterType)
    const animatedBackground = this.animatedColor.interpolate({
      inputRange: [0, 100, 200],
      outputRange: [COLOR.TRANSPARENT, COLOR.BORDER_SHADOW, COLOR.TRANSPARENT_BACKGROUND],
    })
    return (
      <TouchableWithoutFeedback onPress={onDismiss}>
        <Animated.View style={[styles.modalContainer, { backgroundColor: animatedBackground }]}>
          <Animated.View style={[styles.panelContainer, { height: this.animatedHeight }]}>
            <FilterList
              filterItems={filterItems}
              isMultiSelection={!this.isDraftFilter}
              onFilterItemSelected={this.onFilterItemSelected}
            />
            <PanelButtonGroup
              hidden={filterType === FILTER_TYPE.DRAFT}
              onShowResults={this.showResults}
              onReset={this.resetFilters}
            />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  regionFilterSource: regionFilterSourceSelector,
  categoryFilterSource: categoryFilterSourceSelector,
  filterConditions: filterConditionsSelector,
})

FilterPanel.propTypes = {
  regionFilterSource: PropTypes.arrayOf(FilterItemShape),
  categoryFilterSource: PropTypes.arrayOf(FilterItemShape),
  filterConditions: PropTypes.arrayOf(FilterItemShape),
  filterType: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  setFilterConditions: PropTypes.func.isRequired,
  resetFilterConditions: PropTypes.func.isRequired,
}

FilterPanel.defaultProps = {
  regionFilterSource: [],
  categoryFilterSource: [],
  filterConditions: [],
}
export default connect(mapStateToProps, {
  setFilterConditions,
  resetFilterConditions,
})(FilterPanel)

