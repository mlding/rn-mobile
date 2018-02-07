import { combineActions, handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { findIndex, remove, isEmpty } from 'lodash'
import { reject, resolve } from '../utilities/actions'
import {
  FETCH_WORK_ITEMS,
  RESET_SELECTED_IDS,
  SET_WORK_ITEMS_REFRESHING,
  TOGGLE_SELECTED_BY_ID,
  RESET_FILTER_CONDITIONS,
  SET_SEARCH_CONDITION,
  RESET_FILTER_AND_SEARCH,
  SET_WORK_ITEMS_VISIBILITY,
  SET_FILTER_CONDITIONS,
  RESET_WORK_ITEMS_LOADING,
} from './actions'
import { addArrayItem, removeArrayItem } from '../utilities/array'
import { DEFAULT_FILTER_CONDITIONS } from './filter/constants'

const combineFetchWorkItemsFinalActions = combineActions(
  resolve(FETCH_WORK_ITEMS),
  reject(FETCH_WORK_ITEMS),
)

const list = handleActions({
  [resolve(FETCH_WORK_ITEMS)]: (state, { payload }) => (
    payload.previous ? [...state, ...payload.results] : [...payload.results]
  ),
}, [])

const next = handleActions({
  [resolve(FETCH_WORK_ITEMS)]:
    (state, { payload }) => payload.next,
}, null)

const loading = handleActions({
  [FETCH_WORK_ITEMS]: () => true,
  [combineFetchWorkItemsFinalActions]: () => false,
}, false)

const refreshing = handleActions({
  [SET_WORK_ITEMS_REFRESHING]: () => true,
  [combineFetchWorkItemsFinalActions]: () => false,
  [RESET_WORK_ITEMS_LOADING]: () => false,
}, false)

const errorMessage = handleActions({
  [combineActions(FETCH_WORK_ITEMS, resolve(FETCH_WORK_ITEMS))]: () => '',
  [reject(FETCH_WORK_ITEMS)]: (state, { payload }) => payload.message,
}, '')

const selectedIds = handleActions({
  [TOGGLE_SELECTED_BY_ID]: (state, { payload }) => {
    const index = findIndex(state, id => id === payload)
    if (index === -1) {
      return addArrayItem(state, payload)
    }

    return removeArrayItem(state, index)
  },
  [RESET_SELECTED_IDS]: () => [],
}, [])

const filterConditions = handleActions({
  [SET_FILTER_CONDITIONS]: (state, { payload }) => payload,
  [RESET_FILTER_AND_SEARCH]: () => DEFAULT_FILTER_CONDITIONS,
  [RESET_FILTER_CONDITIONS]: (state, { payload }) => {
    if (isEmpty(payload)) return DEFAULT_FILTER_CONDITIONS
    const array = [...state]
    remove(array, item => item.filterType === payload)
    return array
  },
}, DEFAULT_FILTER_CONDITIONS)

const searchCondition = handleActions({
  [SET_SEARCH_CONDITION]: (state, { payload }) => ({ ...state, ...payload }),
  [RESET_FILTER_AND_SEARCH]: () => ({}),
}, {})

const visibility = handleActions({
  [SET_WORK_ITEMS_VISIBILITY]: (state, { payload }) => payload,
}, false)

export default combineReducers({
  list,
  next,
  loading,
  refreshing,
  errorMessage,
  selectedIds,
  filterConditions,
  searchCondition,
  visibility,
})
