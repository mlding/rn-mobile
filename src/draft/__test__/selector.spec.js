import {
  draftReportSelector,
  draftExtraWorkOrderSelector,
  draftTimesheetSelector,
} from '../selector'
import { draftReport } from '../../shared/fixture'
import { draftExtraWorkOrder } from '../../extra-work-order/fixture'
import { timesheetDraft } from '../../timesheet/fixture'

describe('draft selector', () => {
  const rootState = {
    draft: {
      report: draftReport,
      extraWorkOrder: draftExtraWorkOrder,
      timesheet: timesheetDraft,
    },
  }

  it('should return draft report', () => {
    expect(draftReportSelector(rootState)).toEqual(draftReport)
  })
  it('should return draft extra work order', () => {
    expect(draftExtraWorkOrderSelector(rootState)).toEqual(draftExtraWorkOrder)
  })
  it('should return draft timesheet', () => {
    expect(draftTimesheetSelector(rootState)).toEqual(timesheetDraft)
  })
})
