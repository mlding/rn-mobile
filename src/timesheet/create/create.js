import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { compose } from 'recompose'
import PropTypes from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { isEqual, isEmpty, noop, trim } from 'lodash'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { createStructuredSelector } from 'reselect'
import { BOTTOM_BUTTON_HEIGHT, TOTAL_ITEM_HEIGHT, COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import LabelTextInput from '../../components/labelTextInput'
import { setTimesheetBasicInfo, resetTimesheetBasicInfo, submitTimesheet, setTimesheetLine, refreshTimesheet } from '../actions'
import { changeShowAlertState } from '../../report/actions'
import SubmitButtonGroup from '../../shared/submitButtonGroup'
import { StableBottomView } from '../../components/stableBottomView'
import { nameSelector, descriptionSelector, notesSelector, timesheetLinesSelector, submittingSelector, timesheetBasicInfoSelector } from '../selector'
import AddItemButton from '../../shared/addItemButton'
import { TITLE } from '../constants'
import TimesheetItemList from '../components/timesheetItemList'
import { TimesheetLineShape, TimesheetBasicInfoShape, UserShape, TimesheetShape } from '../../shared/shape'
import TotalItem from '../../shared/reportTotalItem'
import { calculateTotalHours, generateSubmittedLines, getHourWithUnit } from '../utilities'
import { formatUTCZeroDate } from '../../utilities/dateUtils'
import { showError, showInfo } from '../../utilities/messageBar'
import { ERROR_MSG } from '../../constants/toast'
import loadingLayer from '../../components/loadingLayer'
import { DIGITAL_SIGNATURE } from '../../constants/apiConfig'
import STATUS from '../../constants/status'
import { userSelector } from '../../auth/selector'
import { draftTimesheetSelector } from '../../draft/selector'
import { setDraftTimesheet } from '../../draft/actions'
import { createDraft, showDraftAlert } from '../../draft/utilities'
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
  timesheetInfo: {
    backgroundColor: COLOR.WHITE,
    paddingLeft: 15,
    borderColor: COLOR.BORDER_GREY,
    borderBottomWidth: 1,
  },
  addButton: {
    marginTop: 30,
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLOR.FADE_BLUE,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 2,
  },
  addText: {
    color: COLOR.FADE_BLUE,
    fontSize: FONT.L,
    fontWeight: FONT_WEIGHT.BOLD,
  },
})

class CreateTimesheet extends Component {

  componentDidMount() {
    if (isEqual(this.props.status, STATUS.DRAFT)) {
      const { name, description, notes, lines } = this.props.draft
      this.props.setTimesheetBasicInfo({ name, description, notes })
      this.props.setTimesheetLine(lines)
    } else {
      this.props.resetTimesheetBasicInfo()
      this.props.setTimesheetLine()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isEqual(this.props.status, STATUS.DRAFT) && !isEmpty(this.props.draft)) {
      const { name, description, notes, timesheetLines } = nextProps
      const { draft } = this.props
      if (!isEqual(name, draft.name)
        || !isEqual(description, draft.description)
        || !isEqual(notes, draft.notes)
        || !isEqual(timesheetLines, draft.lines)) {
        this.props.changeShowAlertState(true)
      }
      return
    }
    const { basicInfo, name, timesheetLines } = this.props
    if (!isEqual(nextProps.basicInfo, basicInfo) && !isEmpty(name)) {
      this.props.changeShowAlertState(true)
    }
    if (!isEqual(nextProps.timesheetLines, timesheetLines)) {
      this.props.changeShowAlertState(!isEmpty(nextProps.timesheetLines))
    }
  }

  componentWillUnmount() {
    this.props.changeShowAlertState(false)
    this.props.resetTimesheetBasicInfo()
  }

  onSaveDraft = () => {
    const { user, name, description, notes, timesheetLines, status } = this.props
    const draft = {
      name: name,
      description: description,
      notes: notes,
      lines: timesheetLines,
      status: STATUS.DRAFT,
    }
    const params = {
      setToDraft: this.props.setDraftTimesheet,
      name: name,
      draft: draft,
      user: user,
    }
    if (isEmpty(status) && !isEmpty(this.props.draft)) {
      showDraftAlert(params)
    } else {
      createDraft(params)
    }
  }

