import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import { capitalize, isEqual } from 'lodash'
import { TimesheetShape, UserShape } from '../../shared/shape'
import STATUS from '../../constants/status'
import { formatDate } from '../../utilities/dateUtils'
import ItemCell from '../../shared/reportItemCell'
import { openTimesheetDetail, getContentDescription } from '../utilities'
import { TITLE } from '../constants'
import { setDraftTimesheet } from '../../draft/actions'
import DeleteIcon from '../../shared/deleteIcon'
import { navButtonStyles } from '../../shared/styles'

class TimesheetItem extends Component {
  getDateDescription = timesheet => {
    if (isEqual(STATUS.DRAFT, capitalize(timesheet.status))) {
      return null
    }
    return `Submitted ${formatDate(timesheet.submitted_date)}`
  }

  handlePress = (role, item, viewMode) => {
    const formatStatus = capitalize(item.status)

    if (isEqual(STATUS.DRAFT, formatStatus)) {
      Actions.createTimesheet({
        title: TITLE.EDIT_DRAFT,
        status: STATUS.DRAFT,
        right: () =>
          (<DeleteIcon
            style={navButtonStyles.buttonContainer}
            setDraft={this.props.setDraftTimesheet}
            user={this.props.user}
            name={item.name}
          />),
      })
      return
    }
    openTimesheetDetail(item, role, viewMode)
  }

  render() {
    const { timesheet, user, viewMode } = this.props
    return (
      <ItemCell
        title={timesheet.name}
        status={timesheet.status}
        content={getContentDescription(timesheet, user.role, viewMode)}
        dateDescription={this.getDateDescription(timesheet)}
        onPress={() => this.handlePress(user.role, timesheet, viewMode)}
      />
    )
  }
}

TimesheetItem.propTypes = {
  timesheet: TimesheetShape.isRequired,
  user: UserShape.isRequired,
  setDraftTimesheet: PropTypes.func.isRequired,
  viewMode: PropTypes.string,
}

TimesheetItem.defaultProps = {
  viewMode: '',
}

export default connect(null, { setDraftTimesheet })(TimesheetItem)
