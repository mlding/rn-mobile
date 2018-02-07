import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import {
  TIMESHEET_URL, fetchTimesheet, refreshTimesheet, SET_TIMESHEET_REFRESH, FETCH_TIMESHEET,
  resetErrorMessage, RESET_ERROR_MESSAGE, SET_TIMESHEET_BASIC_INFO, setTimesheetBasicInfo,
  setTimesheetRefreshing, ADD_TIMESHEET_LINE,
  addTimesheetLine, resetTimesheetBasicInfo, RESET_TIMESHEET_BASIC_INFO,
  CHANGE_SHOW_ALERT_STATE, changeShowAlertState, createTimesheet,
  deleteTimesheetLine, DELETE_TIMESHEET_LINE,
  updateTimesheetLine, UPDATE_TIMESHEET_LINE,
  setTimesheetLine, SET_TIMESHEET_LINE,
  submitTimesheet, SUBMIT_TIMESHEET,
  patchTimesheet, PATCH_TIMESHEET,
  updateTimesheet, UPDATE_TIMESHEET,
  changeViewMode, SET_VIEW_MODE,
  fetchManagerTimesheet, FETCH_MANAGER_TIMESHEET,
  setManagerTimesheetRefreshing, SET_MANAGER_TIMESHEET_REFRESH,
  refreshManagerTimesheet,
  resetManagerTimesheetErrorMessage, RESET_MANAGER_TIMESHEET_ERROR_MESSAGE,
} from '../actions'
import { constructionManager, leadWorker } from '../../shared/fixture'
import { ORDERING, ORDERING_BY_STATUS } from '../../constants/status'
import { getDefaultName } from '../../utilities/utils'
import { TITLE, VIEW_MODE } from '../constants'
import alert from '../../utilities/prompt'

jest.mock('react-native-router-flux', () => ({
  ActionConst: { RESET: 'reset' },
  Actions: {
    createTimesheet: jest.fn(),
  },
}))

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}))

