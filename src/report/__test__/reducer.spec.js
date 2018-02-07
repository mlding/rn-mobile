import reducer from '../reducer'
import {
  FETCH_REPORTS,
  SET_REPORTS_REFRESH,
  RESET_ERROR_MESSAGE,
  CHANGE_SORT_TYPE,
} from '../actions'
import { resolve, pend, reject } from '../../utilities/actions'
import Report from '../fixture'

describe('report list reducer', () => {
  let payload
  let initStatus

  beforeEach(() => {
    initStatus = {
      list: [Report],
      next: null,
      loading: true,
      refreshing: false,
    }
    payload = {
      results: [Report],
      next: null,
      previous: 'localhost:test/api/v2/report',
      message: 'the network error',
    }
  })

  it('should attach the report list if when fetch report success and the previous is not empty', () => {
    const reports = reducer(initStatus, {
      type: resolve(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.list.length).toEqual(2)
  })
  it('should return report list if when fetch report success and the previous is empty', () => {
    payload.previous = null
    const reports = reducer(initStatus, {
      type: resolve(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.list.length).toEqual(1)
  })
  it('should return the payload next value when fetch report success', () => {
    const next = 'next page'
    payload.next = next
    const reports = reducer(initStatus, {
      type: resolve(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.next).toEqual(next)
  })
  it('should set loading to true if the fetch report is pending', () => {
    payload.loading = false
    const reports = reducer(initStatus, {
      type: pend(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.loading).toEqual(true)
  })
  it('should set loading to false if the fetch report is resolve', () => {
    initStatus.loading = true
    const reports = reducer(initStatus, {
      type: resolve(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.loading).toEqual(false)
  })
  it('should set loading to false if the fetch report is reject', () => {
    initStatus.loading = true
    const reports = reducer(initStatus, {
      type: reject(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.loading).toEqual(false)
  })
  it('should set refreshing to true if the action type is SET_REPORTS_REFRESH', () => {
    initStatus.refreshing = false
    const reports = reducer(initStatus, {
      type: SET_REPORTS_REFRESH,
      payload: payload,
    })
    expect(reports.loading).toEqual(true)
  })
  it('should set refreshing to false if the action type is fetch report is resolve', () => {
    initStatus.refreshing = true
    const reports = reducer(initStatus, {
      type: resolve(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.refreshing).toEqual(false)
  })
  it('should set refreshing to false if the action type is fetch report is reject', () => {
    initStatus.refreshing = true
    const reports = reducer(initStatus, {
      type: reject(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.refreshing).toEqual(false)
  })
  it('should set error message to null if fetch report is pending', () => {
    const reports = reducer(initStatus, {
      type: pend(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.errorMessage).toEqual('')
  })

  it('should set error message to null if when reset error message', () => {
    const reports = reducer(initStatus, {
      type: RESET_ERROR_MESSAGE,
      payload: payload,
    })
    expect(reports.errorMessage).toEqual('')
  })

  it('should set error message  if fetch report is reject', () => {
    const reports = reducer(initStatus, {
      type: reject(FETCH_REPORTS),
      payload: payload,
    })
    expect(reports.errorMessage).toEqual('the network error')
  })

  it('should change the sort type when call change sort type', () => {
    const reports = reducer(initStatus, {
      type: CHANGE_SORT_TYPE,
      payload: 'date',
    })
    expect(reports.sortType).toEqual('date')
  })
})
