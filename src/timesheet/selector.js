import { createSelector } from 'reselect'
import { getStatusComparator } from '../utilities/sort'

const selector = state => state.timesheet

export const nextSelector = createSelector(
  selector,
  timesheet => timesheet.next,
)

export const loadingSelector = createSelector(
  selector,
  timesheet => timesheet.loading,
)

export const submittingSelector = createSelector(
  selector,
  timesheet => timesheet.submitting,
)

export const refreshingSelector = createSelector(
  selector,
  timesheet => timesheet.refreshing,
)

export const errorMsgSelector = createSelector(
  selector,
  timesheet => timesheet.errorMessage,
)

export const timesheetBasicInfoSelector = createSelector(
  selector,
  timesheet => timesheet.timesheetBasicInfo,
)

export const nameSelector = createSelector(
  timesheetBasicInfoSelector,
  timesheetBasicInfo => timesheetBasicInfo.name,
)

export const descriptionSelector = createSelector(
  timesheetBasicInfoSelector,
  timesheetBasicInfo => timesheetBasicInfo.description,
)

export const notesSelector = createSelector(
  timesheetBasicInfoSelector,
  timesheetBasicInfo => timesheetBasicInfo.notes,
)

export const timesheetLinesSelector = createSelector(
  selector,
  timesheet => timesheet.timesheetLines,
)

export const viewModeSelector = createSelector(
  selector,
  timesheet => timesheet.viewMode,
)

export const listSelector = createSelector(
  selector,
  timesheet => [...timesheet.list].sort(getStatusComparator(true)),
)

export const managerTimesheetNextSelector = createSelector(
  selector,
  timesheet => timesheet.managerTimesheetNext,
)

export const managerTimesheetRefreshSelector = createSelector(
  selector,
  timesheet => timesheet.managerTimesheetRefreshing,
)

export const managerTimesheetErrorMsgSelector = createSelector(
  selector,
  timesheet => timesheet.managerTimesheetErrorMsg,
)

export const managerTimesheetLoadingSelector = createSelector(
  selector,
  timesheet => timesheet.managerTimesheetLoading,
)

export const managerTimesheetListSelector = createSelector(
  selector,
  timesheet => [...timesheet.managerTimesheetList].sort(getStatusComparator(false)),
)