describe('#timesheet actions', () => {
  const mockStore = configureMockStore([thunk])
  let store = {}
  const initialState = {
    list: [],
    next: null,
    loading: false,
    refreshing: false,
    errorMessage: false,
    auth: { user: leadWorker },
    showAlert: false,
    timesheetBasicInfo: {},
    timesheetForm: {},
    timesheetLines: [],
    draft: { timesheet: '' },
    timesheet: {
      viewMode: VIEW_MODE.APPROVAL,
    },
  }
  const mock = new MockAdapter(axios)

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
    mock.reset()
  })

  describe('#showAlert', () => {
    it('it should show alert', () => {
      const expectActions = [
        {
          type: CHANGE_SHOW_ALERT_STATE,
          payload: true,
        },
      ]
      store.dispatch(changeShowAlertState(true))
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#createTimesheet', () => {
    it('it should prompt alert modal when there exsits draft timesheet', () => {
      store = mockStore({ ...initialState, draft: { timesheet: 'timesheet' } })
      const leftFunc = jest.fn()
      const rightFunc = jest.fn()
      const parameters = {
        message: 'Message',
        leftText: 'No',
        leftFunc: leftFunc,
        rightText: 'Yes',
        rightFunc: rightFunc,
      }
      alert(parameters)
      store.dispatch(createTimesheet())
      expect(Alert.alert).toBeCalledWith(
        '',
        'Message',
        [{ onPress: leftFunc, text: 'No' }, { onPress: rightFunc, text: 'Yes' }],
        { 'cancelable': false },
      )
    })

    it('it should redirect to createTimesheet when there not exsits draft timesheet', () => {
      store.dispatch(createTimesheet())
      expect(Actions.createTimesheet).toBeCalledWith({ title: TITLE.CREATE })
    })
  })

  describe('#fetchTimesheet', () => {
    it('it should called actions when user is leadWorker ', () => {
      const inputOffset = 0
      const user = leadWorker
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(TIMESHEET_URL, params).reply(200, 'success')
      return fetchTimesheet(inputOffset, user).payload.then(res => {
        expect(res).toEqual('success')
      })
    })
    it('it should called actions when user is constructManager ', () => {
      const inputOffset = 0
      const user = constructionManager
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(TIMESHEET_URL, params).reply(200, 'success')
      return fetchTimesheet(inputOffset, user).payload.then(res => {
        expect(res).toEqual('success')
      })
    })
    it('it should called actions when user is unknown ', () => {
      const inputOffset = 0
      const user = {}
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(TIMESHEET_URL, params).reply(400, 'User is invalid')
      return fetchTimesheet(inputOffset, user).payload.catch(res => {
        expect(res.message).toEqual('User is invalid')
      })
    })
  })

  describe('#setTimesheetRefreshing', () => {
    it('it should called actions when call setTimesheetRefreshing ', () => {
      const expectActions = [SET_TIMESHEET_REFRESH]
      store.dispatch(setTimesheetRefreshing())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#refreshTimesheet', () => {
    it('it should called actions when call refreshTimesheet ', () => {
      const expectActions = [SET_TIMESHEET_REFRESH, FETCH_TIMESHEET]
      store.dispatch(refreshTimesheet())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#resetErrorMessage', () => {
    it('it should return empty result when call resetErrorMessage', () => {
      const res = resetErrorMessage()
      expect(res.type).toEqual(RESET_ERROR_MESSAGE)
      expect(res.payload).toBeUndefined()
    })
  })

  describe('#setTimesheetBasicInfo', () => {
    it('it should set timesheet', () => {
      const payload = {
        name: 'name',
        description: 'description',
        notes: 'notes',
      }
      const expectActions = [
        {
          type: SET_TIMESHEET_BASIC_INFO,
          payload: payload,
        },
      ]
      store.dispatch(setTimesheetBasicInfo(payload))
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#resetTimesheetInfo', () => {
    it('it should reset timesheet', () => {
      const expectActions = [
        {
          type: RESET_TIMESHEET_BASIC_INFO,
          payload: {
            name: getDefaultName(initialState.auth.user),
            description: '',
            notes: '',
          },
        },
      ]
      store.dispatch(resetTimesheetBasicInfo())
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#addTimesheetLine', () => {
    it('it should called actions when call addTimesheetLine ', () => {
      const expectActions = [ADD_TIMESHEET_LINE]
      store.dispatch(addTimesheetLine())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#deleteTimesheetLine', () => {
    it('it should called actions when call deleteTimesheetLine ', () => {
      const expectActions = [DELETE_TIMESHEET_LINE]
      store.dispatch(deleteTimesheetLine())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#updateTimesheetLine', () => {
    it('it should called actions when call updateTimesheetLine ', () => {
      const expectActions = [UPDATE_TIMESHEET_LINE]
      store.dispatch(updateTimesheetLine())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#setTimesheetLine', () => {
    it('it should called actions when call setTimesheetLine ', () => {
      const expectActions = [SET_TIMESHEET_LINE]
      store.dispatch(setTimesheetLine())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#submitTimesheet', () => {
    it('it should call actions when call submitTimesheet ', () => {
      const params = { 'name': '17-12-06-BQ', 'description': 'de', 'notes': '', 'submitted_date': '2017-12-07T03:27:14+00:00', 'digital_signature': 'mobile', 'lines': [{ 'date': '2017-12-06', 'job_code': 'd', 'hours': 123 }] }
      mock.onPost(TIMESHEET_URL, params).reply(201, 'success')
      expect(submitTimesheet().type).toEqual(SUBMIT_TIMESHEET)
      return submitTimesheet(params).payload.catch(res => {
        expect(res.message).toEqual('success')
      })
    })
  })

  describe('#patchTimesheet', () => {
    it('it should call actions when call patchTimesheet ', () => {
      const id = 1
      const patchParams = {
        status: 'resubmitted',
        comments: 'test',
      }
      const params = {
        id,
        ...patchParams,
      }
      mock.onPatch(`${TIMESHEET_URL}${id}/`, patchParams).reply(200, 'success')
      expect(patchTimesheet(params).type).toEqual(PATCH_TIMESHEET)
      return patchTimesheet(params).payload.catch(res => {
        expect(res.message).toEqual('success')
      })
    })
  })

  describe('#updateTimesheet', () => {
    it('it should call actions when call updateTimesheet ', () => {
      const timesheet = { 'id': 148, 'approver_name': 'Bill Quora', 'created_by_name': 'Bernie Quor', 'name': 'timesheet name-54', 'created': '2017-12-06T02:46:11Z', 'reported_date': '2017-12-06T02:46:11Z', 'approved_date': null, 'digital_signature': 'mobile', 'notes': 'changed', 'description': 'changed', 'comments': 'test', 'created_by': 16, 'approver': 17, 'submitted_date': '2017-12-07T03:30:01+00:00', 'status': 'resubmitted', 'lines': [{ 'id': 173, 'created': '2017-12-06T02:46:11Z', 'comments': null, 'date': '2017-12-25', 'job_code': 'code', 'hours': 6, 'time_sheet': 148 }] }

      mock.onPut(`${TIMESHEET_URL}${timesheet.id}/`, timesheet).reply(200, 'success')
      expect(updateTimesheet(timesheet).type).toEqual(UPDATE_TIMESHEET)
      return updateTimesheet(timesheet).payload.catch(res => {
        expect(res.message).toEqual('success')
      })
    })
  })

  describe('#changeShowAlertState', () => {
    it('it should call actions when call changeShowAlertState ', () => {
      expect(changeShowAlertState().type).toEqual(CHANGE_SHOW_ALERT_STATE)
    })
  })

  describe('#changeViewMode', () => {
    it('it should call actions when call changeShowAlertState ', () => {
      mock.onGet(TIMESHEET_URL).reply(200, 'success')
      store.dispatch(changeViewMode(VIEW_MODE.CREATOR))
      const expectActionsType = [SET_VIEW_MODE]
      expect(store.getActions().map(it => it.type)).toEqual(expectActionsType)
    })
  })

  describe('#fetchManagerTimesheet', () => {
    it('it should called actions when user is leadWorker ', () => {
      const inputOffset = 0
      const user = leadWorker
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(TIMESHEET_URL, params).reply(200, 'success')
      return fetchManagerTimesheet(inputOffset, user).payload.then(res => {
        expect(res).toEqual('success')
      })
    })
    it('it should called actions when user is constructManager ', () => {
      const inputOffset = 0
      const user = constructionManager
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(TIMESHEET_URL, params).reply(200, 'success')
      return fetchManagerTimesheet(inputOffset, user).payload.then(res => {
        expect(res).toEqual('success')
      })
    })
    it('it should called actions when user is unknown ', () => {
      const inputOffset = 0
      const user = {}
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(TIMESHEET_URL, params).reply(400, 'User is invalid')
      return fetchManagerTimesheet(inputOffset, user).payload.catch(res => {
        expect(res.message).toEqual('User is invalid')
      })
    })
  })

  describe('#setManagerTimesheetRefreshing', () => {
    it('it should called actions when call setManagerTimesheetRefreshing ', () => {
      const expectActions = [SET_MANAGER_TIMESHEET_REFRESH]
      store.dispatch(setManagerTimesheetRefreshing())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#refreshManagerTimesheet', () => {
    it('it should called actions when call refreshManagerTimesheet ', () => {
      const expectActions = [SET_MANAGER_TIMESHEET_REFRESH, FETCH_MANAGER_TIMESHEET]
      store.dispatch(refreshManagerTimesheet())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#resetManagerTimesheetErrorMessage', () => {
    it('it should called actions when call resetManagerTimesheetErrorMessage ', () => {
      const expectActions = [RESET_MANAGER_TIMESHEET_ERROR_MESSAGE]
      store.dispatch(resetManagerTimesheetErrorMessage())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })
})
