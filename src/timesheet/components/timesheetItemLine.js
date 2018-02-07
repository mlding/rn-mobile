import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { noop } from 'lodash'
import { View, Text, StyleSheet } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { COLOR, FONT, FONT_WEIGHT } from '../../constants/styleGuide'
import Icon from '../../components/icon'
import Button from '../../components/button'
import { TimesheetLineShape } from '../../shared/shape'
import { deleteTimesheetLine } from '../actions'
import { TITLE, STATUS } from '../constants'
import { getHourWithUnit } from '../utilities'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.WHITE,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: COLOR.BORDER_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  jobCode: {
    fontSize: FONT.M,
    color: COLOR.MEDIUM_BLACK,
  },
  date: {
    fontSize: FONT.MD,
    color: COLOR.SILVER,
  },
  separator: {
    marginHorizontal: 12,
    borderWidth: 0.5,
    borderColor: COLOR.SEPARATOR_LINE,
  },
  hours: {
    flex: 1,
    fontSize: FONT.MD,
    color: COLOR.MEDIUM_BLACK,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  buttons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 34,
  },
  icon: {
    fontSize: FONT.XL,
    color: COLOR.LINK,
  },
})

const renderButtons = (item, deleteTimesheetLine) => (  // eslint-disable-line
  <View style={styles.buttons}>
    <Button
      style={styles.editButton}
      onPress={() => Actions.addItemForTimesheet(
        { title: TITLE.EDIT_ITEM, item: item, status: STATUS.EDIT })}
    >
      <Icon name="edit" style={styles.icon} />
    </Button>
    <Button onPress={() => deleteTimesheetLine(item)} >
      <Icon name="delete" style={styles.icon} />
    </Button>
  </View>
)

const TimesheetItemLine = props => {
  const { editable, item } = props

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.jobCode}>{item.job_code}</Text>
        <View style={styles.content}>
          <Text style={styles.date}>{item.date}</Text>
          <Text style={styles.separator} />
          <Text style={styles.hours}>{getHourWithUnit(item.hours)}</Text>
        </View>
      </View>
      {editable ? renderButtons(item, props.deleteTimesheetLine) : null}
    </View>
  )
}

TimesheetItemLine.propTypes = {
  item: TimesheetLineShape,
  deleteTimesheetLine: PropTypes.func,
  editable: PropTypes.bool,
}

TimesheetItemLine.defaultProps = {
  item: {},
  deleteTimesheetLine: noop,
  editable: false,
}

const mapDispatchToProps = {
  deleteTimesheetLine,
}

export default connect(null, mapDispatchToProps)(TimesheetItemLine)

