import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { chain, isEmpty } from 'lodash'
import { COLOR, FONT } from '../../constants/styleGuide'
import { DRAFT_FILTER, FILTER_BAR_HEIGHT, FILTER_BAR_ITEMS, FILTER_TYPE } from './constants'
import Icon from '../../components/icon'
import { filterConditionsSelector } from '../selector'
import { FilterItemShape } from '../../shared/shape'
import { getFilterBarLabel, hideFilterPanel } from './utilities'

const styles = StyleSheet.create({
  container: {
    height: FILTER_BAR_HEIGHT,
    flexDirection: 'column',
    backgroundColor: COLOR.WHITE,
  },
  shadowLayer: {
    height: 0,
    borderBottomWidth: 0.8,
    borderBottomColor: COLOR.BORDER_GREY,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: FILTER_BAR_HEIGHT - 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    height: FILTER_BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: COLOR.MEDIUM_GREY,
    marginLeft: 5,
    fontSize: 4,
    width: 8,
  },
  selectedArrow: {
    transform: [{ rotate: '180deg' }],
  },
  text: {
    fontSize: FONT.SM,
    color: COLOR.MEDIUM_BLACK,
  },
  highlight: {
    color: COLOR.DARK_BLUE,
  },
})

const FilterButton = ({ text, highlighted, selected, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.buttonContainer}>
      <Text
        style={[styles.text, highlighted ? styles.highlight : null]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
      <Icon
        name="triangle"
        style={[
          styles.arrow,
          selected ? styles.selectedArrow : null,
          highlighted ? styles.highlight : null,
        ]}
      />
    </View>
  </TouchableWithoutFeedback>
)

FilterButton.propTypes = {
  text: PropTypes.string.isRequired,
  highlighted: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
}
FilterButton.defaultProps = {
  highlighted: false,
}

class FilterBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterType: null,
    }
  }

  onFilterButtonSelected = filterType => {
    if (this.state.filterType === filterType) {
      this.resetStatusBar()
    } else {
      this.showFilterPanel(filterType)
    }
  }

  getSelectedFilterNames = filterType => (
    chain(this.props.filterConditions)
    .values()
    .filter(item => item.filterType === filterType)
    .map('name')
    .value()
    .join(',')
  )

  getHighlighted = filterType => {
    if (this.state.filterType === filterType) return true
    if (filterType === FILTER_TYPE.DRAFT &&
        this.getSelectedFilterNames(FILTER_TYPE.DRAFT) === DRAFT_FILTER.ALL) return false
    return !isEmpty(this.getSelectedFilterNames(filterType))
  }

  getFilterText = (filterType, text) => {
    const selectedFilterNames = this.getSelectedFilterNames(filterType)
    if (filterType === FILTER_TYPE.DRAFT) {
      return getFilterBarLabel(selectedFilterNames)
    }
    return text
  }

  resetStatusBar = () => {
    this.setState({ filterType: null })
    hideFilterPanel()
  }

  showFilterPanel = filterType => {
    this.setState({ filterType })
    Actions.filterPanel({
      filterType: filterType,
      onDismiss: this.resetStatusBar,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          {FILTER_BAR_ITEMS.map(item => (
            <FilterButton
              key={item.text}
              text={this.getFilterText(item.filterType, item.text)}
              highlighted={this.getHighlighted(item.filterType)}
              selected={this.state.filterType === item.filterType}
              onPress={() => this.onFilterButtonSelected(item.filterType)}
            />
          ))}
        </View>
        <View style={styles.shadowLayer} />
      </View>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  filterConditions: filterConditionsSelector,
})

FilterBar.propTypes = {
  filterConditions: PropTypes.arrayOf(FilterItemShape),
}
FilterBar.defaultProps = {
  filterConditions: [],
}

export default connect(mapStateToProps, null)(FilterBar)
