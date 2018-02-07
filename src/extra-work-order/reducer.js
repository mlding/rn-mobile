import { handleActions, combineActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { findIndex, isEmpty } from 'lodash'
import { resolve, pend, reject } from '../utilities/actions'
import {
  FETCH_EXTRA_WORK_ORDER,
  SET_EXTRA_WORK_ORDER_REFRESH,
  RESET_ERROR_MESSAGE,
  RESET_BASIC_INFO,
  SET_BASIC_INFO,
  ADD_EXTRA_LINE,
  UPDATE_EXTRA_LINE,
  DELETE_EXTRA_LINE,
  UPDATE_EXTRA_LINE_FORM,
  UPDATE_LOCATION,
  SET_LOCATION_ENTRANCE,
  SUBMIT_EXTRA_WORK_ORDER,
  SET_EXTRA_LINES,
  RESET_EXTRA_LINE_FORM,
  UPDATE_EXTRA_WORK_ORDER,
  PATCH_EXTRA_WORK_ORDER, CHANGE_SHOW_ALERT_FOR_ITEM,
} from './actions'
import { addArrayItem, removeArrayItem, replaceArrayItem } from '../utilities/array'
import { DEFAULT_BASIC_INFO, DEFAULT_EXTRA_LINE_FORM, DEFAULT_LOCATION, DEFAULT_LOCATION_ENTRANCE } from './constants'
import { compareIdOrUuid } from './utilities'

const basicInfo = handleActions({
  [SET_BASIC_INFO]: (state, { payload }) => ({ ...state, ...payload }),
  [RESET_BASIC_INFO]: (state, { payload }) => payload,
}, DEFAULT_BASIC_INFO)

const extraLines = handleActions({
  [ADD_EXTRA_LINE]: (state, { payload }) => addArrayItem(state, payload),
  [UPDATE_EXTRA_LINE]: (state, { payload }) => {
    if (isEmpty(payload)) return []
    const index = findIndex(state, item => compareIdOrUuid(item, payload))
    return replaceArrayItem(state, index, payload)
  },
  [DELETE_EXTRA_LINE]: (state, { payload }) => {
    const index = findIndex(state, item => compareIdOrUuid(item, payload))
    return removeArrayItem(state, index)
  },
  [SET_EXTRA_LINES]: (state, { payload }) => payload,
}, [])

const extraLineForm = handleActions({
  [RESET_EXTRA_LINE_FORM]: () => DEFAULT_EXTRA_LINE_FORM,
  [UPDATE_EXTRA_LINE_FORM]: (state, { payload }) => ({ ...state, ...payload }),
}, DEFAULT_EXTRA_LINE_FORM)

const location = handleActions({
  [UPDATE_LOCATION]: (state, { payload }) => ({ ...state, ...payload }),
}, DEFAULT_LOCATION)

const locationEntrance = handleActions({
  [SET_LOCATION_ENTRANCE]: (state, { payload }) => payload,
}, DEFAULT_LOCATION_ENTRANCE)

const FETCH_EXTRA_WORK_ORDER_RESULT =
  combineActions(resolve(FETCH_EXTRA_WORK_ORDER), reject(FETCH_EXTRA_WORK_ORDER))

const list = handleActions({
  [resolve(FETCH_EXTRA_WORK_ORDER)]: (state, { payload }) => (
    payload.previous ? [...state, ...payload.results] : payload.results
  ) }, [])

const next = handleActions({
  [resolve(FETCH_EXTRA_WORK_ORDER)]: (state, { payload }) => payload.next,
}, null)

const loading = handleActions({
  [combineActions(
    pend(FETCH_EXTRA_WORK_ORDER),
  )]: () => true,
  [combineActions(
    resolve(FETCH_EXTRA_WORK_ORDER),
    reject(FETCH_EXTRA_WORK_ORDER),
  )]: () => false,
}, false)

const submitting = handleActions({
  [combineActions(
    pend(SUBMIT_EXTRA_WORK_ORDER),
    pend(UPDATE_EXTRA_WORK_ORDER),
    pend(PATCH_EXTRA_WORK_ORDER),
  )]: () => true,
  [combineActions(
    resolve(SUBMIT_EXTRA_WORK_ORDER),
    reject(SUBMIT_EXTRA_WORK_ORDER),
    resolve(PATCH_EXTRA_WORK_ORDER),
    reject(PATCH_EXTRA_WORK_ORDER),
    resolve(UPDATE_EXTRA_WORK_ORDER),
    reject(UPDATE_EXTRA_WORK_ORDER),
  )]: () => false,
}, false)

const refreshing = handleActions({
  [SET_EXTRA_WORK_ORDER_REFRESH]: () => true,
  [FETCH_EXTRA_WORK_ORDER_RESULT]: () => false,
}, false)

const errorMessage = handleActions({
  [combineActions(pend(FETCH_EXTRA_WORK_ORDER), resolve(FETCH_EXTRA_WORK_ORDER))]: () => '',
  [reject(FETCH_EXTRA_WORK_ORDER)]: (state, { payload }) => payload.message,
  [RESET_ERROR_MESSAGE]: () => '',
}, '')

const showAlertForItem = handleActions({
  [CHANGE_SHOW_ALERT_FOR_ITEM]: (state, { payload }) => payload,
}, false)

export default combineReducers({
  list,
  next,
  loading,
  submitting,
  refreshing,
  errorMessage,
  basicInfo,
  extraLines,
  extraLineForm,
  location,
  locationEntrance,
  showAlertForItem,
})
