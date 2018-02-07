import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DeviceEventEmitter, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isEmpty, isEqual } from 'lodash'
import { FilterItemShape, NotificationShape, UserShape, WorkItemShape } from '../../shared/shape'
import {
  fetchWorkItems,
  refreshWorkItems,
  resetFilterAndSearch,
  resetSelectedIds,
  resetWorkItemsLoading,
  setWorkItemsVisibility,
  toggleSelectedById,
} from '../actions'
import { getDraftReport } from '../../draft/actions'
import {
  errorMessageSelector,
  filterConditionsSelector,
  filteredWorkItemsSelector,
  loadingSelector,
  searchConditionSelector,
  visibilitySelector,
  workItemsSelector,
} from '../selector'
import { userSelector } from '../../auth/selector'
import { onlineSelector } from '../../shared/selector'
import { getUniqProps } from '../utilities'
import {
  clearAsBuiltRequirements,
  clearMaterials,
  clearWorkPackageFiles,
  fetchAsBuiltRequirements,
  fetchMaterials,
  fetchQuantityDescriptions,
  fetchWorkPackageFiles,
} from '../../cache/actions'
import { download } from '../../download/actions'
import { downloadedWorkPackageListSelector } from '../../cache/selector'
import { EVENTS } from '../../utilities/events'
import Map from './map'
import NavigationBar from '../../components/navigationBar'
import DownloadIcon from '../../download/downloadIcon'
import Button from '../../components/button'
import SearchWorkItemButton from './searchWorkItemButton'
import Icon from '../../components/icon'
import { COLOR } from '../../constants/styleGuide'
import FilterBar from '../filter/filterBar'
import { showError } from '../../utilities/messageBar'
import { hideFilterPanel, showToast } from '../filter/utilities'
import { SNAP_POSITION_INDEX } from './interactableWorkItems'
import { DEFAULT_FILTER_CONDITIONS } from '../filter/constants'
import { isManualRefreshSelector, notificationSelector } from '../../notification/selector'
import { resetManualRefresh, resetNotification } from '../../notification/actions'
import { shouldRedirectForNotification } from '../../notification/utilities'
import MapLoading from '../../shared/mapLoading'
import { NOTIFICATION_KEY } from '../../notification/constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationBar: {
    paddingLeft: 15,
    paddingRight: 5,
  },
  buttonsContainer: {
    paddingLeft: 10,
    flexDirection: 'row',
  },
  iconButton: {
    padding: 10,
  },
  listIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIcon: {
    fontSize: 22,
    color: COLOR.WHITE,
  },
  listSelectedIcon: {
    fontSize: 20,
  },
})

