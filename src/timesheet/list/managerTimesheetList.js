import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  managerTimesheetErrorMsgSelector,
  managerTimesheetListSelector,
  managerTimesheetLoadingSelector,
  managerTimesheetNextSelector,
  managerTimesheetRefreshSelector, viewModeSelector,
} from '../selector'
import {
  TimesheetShape,
  UserShape,
} from '../../shared/shape'
import PullRefreshList from '../../shared/pullRefreshList'
import {
  fetchManagerTimesheet,
  refreshManagerTimesheet,
  resetManagerTimesheetErrorMessage,
} from '../actions'
import { userSelector } from '../../auth/selector'
import TimesheetItem from './item'
import { VIEW_MODE } from '../constants'
import { NOTIFICATION_KEY } from '../../notification/constants'

const ManagerTimesheetList = props => {
  const { list, next, loading, refreshing, errorMessage, user, viewMode } = props
  return (
    <PullRefreshList
      items={list}
      next={next}
      loading={loading}
      refreshing={refreshing}
      errorMessage={errorMessage}
      renderItem={({ item }) => (
        <TimesheetItem
          timesheet={item}
          user={user}
          viewMode={viewMode}
        />
      )}
      emptyLabel="Timesheet"
      notificationKey={NOTIFICATION_KEY.TIMESHEET}
      viewMode={VIEW_MODE.APPROVAL}
      fetchItems={props.fetchManagerTimesheet}
      refreshItems={props.refreshManagerTimesheet}
      user={user}
      resetErrorMessage={props.resetManagerTimesheetErrorMessage}
    />
  )
}

ManagerTimesheetList.propTypes = {
  list: PropTypes.arrayOf(TimesheetShape),
  next: PropTypes.string,
  loading: PropTypes.bool,
  refreshing: PropTypes.bool,
  errorMessage: PropTypes.string,
  viewMode: PropTypes.string,
  user: UserShape,
  fetchManagerTimesheet: PropTypes.func.isRequired,
  refreshManagerTimesheet: PropTypes.func.isRequired,
  resetManagerTimesheetErrorMessage: PropTypes.func.isRequired,
}

ManagerTimesheetList.defaultProps = {
  list: [],
  next: null,
  loading: true,
  refreshing: false,
  errorMessage: '',
  user: {},
  draft: null,
  viewMode: '',
}

const mapStateToProps = createStructuredSelector({
  list: managerTimesheetListSelector,
  next: managerTimesheetNextSelector,
  loading: managerTimesheetLoadingSelector,
  refreshing: managerTimesheetRefreshSelector,
  errorMessage: managerTimesheetErrorMsgSelector,
  user: userSelector,
  viewMode: viewModeSelector,
})

const mapDispatchToProps = {
  fetchManagerTimesheet,
  refreshManagerTimesheet,
  resetManagerTimesheetErrorMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagerTimesheetList)