  onSubmit = () => {
    const { status, user, name, description, notes, timesheetLines } = this.props
    const submitParams = {
      name: name,
      description: description,
      notes: notes,
      submitted_date: formatUTCZeroDate(new Date()),
      digital_signature: DIGITAL_SIGNATURE,
      lines: generateSubmittedLines(timesheetLines),
    }
    this.props.submitTimesheet(submitParams)
    .then(res => {
      if (isEqual(status, STATUS.DRAFT)) {
        this.props.setDraftTimesheet(null, user)
      }
      this.props.refreshTimesheet()
      Actions.pop()
      showInfo(`${res.value.name} is submitted.`)
    })
    .catch(() => showError(ERROR_MSG))
  }

  isSubmitButtonActive = () => {
    const { name, description, timesheetLines } = this.props
    return !(isEmpty(name)
    || isEmpty(description)
    || isEmpty(timesheetLines))
  }

  isDraftButtonActive = () => !isEmpty(this.props.name)


  trimName = () => {
    const trimName = trim(this.props.name)
    this.props.setTimesheetBasicInfo({ name: trimName })
  }

  render() {
    const { name, description, notes, timesheetLines } = this.props
    const totalHours = calculateTotalHours(timesheetLines)
    const bottomButtonHeight = TOTAL_ITEM_HEIGHT + BOTTOM_BUTTON_HEIGHT
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.scrollContainer}>
          <View style={styles.timesheetInfo}>
            <LabelTextInput
              labelName="Name"
              text={name}
              onChangeText={val => this.props.setTimesheetBasicInfo({ name: val })}
              onBlur={this.trimName}
            />
            <LabelTextInput
              labelName="Description"
              text={description}
              onChangeText={val => this.props.setTimesheetBasicInfo({ description: val })}
            />
            <LabelTextInput
              labelName="Notes"
              placeholder="Optional"
              text={notes}
              onChangeText={val => this.props.setTimesheetBasicInfo({ notes: val })}
            />
            <AddItemButton onPress={() => Actions.addItemForTimesheet({ title: TITLE.ADD_ITEM })} />
          </View>
          <TimesheetItemList timesheetLines={timesheetLines} editable />
          <BottomPlaceholder height={bottomButtonHeight} />
        </KeyboardAwareScrollView>
        <StableBottomView height={bottomButtonHeight}>
          <TotalItem itemsCount={timesheetLines.length} totalText={getHourWithUnit(totalHours)} />
          <SubmitButtonGroup
            onSaveDraft={this.onSaveDraft}
            onSubmit={this.onSubmit}
            isSubmittedButtonActive={this.isSubmitButtonActive()}
            isDraftButtonActive={this.isDraftButtonActive()}
          />
        </StableBottomView>
      </View>
    )
  }
}

CreateTimesheet.propTypes = {
  basicInfo: TimesheetBasicInfoShape,
  user: UserShape.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
  notes: PropTypes.string,
  setTimesheetBasicInfo: PropTypes.func,
  resetTimesheetBasicInfo: PropTypes.func,
  submitTimesheet: PropTypes.func,
  refreshTimesheet: PropTypes.func,
  timesheetLines: PropTypes.arrayOf(TimesheetLineShape),
  changeShowAlertState: PropTypes.func,
  setTimesheetLine: PropTypes.func,
  draft: TimesheetShape,
  setDraftTimesheet: PropTypes.func.isRequired,
  status: PropTypes.string,
}

CreateTimesheet.defaultProps = {
  basicInfo: {},
  name: '',
  description: '',
  notes: '',
  setTimesheetBasicInfo: noop,
  resetTimesheetBasicInfo: noop,
  submitTimesheet: noop,
  refreshTimesheet: noop,
  timesheetLines: [],
  changeShowAlertState: noop,
  setTimesheetLine: noop,
  draft: null,
  status: '',
}

const mapStateToProps = createStructuredSelector({
  basicInfo: timesheetBasicInfoSelector,
  name: nameSelector,
  description: descriptionSelector,
  notes: notesSelector,
  timesheetLines: timesheetLinesSelector,
  showLoading: submittingSelector,
  user: userSelector,
  draft: draftTimesheetSelector,
})

const mapDispatchToProps = {
  setTimesheetBasicInfo,
  resetTimesheetBasicInfo,
  submitTimesheet,
  changeShowAlertState,
  setTimesheetLine,
  setDraftTimesheet,
  refreshTimesheet,
}

export default compose(connect(mapStateToProps, mapDispatchToProps),
loadingLayer, ShowAlertBackHandlerBase)(CreateTimesheet)

