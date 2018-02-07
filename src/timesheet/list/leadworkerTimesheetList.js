import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, LayoutAnimation } from 'react-native'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { isEmpty } from 'lodash'
import {
  errorMsgSelector,
  listSelector,
  loadingSelector,
  nextSelector,
  refreshingSelector,
} from '../selector'
import {
  TimesheetShape,
  UserShape,
} from '../../shared/shape'
import PullRefreshList from '../../shared/pullRefreshList'
import {
  fetchTimesheet,
  refreshTimesheet,
  resetErrorMessage,
} from '../actions'
import { userSelector } from '../../auth/selector'
import TimesheetItem from './item'
import { draftTimesheetSelector } from '../../draft/selector'
import { getDraftTimeSheet, setDraftTimesheet } from '../../draft/actions'
import { VIEW_MODE } from '../constants'
import { DELETE_ITEM_ANIMA } from '../../utilities/animaUtil'
import SwipeDraft from '../../draft/swipeDraft'
import { DRAFT_TYPE } from '../../draft/constants'
import { NOTIFICATION_KEY } from '../../notification/constants'

class LeadWorkerTimesheetList extends Component {
  componentDidMount() {
    this.props.getDraftTimeSheet(this.props.user)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.draft !== null && nextProps.draft === null) {
      LayoutAnimation.configureNext(DELETE_ITEM_ANIMA)
    }
  }

  renderDraft = () => {
    const { draft, user } = this.props
    if (isEmpty(draft)) {
      return <View />
    }

    return (
      <SwipeDraft
        draft={draft}
        user={user}
        name={draft.name}
        type={DRAFT_TYPE.TIMESHEET}
        setDraft={this.props.setDraftTimesheet}
      >
        <TimesheetItem
          timesheet={draft}
          user={user}
        />
      </SwipeDraft>
    )
  }

  render() {
    const { list, next, loading, refreshing, errorMessage, user } = this.props
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
            viewMode={VIEW_MODE.CREATOR}
          />
        )}
        emptyLabel="Timesheet"
        notificationKey={NOTIFICATION_KEY.TIMESHEET}
        viewMode={VIEW_MODE.CREATOR}
        fetchItems={this.props.fetchTimesheet}
        refreshItems={this.props.refreshTimesheet}
        user={user}
        resetErrorMessage={this.props.resetErrorMessage}
        ListHeaderComponent={this.renderDraft}
      />
    )
  }
}

LeadWorkerTimesheetList.propTypes = {
  list: PropTypes.arrayOf(TimesheetShape),
  next: PropTypes.string,
  loading: PropTypes.bool,
  refreshing: PropTypes.bool,
  errorMessage: PropTypes.string,
  user: UserShape,
  fetchTimesheet: PropTypes.func.isRequired,
  refreshTimesheet: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  draft: TimesheetShape,
  setDraftTimesheet: PropTypes.func.isRequired,
  getDraftTimeSheet: PropTypes.func.isRequired,
}

LeadWorkerTimesheetList.defaultProps = {
  list: [],
  next: null,
  loading: true,
  refreshing: false,
  errorMessage: '',
  user: {},
  draft: null,
}

const mapStateToProps = createStructuredSelector({
  list: listSelector,
  next: nextSelector,
  loading: loadingSelector,
  refreshing: refreshingSelector,
  errorMessage: errorMsgSelector,
  user: userSelector,
  draft: draftTimesheetSelector,
})

const mapDispatchToProps = {
  fetchTimesheet,
  refreshTimesheet,
  resetErrorMessage,
  setDraftTimesheet,
  getDraftTimeSheet,
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadWorkerTimesheetList)
