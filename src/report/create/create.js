import React, { Component } from 'react'
import { View, StyleSheet, LayoutAnimation } from 'react-native'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEmpty, noop, indexOf, isEqual, padStart, map, trim } from 'lodash'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import { BOTTOM_BUTTON_HEIGHT, COLOR } from '../../constants/styleGuide'
import LabelTextInput from '../../components/labelTextInput'
import PickerPanel from '../../components/pickerPanel'
import pickerUtil from '../../utilities/pickerUtil'
import { createDateData, monthNames, formatUTCZeroDate } from '../../utilities/dateUtils'
import { WorkItemShape, UserShape, ReportShape } from '../../shared/shape'
import {
  productReportLinesSelector,
  loadingSelector,
  reportNameSelector,
  reportedDateSelector,
  reportNotesSelector,
} from '../selector'
import { draftReportSelector } from '../../draft/selector'
import { userFullNameSelector, userSelector } from '../../auth/selector'
import {
  setProductionLines,
  submitReport,
  changeShowAlertState,
  setReportInfo,
  fetchReports,
  resetReportInfo,
  setOriginWorkItems,
} from '../actions'
import { setDraftReport } from '../../draft/actions'
import { uploadPictures, resetUploadedPictures, cleanUnusedPictures } from '../pictureActions'
import loadingLayer from '../../components/loadingLayer'
import { showError, showInfo } from '../../utilities/messageBar'
import { ERROR_MSG } from '../../constants/toast'
import { DELETE_ITEM_ANIMA } from '../../utilities/animaUtil'
import SubmitButtonGroup from '../../shared/submitButtonGroup'
import STATUS from '../../constants/status'
import { getShowText } from '../../utilities/dataProcessUtils'
import {
  getCurrentLocation, convertReportLineToSubmittedData, isQuantityFieldEmpty, isRequiredPhotoEmpty,
  getWorkItemsFromReportLines,
} from '../utilities'
import { createDraft, showDraftAlert } from '../../draft/utilities'
import ReportLineList from '../components/reportLineList'
import { StableBottomView } from '../../components/stableBottomView'
import { DIGITAL_SIGNATURE } from '../../constants/apiConfig'
import { BottomPlaceholder } from '../../components/bottomPlaceholder'
import { workItemListSelector } from '../../work-item/selector'
import AddItemButton from '../../shared/addItemButton'
import ShowAlertBackHandlerBase from '../../components/showAlertBackHandlerBase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_WHITE,
  },
  scrollContainer: {
    flex: 1,
  },
  reportInfo: {
    backgroundColor: COLOR.WHITE,
    paddingLeft: 15,
    borderColor: COLOR.BORDER_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  workItems: {
    flex: 1,
  },
})

class CreateReport extends Component {
  state = {
    isInputAreaFocused: false,
  }

