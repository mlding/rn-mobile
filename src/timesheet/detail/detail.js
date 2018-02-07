import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { compose } from 'recompose'
import { isEmpty, noop } from 'lodash'
import PropTypes from 'prop-types'
import LabelTextView from '../../components/labelTextView'
import StatusRow from '../../shared/reportStatusRow'
import CommentView from '../../shared/commentView'
import TotalItem from '../../shared/reportTotalItem'
import { calculateTotalHours, getHourWithUnit, isApprover, getContentDescription } from '../utilities'
import { TimesheetLineShape, UserShape } from '../../shared/shape'
import { TOTAL_ITEM_HEIGHT, COLOR } from '../../constants/styleGuide'
import { formatDate } from '../../utilities/dateUtils'
import ReportButtonGroup, { REPORT_BUTTON_HEIGHT } from '../../report/detail/reportButtonGroup'
import STATUS from '../../constants/status'
import { showError, showInfo } from '../../utilities/messageBar'
import { changeShowAlertState } from '../../report/actions'
import EditComment from '../../shared/editComment'
import loadingLayer from '../../components/loadingLayer'
import { userSelector } from '../../auth/selector'
import { submittingSelector, viewModeSelector } from '../selector'
import { StableBottomView } from '../../components/stableBottomView'
import { commentEditable } from '../../utilities/commentUtil'
import TimesheetItemList from '../components/timesheetItemList'
import { fetchManagerTimesheet, patchTimesheet } from '../actions'
import { BottomPlaceholder } from '../../components/bottomPlaceholder'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_WHITE,
  },
  headerContainer: {
    backgroundColor: COLOR.WHITE,
  },
  basicInfoContainer: {
    paddingHorizontal: 15,
    backgroundColor: COLOR.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER_GREY,
    paddingBottom: 7,
  },
})

class TimesheetDetail extends Component {
  constructor(props) {
    super(props)
    this.state = { comments: props.timesheet.comments }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
  }

  get isApprover() {
    const { user, viewMode } = this.props
    return isApprover(user.role, viewMode)
  }

  getBottomButtonHeight = timesheet => TOTAL_ITEM_HEIGHT +
    (this.isCommentEditable(timesheet) ? REPORT_BUTTON_HEIGHT : 0)

  isCommentEditable = timesheet =>
    commentEditable({ isApprover: this.isApprover, status: timesheet.status })

  handleSubmit = flag => {
    const { timesheet, user } = this.props
    const { comments } = this.state
    if (flag && isEmpty(comments)) {
      showError('Please add comment to flag the timesheet')
      return
    }
    const status = flag ? STATUS.FLAGGED.toLowerCase() : STATUS.APPROVED.toLowerCase()
    this.props.patchTimesheet({
      id: timesheet.id,
      status: status,
      comments: comments,
    }).then(() => {
      this.props.fetchManagerTimesheet(0, user)
      Actions.pop()
      showInfo(`${timesheet.name} is ${status}.`)
    }).catch(error => {
      showError(error.message)
    })
  }

  renderStatusRow = () => {
    const { timesheet, viewMode, user } = this.props
    return (
      <StatusRow
        nameContent={getContentDescription(timesheet, user.role, viewMode)}
        status={timesheet.status}
      />)
  }

  renderCommentViewMode = timesheet => {
    const comments = timesheet.comments
    if (!comments || this.isCommentEditable(timesheet)) {
      return <View />
    }
    return (
      <CommentView
        title={this.isApprover ? 'My Comment' : `Comment from ${timesheet.approver_name}`}
        content={comments}
      />
    )
  }

  renderCommentEditMode = timesheet => {
    if (!this.isCommentEditable(timesheet)) {
      return <View />
    }
    return (
      <EditComment
        flagText={this.state.comments}
        onChangeText={value => {
          this.setState({ comments: value })
          this.props.changeShowAlertState(true)
        }}
      />
    )
  }

  renderReportHeader = timesheet => (
    <View style={styles.headerContainer}>
      {this.renderCommentViewMode(timesheet)}
      {this.renderStatusRow()}
    </View>
  )

  renderBasicInfo = timesheet => (
    <View style={styles.basicInfoContainer}>
      <LabelTextView label="Name" value={timesheet.name} />
      <LabelTextView label="Submitted Date" value={formatDate(timesheet.submitted_date)} />
      <LabelTextView label="Description" value={timesheet.description} />
      {!isEmpty(timesheet.notes) && <LabelTextView label="Notes" value={timesheet.notes} />}
    </View>
  )

  renderApproverFlag = timesheet => {
    if (this.isCommentEditable(timesheet)) {
      return (
        <ReportButtonGroup
          flagOnPress={() => this.handleSubmit(true)}
          approveOnPress={() => this.handleSubmit(false)}
        />
      )
    }
    return null
  }

  render() {
    const { timesheet } = this.props
    const { lines } = timesheet
    const bottomButtonHeight = this.getBottomButtonHeight(timesheet)
    const totalHours = calculateTotalHours(lines)
    return (
      <View style={styles.container}>
        {this.renderCommentEditMode(timesheet)}
        <KeyboardAwareScrollView>
          {this.renderReportHeader(timesheet)}
          {this.renderBasicInfo(timesheet)}
          <TimesheetItemList timesheetLines={lines} />
          <BottomPlaceholder height={bottomButtonHeight} />
        </KeyboardAwareScrollView>
        <StableBottomView height={bottomButtonHeight}>
          <TotalItem itemsCount={lines.length} totalText={getHourWithUnit(totalHours)} />
          {this.renderApproverFlag(timesheet)}
        </StableBottomView>
      </View>
    )
  }
}

TimesheetDetail.propTypes = {
  timesheet: TimesheetLineShape.isRequired,
  user: UserShape.isRequired,
  changeShowAlertState: PropTypes.func.isRequired,
  patchTimesheet: PropTypes.func,
  fetchManagerTimesheet: PropTypes.func,
  viewMode: PropTypes.string,
}

TimesheetDetail.defaultProps = {
  patchTimesheet: noop,
  fetchManagerTimesheet: noop,
  viewMode: '',
}

const mapStateToProps = createStructuredSelector({
  user: userSelector,
  showLoading: submittingSelector,
  viewMode: viewModeSelector,
})

const mapDispatchToProps = {
  changeShowAlertState,
  patchTimesheet,
  fetchManagerTimesheet,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
  loadingLayer)(TimesheetDetail)
