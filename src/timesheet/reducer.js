import { handleActions, combineActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { omitBy, isUndefined, findIndex, isEmpty } from 'lodash'
import { resolve, pend, reject } from '../utilities/actions'
import {
  SET_TIMESHEET_BASIC_INFO,
  RESET_TIMESHEET_BASIC_INFO,
  FETCH_TIMESHEET,
  SET_TIMESHEET_REFRESH,
  ADD_TIMESHEET_LINE,
  RESET_ERROR_MESSAGE,
  DELETE_TIMESHEET_LINE,
  UPDATE_TIMESHEET_LINE,
  SET_TIMESHEET_LINE,
  SUBMIT_TIMESHEET,
  CHANGE_SHOW_ALERT_STATE,
  PATCH_TIMESHEET,
  UPDATE_TIMESHEET,
  SET_VIEW_MODE,
  FETCH_MANAGER_TIMESHEET,
  SET_MANAGER_TIMESHEET_REFRESH,
  RESET_MANAGER_TIMESHEET_ERROR_MESSAGE,
} from './actions'
import { addArrayItem, removeArrayItem, replaceArrayItem } from '../utilities/array'
import { VIEW_MODE } from './constants'

const timesheetBasicInfo = handleActions({
  [SET_TIMESHEET_BASIC_INFO]:
  (state, { payload }) => ({ ...state, ...omitBy(payload, isUndefined) }),
  [RESET_TIMESHEET_BASIC_INFO]: (state, { payload }) => payload,
}, {})

const list = handleActions({
  [resolve(FETCH_TIMESHEET)]: (state, { payload }) => (
    payload.previous ? [...state, ...payload.results] : payload.results
  ),
}, [])

const next = handleActions({
  [resolve(FETCH_TIMESHEET)]: (state, { payload }) => payload.next,
}, null)

const loading = handleActions({
  [combineActions(
    pend(FETCH_TIMESHEET),
  )]: () => true,
  [combineActions(
    resolve(FETCH_TIMESHEET),
    reject(FETCH_TIMESHEET),
  )]: () => false,
}, false)

const submitting = handleActions({
  [combineActions(
    pend(SUBMIT_TIMESHEET),
    pend(PATCH_TIMESHEET),
    pend(UPDATE_TIMESHEET),
  )]: () => true,
  [combineActions(
    resolve(SUBMIT_TIMESHEET),
    resolve(PATCH_TIMESHEET),
    resolve(UPDATE_TIMESHEET),
    reject(SUBMIT_TIMESHEET),
    reject(PATCH_TIMESHEET),
    reject(UPDATE_TIMESHEET),
  )]: () => false,
}, false)

const refreshing = handleActions({
  [SET_TIMESHEET_REFRESH]: () => true,
  [combineActions(
    resolve(FETCH_TIMESHEET),
    reject(FETCH_TIMESHEET),
  )]: () => false,
}, false)

const errorMessage = handleActions({
  [combineActions(
    pend(FETCH_TIMESHEET),
    resolve(FETCH_TIMESHEET),
    RESET_ERROR_MESSAGE,
  )]: () => '',
  [reject(FETCH_TIMESHEET)]: (state, { payload }) => payload.message,
}, '')

const timesheetLines = handleActions({
  [ADD_TIMESHEET_LINE]: (state, { payload }) => addArrayItem(state, payload),
  [DELETE_TIMESHEET_LINE]: (state, { payload }) => (
  removeArrayItem(state, findIndex(state, item => item.uuid === payload.uuid))),
  [UPDATE_TIMESHEET_LINE]: (state, { payload }) => (
    replaceArrayItem(state, findIndex(state, item =>
      (item.id ? item.id === payload.id : item.uuid === payload.uuid)), payload)),
  [SET_TIMESHEET_LINE]: (state, { payload }) => (isEmpty(payload) ? [] : payload),
}, [])

const showAlert = handleActions({
  [CHANGE_SHOW_ALERT_STATE]: (state, { payload }) => payload,
}, false)

const viewMode = handleActions({
  [SET_VIEW_MODE]: (state, { payload }) => payload,
}, VIEW_MODE.APPROVAL)


const managerTimesheetList = handleActions({
  [resolve(FETCH_MANAGER_TIMESHEET)]: (state, { payload }) => (
    payload.previous ? [...state, ...payload.results] : payload.results
  ) }, [])

const managerTimesheetNext = handleActions({
  [resolve(FETCH_MANAGER_TIMESHEET)]: (state, { payload }) => payload.next,
}, null)

const managerTimesheetLoading = handleActions({
  [combineActions(
    pend(FETCH_MANAGER_TIMESHEET),
  )]: () => true,
  [combineActions(
    resolve(FETCH_MANAGER_TIMESHEET),
    reject(FETCH_MANAGER_TIMESHEET),
  )]: () => false,
}, false)

const managerTimesheetRefreshing = handleActions({
  [SET_MANAGER_TIMESHEET_REFRESH]: () => true,
  [combineActions(
    resolve(FETCH_MANAGER_TIMESHEET),
    reject(FETCH_MANAGER_TIMESHEET),
  )]: () => false,
}, false)

const managerTimesheetErrorMsg = handleActions({
  [combineActions(pend(FETCH_MANAGER_TIMESHEET), resolve(FETCH_MANAGER_TIMESHEET))]: () => '',
  [reject(FETCH_MANAGER_TIMESHEET)]: (state, { payload }) => payload.message,
  [RESET_MANAGER_TIMESHEET_ERROR_MESSAGE]: () => '',
}, '')


export default combineReducers({
  list,
  next,
  loading,
  refreshing,
  submitting,
  errorMessage,
  showAlert,
  timesheetBasicInfo,
  timesheetLines,
  viewMode,
  managerTimesheetList,
  managerTimesheetNext,
  managerTimesheetLoading,
  managerTimesheetRefreshing,
  managerTimesheetErrorMsg,
})
