import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { View, StatusBar, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { isEmpty } from 'lodash'
import { compose } from 'recompose'
import { COLOR } from '../../constants/styleGuide'
import { formatDate } from '../../utilities/dateUtils'
import { ReportShape, UserShape, WorkItemShape } from '../../shared/shape'
import { isConstructionManager } from '../../utilities/role'
import { ROLE_MAPPING } from '../constants'
import STATUS from '../../constants/status'
import ReportButtonGroup, { REPORT_BUTTON_HEIGHT } from './reportButtonGroup'
import { showError, showInfo } from '../../utilities/messageBar'
import { patchReport, fetchReports, changeShowAlertState, setOriginWorkItems, setCurrentReportId } from '../actions'
import loadingLayer from '../../components/loadingLayer'
import StatusRow from '../../shared/reportStatusRow'
import LabelTextView from '../../components/labelTextView'
import CommentView from '../../shared/commentView'
import EditComment from '../../shared/editComment'
import ReportLineList from '../components/reportLineList'
import { StableBottomView } from '../../components/stableBottomView'
import { getWorkItemsFromReportLines } from '../utilities'
import { commentEditable } from '../../utilities/commentUtil'
import { BottomPlaceholder } from '../../components/bottomPlaceholder'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_WHITE,
  },
  headerContainer: {
    backgroundColor: COLOR.WHITE,
    paddingBottom: 10,
    borderColor: COLOR.BORDER_GREY,
    borderBottomWidth: 1,
  },
  basicInfoContainer: {
    paddingHorizontal: 15,
  },
})

export class ReportDetail extends Component {

  constructor(props) {
    super(props)
    this.state = { comments: props.reportDetailData.comments }
  }

  componentDidMount() {
    StatusBar.setHidden(false)
    const { reportDetailData, workItemList } = this.props
    const { id, production_lines } = reportDetailData
    this.props.setOriginWorkItems(getWorkItemsFromReportLines(workItemList, production_lines))
    this.props.setCurrentReportId(id)
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
  }

  get role() {
    return { role: this.props.user.role, isManager: isConstructionManager(this.props.user.role) }
  }

  handleSubmit = flag => {
    if (flag && isEmpty(this.state.comments)) {
      showError('Please add comment to flag the report')
      return
    }
    const { reportDetailData } = this.props
    const { id } = reportDetailData
    const comments = this.state.comments
    const status = (flag ? STATUS.FLAGGED : STATUS.APPROVED).toLowerCase()
    this.props.patchReport({ id, status, comments }).then(() => {
      const { user } = this.props
      this.props.fetchReports(0, user)
      Actions.pop()
      showInfo(`${reportDetailData.document_reference} is ${status}.`)
    }).catch(error => {
      showError(error.message)
    })
  }

  isCommentEditable = reportDetailData =>
    commentEditable({ isApprover: this.role.isManager, status: reportDetailData.status })

  renderCommentViewMode = reportDetailData => {
    const comments = reportDetailData.comments
    const isManager = this.role.isManager
    if (!comments || this.isCommentEditable(reportDetailData)) {
      return <View />
    }
    return (
      <CommentView
        title={isManager ? 'My Comment' : `Comment from ${reportDetailData.approver_name}`}
        content={comments}
      />
    )
  }

  renderCommentEditMode = reportDetailData => {
    if (!this.isCommentEditable(reportDetailData)) {
      return <View />
    }
    return (
      <EditComment
        flagText={this.state.comments}
        onChangeText={value => {
          this.setState({ comments: value })
          this.props.changeShowAlertState(true)
        }}
      />)
  }

  renderStatusRow = reportDetailData => {
    const { role } = this.role
    const { nameLabel, name } = ROLE_MAPPING[role.toUpperCase()]
    const nameContent = `${nameLabel} ${reportDetailData[name]}`
    return (<StatusRow nameContent={nameContent} status={reportDetailData.status} />)
  }

  renderReportHeader = reportDetailData => (
    <View style={styles.headerContainer}>
      {this.renderCommentViewMode(reportDetailData)}
      {this.renderStatusRow(reportDetailData)}
      <View style={styles.basicInfoContainer}>
        <LabelTextView label="Report Name" value={reportDetailData.document_reference} />
        <LabelTextView label="Report Date" value={formatDate(reportDetailData.reported_date)} />
        <LabelTextView
          label="Submitted Date"
          value={formatDate(reportDetailData.submitted_date)}
        />
        {!isEmpty(reportDetailData.notes) && <LabelTextView label="Notes" value={reportDetailData.notes} />}
      </View>
    </View>
  )

  renderBottomView = reportDetailData => {
    if (this.isCommentEditable(reportDetailData)) {
      return <BottomPlaceholder height={REPORT_BUTTON_HEIGHT} />
    }
    return <BottomPlaceholder />
  }

  renderApproverFlag = reportDetailData => {
    if (this.isCommentEditable(reportDetailData)) {
      return (
        <StableBottomView height={REPORT_BUTTON_HEIGHT}>
          <ReportButtonGroup
            flagOnPress={() => this.handleSubmit(true)}
            approveOnPress={() => this.handleSubmit(false)}
          />
        </StableBottomView>
      )
    }
    return null
  }

  render() {
    const { reportDetailData } = this.props
    return (
      <View style={styles.container}>
        {this.renderCommentEditMode(reportDetailData)}
        <KeyboardAwareScrollView>
          {this.renderReportHeader(reportDetailData)}
          <ReportLineList reportLines={reportDetailData.production_lines} />
          {this.renderBottomView(reportDetailData)}
        </KeyboardAwareScrollView>
        {this.renderApproverFlag(reportDetailData)}
      </View>
    )
  }
}

ReportDetail.propTypes = {
  reportDetailData: ReportShape.isRequired,
  user: UserShape.isRequired,
  patchReport: PropTypes.func.isRequired,
  fetchReports: PropTypes.func.isRequired,
  changeShowAlertState: PropTypes.func.isRequired,
  setOriginWorkItems: PropTypes.func.isRequired,
  setCurrentReportId: PropTypes.func.isRequired,
  workItemList: PropTypes.arrayOf(WorkItemShape).isRequired,
}

const mapStateToProps = state => ({
  user: state.auth.user,
  showLoading: state.reportForm.showLoading,
  workItemList: state.workItems.list,
})

const mapDispatchToProps = {
  patchReport,
  fetchReports,
  changeShowAlertState,
  setOriginWorkItems,
  setCurrentReportId,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
  loadingLayer)(ReportDetail)
