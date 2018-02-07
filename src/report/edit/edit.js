import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { LayoutAnimation, StatusBar, StyleSheet, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { compose } from 'recompose'
import { isEmpty, map, noop } from 'lodash'
import { BOTTOM_BUTTON_HEIGHT, COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import { formatDate, formatUTCZeroDate } from '../../utilities/dateUtils'
import { ReportShape, UserShape, WorkItemShape } from '../../shared/shape'
import { isConstructionManager } from '../../utilities/role'
import { ROLE_MAPPING } from '../constants'
import STATUS from '../../constants/status'
import { showError, showInfo } from '../../utilities/messageBar'
import {
  changeShowAlertState,
  fetchReports,
  patchReport,
  setOriginWorkItems,
  setProductionLines,
  updateReport,
} from '../actions'
import { cleanUnusedPictures, resetUploadedPictures, uploadPictures } from '../pictureActions'
import loadingLayer from '../../components/loadingLayer'
import LabelTextInput from '../../components/labelTextInput'
import { ERROR_MSG } from '../../constants/toast'
import { DELETE_ITEM_ANIMA } from '../../utilities/animaUtil'
import {
  convertReportLineToSubmittedData,
  getWorkItemsFromReportLines,
  isQuantityFieldEmpty,
  isRequiredPhotoEmpty,
} from '../utilities'
import StatusRow from '../../shared/reportStatusRow'
import LabelTextView from '../../components/labelTextView'
import CommentView from '../../shared/commentView'
import ReportLineList from '../components/reportLineList'
import SubmitButton from '../../shared/submitButton'
import { StableBottomView } from '../../components/stableBottomView'
import { BottomPlaceholder } from '../../components/bottomPlaceholder'
import AddItemButton from '../../shared/addItemButton'
import ShowAlertBackHandlerBase from '../../components/showAlertBackHandlerBase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_WHITE,
  },
  headerContainer: {
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.BORDER_GREY,
    borderBottomWidth: 1,
  },
  basicInfoContainer: {
    paddingLeft: 15,
  },
  line: {
    height: 1,
    alignItems: 'stretch',
    backgroundColor: COLOR.DARK_WHITE,
    marginHorizontal: -27,
  },
  separator: {
    height: 5,
    backgroundColor: COLOR.DARK_WHITE,
    marginHorizontal: -27,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.BORDER,
  },
  buttonText: {
    fontSize: FONT.LG,
    color: COLOR.WHITE,
    fontWeight: FONT_WEIGHT.BOLD,
    textAlign: 'center',
  },
})

