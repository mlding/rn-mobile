import { createAction } from 'redux-actions'
import { createOfflineAction, GET } from '../utilities/actions'

export const FETCH_WORK_ITEMS_URL = '/api/v1/mobile/work_items/'

export const FETCH_WORK_ITEMS = 'WORK_ITEMS/FETCH_LIST'
export const RESET_WORK_ITEMS_LOADING = 'WORK_ITEMS/RESET_LOADING'
export const SET_WORK_ITEMS_REFRESHING = 'WORK_ITEMS/SET_REFRESHING'
export const TOGGLE_SELECTED_BY_ID = 'WORK_ITEMS/TOGGLE_SELECTED'
export const RESET_SELECTED_IDS = 'WORK_ITEMS/RESET_SELECTED_IDS'
export const RESET_FILTER_CONDITIONS = 'WORK_ITEMS/RESET_FILTER_CONDITIONS'
export const SET_SEARCH_CONDITION = 'WORK_ITEMS/SET_SEARCH_CONDITION'
export const RESET_FILTER_AND_SEARCH = 'WORK_ITEMS/RESET_FILTER_AND_SEARCH'
export const SET_WORK_ITEMS_VISIBILITY = 'WORK_ITEMS/SET_VISIBILITY'
export const SET_FILTER_CONDITIONS = 'WORK_ITEMS/SET_FILTER_CONDITIONS'

export const fetchWorkItems = createOfflineAction(FETCH_WORK_ITEMS, (offset, user) => ({
  url: FETCH_WORK_ITEMS_URL,
  method: GET,
  params: {
    assign_to_person: user.id,
    status: 'assigned',
  },
}))

export const resetWorkItemsLoading = createAction(RESET_WORK_ITEMS_LOADING)

export const setWorkItemsRefreshing = createAction(SET_WORK_ITEMS_REFRESHING)

export const refreshWorkItems = () => (dispatch, getState) => {
  dispatch(setWorkItemsRefreshing())
  dispatch(fetchWorkItems(0, getState().auth.user))
}

export const toggleSelectedById = createAction(TOGGLE_SELECTED_BY_ID)
export const resetSelectedIds = createAction(RESET_SELECTED_IDS)

export const setSearchCondition = createAction(SET_SEARCH_CONDITION)

export const resetFilterAndSearch = createAction(RESET_FILTER_AND_SEARCH)

export const setWorkItemsVisibility = createAction(SET_WORK_ITEMS_VISIBILITY)

export const resetFilterConditions = createAction(RESET_FILTER_CONDITIONS)
export const setFilterConditions = createAction(SET_FILTER_CONDITIONS)