class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.mapInteractableRef = null
    this.state = {
      rowId: null,
      isFirstOpen: true,
      scrollEnabled: true,
      selectedWorkItem: null,
    }
  }

  componentDidMount() {
    const { user, online } = this.props
    this.props.resetWorkItemsLoading()
    if (online) {
      this.props.fetchWorkItems(0, user)
    }
    this.props.setWorkItemsVisibility(false)
    this.props.getDraftReport(user)
    this.props.fetchQuantityDescriptions()
    this.swipeViewSubscription = DeviceEventEmitter.addListener(
      EVENTS.CLOSE_SWIPE_VIEW,
      () => {
        this.setState({ rowId: null })
      })
    this.props.resetFilterAndSearch()
  }

  componentWillReceiveProps(nextProps) {
    const { workItems, online, filterConditions } = this.props
    const { workItems: nextWorkItems, downloadedWorkPackageList, online: nextOnline } = nextProps
    if (online !== nextOnline && !nextOnline) {
      this.props.resetWorkItemsLoading()
      return
    }
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

    this.handleError(nextProps)

    if (isEmpty(nextProps.filteredWorkItems) &&
      !isEqual(nextProps.filterConditions, DEFAULT_FILTER_CONDITIONS) &&
      !isEqual(nextProps.filterConditions, filterConditions)
    ) {
      showToast('No Result')
    }
    if (shouldRedirectForNotification(nextProps.notification, NOTIFICATION_KEY.WORK_ITEM)) {
      this.fetchItemsAfterNotification(this.props.isManualRefresh, nextProps.isManualRefresh)
      this.openListOrDetailAfterNotification(
        this.props.workItems, nextProps.workItems, nextProps.notification)
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

  setSelectedWorkItem = (workItem = null) => {
    this.setState({
      selectedWorkItem: workItem,
    })
  }

  fetchItemsAfterNotification = (preNeedRefresh, nextNeedRefresh) => {
    if (!preNeedRefresh && nextNeedRefresh) {
      const { user, online } = this.props
      if (online) {
        this.props.fetchWorkItems(0, user)
      }
      this.props.resetManualRefresh()
    }
  }

  openListOrDetailAfterNotification = (items, nextItems, notification) => {
    if (isEqual(items, nextItems) || isEmpty(notification)) return
    this.openListAfterNotification()
    if (notification.itemId) {
      const newItem = nextItems.find(item => `${item.id}` === notification.itemId)
      if (!isEmpty(newItem)) {
        setTimeout(() => this.setSelectedWorkItem(newItem), 0)
        this.mapInteractableRef.snapToIndex(SNAP_POSITION_INDEX.MIDDLE)
      }
    }
    this.props.resetNotification()
  }

  openListAfterNotification() {
    hideFilterPanel()
    this.props.setWorkItemsVisibility(true)
    this.mapInteractableRef.snapToIndex(SNAP_POSITION_INDEX.TOP)
  }

  handleError = nextProps => {
    const { errorMessage, showLoading } = nextProps
    if (!isEmpty(errorMessage) && !showLoading) {
      showError(errorMessage)
    }
  }

  handleListIconPress = () => {
    if (!this.props.visibility) {
      hideFilterPanel()
      this.props.setWorkItemsVisibility(true)
    }
    this.mapInteractableRef.snapToIndex(SNAP_POSITION_INDEX.TOP)
    this.setSelectedWorkItem()
  }

  renderNavBar() {
    const { visibility } = this.props
    return (
      <NavigationBar style={styles.navigationBar}>
        <SearchWorkItemButton
          text={this.props.searchCondition.searchText}
          onClear={() => {
            this.props.resetFilterAndSearch()
          }}
        />
        <View style={styles.buttonsContainer}>
          <DownloadIcon
            style={styles.iconButton}
          />
          <Button
            onPress={this.handleListIconPress}
            style={styles.listIconButton}
          >
            <Icon
              name={visibility ? 'list-selected' : 'list'}
              style={[styles.listIcon, visibility && styles.listSelectedIcon]}
            />
          </Button>
        </View>
      </NavigationBar>
    )
  }

  render() {
    const { visibility, filteredWorkItems, user, online } = this.props
    return (
      <View style={styles.container}>
        {this.props.showLoading && <MapLoading />}
        {this.renderNavBar()}
        <FilterBar />
        <Map
          mapInteractableRef={ref => { this.mapInteractableRef = ref }}
          rowId={this.state.rowId}
          workItems={filteredWorkItems}
          selectedWorkItem={this.state.selectedWorkItem}
          onChangeRowId={this.onChangeRowId}
          listVisibility={visibility}
          setListVisibility={this.props.setWorkItemsVisibility}
          refreshWorkItems={() => {
            if (online) {
              this.props.fetchWorkItems(0, user)
            } else {
              showToast('No Network')
            }
          }}
          setSelectedWorkItem={this.setSelectedWorkItem}
        />
      </View>
    )
  }
}

MapContainer.propTypes = {
  workItems: PropTypes.arrayOf(WorkItemShape),
  user: UserShape,
  online: PropTypes.bool,
  visibility: PropTypes.bool,
  showLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
  downloadedWorkPackageList: PropTypes.arrayOf(PropTypes.number),
  notification: NotificationShape,
  isManualRefresh: PropTypes.bool,
  fetchWorkItems: PropTypes.func.isRequired,
  fetchAsBuiltRequirements: PropTypes.func.isRequired,
  clearAsBuiltRequirements: PropTypes.func.isRequired,
  fetchWorkPackageFiles: PropTypes.func.isRequired,
  clearWorkPackageFiles: PropTypes.func.isRequired,
  fetchMaterials: PropTypes.func.isRequired,
  clearMaterials: PropTypes.func.isRequired,
  fetchQuantityDescriptions: PropTypes.func.isRequired,
  getDraftReport: PropTypes.func.isRequired,
  download: PropTypes.func.isRequired,
  setWorkItemsVisibility: PropTypes.func.isRequired,
  resetFilterAndSearch: PropTypes.func.isRequired,
  searchCondition: PropTypes.object, //eslint-disable-line
  filteredWorkItems: PropTypes.arrayOf(WorkItemShape),
  filterConditions: PropTypes.arrayOf(FilterItemShape).isRequired,
  resetWorkItemsLoading: PropTypes.func.isRequired,
  resetManualRefresh: PropTypes.func.isRequired,
  resetNotification: PropTypes.func.isRequired,
}

MapContainer.defaultProps = {
  workItems: [],
  user: {},
  online: true,
  visibility: true,
  showLoading: false,
  errorMessage: '',
  downloadedWorkPackageList: [],
  searchCondition: {},
  filteredWorkItems: [],
  notification: null,
  isManualRefresh: false,
}

const mapStateToProps = createStructuredSelector({
  workItems: workItemsSelector,
  user: userSelector,
  online: onlineSelector,
  visibility: visibilitySelector,
  showLoading: loadingSelector,
  errorMessage: errorMessageSelector,
  downloadedWorkPackageList: downloadedWorkPackageListSelector,
  searchCondition: searchConditionSelector,
  filteredWorkItems: filteredWorkItemsSelector,
  filterConditions: filterConditionsSelector,
  notification: notificationSelector,
  isManualRefresh: isManualRefreshSelector,
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
  resetFilterAndSearch,
  setWorkItemsVisibility,
  resetWorkItemsLoading,
  resetManualRefresh,
  resetNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer)
