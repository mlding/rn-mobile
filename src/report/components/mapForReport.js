import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isEqual } from 'lodash'
import Map from '../../work-item/map/map'
import { WorkItemShape } from '../../shared/shape'
import {
  currentReportIdSelector, mapLoadingSelector, originWorkItemsSelector, reportWorkItemsSelector,
} from '../selector'
import { fetchWorkItemsByReportId, resetReportWorkItems } from '../actions'
import { SHOW_MAP_MODE } from '../constants'
import MapLoading from '../../shared/mapLoading'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

class MapForReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedWorkItem: null,
    }
  }

  componentDidMount() {
    if (this.props.mode === SHOW_MAP_MODE.VIEW) {
      this.props.fetchWorkItemsByReportId(this.props.currentReportId)
    }
  }

  componentWillUnmount() {
    this.props.resetReportWorkItems()
  }

  setSelectedWorkItem = (workItem = null) => {
    this.setState({
      selectedWorkItem: workItem,
    })
  }

  render() {
    const { isReportEntrance, mode, originWorkItems, reportWorkItems, mapLoading } = this.props
    return (
      <View style={styles.container}>
        {mapLoading && <MapLoading isReportMap />}
        <Map
          workItems={isEqual(mode, SHOW_MAP_MODE.VIEW) ? reportWorkItems : originWorkItems}
          isReportEntrance={isReportEntrance}
          selectedWorkItem={this.state.selectedWorkItem}
          setSelectedWorkItem={this.setSelectedWorkItem}
        />
      </View>
    )
  }
}

MapForReport.propTypes = {
  currentReportId: PropTypes.number,
  fetchWorkItemsByReportId: PropTypes.func.isRequired,
  resetReportWorkItems: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  originWorkItems: PropTypes.arrayOf(WorkItemShape),
  reportWorkItems: PropTypes.arrayOf(WorkItemShape),
  isReportEntrance: PropTypes.bool,
  mapLoading: PropTypes.bool.isRequired,
}

MapForReport.defaultProps = {
  originWorkItems: [],
  reportWorkItems: [],
  isReportEntrance: false,
  currentReportId: null,
}

const mapStateToProps = createStructuredSelector({
  originWorkItems: originWorkItemsSelector,
  reportWorkItems: reportWorkItemsSelector,
  currentReportId: currentReportIdSelector,
  mapLoading: mapLoadingSelector,
})

const mapDispatchToProps = {
  fetchWorkItemsByReportId,
  resetReportWorkItems,
}

export default connect(mapStateToProps, mapDispatchToProps)(MapForReport)