  componentDidMount() {
    this.props.resetUploadedPictures()
    if (isEqual(this.props.status, STATUS.DRAFT)) {
      const { workItemList, draft } = this.props
      const { documentReference, reportedDate, notes, productReportLines } = draft
      this.props.setReportInfo({ documentReference, reportedDate, notes })
      this.props.setProductionLines(productReportLines)
      this.props.setOriginWorkItems(getWorkItemsFromReportLines(workItemList, productReportLines))
      return
    }

    this.props.setProductionLines()
    this.props.resetReportInfo()
    this.props.setOriginWorkItems()
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.props.status, STATUS.DRAFT)) {
      const { documentReference, reportedDate, notes, productReportLines } = this.props.draft
      if (!isEqual(nextProps.documentReference, documentReference)
        || !isEqual(nextProps.reportedDate, reportedDate)
        || !isEqual(nextProps.notes, notes)
        || !isEqual(nextProps.productReportLines, productReportLines)) {
        this.props.changeShowAlertState(true)
      }

      if (nextProps.productReportLines.length < productReportLines.length) {
        LayoutAnimation.configureNext(DELETE_ITEM_ANIMA)
      }
      return
    }

    const { documentReference, reportedDate, notes, productReportLines } = this.props
    if (nextProps.documentReference !== documentReference
      || nextProps.reportedDate !== reportedDate
      || nextProps.notes !== notes
    ) {
      this.props.changeShowAlertState(true)
    }
    if (nextProps.productReportLines !== productReportLines) {
      this.props.changeShowAlertState(!isEmpty(nextProps.productReportLines))
    }
    if (nextProps.productReportLines.length < productReportLines.length) {
      LayoutAnimation.configureNext(DELETE_ITEM_ANIMA)
    }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)

    pickerUtil.hide()
  }

  onSaveDraft = () => {
    const { documentReference, notes, productReportLines, user, reportedDate, status } = this.props
    const draft = {
      documentReference: documentReference,
      reportedDate: reportedDate,
      notes: notes,
      productReportLines: productReportLines,
      status: STATUS.DRAFT,
      approver_name: getShowText(),
    }

    const params = {
      ...{
        setToDraft: this.props.setDraftReport,
        name: documentReference,
      },
      draft,
      user,
    }

    if (isEmpty(status) && !isEmpty(this.props.draft)) {
      showDraftAlert(params)
    } else {
      createDraft(params)
    }
  }

  onSubmit = () => {
    const { status, user, productReportLines } = this.props
    Promise.all([this.props.uploadPictures(productReportLines), getCurrentLocation()])
      .then(res => this.submitReport(res[0], res[1]))
      .then(response => {
        if (isEqual(status, STATUS.DRAFT)) {
          this.props.setDraftReport(null, user)
        }
        this.props.fetchReports(0, user)
        this.props.cleanUnusedPictures()
        Actions.pop()
        showInfo(`${response.value.document_reference} is submitted.`)
      })
      .catch(() => {
        showError(ERROR_MSG)
      })
  }

  submitReport = (allUploadedPictures, location) => {
    const { productReportLines, documentReference,
      userFullName, notes, reportedDate } = this.props
    const date = new Date(
      reportedDate[0],
      padStart(indexOf(monthNames, reportedDate[1]), 2, 0),
      padStart(reportedDate[2], 2, 0),
    )
    let locations = []
    if (!isEmpty(location)) {
      locations = [location]
    }
    const submitReportParams = {
      document_reference: documentReference,
      reported_date: formatUTCZeroDate(date),
      submitted_date: formatUTCZeroDate(new Date()),
      created_by_name: userFullName,
      notes: notes,
      locations: locations,
      production_lines: map(productReportLines, productReportLine =>
              convertReportLineToSubmittedData(productReportLine, allUploadedPictures)),
      digital_signature: DIGITAL_SIGNATURE,
    }

    return this.props.submitReport(submitReportParams)
  }

  datePicker = () => {
    const { reportedDate } = this.props
    const dataSource = []
    createDateData(dataSource)

    pickerUtil.build({
      title: '',
      dataSource: dataSource,
      value: [reportedDate[0], reportedDate[1], reportedDate[2]],
      onConfirm: arr => {
        this.setState({ isInputAreaFocused: false })
        this.props.setReportInfo({ reportedDate: arr })
      },
      onCancel: () => {
        this.setState({ isInputAreaFocused: false })
      },
    })
  }

  isSubmitButtonActive = () => {
    const { documentReference, reportedDate, productReportLines } = this.props
    return !(isEmpty(documentReference)
    || isEmpty(reportedDate)
    || isEmpty(productReportLines)
    || isQuantityFieldEmpty(productReportLines)
    || isRequiredPhotoEmpty(productReportLines))
  }

  trimName = () => {
    const trimName = trim(this.props.documentReference)
    this.props.setReportInfo({ documentReference: trimName })
  }

  render() {
    const { documentReference, reportedDate, notes, productReportLines } = this.props
    const formatDate = isEmpty(reportedDate) ? '' : `${reportedDate[0]}-${padStart(indexOf(monthNames, reportedDate[1]) + 1, 2, 0)}-${padStart(reportedDate[2], 2, 0)}`

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.scrollContainer}>
          <View style={styles.reportInfo}>
            <LabelTextInput
              labelName="Report Name"
              text={documentReference}
              onChangeText={val => this.props.setReportInfo({ documentReference: val })}
              onBlur={this.trimName}
            />
            <PickerPanel
              labelName="Report Date"
              content={formatDate}
              onPress={this.datePicker}
              isInputAreaFocused={this.state.isInputAreaFocused}
            />
            <LabelTextInput
              labelName="Notes"
              placeholder="Optional"
              text={notes}
              onChangeText={val => this.props.setReportInfo({ notes: val })}
            />
            <AddItemButton onPress={Actions.selectWorkItems} addText="Add Work Item" />
          </View>
          <ReportLineList reportLines={productReportLines} editable />
          <BottomPlaceholder height={BOTTOM_BUTTON_HEIGHT} />
        </KeyboardAwareScrollView>
        <StableBottomView height={BOTTOM_BUTTON_HEIGHT}>
          <SubmitButtonGroup
            onSaveDraft={this.onSaveDraft}
            onSubmit={this.onSubmit}
            isSubmittedButtonActive={this.isSubmitButtonActive()}
            isDraftButtonActive={this.isSubmitButtonActive()}
          />
        </StableBottomView>
      </View>
    )
  }
}

CreateReport.propTypes = {
  productReportLines: PropTypes.arrayOf(WorkItemShape),
  submitReport: PropTypes.func.isRequired,
  setProductionLines: PropTypes.func.isRequired,
  resetReportInfo: PropTypes.func.isRequired,
  changeShowAlertState: PropTypes.func,
  documentReference: PropTypes.string,
  reportedDate: PropTypes.arrayOf(PropTypes.any),
  notes: PropTypes.string,
  setReportInfo: PropTypes.func.isRequired,
  fetchReports: PropTypes.func.isRequired,
  setDraftReport: PropTypes.func.isRequired,
  user: UserShape.isRequired,
  draft: ReportShape,
  status: PropTypes.string,
  uploadPictures: PropTypes.func.isRequired,
  resetUploadedPictures: PropTypes.func.isRequired,
  cleanUnusedPictures: PropTypes.func.isRequired,
  userFullName: PropTypes.string,
  setOriginWorkItems: PropTypes.func.isRequired,
  workItemList: PropTypes.arrayOf(WorkItemShape).isRequired,
}

CreateReport.defaultProps = {
  productReportLines: [],
  userFullName: '',
  changeShowAlertState: noop,
  documentReference: '',
  notes: '',
  draft: {},
  status: '',
  reportedDate: [],
}

const mapStateToProps = createStructuredSelector({
  productReportLines: productReportLinesSelector,
  userFullName: userFullNameSelector,
  showLoading: loadingSelector,
  documentReference: reportNameSelector,
  reportedDate: reportedDateSelector,
  notes: reportNotesSelector,
  user: userSelector,
  draft: draftReportSelector,
  workItemList: workItemListSelector,
})

const mapDispatchToProps = {
  submitReport,
  setProductionLines,
  resetReportInfo,
  changeShowAlertState,
  setReportInfo,
  fetchReports,
  setDraftReport,
  uploadPictures,
  resetUploadedPictures,
  cleanUnusedPictures,
  setOriginWorkItems,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
loadingLayer, ShowAlertBackHandlerBase)(CreateReport)

