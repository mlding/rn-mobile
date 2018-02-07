import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FlatList, StyleSheet, View, SectionList } from 'react-native'
import { isEmpty, omit, keys, noop, isEqual } from 'lodash'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { ListSeparator } from '../components/separator'
import ListFooter from '../components/listFooter'
import EmptyPage from '../components/emptyPage'
import { UserShape, NotificationShape } from './shape'
import { showError } from '../utilities/messageBar'
import { COLOR } from '../constants/styleGuide'
import { notificationSelector, isManualRefreshSelector } from '../notification/selector'
import { viewModeSelector } from '../timesheet/selector'
import { resetManualRefresh, resetNotification } from '../notification/actions'
import { showDetailAfterNotification, shouldRedirectForNotification } from '../notification/utilities'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_WHITE,
  },
})

class PullRefreshList extends Component {
  componentDidMount() {
    this.fetchItemsWhenOnline()
  }

  componentWillReceiveProps(nextProps) {
    this.handleErrorMessage(nextProps)
    const { notification, notificationKey, timesheetViewMode, viewMode } = nextProps

    if (shouldRedirectForNotification(notification, notificationKey, timesheetViewMode, viewMode)) {
      this.fetchItemsAfterNotification(this.props.isManualRefresh, nextProps.isManualRefresh)
      this.redirectAfterNotification(this.props.items, nextProps.items, nextProps.notification)
    }
  }

  fetchItemsWhenOnline = () => {
    const { user, online } = this.props
    if (online) {
      this.props.fetchItems(0, user)
    }
  }

  fetchItemsAfterNotification = (preNeedRefresh, nextNeedRefresh) => {
    if (!preNeedRefresh && nextNeedRefresh) {
      this.fetchItemsWhenOnline()
      this.props.resetManualRefresh()
    }
  }

  redirectAfterNotification = (items, nextItems, notification) => {
    if (isEqual(items, nextItems) || isEmpty(notification)) return
    if (notification.itemId) {
      showDetailAfterNotification(nextItems, notification, this.props.user.role)
    }
    this.props.resetNotification()
  }

  handleErrorMessage = nextProps => {
    const { errorMessage, loading, resetErrorMessage } = nextProps
    if (!isEmpty(errorMessage) && !loading) {
      showError(errorMessage)
      if (!resetErrorMessage) return
      resetErrorMessage()
    }
  }

  loadMoreitems = () => {
    const { next, loading, items, user } = this.props
    if (next && !loading) {
      this.props.fetchItems(items.length, user)
    }
  }

  refreshItems = () => {
    const { refreshing, loading, user, online } = this.props
    if (!refreshing && !loading && online) {
      this.props.refreshItems(user)
    }
  }

  renderFooter = () => {
    const { errorMessage, loading, refreshing, online } = this.props
    if ((!isEmpty(errorMessage) && !loading) || refreshing || !online) {
      return null
    }
    return <ListFooter loading={loading} />
  }

  renderBlankPage = () => {
    const { loading, emptyLabel } = this.props
    if (loading || this.props.hasDraft) {
      return null
    }
    return <EmptyPage label={emptyLabel} />
  }

  render() {
    const { items, refreshing, renderItem, component: ListComponent } = this.props
    const others = omit(this.props, keys(PullRefreshList.propTypes))

    return (
      <View style={styles.container}>
        <ListComponent
          data={items}
          renderItem={renderItem}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={workItem => workItem.id}
          onEndReached={this.loadMoreitems}
          onEndReachedThreshold={0.3}
          onRefresh={this.refreshItems}
          refreshing={refreshing}
          ListFooterComponent={this.renderFooter()}
          ListEmptyComponent={this.renderBlankPage()}
          {...others}
        />
      </View>
    )
  }
}

PullRefreshList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  next: PropTypes.string,
  loading: PropTypes.bool,
  refreshing: PropTypes.bool,
  errorMessage: PropTypes.string,
  emptyLabel: PropTypes.string,
  notificationKey: PropTypes.string,
  timesheetViewMode: PropTypes.string,
  viewMode: PropTypes.string,
  user: UserShape,
  online: PropTypes.bool,
  component: PropTypes.oneOf([FlatList, SectionList]),
  hasDraft: PropTypes.bool,
  notification: NotificationShape,
  isManualRefresh: PropTypes.bool.isRequired,
  fetchItems: PropTypes.func.isRequired,
  refreshItems: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func,
  resetManualRefresh: PropTypes.func.isRequired,
  resetNotification: PropTypes.func.isRequired,
}

PullRefreshList.defaultProps = {
  items: [],
  next: null,
  loading: false,
  refreshing: false,
  errorMessage: '',
  emptyLabel: '',
  user: {},
  online: true,
  component: FlatList,
  hasDraft: false,
  notification: null,
  resetErrorMessage: noop,
  notificationKey: '',
  timesheetViewMode: '',
  viewMode: '',
}

const mapStateToProps = createStructuredSelector({
  notification: notificationSelector,
  isManualRefresh: isManualRefreshSelector,
  timesheetViewMode: viewModeSelector,
})

export default connect(mapStateToProps, {
  resetManualRefresh,
  resetNotification,
})(PullRefreshList)
