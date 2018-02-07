import React, { Component } from 'react'
import { View, StyleSheet, LayoutAnimation } from 'react-native'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEmpty, isEqual, map, find, omit, trim } from 'lodash'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import { ARROW_DIRECTION, BOTTOM_BUTTON_HEIGHT, TOTAL_ITEM_HEIGHT, COLOR } from '../../constants/styleGuide'
import loadingLayer from '../../components/loadingLayer'
import LabelTextInput from '../../components/labelTextInput'
import PickerPanel from '../../components/pickerPanel'
import pickerUtil from '../../utilities/pickerUtil'
import ExtraLineList from '../components/extraLineList'
import SubmitButtonGroup from '../../shared/submitButtonGroup'
import TotalItem from '../../shared/reportTotalItem'
import {
  ExtraLineShape,
  ExtraWorkOrderBasicInfoShape,
  ExtraWorkOrderDraftShape,
  WorkItemShape,
  UserShape,
} from '../../shared/shape'
import { basicInfoSelector, extraLinesSelector, submittingSelector } from '../selector'
import { workItemsSelector } from '../../work-item/selector'
import { draftExtraWorkOrderSelector } from '../../draft/selector'
import { DELETE_ITEM_ANIMA } from '../../utilities/animaUtil'
import {
  refreshExtraWorkOrders,
  resetBasicInfo,
  setBasicInfo,
  submitExtraWorkOrder,
  updateExtraLine,
  setExtraLines,
} from '../actions'
import { calculateTotalMoney, formatMoney, convertExtraLineForSubmit, getWorkItemsAttribute } from '../utilities'
import { LOCATION_ENTRANCE, LOCATION_PLACEHOLDER, TITLE } from '../constants'
import { changeShowAlertState } from '../../report/actions'
import { setDraftExtraWorkOrder } from '../../draft/actions'
import { userSelector } from '../../auth/selector'
import { formatUTCZeroDate } from '../../utilities/dateUtils'
import { isCoordinateNotEmpty } from '../../utilities/mapUtil'
import { showError, showInfo } from '../../utilities/messageBar'
import { ERROR_MSG } from '../../constants/toast'
import STATUS from '../../constants/status'
import { createDraft, showDraftAlert } from '../../draft/utilities'
import AddItemButton from '../../shared/addItemButton'
import { StableBottomView } from '../../components/stableBottomView'
import { BottomPlaceholder } from '../../components/bottomPlaceholder'
import ShowAlertBackHandlerBase from '../../components/showAlertBackHandlerBase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_WHITE,
  },
  scrollContainer: {
    flex: 1,
  },
  basicInfo: {
    backgroundColor: COLOR.WHITE,
    paddingLeft: 15,
    borderColor: COLOR.BORDER_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
})

class CreateExtraWorkOrder extends Component {
  state = {
    isWorkPackageFocused: false,
    isAssociatedWorkOrderFocused: false,
  }