export class EditReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: this.props.reportDetailData.notes,
    }
  }

  componentDidMount() {
    StatusBar.setHidden(false)
    this.props.resetUploadedPictures()
    this.props.setProductionLines(this.props.reportDetailData.production_lines)
    const { reportDetailData, workItemList } = this.props
    const { production_lines } = reportDetailData
    this.props.setOriginWorkItems(getWorkItemsFromReportLines(workItemList, production_lines))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.productReportLines !== this.props.reportDetailData.production_lines) {
      this.props.changeShowAlertState(true)
    }

    if (nextProps.productReportLines.length < this.props.productReportLines.length) {
      LayoutAnimation.configureNext(DELETE_ITEM_ANIMA)
    }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
  }

  onSubmitReport = () => {
    const { user, productReportLines } = this.props
    this.props.uploadPictures(productReportLines)
      .then(allUploadedPictures =>
        this.props.updateReport(this.getReportParams(allUploadedPictures)))
      .then(response => {
        this.props.fetchReports(0, user)
        this.props.cleanUnusedPictures()
        Actions.pop()
        showInfo(`${response.value.document_reference} is resubmitted.`)
      }).catch(() => {
        showError(ERROR_MSG)
      })
  }

  getReportParams = allUploadedPictures => {
    const { notes } = this.state

    // TODO: add getCurrentLocation function
    const { reportDetailData, productReportLines } = this.props
    return {
      ...reportDetailData,
      status: STATUS.RESUBMITTED.toLowerCase(),
      submitted_date: formatUTCZeroDate(new Date()),
      notes: notes,
      production_lines: map(productReportLines, productReportLine =>
        convertReportLineToSubmittedData(productReportLine, allUploadedPictures)),
    }
  }

  get role() {
    return { role: this.props.user.role, isManager: isConstructionManager(this.props.user.role) }
  }

  get isSubmitButtonActive() {
    const { productReportLines } = this.props
    const actualProductReportLines = productReportLines.filter(reportLine => reportLine.is_active)
    return !(isEmpty(actualProductReportLines)
    || isQuantityFieldEmpty(actualProductReportLines)
    || isRequiredPhotoEmpty(actualProductReportLines))
  }

  handleOnChangeNotes = state => {
    this.setState(state)
    this.props.changeShowAlertState(true)
  }

  renderComment = reportDetailData => {
    if (!reportDetailData.comments) {
      return null
    }
    const { isManager } = this.role
    return (
      <CommentView
        title={isManager ? 'My Comment' : `Comment from ${reportDetailData.approver_name}`}
        content={reportDetailData.comments}
      />
    )
  }

  renderNotes = () => (
    <LabelTextInput
      labelName="Notes"
      text={this.state.notes}
      placeholder="Optional"
      onChangeText={value => this.handleOnChangeNotes({ notes: value })}
      multiline={false}
    />
  )

  renderStatusRow = reportDetailData => {
    const { role } = this.role
    const { nameLabel, name } = ROLE_MAPPING[role.toUpperCase()]
    const nameContent = `${nameLabel} ${reportDetailData[name]}`
    return (<StatusRow nameContent={nameContent} status={reportDetailData.status} />)
  }

  renderReportHeader = reportDetailData => (
    <View style={styles.headerContainer}>
      {this.renderComment(reportDetailData)}
      {this.renderStatusRow(reportDetailData)}
      <View style={styles.basicInfoContainer}>
        <LabelTextView label="Report Name" value={reportDetailData.document_reference} />
        <LabelTextView label="Report Date" value={formatDate(reportDetailData.reported_date)} />
        <LabelTextView
          label="Submitted Date"
          value={formatDate(reportDetailData.submitted_date)}
        />
        {this.renderNotes()}
        <AddItemButton onPress={Actions.selectWorkItems} addText="Add Work Item" />
      </View>
    </View>
  )

  render() {
    const { reportDetailData, productReportLines } = this.props
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          {this.renderReportHeader(reportDetailData)}
          <ReportLineList reportLines={productReportLines} editable />
          <BottomPlaceholder height={BOTTOM_BUTTON_HEIGHT} />
        </KeyboardAwareScrollView>
        <StableBottomView height={BOTTOM_BUTTON_HEIGHT}>
          <SubmitButton
            onSubmit={this.onSubmitReport}
            isButtonActive={this.isSubmitButtonActive}
          />
        </StableBottomView>
      </View>
    )
  }
}

EditReport.propTypes = {
  reportDetailData: ReportShape.isRequired,
  user: UserShape.isRequired,
  updateReport: PropTypes.func.isRequired,
  fetchReports: PropTypes.func.isRequired,
  productReportLines: PropTypes.arrayOf(WorkItemShape),
  setProductionLines: PropTypes.func.isRequired,
  changeShowAlertState: PropTypes.func,
  uploadPictures: PropTypes.func.isRequired,
  resetUploadedPictures: PropTypes.func.isRequired,
  cleanUnusedPictures: PropTypes.func.isRequired,
  setOriginWorkItems: PropTypes.func.isRequired,
  workItemList: PropTypes.arrayOf(WorkItemShape).isRequired,
}

EditReport.defaultProps = {
  productReportLines: [],
  changeShowAlertState: noop,
  startShowLoading: noop,
}

const mapStateToProps = state => ({
  user: state.auth.user,
  showLoading: state.reportForm.showLoading,
  productReportLines: state.reportForm.productReportLines,
  selectedIds: state.workItems.selectedIds,
  workItemList: state.workItems.list,
})

const mapDispatchToProps = {
  patchReport,
  fetchReports,
  setProductionLines,
  updateReport,
  changeShowAlertState,
  uploadPictures,
  resetUploadedPictures,
  cleanUnusedPictures,
  setOriginWorkItems,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
loadingLayer, ShowAlertBackHandlerBase)(EditReport)
