import reducer from '../reducer'
import { resolve, pend, reject } from '../../utilities/actions'
import {
  FETCH_TIMESHEET, RESET_ERROR_MESSAGE, SET_TIMESHEET_REFRESH,
  SET_TIMESHEET_BASIC_INFO, RESET_TIMESHEET_BASIC_INFO,
  ADD_TIMESHEET_LINE, DELETE_TIMESHEET_LINE, UPDATE_TIMESHEET_LINE, SET_TIMESHEET_LINE,
  CHANGE_SHOW_ALERT_STATE, SUBMIT_TIMESHEET, UPDATE_TIMESHEET, PATCH_TIMESHEET, SET_VIEW_MODE,
  FETCH_MANAGER_TIMESHEET, SET_MANAGER_TIMESHEET_REFRESH,
} from '../actions'
import { VIEW_MODE } from '../constants'

describe('#timesheet reducer', () => {
  let initialState = {}

  beforeEach(() => {
    initialState = {
      list: null,
      next: null,
      loading: false,
      submitting: false,
      refreshing: false,
      errorMessage: null,
      timesheetBasicInfo: {},
      timesheetLines: [],
    }
  })

  describe('#list', () => {
    it('should reset list when load finish with no previous', () => {
      initialState.list = ['1', '2']
      const action = {
        type: resolve(FETCH_TIMESHEET),
        payload: {
          previous: null,
          next: null,
          results: ['3', '4'],
        },
      }
      expect(reducer(initialState, action).list).toEqual(['3', '4'])
    })
    it('should append list when load finish with exist previous', () => {
      initialState.list = ['1', '2']
      const action = {
        type: resolve(FETCH_TIMESHEET),
        payload: {
          previous: true,
          next: null,
          results: ['3', '4'],
        },
      }
      expect(reducer(initialState, action).list).toEqual(['1', '2', '3', '4'])
    })
  })

  describe('#loading', () => {
    it('should set loading when load finish with next value', () => {
      const action = {
        type: pend(FETCH_TIMESHEET),
        payload: {},
      }
      expect(reducer(initialState, action).loading).toEqual(true)
    })
    it('should set loading false when resolve action', () => {
      const action = {
        type: resolve(FETCH_TIMESHEET),
        payload: {
          previous: null,
          next: null,
          results: null,
        },
      }
      expect(reducer(initialState, action).loading).toEqual(false)
    })
    it('should set loading true and error message when load finish with next value', () => {
      const action = {
        type: reject(FETCH_TIMESHEET),
        payload: { message: 'xx' },
      }
      expect(reducer(initialState, action).loading).toEqual(false)
      expect(reducer(initialState, action).errorMessage).toEqual('xx')
    })
  })

  describe('#submitting', () => {
    it('should set submitting false when on submit timesheet', () => {
      const action = {
        type: pend(SUBMIT_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(true)
    })
    it('should set submitting false when resolve submit timesheet action', () => {
      const action = {
        type: resolve(SUBMIT_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(false)
    })

    it('should set loading true when reject submit timesheet action', () => {
      const action = {
        type: reject(SUBMIT_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(false)
    })

    it('should set submitting false when on update timesheet', () => {
      const action = {
        type: pend(UPDATE_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(true)
    })
    it('should set submitting false when resolve update timesheet action', () => {
      const action = {
        type: resolve(UPDATE_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(false)
    })
    it('should set loading true when reject update timesheet action', () => {
      const action = {
        type: reject(UPDATE_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(false)
    })

    it('should set submitting false when on update timesheet status', () => {
      const action = {
        type: pend(PATCH_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(true)
    })
    it('should set submitting false when resolve update timesheet status action', () => {
      const action = {
        type: resolve(PATCH_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(false)
    })
    it('should set loading true when reject update timesheet status action', () => {
      const action = {
        type: reject(PATCH_TIMESHEET),
      }
      expect(reducer(initialState, action).submitting).toEqual(false)
    })
  })

  describe('#refreshing', () => {
    it('should set refreshing true when call SET_TIMESHEET_REFRESH', () => {
      const action = {
        type: SET_TIMESHEET_REFRESH,
        payload: {},
      }
      expect(reducer(initialState, action).refreshing).toEqual(true)
    })
    it('should set refreshing true when call resolve(FETCH_TIMESHEET)', () => {
      const action = {
        type: resolve(FETCH_TIMESHEET),
        payload: {
          previous: null,
          next: null,
          results: null,
        },
      }
      expect(reducer(initialState, action).refreshing).toEqual(false)
    })
    it('should set refreshing true when call reject(FETCH_TIMESHEET)', () => {
      const action = {
        type: reject(FETCH_TIMESHEET),
        payload: { message: 'xx' },
      }
      expect(reducer(initialState, action).refreshing).toEqual(false)
    })
  })

  describe('#errorMessage', () => {
    it('should reset error message true when action is pend(FETCH_TIMESHEET)', () => {
      initialState.errorMessage = 'errorMessage'
      const action = {
        type: pend(FETCH_TIMESHEET),
      }
      expect(reducer(initialState, action).errorMessage).toEqual('')
    })
    it('should reset error message true when action is resolve(FETCH_TIMESHEET)', () => {
      initialState.errorMessage = 'errorMessage'
      const action = {
        type: resolve(FETCH_TIMESHEET),
        payload: {
          previous: null,
          next: null,
          results: null,
        },
      }
      expect(reducer(initialState, action).errorMessage).toEqual('')
    })
    it('should reset error message true when action is RESET_ERROR_MESSAGE', () => {
      initialState.errorMessage = 'errorMessage'
      const action = {
        type: RESET_ERROR_MESSAGE,
      }
      expect(reducer(initialState, action).errorMessage).toEqual('')
    })
  })

  describe('#timesheetBasicInfo', () => {
    it('should set timesheet basic info when dispatch set timesheet action', () => {
      const payload = {
        name: '17-11-24-BQ',
        description: 'desc',
        notes: 'notes',
      }
      const action = {
        type: SET_TIMESHEET_BASIC_INFO,
        payload: payload,
      }
      expect(reducer(initialState, action).timesheetBasicInfo).toEqual(payload)
    })

    it('should reset timesheet basic info when dispatch the reset timesheet action', () => {
      initialState.timesheetBasicInfo = { name: 'test' }
      const action = {
        type: RESET_TIMESHEET_BASIC_INFO,
        payload: {},
      }
      expect(reducer(initialState, action).timesheetBasicInfo).toEqual({})
    })
  })

  describe('#timesheetLines', () => {
    it('should add timesheet lines when dispatch add timesheet lines action', () => {
      const payload = {
        uuid: '11',
        date: '2017-1-1',
        job_code: 'job_code',
        hours: 3.5,
      }
      const action = {
        type: ADD_TIMESHEET_LINE,
        payload: payload,
      }
      expect(reducer(initialState, action).timesheetLines).toEqual([payload])
    })

    it('should delete timesheet lines when dispatch delete timesheet lines action', () => {
      const payload1 = {
        uuid: '11',
        date: '2017-1-1',
        job_code: 'job_code',
        hours: 3.5,
      }
      const payload2 = {
        uuid: '22',
        date: '2017-1-1',
        job_code: 'job_code',
        hours: 3.5,
      }
      initialState.timesheetLines = [payload1]
      const action1 = {
        type: DELETE_TIMESHEET_LINE,
        payload: payload1,
      }
      const action2 = {
        type: DELETE_TIMESHEET_LINE,
        payload: payload2,
      }
      expect(reducer(initialState, action1).timesheetLines).toEqual([])
      expect(reducer(initialState, action2).timesheetLines).toEqual([payload1])
    })

    it('should update timesheet line without id when dispatch update timesheet lines action', () => {
      const payload1 = {
        uuid: '11',
        date: '2017-1-1',
        job_code: 'job_code',
        hours: 3.5,
      }
      const payload2 = {
        uuid: '11',
        date: '2017-1-2',
        job_code: 'job_code2',
        hours: 22,
      }
      initialState.timesheetLines = [payload1]
      const action = {
        type: UPDATE_TIMESHEET_LINE,
        payload: payload2,
      }
      expect(reducer(initialState, action).timesheetLines).toEqual([payload2])
    })

    it('should update timesheet line with id when dispatch update timesheet lines action', () => {
      const payload1 = {
        id: 1,
        uuid: '11',
        date: '2017-1-1',
        job_code: 'job_code',
        hours: 3.5,
      }
      const payload2 = {
        id: 1,
        uuid: '12',
        date: '2017-1-2',
        job_code: 'job_code2',
        hours: 22,
      }
      initialState.timesheetLines = [payload1]
      const action = {
        type: UPDATE_TIMESHEET_LINE,
        payload: payload2,
      }
      expect(reducer(initialState, action).timesheetLines).toEqual([payload2])
    })

    it('should set timesheet lines when dispatch set timesheet lines action', () => {
      const payload = [{
        uuid: '11',
        date: '2017-1-1',
        job_code: 'job_code',
        hours: 3.5,
      }]
      const action1 = {
        type: SET_TIMESHEET_LINE,
        payload: payload,
      }
      const action2 = {
        type: SET_TIMESHEET_LINE,
        payload: [],
      }
      expect(reducer(initialState, action1).timesheetLines).toEqual(payload)
      expect(reducer(initialState, action2).timesheetLines).toEqual([])
    })
  })

  describe('#showAlert', () => {
    it('should show alert', () => {
      const action = {
        type: CHANGE_SHOW_ALERT_STATE,
        payload: true,
      }
      expect(reducer(initialState, action).showAlert).toEqual(true)
    })
  })

  describe('#viewMode', () => {
    it('should show creator viewMode', () => {
      const action = {
        type: SET_VIEW_MODE,
        payload: VIEW_MODE.CREATOR,
      }
      expect(reducer(initialState, action).viewMode).toEqual(VIEW_MODE.CREATOR)
    })
    it('should show approver viewMode', () => {
      const action = {
        type: SET_VIEW_MODE,
        payload: VIEW_MODE.APPROVAL,
      }
      expect(reducer(initialState, action).viewMode).toEqual(VIEW_MODE.APPROVAL)
    })
  })

  describe('#managerTimesheetList and managerTimesheetNext', () => {
    it('should reset list when load finish with no previous', () => {
      initialState.managerTimesheetList = ['1', '2']
      const action = {
        type: resolve(FETCH_MANAGER_TIMESHEET),
        payload: {
          previous: null,
          next: 'next',
          results: ['3', '4'],
        },
      }
      expect(reducer(initialState, action).managerTimesheetList).toEqual(['3', '4'])
      expect(reducer(initialState, action).managerTimesheetNext).toEqual('next')
    })
    it('should append list when load finish with exist previous', () => {
      initialState.managerTimesheetList = ['1', '2']
      const action = {
        type: resolve(FETCH_MANAGER_TIMESHEET),
        payload: {
          previous: true,
          next: null,
          results: ['3', '4'],
        },
      }
      expect(reducer(initialState, action).managerTimesheetList).toEqual(['1', '2', '3', '4'])
      expect(reducer(initialState, action).managerTimesheetNext).toEqual(null)
    })
  })

  describe('#managerTimesheetLoading', () => {
    it('should set loading when load finish with next value', () => {
      const action = {
        type: pend(FETCH_MANAGER_TIMESHEET),
        payload: {},
      }
      expect(reducer(initialState, action).managerTimesheetLoading).toEqual(true)
    })
    it('should set loading false when resolve action', () => {
      const action = {
        type: resolve(FETCH_MANAGER_TIMESHEET),
        payload: {
          previous: null,
          next: null,
          results: null,
        },
      }
      expect(reducer(initialState, action).managerTimesheetLoading).toEqual(false)
    })
    it('should set loading true and error message when load finish with next value', () => {
      const action = {
        type: reject(FETCH_MANAGER_TIMESHEET),
        payload: { message: 'managerTimesheetErrorMsg' },
      }
      expect(reducer(initialState, action).managerTimesheetLoading).toEqual(false)
      expect(reducer(initialState, action).managerTimesheetErrorMsg).toEqual('managerTimesheetErrorMsg')
    })
  })

  describe('#managerTimesheetRefreshing', () => {
    it('should set refreshing true when call SET_MANAGER_TIMESHEET_REFRESH', () => {
      const action = {
        type: SET_MANAGER_TIMESHEET_REFRESH,
        payload: {},
      }
      expect(reducer(initialState, action).managerTimesheetRefreshing).toEqual(true)
    })
    it('should set refreshing true when call resolve(FETCH_MANAGER_TIMESHEET)', () => {
      const action = {
        type: resolve(FETCH_MANAGER_TIMESHEET),
        payload: {
          previous: null,
          next: null,
          results: null,
        },
      }
      expect(reducer(initialState, action).managerTimesheetRefreshing).toEqual(false)
    })
    it('should set refreshing true when call reject(FETCH_TIMESHEET)', () => {
      const action = {
        type: reject(FETCH_MANAGER_TIMESHEET),
        payload: { message: 'xx' },
      }
      expect(reducer(initialState, action).managerTimesheetRefreshing).toEqual(false)
    })
  })
})
