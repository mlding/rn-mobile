import { get } from 'lodash'
import { createAction } from 'redux-actions'
import { getManagerViewMode } from './utilities'
import { setViewMode } from '../timesheet/actions'

export const SET_NOTIFICATION = 'NOTIFICATION/SET_NOTIFICATION'
export const RESET_NOTIFICATION = 'NOTIFICATION/RESET_NOTIFICATION'
export const RESET_MANUAL_REFRESH = 'NOTIFICATION/RESET_MANUAL_REFRESH'

export const setNotification = payload => (dispatch, getState) => {
  // 1. Need set view mode if notification need redirect to CREATOR_MODE for Bill
  const role = get(getState().auth, 'user.role')
  const currentViewMode = get(getState().timesheet, 'viewMode')
  const managerViewMode = getManagerViewMode(payload.type, role)
  if (managerViewMode && managerViewMode !== currentViewMode) {
    dispatch(setViewMode(managerViewMode))
  }
  dispatch({ type: SET_NOTIFICATION, payload: payload })
}

export const resetNotification = createAction(RESET_NOTIFICATION)
export const resetManualRefresh = createAction(RESET_MANUAL_REFRESH)
