import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isEmpty, find } from 'lodash'
import { Actions } from 'react-native-router-flux'

import { COLOR, FONT } from '../../constants/styleGuide'
import Icon from '../../components/icon'
import SearchTypePanel from './searchTypePanel'
import SearchBar from '../../shared/searchBar'
import { SEARCH_TYPES } from '../../constants/searchType'
import { searchConditionSelector, workItemsSelector } from '../selector'
import NavigationBar from '../../components/navigationBar'
import { resetFilterConditions, setSearchCondition } from '../actions'
import { WorkItemShape } from '../../shared/shape'
import { getWorkItemsBySearchCondition } from '../utilities'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  noResultContainer: {
    alignItems: 'center',
    marginTop: 92,
  },
  onResultIcon: {
    fontSize: 50,
    color: COLOR.SILVER,
  },
  noResultsText: {
    textAlign: 'center',
    color: COLOR.SILVER,
    marginTop: 20,
    fontSize: FONT.LG,
  },
})

const getDisplayBySearchField = searchField => {
  const searchType = find(SEARCH_TYPES, { 'searchField': searchField })
  return isEmpty(searchType) ? '' : searchType.text
}

class WorkItemsSearch extends Component {
  constructor(props) {
    super(props)
    const { searchField } = props.searchCondition
    this.state = {
      searchField: isEmpty(searchField) ? SEARCH_TYPES[0].searchField : searchField,
      noResult: false,
    }
  }

  getDefaultSearchText = () => {
    const { searchText } = this.props.searchCondition
    return isEmpty(searchText) ? '' : searchText
  }

  getSearchPlaceHolder = () =>
    `Search by ${getDisplayBySearchField(this.state.searchField).toLowerCase()}`

  searchWorkItem = searchText => {
    const searchCondition = {
      searchText: searchText,
      searchField: this.state.searchField,
    }
    const searchResult = getWorkItemsBySearchCondition(this.props.workItems, searchCondition)
    const noResult = isEmpty(searchResult)
    this.setState({ noResult })
    if (!noResult) {
      this.props.resetFilterConditions()
      this.props.setSearchCondition(searchCondition)
      Actions.pop()
    }
  }

  chooseSearchType = searchField => {
    this.setState({
      searchField: searchField,
      noResult: false,
    }, () => {
      this.searchBar.focus()
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          hasBackButton
        >
          <SearchBar
            ref={ref => { this.searchBar = ref }}
            placeholder={this.getSearchPlaceHolder()}
            defaultText={this.getDefaultSearchText()}
            autoFocus
            handleSearch={text => this.searchWorkItem(text, true)}
          />
        </NavigationBar>
        <SearchTypePanel
          searchField={this.state.searchField}
          handleSelect={searchField => this.chooseSearchType(searchField)}
        />
        {this.state.noResult &&
          <View style={styles.noResultContainer}>
            <Icon name="no-result" style={styles.onResultIcon} />
            <Text style={styles.noResultsText}>
              No Results
            </Text>
          </View>}
      </View>)
  }
}

WorkItemsSearch.propTypes = {
  workItems: PropTypes.arrayOf(WorkItemShape),
  searchCondition: PropTypes.object.isRequired, //eslint-disable-line
  setSearchCondition: PropTypes.func.isRequired,
  resetFilterConditions: PropTypes.func.isRequired,
}

WorkItemsSearch.defaultProps = {
  workItems: [],
}

const mapStateToProps = createStructuredSelector({
  workItems: workItemsSelector,
  searchCondition: searchConditionSelector,
})

const mapDispatchTopProps = {
  setSearchCondition,
  resetFilterConditions,
}

export default connect(mapStateToProps, mapDispatchTopProps)(WorkItemsSearch)

