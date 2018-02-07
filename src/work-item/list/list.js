import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DeviceEventEmitter, SectionList } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isEmpty, isEqual, noop } from 'lodash'
import { UserShape, WorkItemShape } from '../../shared/shape'
import { fetchWorkItems, refreshWorkItems, resetSelectedIds, toggleSelectedById } from '../actions'
import { getDraftReport } from '../../draft/actions'
import {
  errorMessageSelector,
  loadingSelector,
  nextSelector,
  refreshingSelector,
  workItemsSelector,
} from '../selector'
import PullRefreshList from '../../shared/pullRefreshList'
import { userSelector } from '../../auth/selector'
import { WORK_ITEMS_LIST_TYPE } from '../constants'
import { onlineSelector } from '../../shared/selector'
import SectionHeader from './sectionHeader'
import { getUniqProps, getWorkItemSections } from '../utilities'
import {
  clearAsBuiltRequirements,
  clearMaterials,
  clearWorkPackageFiles,
  fetchAsBuiltRequirements,
  fetchMaterials,
  fetchWorkPackageFiles,
  fetchQuantityDescriptions,
} from '../../cache/actions'
import { download } from '../../download/actions'
import { asBuiltRequirementsSelector, downloadedWorkPackageListSelector } from '../../cache/selector'
import SwipedWorkItemCell from '../../shared/swipedWorkItemCell'
import { EVENTS } from '../../utilities/events'
import { LIST_SCROLL_THROTTLE } from '../../constants/styleGuide'

class WorkItemList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowId: null,
      isFirstOpen: true,
      scrollEnabled: true,
    }
  }

  componentDidMount() {
    if (this.isSelectList) {
      this.props.resetSelectedIds()
    } else {
      this.props.getDraftReport(this.props.user)
      this.props.fetchQuantityDescriptions()
    }
    this.swipeViewSubscription = DeviceEventEmitter.addListener(
      EVENTS.CLOSE_SWIPE_VIEW,
      () => {
        this.setState({ rowId: null })
      })
  }

  componentWillReceiveProps(nextProps) {
    const { workItems } = this.props
    const { workItems: nextWorkItems, downloadedWorkPackageList } = nextProps
    const networkOperatorList = getUniqProps(workItems, 'network_operator')
    const nextNetworkOperatorList = getUniqProps(nextWorkItems, 'network_operator')
    const workPackageList = getUniqProps(workItems, 'work_package')
    const nextWorkPackageList = getUniqProps(nextWorkItems, 'work_package')

    if (!isEqual(networkOperatorList, nextNetworkOperatorList)) {
      this.props.clearAsBuiltRequirements()
      this.props.clearMaterials()
      nextNetworkOperatorList.forEach(item => {
        this.props.fetchAsBuiltRequirements(item)
        this.props.fetchMaterials(item)
      })
    }

    if (!isEqual(workPackageList, nextWorkPackageList)) {
      this.props.clearWorkPackageFiles()
      nextWorkPackageList.forEach(workPackage => {
        this.props.fetchWorkPackageFiles(workPackage)
      })
    }

    if (this.state.isFirstOpen
      && (!isEmpty(downloadedWorkPackageList))
      && isEqual(downloadedWorkPackageList.sort(), nextWorkPackageList.sort())) {
      this.setState({ isFirstOpen: false })
      this.props.download()
    }
  }

  componentWillUnmount() {
    if (this.swipeViewSubscription) {
      this.swipeViewSubscription.remove()
    }
  }

  onChangeRowId = rowId => {
    this.setState({ rowId })
  }

  get isSelectList() {
    return this.props.type === WORK_ITEMS_LIST_TYPE.SELECT
  }

  render() {
    const { workItems, next, loading, refreshing, errorMessage, user, online } = this.props

    return (
      <PullRefreshList
        user={user}
        sections={getWorkItemSections(workItems)}
        next={next}
        loading={loading}
        refreshing={refreshing}
        errorMessage={errorMessage}
        renderItem={({ item }) =>
          (<SwipedWorkItemCell
            item={item}
            isSelectList={this.isSelectList}
            onChangeRowId={this.onChangeRowId}
            rowId={this.state.rowId}
            onScroll={scrollEnabled => this.setState({ scrollEnabled })}
            shouldShowAllFromToText={false}
          />)}
        emptyLabel="Work Item"
        fetchItems={this.props.fetchWorkItems}
        refreshItems={this.props.refreshWorkItems}
        onEndReached={noop}
        online={online}
        component={SectionList}
        renderSectionHeader={({ section }) =>
          <SectionHeader title={section.title} date={section.dueDate} />}
        scrollEnabled={this.state.scrollEnabled}
        scrollEventThrottle={LIST_SCROLL_THROTTLE}
      />
    )
  }
}

WorkItemList.propTypes = {
  workItems: PropTypes.arrayOf(WorkItemShape),
  next: PropTypes.string,
  loading: PropTypes.bool,
  refreshing: PropTypes.bool,
  errorMessage: PropTypes.string,
  user: UserShape,
  type: PropTypes.string,
  online: PropTypes.bool,
  fetchWorkItems: PropTypes.func.isRequired,
  refreshWorkItems: PropTypes.func.isRequired,
  resetSelectedIds: PropTypes.func.isRequired,
  fetchAsBuiltRequirements: PropTypes.func.isRequired,
  clearAsBuiltRequirements: PropTypes.func.isRequired,
  fetchWorkPackageFiles: PropTypes.func.isRequired,
  clearWorkPackageFiles: PropTypes.func.isRequired,
  fetchMaterials: PropTypes.func.isRequired,
  clearMaterials: PropTypes.func.isRequired,
  fetchQuantityDescriptions: PropTypes.func.isRequired,
  getDraftReport: PropTypes.func.isRequired,
  download: PropTypes.func.isRequired,
  downloadedWorkPackageList: PropTypes.arrayOf(PropTypes.number),
}

WorkItemList.defaultProps = {
  workItems: [],
  next: null,
  loading: false,
  refreshing: false,
  errorMessage: '',
  user: {},
  type: '',
  online: true,
  downloadedWorkPackageList: [],
}

const mapStateToProps = createStructuredSelector({
  workItems: workItemsSelector,
  next: nextSelector,
  loading: loadingSelector,
  refreshing: refreshingSelector,
  errorMessage: errorMessageSelector,
  user: userSelector,
  online: onlineSelector,
  asBuiltRequirements: asBuiltRequirementsSelector,
  downloadedWorkPackageList: downloadedWorkPackageListSelector,
})

const mapDispatchToProps = {
  fetchWorkItems,
  refreshWorkItems,
  toggleSelectedById,
  resetSelectedIds,
  fetchAsBuiltRequirements,
  clearAsBuiltRequirements,
  fetchWorkPackageFiles,
  clearWorkPackageFiles,
  fetchMaterials,
  clearMaterials,
  fetchQuantityDescriptions,
  getDraftReport,
  download,
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkItemList)
