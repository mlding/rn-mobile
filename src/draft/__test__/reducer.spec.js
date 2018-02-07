import reducer from '../reducer'
import {
  UPDATE_DRAFT_REPORT,
  GET_DRAFT_REPORT,
  UPDATE_DRAFT_EXTRA_WORK_ORDER,
  GET_DRAFT_EXTRA_WORK_ORDER, UPDATE_DRAFT_TIMESHEET,
} from '../actions'
import { draftReport } from '../../shared/fixture'
import { resolve } from '../../utilities/actions'

describe('shared reducer', () => {
  let payload
  let initStatus

  beforeEach(() => {
    initStatus = {
      report: null,
      extraWorkOrder: null,
      timesheet: null,
    }
    payload = draftReport
  })

  it('should set draft report null if draft report is empty when update draft report success', () => {
    const result = reducer(initStatus, {
      type: resolve(UPDATE_DRAFT_REPORT),
      payload: null,
    })
    expect(result.report).toEqual(null)
  })

  it('should set draft report correctly if draft report is exist when update draft report success', () => {
    const result = reducer(initStatus, {
      type: resolve(UPDATE_DRAFT_REPORT),
      payload: payload,
    })
    expect(result.report).toEqual(draftReport)
  })

  it('should set draft report if draft report is empty when get draft report success', () => {
    const result = reducer(initStatus, {
      type: resolve(GET_DRAFT_REPORT),
      payload: draftReport,
    })
    expect(result.report).toEqual(draftReport)
  })

  it('should set draft extra work order null if extra work order is empty when update duccess', () => {
    const result = reducer(initStatus, {
      type: resolve(UPDATE_DRAFT_EXTRA_WORK_ORDER),
      payload: null,
    })
    expect(result.extraWorkOrder).toEqual(null)
  })

  it('should set draft extra work order correctly if draft extra work order is exist when update success', () => {
    const result = reducer(initStatus, {
      type: resolve(UPDATE_DRAFT_EXTRA_WORK_ORDER),
      payload: payload,
    })
    expect(result.extraWorkOrder).toEqual(draftReport)
  })

  it('should set draft extra work order if draft extra work order is empty when get success', () => {
    const result = reducer(initStatus, {
      type: resolve(GET_DRAFT_EXTRA_WORK_ORDER),
      payload: draftReport,
    })
    expect(result.extraWorkOrder).toEqual(draftReport)
  })

  describe('timesheet', () => {
    it('should update timesheet when call UPDATE_DRAFT_TIMESHEET', () => {
      initStatus.timesheet = {}
      const result = reducer(initStatus, {
        type: resolve(UPDATE_DRAFT_TIMESHEET),
        payload: null,
      })
      expect(result.timesheet).toEqual(null)
    })
  })
})
