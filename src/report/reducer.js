import { handleActions, combineActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { resolve, pend, reject } from '../utilities/actions'
import { FETCH_REPORTS, SET_REPORTS_REFRESH, RESET_ERROR_MESSAGE, CHANGE_SORT_TYPE } from './actions'
import { DEFAULT_SORT_TYPE } from './constants'

const FETCH_REPORTS_RESULT = combineActions(resolve(FETCH_REPORTS), reject(FETCH_REPORTS))

const list = handleActions({
  [resolve(FETCH_REPORTS)]: (state, { payload }) => (
    payload.previous ? [...state, ...payload.results] : payload.results
  ) }, [])

const next = handleActions({
  [resolve(FETCH_REPORTS)]: (state, { payload }) => payload.next,
}, null)

const loading = handleActions({
  [pend(FETCH_REPORTS)]: () => true,
  [FETCH_REPORTS_RESULT]: () => false,
}, false)

const refreshing = handleActions({
  [SET_REPORTS_REFRESH]: () => true,
  [FETCH_REPORTS_RESULT]: () => false,
}, false)

const errorMessage = handleActions({
  [combineActions(pend(FETCH_REPORTS), resolve(FETCH_REPORTS))]: () => '',
  [reject(FETCH_REPORTS)]: (state, { payload }) => payload.message,
  [RESET_ERROR_MESSAGE]: () => '',
}, '')

const sortType = handleActions({
  [CHANGE_SORT_TYPE]: (state, { payload }) => payload,
}, DEFAULT_SORT_TYPE)

export default combineReducers({
  list,
  next,
  loading,
  refreshing,
  errorMessage,
  sortType,
})
