import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEqual, isEmpty, omit } from 'lodash'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import { BOTTOM_BUTTON_HEIGHT, TOTAL_ITEM_HEIGHT, COLOR } from '../../constants/styleGuide'
import LabelTextInput from '../../components/labelTextInput'
import LabelTextView from '../../components/labelTextView'
import CommentView from '../../shared/commentView'
import StatusRow from '../../shared/reportStatusRow'
import SubmitButton from '../../shared/submitButton'
import { StableBottomView } from '../../components/stableBottomView'
import AddItemButton from '../../shared/addItemButton'
import TimesheetItemList from '../components/timesheetItemList'
import TotalItem from '../../shared/reportTotalItem'
import loadingLayer from '../../components/loadingLayer'
import {
  setTimesheetBasicInfo,
  resetTimesheetBasicInfo,
  setTimesheetLine,
  updateTimesheet,
  refreshTimesheet,
} from '../actions'
import { changeShowAlertState } from '../../report/actions'
import { timesheetLinesSelector, submittingSelector, timesheetBasicInfoSelector } from '../selector'
import { TITLE } from '../constants'
import { ERROR_MSG } from '../../constants/toast'
import STATUS from '../../constants/status'
import { TimesheetLineShape, TimesheetShape, TimesheetBasicInfoShape } from '../../shared/shape'
import { calculateTotalHours, generateSubmittedLines, getHourWithUnit } from '../utilities'
import { formatDate, formatUTCZeroDate } from '../../utilities/dateUtils'
import { showError, showInfo } from '../../utilities/messageBar'
import { BottomPlaceholder } from '../../components/bottomPlaceholder'
import { getShowText } from '../../utilities/dataProcessUtils'
import ShowAlertBackHandlerBase from '../../components/showAlertBackHandlerBase'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.DARK_WHITE,
  },
  scrollContainer: {
    flex: 1,
  },
  timesheetInfo: {
    backgroundColor: COLOR.WHITE,
    paddingLeft: 15,
    borderColor: COLOR.BORDER_GREY,
    borderBottomWidth: 1,
  },
})

class EditTimesheet extends Component {
  componentDidMount() {
    this.props.setTimesheetBasicInfo(omit(this.props.timesheet, ['lines']))
    this.props.setTimesheetLine(this.props.timesheet.lines)
  }

  componentWillReceiveProps(nextProps) {
    const { timesheet } = this.props
    if (!isEqual(nextProps.basicInfo, omit(timesheet, 'lines'))
      || nextProps.timesheetLines !== timesheet.lines) {
      this.props.changeShowAlertState(true)
    }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
    this.props.resetTimesheetBasicInfo()
    this.props.setTimesheetLine([])
  }

  get isButtonActive() {
    const { basicInfo, timesheetLines } = this.props
    return !(isEmpty(basicInfo.description) || isEmpty(timesheetLines))
  }

  get submitParameter() {
    const { basicInfo, timesheetLines } = this.props
    return {
      ...omit(basicInfo, 'submitted_date', 'status'),
      submitted_date: formatUTCZeroDate(new Date()),
      status: STATUS.RESUBMITTED.toLowerCase(),
      lines: generateSubmittedLines(timesheetLines),
    }
  }

  updateTimesheet = () => {
    this.props.updateTimesheet(this.submitParameter)
      .then(response => {
        this.props.refreshTimesheet()
        Actions.pop()
        showInfo(`${response.value.name} is resubmitted.`)
      })
      .catch(() => {
        showError(ERROR_MSG)
      })
  }

  renderCommentViewMode = () => {
    const { comments, approver_name } = this.props.basicInfo
    if (isEmpty(comments)) {
      return <View />
    }
    return (
      <CommentView
        title={`Comment from ${approver_name}`} //eslint-disable-line
        content={comments}
      />
    )
  }

  renderStatusRow = timesheet => {
    const nameContent = `Review By ${getShowText(timesheet.approver_name)}`
    return (<StatusRow nameContent={nameContent} status={timesheet.status} />)
  }

  renderBasicInfo() {
    const { submitted_date, description, notes, name } = this.props.basicInfo
    return (
      <View style={styles.timesheetInfo}>
        <LabelTextView
          label="Name"
          value={name}
        />
        <LabelTextView
          label="Submitted Date"
          value={formatDate(submitted_date)}
        />
        <LabelTextInput
          labelName="Description"
          maxTextInputLength={128}
          text={description}
          onChangeText={val => this.props.setTimesheetBasicInfo({ description: val })}
        />
        <LabelTextInput
          labelName="Notes"
          maxTextInputLength={256}
          placeholder="Optional"
          text={notes}
          onChangeText={val => this.props.setTimesheetBasicInfo({ notes: val })}
        />
        <AddItemButton onPress={() => Actions.addItemForTimesheet({ title: TITLE.ADD_ITEM })} />
      </View>
    )
  }

  render() {
    const { timesheetLines, basicInfo } = this.props
    const bottomButtonHeight = TOTAL_ITEM_HEIGHT + BOTTOM_BUTTON_HEIGHT
    const totalHours = calculateTotalHours(timesheetLines)
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.scrollContainer}>
          {this.renderCommentViewMode()}
          {this.renderStatusRow(basicInfo)}
          {this.renderBasicInfo()}
          <TimesheetItemList timesheetLines={timesheetLines} editable />
          <BottomPlaceholder height={bottomButtonHeight} />
        </KeyboardAwareScrollView>
        <StableBottomView height={bottomButtonHeight}>
          <TotalItem itemsCount={timesheetLines.length} totalText={getHourWithUnit(totalHours)} />
          <SubmitButton
            onSubmit={this.updateTimesheet}
            isButtonActive={this.isButtonActive}
          />
        </StableBottomView>
      </View>
    )
  }
}

EditTimesheet.propTypes = {
  timesheet: TimesheetShape.isRequired,
  basicInfo: TimesheetBasicInfoShape,
  timesheetLines: PropTypes.arrayOf(TimesheetLineShape),
  changeShowAlertState: PropTypes.func.isRequired,
  setTimesheetLine: PropTypes.func.isRequired,
  setTimesheetBasicInfo: PropTypes.func.isRequired,
  resetTimesheetBasicInfo: PropTypes.func.isRequired,
  updateTimesheet: PropTypes.func.isRequired,
  refreshTimesheet: PropTypes.func.isRequired,
}

EditTimesheet.defaultProps = {
  basicInfo: {},
  timesheetLines: [],
}

const mapStateToProps = createStructuredSelector({
  basicInfo: timesheetBasicInfoSelector,
  timesheetLines: timesheetLinesSelector,
  showLoading: submittingSelector,
})

const mapDispatchToProps = {
  setTimesheetBasicInfo,
  resetTimesheetBasicInfo,
  changeShowAlertState,
  setTimesheetLine,
  updateTimesheet,
  refreshTimesheet,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
loadingLayer, ShowAlertBackHandlerBase)(EditTimesheet)

