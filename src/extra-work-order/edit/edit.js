import React, { Component } from 'react'
import { View, StyleSheet, LayoutAnimation } from 'react-native'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEmpty, isEqual, map, find, omit } from 'lodash'
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
import TotalItem from '../../shared/reportTotalItem'
import { ExtraLineShape, ExtraWorkOrderBasicInfoShape, ExtraWorkOrderShape, WorkItemShape } from '../../shared/shape'
import { DELETE_ITEM_ANIMA } from '../../utilities/animaUtil'
import {
  refreshExtraWorkOrders,
  resetBasicInfo,
  setBasicInfo,
  updateExtraWorkOrder,
  updateExtraLine,
  setExtraLines,
} from '../actions'
import { calculateTotalMoney, formatMoney, convertExtraLineForSubmit, getWorkItemsAttribute } from '../utilities'
import { LOCATION_ENTRANCE, LOCATION_PLACEHOLDER, TITLE } from '../constants'
import { changeShowAlertState } from '../../report/actions'
import { setDraftExtraWorkOrder } from '../../draft/actions'
import { roleSelector } from '../../auth/selector'
import { formatDate, formatUTCZeroDate } from '../../utilities/dateUtils'
import { isCoordinateNotEmpty } from '../../utilities/mapUtil'
import { showError, showInfo } from '../../utilities/messageBar'
import { ERROR_MSG } from '../../constants/toast'
import CommentView from '../../shared/commentView'
import StatusRow from '../../shared/reportStatusRow'
import { ROLE_MAPPING } from '../../report/constants'
import { isConstructionManager } from '../../utilities/role'
import SubmitButton from '../../shared/submitButton'
import { basicInfoSelector, extraLinesSelector, submittingSelector } from '../selector'
import LabelTextView from '../../components/labelTextView'
import { workItemsSelector } from '../../work-item/selector'
import STATUS from '../../constants/status'
import AddItemButton from '../../shared/addItemButton'
import { StableBottomView } from '../../components/stableBottomView'
import { BottomPlaceholder } from '../../components/bottomPlaceholder'
import ShowAlertBackHandlerBase from '../../components/showAlertBackHandlerBase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_WHITE,
  },
  basicInfo: {
    backgroundColor: COLOR.WHITE,
    paddingLeft: 15,
    borderColor: COLOR.BORDER_GREY,
    borderBottomWidth: 1,
  },
})

class EditExtraWorkOrder extends Component {

  state = {
    isWorkPackageFocused: false,
    isAssociatedWorkOrderFocused: false,
  }

  componentDidMount() {
    const { extraWorkOrder, workItems } = this.props
    this.workPackages = getWorkItemsAttribute(workItems, 'work_package', 'work_package_name')
    this.workPackagesOnlyName = map(this.workPackages, 'work_package_name')
    this.workOrders = getWorkItemsAttribute(workItems, 'work_order', 'work_order_name')
    this.workOrdersOnlyName = map(this.workOrders, 'work_order_name')
    this.props.setBasicInfo(omit(extraWorkOrder, 'items'))
    this.props.setExtraLines(extraWorkOrder.items)
  }

  componentWillReceiveProps(nextProps) {
    const { extraLines, extraWorkOrder } = this.props
    if (nextProps.extraLines.length < extraLines.length) {
      LayoutAnimation.configureNext(DELETE_ITEM_ANIMA)
    }
    if (nextProps.extraLines.length > extraLines.length) {
      this.scrollView.scrollToPosition(0, 400, true)
    }
    if (!isEqual(nextProps.basicInfo, omit(extraWorkOrder, 'items'))
        || nextProps.extraLines !== extraWorkOrder.items) {
      this.props.changeShowAlertState(true)
    } else {
      this.props.changeShowAlertState(false)
    }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
    this.props.resetBasicInfo()
    this.props.updateExtraLine()
    pickerUtil.hide()
  }

  onSubmit = () => {
    this.props.updateExtraWorkOrder(this.getParams())
      .then(response => {
        this.props.refreshExtraWorkOrders()
        Actions.pop()
        showInfo(`${response.value.name} is resubmitted.`)
      })
      .catch(() => {
        showError(ERROR_MSG)
      })
  }

