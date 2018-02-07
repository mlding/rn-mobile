import { Actions } from 'react-native-router-flux'
import { reduce, map, omit, capitalize, isEqual } from 'lodash'
import { isConstructionManager, isLeadWorker } from '../utilities/role'
import STATUS, { READ_ONLY_STATUS_FOR_LEAD_WORKER } from '../constants/status'
import ROLE from '../constants/role'
import { VIEW_MODE } from './constants'
import { ROLE_MAPPING } from '../report/constants'
import { getShowText } from '../utilities/dataProcessUtils'

export const calculateTotalHours = timesheetLines => (
  reduce(timesheetLines, (total, line) => ((total * 100) + (line.hours * 100)) / 100, 0.00)
)

export const generateSubmittedLines = timeSheetLines => (
  map(timeSheetLines, line => omit(line, 'uuid'))
)

export const openTimesheetDetail = (item, role, viewMode) => {
  if (isLeadWorker(role) || VIEW_MODE.CREATOR === viewMode) {
    const formatStatus = capitalize(item.status)
    if (READ_ONLY_STATUS_FOR_LEAD_WORKER.includes(formatStatus)) {
      Actions.timesheet({ timesheet: item })
    } else if (isEqual(STATUS.FLAGGED, formatStatus)) {
      Actions.editTimesheet({ timesheet: item })
    }
  } else if (isConstructionManager(role)) {
    Actions.managerTimesheetDetail({ timesheet: item })
  }
}

export const getHourWithUnit = hour => (
  hour > 1 ? `${hour} Hours` : `${hour} Hour`
)

export const isApprover = (role, viewMode) =>
  (role === ROLE.CONSTRUCTION_MANAGER && viewMode === VIEW_MODE.APPROVAL)

export const getContentDescription = (timesheet, role, viewMode) => {
  if (viewMode === VIEW_MODE.CREATOR) {
    return `Review By ${getShowText(timesheet.approver_name)}`
  }
  const { nameLabel, name } = ROLE_MAPPING[role.toUpperCase()]
  return `${nameLabel} ${getShowText(timesheet[name])}`
}
