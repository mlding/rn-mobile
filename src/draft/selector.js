import { createSelector } from 'reselect'

const draftSelector = state => state.draft

export const draftReportSelector = createSelector(
  draftSelector,
  draft => draft.report,
)

export const draftExtraWorkOrderSelector = createSelector(
  draftSelector,
  draft => draft.extraWorkOrder,
)

export const draftTimesheetSelector = createSelector(
  draftSelector,
  draft => draft.timesheet,
)