  componentDidMount() {
    const { user, workItems } = this.props
    this.workPackages = getWorkItemsAttribute(workItems, 'work_package', 'work_package_name')
    this.workPackagesOnlyName = map(this.workPackages, 'work_package_name')
    this.workOrders = getWorkItemsAttribute(workItems, 'work_order', 'work_order_name')
    this.workOrdersOnlyName = map(this.workOrders, 'work_order_name')

    if (isEqual(STATUS.DRAFT, this.props.status)) {
      const { basicInfo, extraLines } = this.props.draft
      this.props.setBasicInfo(basicInfo)
      this.props.setExtraLines(extraLines)
      return
    }
    this.props.resetBasicInfo(user)

    if (this.workPackages.length === 1) {
      const defaultWorkPackage = this.workPackages[0]
      this.props.setBasicInfo({
        work_package: defaultWorkPackage.work_package,
        work_package_name: defaultWorkPackage.work_package_name,
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { basicInfo, extraLines, draft } = this.props
    if (nextProps.extraLines.length < extraLines.length) {
      LayoutAnimation.configureNext(DELETE_ITEM_ANIMA)
    }
    if (nextProps.extraLines.length > extraLines.length) {
      this.scrollView.scrollToPosition(0, 200, true)
    }

    if (isEqual(this.props.status, STATUS.DRAFT)) {
      if (!isEqual(nextProps.basicInfo, draft.basicInfo)
      || nextProps.extraLines !== draft.extraLines) {
        this.props.changeShowAlertState(true)
      }
      return
    }

    if (!isEqual(nextProps.basicInfo, basicInfo) && !isEmpty(basicInfo.name)) {
      this.props.changeShowAlertState(true)
    }
    if (nextProps.extraLines !== extraLines) {
      this.props.changeShowAlertState(!isEmpty(nextProps.extraLines))
    }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
    this.props.resetBasicInfo()
    this.props.updateExtraLine()
    pickerUtil.hide()
  }

  onSaveDraft = () => {
    const { user, basicInfo, extraLines } = this.props
    const { status } = basicInfo
    const draftBasicInfo = { ...basicInfo, status: STATUS.DRAFT }
    const draft = { ...{ basicInfo: draftBasicInfo }, extraLines }

    const params = {
      ...{
        setToDraft: this.props.setDraftExtraWorkOrder,
        name: draft.basicInfo.name,
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
    this.props.submitExtraWorkOrder(this.getParams())
      .then(response => {
        const { basicInfo, user } = this.props
        if (isEqual(basicInfo.status, STATUS.DRAFT)) {
          this.props.setDraftExtraWorkOrder(null, user)
        }
        this.props.refreshExtraWorkOrders()
        Actions.pop()
        showInfo(`${response.value.name} is submitted.`)
      })
      .catch(() => {
        showError(ERROR_MSG)
      })
  }

  getParams = () => {
    const { basicInfo, extraLines } = this.props
    return (
    {
      ...omit(basicInfo, 'work_package_name', 'associated_work_order_name', 'status'),
      submitted_date: formatUTCZeroDate(new Date()),
      items: map(extraLines, extraLine => convertExtraLineForSubmit(extraLine)),
    })
  }

  isSubmittedButtonActive = () => {
    const { basicInfo, extraLines } = this.props
    const { name, work_package, description, location } = basicInfo
    return (
      !isEmpty(name)
      && work_package  // eslint-disable-line
      && isCoordinateNotEmpty(location)
      && !isEmpty(description)
      && !isEmpty(extraLines)
    )
  }

  isDraftButtonActive = () => {
    const { name } = this.props.basicInfo
    return !isEmpty(name)
  }

  workPackagePicker = () => {
    const { basicInfo } = this.props
    pickerUtil.build({
      title: '',
      dataSource: this.workPackagesOnlyName,
      value: [basicInfo.work_package_name],
      onConfirm: arr => {
        this.setState({ isWorkPackageFocused: false })
        const workPackage = find(this.workPackages, item =>
          isEqual(item.work_package_name, arr[0])).work_package
        this.props.setBasicInfo({
          work_package: workPackage,
          work_package_name: arr[0],
        })
      },
      onCancel: () => {
        this.setState({ isWorkPackageFocused: false })
      },
    })
  }

  associatedWorkOrderPicker = () => {
    const { basicInfo } = this.props
    pickerUtil.build({
      title: '',
      dataSource: this.workOrdersOnlyName,
      value: [basicInfo.associated_work_order_name],
      onConfirm: arr => {
        this.setState({ isAssociatedWorkOrderFocused: false })
        const workOrder = find(this.workOrders, item =>
          isEqual(item.work_order_name, arr[0])).work_order
        this.props.setBasicInfo({
          associated_work_order: workOrder,
          associated_work_order_name: arr[0],
        })
      },
      onCancel: () => {
        this.setState({ isAssociatedWorkOrderFocused: false })
      },
    })
  }

  trimName = () => {
    const trimName = trim(this.props.basicInfo.name)
    this.props.setBasicInfo({ name: trimName })
  }

  renderBasicInfo = basicInfo => (
    <View style={styles.basicInfo}>
      <LabelTextInput
        labelName="Work Order Name"
        text={basicInfo.name}
        onChangeText={val => this.props.setBasicInfo({ name: val })}
        onBlur={this.trimName}
      />
      <PickerPanel
        labelName="Work Package"
        content={basicInfo.work_package_name}
        onPress={this.workPackagePicker}
        isInputAreaFocused={this.state.isWorkPackageFocused}
        placeholder="Please select"
      />
      <PickerPanel
        labelName="Associated Work Order"
        content={basicInfo.associated_work_order_name}
        onPress={this.associatedWorkOrderPicker}
        isInputAreaFocused={this.state.isAssociatedWorkOrderFocused}
        placeholder="Optional"
      />
      <PickerPanel
        labelName="Location"
        content={basicInfo.address}
        onPress={() => Actions.mapPicker({
          coordinate: basicInfo.location,
          address: basicInfo.address,
          locationEntrance: LOCATION_ENTRANCE.EXTRA_WORK_ORDER,
        })}
        arrowDirection={ARROW_DIRECTION.RIGHT}
        placeholder={LOCATION_PLACEHOLDER}
        touchableWithoutFeedback
      />
      <LabelTextInput
        labelName="Description"
        text={basicInfo.description}
        onChangeText={val => this.props.setBasicInfo({ description: val })}
      />
      <LabelTextInput
        labelName="Notes"
        placeholder="Optional"
        text={basicInfo.notes}
        onChangeText={val => this.props.setBasicInfo({ notes: val })}
      />
      <AddItemButton onPress={() => Actions.addItem({ title: TITLE.ADD_ITEM })} />
    </View>
  )

  render() {
    const { basicInfo, extraLines } = this.props
    const bottomButtonHeight = TOTAL_ITEM_HEIGHT + BOTTOM_BUTTON_HEIGHT
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          ref={ref => { this.scrollView = ref }}
          style={styles.scrollContainer}
        >
          {this.renderBasicInfo(basicInfo)}
          <ExtraLineList extraLines={extraLines} />
          <BottomPlaceholder height={bottomButtonHeight} />
        </KeyboardAwareScrollView>
        <StableBottomView height={bottomButtonHeight}>
          <TotalItem itemsCount={extraLines.length} totalText={`$ ${formatMoney(calculateTotalMoney(extraLines))}`} />
          <SubmitButtonGroup
            onSaveDraft={this.onSaveDraft}
            onSubmit={this.onSubmit}
            isDraftButtonActive={this.isDraftButtonActive()}
            isSubmittedButtonActive={this.isSubmittedButtonActive()}
          />
        </StableBottomView>
      </View>
    )
  }
}

CreateExtraWorkOrder.propTypes = {
  setBasicInfo: PropTypes.func.isRequired,
  resetBasicInfo: PropTypes.func.isRequired,
  changeShowAlertState: PropTypes.func.isRequired,
  submitExtraWorkOrder: PropTypes.func.isRequired,
  refreshExtraWorkOrders: PropTypes.func.isRequired,
  updateExtraLine: PropTypes.func.isRequired,
  setDraftExtraWorkOrder: PropTypes.func.isRequired,
  setExtraLines: PropTypes.func.isRequired,
  basicInfo: ExtraWorkOrderBasicInfoShape.isRequired,
  extraLines: PropTypes.arrayOf(ExtraLineShape).isRequired,
  workItems: PropTypes.arrayOf(WorkItemShape).isRequired,
  user: UserShape.isRequired,
  draft: ExtraWorkOrderDraftShape,
  status: PropTypes.string,
}

CreateExtraWorkOrder.defaultProps = {
  draft: null,
  status: '',
}

const mapStateToProps = createStructuredSelector({
  showLoading: submittingSelector,
  basicInfo: basicInfoSelector,
  extraLines: extraLinesSelector,
  workItems: workItemsSelector,
  user: userSelector,
  draft: draftExtraWorkOrderSelector,
})

const mapDispatchToProps = {
  changeShowAlertState,
  setBasicInfo,
  resetBasicInfo,
  submitExtraWorkOrder,
  refreshExtraWorkOrders,
  updateExtraLine,
  setDraftExtraWorkOrder,
  setExtraLines,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
  loadingLayer, ShowAlertBackHandlerBase)(CreateExtraWorkOrder)
