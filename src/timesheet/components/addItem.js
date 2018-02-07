import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import moment from 'moment'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEmpty, noop, isEqual, toString, toNumber } from 'lodash'
import { connect } from 'react-redux'
import { COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import LabelTextInput from '../../components/labelTextInput'
import { addTimesheetLine, updateTimesheetLine, changeShowAlertState } from '../actions'
import PickerPanel from '../../components/pickerPanel'
import pickerUtil from '../../utilities/pickerUtil'
import { createDateData, monthNames, getFormatedDateText, getDataPickerDate } from '../../utilities/dateUtils'
import AddItemButton from '../../shared/addItemButton'
import { STATUS } from '../constants'
import { TimesheetLineShape } from '../../shared/shape'
import { uuid, checkInputNumberValid, parseFloatOrNull } from '../../utilities/utils'
import ShowAlertBackHandlerBase from '../../components/showAlertBackHandlerBase'
import ALERT_TYPE from '../../constants/showAlertType'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
  },
  scrollContainer: {
    flex: 1,
  },
  itemInfo: {
    paddingLeft: 15,
    paddingBottom: 15,
  },
  addButton: {
    marginTop: 30,
    marginRight: 15,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 2,
  },
  addText: {
    color: COLOR.WHITE,
    fontSize: FONT.L,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

class AddItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInputAreaFocused: false,
      timesheetLine: { ...props.item, hours: toString(props.item.hours) },
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { timesheetLine } = this.state
    if (!isEqual(prevState.timesheetLine, timesheetLine)) {
      this.props.changeShowAlertState(true)
    }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
  }

  get disabled() {
    const { date, hours, job_code } = this.state.timesheetLine
    return isEmpty(date) || isEmpty(job_code) || isEmpty(hours) //eslint-disable-line
  }

  setTimesheetState = updateValue => {
    const timesheetLine = { ...this.state.timesheetLine, ...updateValue }
    this.setState({ timesheetLine })
  }

  handleNumberOnChange = val => {
    if (checkInputNumberValid(val, this.state.timesheetLine.hours, 2)) {
      this.setTimesheetState({ hours: val })
    }
  }

  handleNumberOnBlur = () => {
    const validHours = parseFloatOrNull(this.state.timesheetLine.hours)
    const validHoursText = isFinite(validHours) ? toString(validHours) : ''
    this.setTimesheetState({ hours: validHoursText })
  }

  datePicker = () => {
    const { date } = this.state.timesheetLine
    const dataSource = []
    createDateData(dataSource)

    pickerUtil.build({
      title: '',
      dataSource: dataSource,
      value: getDataPickerDate(date),
      onConfirm: arr => {
        this.setState({
          isInputAreaFocused: false,
          timesheetLine: { ...this.state.timesheetLine, date: getFormatedDateText(arr) },
        })
      },
      onCancel: () => {
        this.setState({ isInputAreaFocused: false })
      },
      defaultValue: [moment().year(), monthNames[moment().month()], moment().date()],
    })
  }

  addItem = () => {
    const { status } = this.props
    const { timesheetLine } = this.state
    const formattedTimesheetLine = {
      ...timesheetLine,
      uuid: isEmpty(timesheetLine.uuid) ? uuid() : timesheetLine.uuid,
      hours: toNumber(timesheetLine.hours) }

    if (isEqual(status, STATUS.EDIT)) {
      this.props.updateTimesheetLine(formattedTimesheetLine)
    } else {
      this.props.addTimesheetLine(formattedTimesheetLine)
    }
    Actions.pop()
  }

  render() {
    const { status } = this.props
    const { date, job_code, hours } = this.state.timesheetLine

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.scrollContainer}>
          <View style={styles.itemInfo}>
            <PickerPanel
              labelName="Date"
              content={date}
              onPress={this.datePicker}
              isInputAreaFocused={this.state.isInputAreaFocused}
            />
            <LabelTextInput
              labelName="Job Code"
              text={job_code}  //eslint-disable-line
              onChangeText={val => this.setTimesheetState({ job_code: val })}
            />
            <LabelTextInput
              labelName="Hours"
              text={hours}
              onChangeText={val => this.handleNumberOnChange(val)}
              onBlur={this.handleNumberOnBlur}
              keyboardType="numeric"
            />
            <AddItemButton
              onPress={this.addItem}
              disabled={this.disabled}
              status={status}
              hasBackgroundColor
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

AddItem.propTypes = {
  addTimesheetLine: PropTypes.func,
  updateTimesheetLine: PropTypes.func,
  changeShowAlertState: PropTypes.func,
  status: PropTypes.string,
  item: TimesheetLineShape,
}

AddItem.defaultProps = {
  addTimesheetLine: noop,
  updateTimesheetLine: noop,
  changeShowAlertState: noop,
  status: '',
  item: { uuid: '', date: '', job_code: '', hours: '' },
}

const mapDispatchToProps = {
  addTimesheetLine,
  updateTimesheetLine,
  changeShowAlertState,
}

export default compose(connect(null, mapDispatchToProps),
ShowAlertBackHandlerBase)(AddItem, ALERT_TYPE.TIMESHEET_ITEM_ALERT)

