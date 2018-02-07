import React, { Component } from 'react'
import { LayoutAnimation, View } from 'react-native'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { fetchReports, refreshReports, resetErrorMessage } from '../actions'
import { setDraftReport } from '../../draft/actions'
import { ReportShape, UserShape } from '../../shared/shape'
import ReportItemContainer from './reportItem'
import PullRefreshList from '../../shared/pullRefreshList'
import SwipeDraft from '../../draft/swipeDraft'
import { LIST_SCROLL_THROTTLE } from '../../constants/styleGuide'
import { DELETE_ITEM_ANIMA } from '../../utilities/animaUtil'
import { DRAFT_TYPE } from '../../draft/constants'
import { draftReportSelector } from '../../draft/selector'
import { userSelector } from '../../auth/selector'
import {
  reportErrorMsgSelector,
  reportLoadingSelector,
  reportRefreshingSelecotr,
  reportNextSelector,
  reportListSelector,
} from '../selector'
import { NOTIFICATION_KEY } from '../../notification/constants'

class Reports extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.draft !== null && nextProps.draft === null) {
      LayoutAnimation.configureNext(DELETE_ITEM_ANIMA)
    }
  }

  renderDraft = () => {
    const { draft, setDraftReport, user } = this.props // eslint-disable-line
    if (isEmpty(draft)) {
      return <View />
    }
    return (
      <SwipeDraft
        draft={draft}
        user={user}
        name={draft.documentReference}
        type={DRAFT_TYPE.REPORT}
        setDraft={setDraftReport}
      >
        <ReportItemContainer item={draft} />
      </SwipeDraft>
    )
  }

  render() {
    const { reports, next, loading, refreshing, errorMessage, user, draft } = this.props
    return (
      <PullRefreshList
        items={reports}
        next={next}
        loading={loading}
        refreshing={refreshing}
        errorMessage={errorMessage}
        renderItem={({ item }) => <ReportItemContainer item={item} />}
        emptyLabel="Report"
        notificationKey={NOTIFICATION_KEY.DPR}
        fetchItems={this.props.fetchReports}
        refreshItems={this.props.refreshReports}
        user={user}
        ListHeaderComponent={this.renderDraft}
        hasDraft={!isEmpty(draft)}
        resetErrorMessage={this.props.resetErrorMessage}
        scrollEventThrottle={LIST_SCROLL_THROTTLE}
      />)
  }
}

Reports.propTypes = {
  reports: PropTypes.arrayOf(ReportShape),
  next: PropTypes.string,
  loading: PropTypes.bool,
  refreshing: PropTypes.bool,
  errorMessage: PropTypes.string,
  user: UserShape,
  draft: ReportShape,
  fetchReports: PropTypes.func.isRequired,
  refreshReports: PropTypes.func.isRequired,
  setDraftReport: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
}

Reports.defaultProps = {
  reports: [],
  next: null,
  loading: true,
  refreshing: false,
  errorMessage: '',
  user: {},
  draft: {},
}

const mapStateToProps = createStructuredSelector({
  reports: reportListSelector,
  next: reportNextSelector,
  loading: reportLoadingSelector,
  refreshing: reportRefreshingSelecotr,
  errorMessage: reportErrorMsgSelector,
  user: userSelector,
  draft: draftReportSelector,
})

const mapDispatchToProps = {
  fetchReports,
  refreshReports,
  setDraftReport,
  resetErrorMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
