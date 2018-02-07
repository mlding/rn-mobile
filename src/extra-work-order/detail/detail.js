import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createStructuredSelector } from 'reselect'
import ActionSheet from 'react-native-actionsheet'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { compose } from 'recompose'
import { isEmpty, noop, findIndex } from 'lodash'
import PropTypes from 'prop-types'
import LabelTextView from '../../components/labelTextView'
import StatusRow from '../../shared/reportStatusRow'
import CommentView from '../../shared/commentView'
import ExtraLineList from '../components/extraLineList'
import Button from '../../components/button'
import Icon from '../../components/icon'
import TotalItem from '../../shared/reportTotalItem'
import { calculateTotalMoney, formatMoney } from '../utilities'
import { ExtraWorkOrderShape, UserShape } from '../../shared/shape'
import { TOTAL_ITEM_HEIGHT, COLOR, FONT } from '../../constants/styleGuide'
import { getShowText } from '../../utilities/dataProcessUtils'
import { ROLE_MAPPING } from '../../report/constants'
import { formatDate } from '../../utilities/dateUtils'
import { isConstructionManager } from '../../utilities/role'
import ReportButtonGroup, { REPORT_BUTTON_HEIGHT } from '../../report/detail/reportButtonGroup'
import STATUS from '../../constants/status'
import { showError, showInfo } from '../../utilities/messageBar'
import { changeShowAlertState } from '../../report/actions'
import EditComment from '../../shared/editComment'
import { APPROVE_STATE } from '../constants'
import { fetchExtraWorkOrder, patchExtraWorkOrder } from '../actions'
import loadingLayer from '../../components/loadingLayer'
import { userSelector } from '../../auth/selector'
import { submittingSelector } from '../selector'
import Strings from '../../constants/strings'
import { StableBottomView } from '../../components/stableBottomView'
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
  fieldWrapper: {
    marginTop: 15,
    marginBottom: 4,
  },
  labelWrapper: {
    flexDirection: 'row',
  },
  label: {
    fontSize: FONT.MD,
    color: COLOR.SILVER,
  },
  field: {
    fontSize: FONT.LG,
    color: COLOR.MEDIUM_BLACK,
    paddingTop: 5,
  },
  iconButton: {
    paddingLeft: 10,
    paddingRight: 20,
  },
  icon: {
    fontSize: FONT.XL,
    color: COLOR.LINK,
  },
})

class ExtraWorkOrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = { comments: props.extraWorkOrder.comments }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
  }

  get role() {
    return { role: this.props.user.role, isManager: isConstructionManager(this.props.user.role) }
  }

  getBottomButtonHeight = extraWorkOrder => TOTAL_ITEM_HEIGHT +
      (this.isCommentEditable(extraWorkOrder) ? REPORT_BUTTON_HEIGHT : 0)

  isCommentEditable = extraWorkOrder =>
    commentEditable({ isApprover: this.role.isManager, status: extraWorkOrder.status })

  handleSubmit = (flag, ewoStatus = null) => {
    const { extraWorkOrder, user } = this.props
    const { comments } = this.state
    if (flag && isEmpty(comments)) {
      showError('Please add comment to flag the extra work order')
      return
    }
    const status = flag ? STATUS.FLAGGED.toLowerCase() : STATUS.APPROVED.toLowerCase()
    this.props.patchExtraWorkOrder({
      id: extraWorkOrder.id,
      status: status,
      comments: comments,
      workorderStatus: ewoStatus })
      .then(() => {
        this.props.fetchExtraWorkOrder(0, user)
        Actions.pop()
        showInfo(`${extraWorkOrder.name} is ${status}.`)
      }).catch(error => {
        showError(error.message)
      })
  }

  renderStatusRow = () => {
    const { role } = this.role
    const { extraWorkOrder } = this.props
    const { nameLabel, name } = ROLE_MAPPING[role.toUpperCase()]
    const nameContent = `${nameLabel} ${extraWorkOrder[name]}`
    return (<StatusRow nameContent={nameContent} status={extraWorkOrder.status} />)
  }

  renderCommentViewMode = () => {
    const { comments, approver_name } = this.props.extraWorkOrder
    if (!comments || this.isCommentEditable(this.props.extraWorkOrder)) {
      return <View />
    }
    const { isManager } = this.role
    return (
      <CommentView
        title={isManager ? 'My Comment' : `Comment from ${approver_name}`} // eslint-disable-line
        content={comments}
      />
    )
  }

  renderCommentEditMode = extraWorkOrder => {
    if (!this.isCommentEditable(extraWorkOrder)) {
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

  renderLocation = () => {
    const { extraWorkOrder } = this.props
    return (
      <View style={styles.fieldWrapper}>
        <View style={styles.labelWrapper}>
          <Text style={styles.label}>Location</Text>
          <Button
            onPress={() => Actions.mapPicker({
              coordinate: extraWorkOrder.location,
              address: extraWorkOrder.address,
              readonly: true,
            })}
            style={styles.iconButton}
          >
            <Icon name="map-location" style={styles.icon} />
          </Button>
        </View>
        <Text style={styles.field}>{extraWorkOrder.address}</Text>
      </View>
    )
  }

  renderBasicInfo = () => {
    const { extraWorkOrder } = this.props
    return (
      <View style={styles.headerContainer}>
        {this.renderCommentViewMode()}
        {this.renderStatusRow()}
        <View style={styles.basicInfoContainer}>
          <LabelTextView label="Work Order Name" value={extraWorkOrder.name} />
          <LabelTextView label="Submitted Date" value={formatDate(extraWorkOrder.submitted_date)} />
          <LabelTextView label="Work Package" value={extraWorkOrder.work_package_name} />
          <LabelTextView label="Associated Work Order" value={getShowText(extraWorkOrder.associated_work_order_name)} />
          {this.renderLocation()}
          <LabelTextView label="Description" value={extraWorkOrder.description} />
          {!isEmpty(extraWorkOrder.notes) && <LabelTextView label="Notes" value={extraWorkOrder.notes} />}
        </View>
      </View>
    )
  }

  renderApproverFlag = extraWorkOrder => {
    if (this.isCommentEditable(extraWorkOrder)) {
      return (
        <ReportButtonGroup
          flagOnPress={() => this.handleSubmit(true)}
          approveOnPress={() => { this.actionSheet.show() }}
        />
      )
    }
    return null
  }

  renderActionSheet = () => {
    const optionsText = [
      APPROVE_STATE.IN_PROGRESS.text,
      APPROVE_STATE.ISSUE.text,
      APPROVE_STATE.COMPLETE.text,
      Strings.Cancel,
    ]
    const optionsValue = [
      APPROVE_STATE.IN_PROGRESS.value,
      APPROVE_STATE.ISSUE.value,
      APPROVE_STATE.COMPLETE.value,
    ]
    const cancelIndex = findIndex(optionsText, it => it === Strings.Cancel)
    return (
      <ActionSheet
        ref={ref => { this.actionSheet = ref }}
        options={optionsText}
        cancelButtonIndex={cancelIndex}
        onPress={index => {
          if (index !== cancelIndex) {
            this.handleSubmit(false, optionsValue[index])
          }
        }}
      />
    )
  }

  render() {
    const { extraWorkOrder } = this.props
    const { items } = extraWorkOrder
    const bottomButtonHeight = this.getBottomButtonHeight(extraWorkOrder)
    return (
      <View style={styles.container}>
        {this.renderCommentEditMode(extraWorkOrder)}
        <KeyboardAwareScrollView>
          {this.renderBasicInfo()}
          <ExtraLineList
            extraLines={items}
            editable={false}
          />
          <BottomPlaceholder height={bottomButtonHeight} />
        </KeyboardAwareScrollView>
        <StableBottomView height={bottomButtonHeight}>
          <TotalItem itemsCount={items.length} totalText={`$ ${formatMoney(calculateTotalMoney(items))}`} />
          {this.renderApproverFlag(extraWorkOrder)}
        </StableBottomView>
        {this.renderActionSheet()}
      </View>
    )
  }
}

ExtraWorkOrderDetail.propTypes = {
  extraWorkOrder: ExtraWorkOrderShape.isRequired,
  user: UserShape.isRequired,
  changeShowAlertState: PropTypes.func.isRequired,
  patchExtraWorkOrder: PropTypes.func,
  fetchExtraWorkOrder: PropTypes.func,
}

ExtraWorkOrderDetail.defaultProps = {
  patchExtraWorkOrder: noop,
  fetchExtraWorkOrder: noop,
}

const mapStateToProps = createStructuredSelector({
  user: userSelector,
  showLoading: submittingSelector,
})

const mapDispatchToProps = {
  patchExtraWorkOrder,
  fetchExtraWorkOrder,
  changeShowAlertState,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
  loadingLayer)(ExtraWorkOrderDetail)