  getParams = () => {
    const { basicInfo, extraLines } = this.props
    return (
    {
      ...omit(basicInfo, 'work_package_name', 'associated_work_order_name'),
      submitted_date: formatUTCZeroDate(new Date()),
      status: STATUS.RESUBMITTED.toLowerCase(),
      items: map(extraLines, extraLine => convertExtraLineForSubmit(extraLine)),
    })
  }

  get isButtonActive() {
    const { basicInfo, extraLines } = this.props
    const { work_package, location, description } = basicInfo
    return (
      work_package  // eslint-disable-line
      && isCoordinateNotEmpty(location)
      && !isEmpty(description)
      && !isEmpty(extraLines)
    )
  }

  get role() {
    return { role: this.props.role, isManager: isConstructionManager(this.props.role) }
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

  renderComment = extraWorkOrder => {
    if (!extraWorkOrder.comments) {
      return null
    }
    const { isManager } = this.role
    return (
      <CommentView
        title={isManager ? 'My Comment' : `Comment from ${extraWorkOrder.approver_name}`}
        content={extraWorkOrder.comments}
      />
    )
  }

  renderStatusRow = (extraWorkOrder, role) => {
    const { nameLabel, name } = ROLE_MAPPING[role.toUpperCase()]
    const nameContent = `${nameLabel} ${extraWorkOrder[name]}`
    return (<StatusRow nameContent={nameContent} status={extraWorkOrder.status} />)
  }

  renderBasicInfo = basicInfo => (
    <View style={styles.basicInfo}>
      <LabelTextView label="Work Order Name" value={basicInfo.name} />
      <LabelTextView label="Submitted Date" value={formatDate(basicInfo.submitted_date)} />
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
    const { extraWorkOrder, role, basicInfo, extraLines } = this.props
    const bottomButtonHeight = TOTAL_ITEM_HEIGHT + BOTTOM_BUTTON_HEIGHT
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView ref={ref => { this.scrollView = ref }}>
          {this.renderComment(extraWorkOrder)}
          {this.renderStatusRow(extraWorkOrder, role)}
          {this.renderBasicInfo(basicInfo)}
          <ExtraLineList extraLines={extraLines} />
          <BottomPlaceholder height={bottomButtonHeight} />
        </KeyboardAwareScrollView>
        <StableBottomView height={bottomButtonHeight}>
          <TotalItem itemsCount={extraLines.length} totalText={`$ ${formatMoney(calculateTotalMoney(extraLines))}`} />
          <SubmitButton
            onSubmit={this.onSubmit}
            isButtonActive={this.isButtonActive}
          />
        </StableBottomView>
      </View>
    )
  }
}

EditExtraWorkOrder.propTypes = {
  extraWorkOrder: ExtraWorkOrderShape.isRequired,
  role: PropTypes.string.isRequired,
  updateExtraWorkOrder: PropTypes.func.isRequired,
  refreshExtraWorkOrders: PropTypes.func.isRequired,
  setBasicInfo: PropTypes.func.isRequired,
  resetBasicInfo: PropTypes.func.isRequired,
  setExtraLines: PropTypes.func.isRequired,
  updateExtraLine: PropTypes.func.isRequired,
  changeShowAlertState: PropTypes.func.isRequired,
  basicInfo: ExtraWorkOrderBasicInfoShape.isRequired,
  extraLines: PropTypes.arrayOf(ExtraLineShape).isRequired,
  workItems: PropTypes.arrayOf(WorkItemShape).isRequired,
}


const mapStateToProps = createStructuredSelector({
  showLoading: submittingSelector,
  basicInfo: basicInfoSelector,
  extraLines: extraLinesSelector,
  role: roleSelector,
  workItems: workItemsSelector,
})

const mapDispatchToProps = {
  changeShowAlertState,
  setBasicInfo,
  resetBasicInfo,
  updateExtraWorkOrder,
  refreshExtraWorkOrders,
  updateExtraLine,
  setDraftExtraWorkOrder,
  setExtraLines,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
  loadingLayer, ShowAlertBackHandlerBase)(EditExtraWorkOrder)
