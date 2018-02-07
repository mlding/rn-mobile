import { createAction } from 'redux-actions'
import { Actions } from 'react-native-router-flux'
import { isEmpty } from 'lodash'
import { TITLE } from './constants'
import api from '../api/api'
import { PAGE_SIZE } from '../utilities/fetchUtil'
import { getDefaultName } from '../utilities/utils'
import alert from '../utilities/prompt'
import STATUS, { ORDERING, ORDERING_BY_STATUS } from '../constants/status'

export const TIMESHEET_URL = '/api/v1/mobile/timesheets/'
export const SET_TIMESHEET_BASIC_INFO = 'TIMESHEET/SET_TIMESHEET_BASIC_INFO'
export const RESET_TIMESHEET_BASIC_INFO = 'TIMESHEET/RESET_TIMESHEET_BASIC_INFO'
export const FETCH_TIMESHEET = 'TIMESHEET/FETCH_TIMESHEET'
export const SET_TIMESHEET_REFRESH = 'TIMESHEET/SET_TIMESHEET_REFRESH'
export const RESET_ERROR_MESSAGE = 'TIMESHEET/RESET_ERROR_MESSAGE'
export const ADD_TIMESHEET_LINE = 'TIMESHEET/ADD_TIMESHEET_LINE'
export const DELETE_TIMESHEET_LINE = 'TIMESHEET/DELETE_TIMESHEET_LINE'
export const UPDATE_TIMESHEET_LINE = 'TIMESHEET/UPDATE_TIMESHEET_LINE'
export const SET_TIMESHEET_LINE = 'TIMESHEET/SET_TIMESHEET_LINE'
export const SUBMIT_TIMESHEET = 'TIMESHEET/SUBMIT_TIMESHEET'
export const CHANGE_SHOW_ALERT_STATE = 'TIMESHEET/CHANGE_SHOW_ALERT_STATE '
export const PATCH_TIMESHEET = 'TIMESHEET/PATCH_TIMESHEET '
export const UPDATE_TIMESHEET = 'TIMESHEET/UPDATE_TIMESHEET '
export const SET_VIEW_MODE = 'TIMESHEET/SET_VIEW_MODE'

export const FETCH_MANAGER_TIMESHEET = 'MANAGER_TIMESHEET/FETCH_LIST'
export const SET_MANAGER_TIMESHEET_REFRESH = 'MANAGER_TIMESHEET/REFRESHING'
export const RESET_MANAGER_TIMESHEET_ERROR_MESSAGE = 'MANAGER_TIMESHEET/RESET_ERROR_MESSAGE'

export const createTimesheet = () => (dispatch, getState) => {
  if (!isEmpty(getState().draft.timesheet)) {
    alert({
      message: 'You have a draft timesheet. Do you want finish the timesheet first?',
      leftText: 'Edit draft',
      leftFunc: () =>
        Actions.createTimesheet({ title: TITLE.EDIT_DRAFT, status: STATUS.DRAFT }),
      rightText: 'Create new',
      rightFunc: () => Actions.createTimesheet({ title: TITLE.CREATE }),
    })
  } else {
    Actions.createTimesheet({ title: TITLE.CREATE })
  }
}

export const fetchTimesheet = createAction(FETCH_TIMESHEET, (offset, user) =>
  api.get(TIMESHEET_URL, {
    params: {
      limit: PAGE_SIZE,
      offset: offset,
      ordering: ORDERING.SUBMITTED_DATE,
      created_by: user.id,
      ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
    },
  }))

export const submitTimesheet = createAction(SUBMIT_TIMESHEET,
  params => api.post(TIMESHEET_URL, params))

export const patchTimesheet = createAction(PATCH_TIMESHEET,
  ({ id, status, comments }) => {
    const url = `${TIMESHEET_URL}${id}/`
    const patchParams = {
      status: status,
      comments: comments,
    }
    return api.patch(url, patchParams)
  },
)

export const updateTimesheet = createAction(UPDATE_TIMESHEET, timesheet => {
  const url = `${TIMESHEET_URL}${timesheet.id}/`
  return api.put(url, timesheet)
})

export const setTimesheetRefreshing = createAction(SET_TIMESHEET_REFRESH)

export const refreshTimesheet = () => (dispatch, getState) => {
  dispatch(setTimesheetRefreshing())
  dispatch(fetchTimesheet(0, getState().auth.user, getState().timesheet.viewMode))
}

export const resetErrorMessage = createAction(RESET_ERROR_MESSAGE)

export const setTimesheetBasicInfo = createAction(SET_TIMESHEET_BASIC_INFO)

export const resetTimesheetBasicInfo = () => (dispatch, getState) => {
  const { auth } = getState()
  dispatch({
    type: RESET_TIMESHEET_BASIC_INFO,
    payload: {
      name: getDefaultName(auth.user),
      description: '',
      notes: '',
    },
  })
}

export const setViewMode = createAction(SET_VIEW_MODE)

export const addTimesheetLine = createAction(ADD_TIMESHEET_LINE)
export const deleteTimesheetLine = createAction(DELETE_TIMESHEET_LINE)
export const updateTimesheetLine = createAction(UPDATE_TIMESHEET_LINE)
export const setTimesheetLine = createAction(SET_TIMESHEET_LINE)
export const changeViewMode = viewMode => dispatch => {
  dispatch(setViewMode(viewMode))
}

export const changeShowAlertState = createAction(CHANGE_SHOW_ALERT_STATE)

export const fetchManagerTimesheet = createAction(FETCH_MANAGER_TIMESHEET, (offset, user) =>
  api.get(TIMESHEET_URL, {
    params: {
      limit: PAGE_SIZE,
      offset: offset,
      ordering: ORDERING.SUBMITTED_DATE,
      approver: user.id,
      ordering_by_status: ORDERING_BY_STATUS.CONSTRUCTION_MANAGER,
    },
  }))

export const setManagerTimesheetRefreshing = createAction(SET_MANAGER_TIMESHEET_REFRESH)

export const refreshManagerTimesheet = () => (dispatch, getState) => {
  dispatch(setManagerTimesheetRefreshing())
  dispatch(fetchManagerTimesheet(0, getState().auth.user))
}

export const resetManagerTimesheetErrorMessage = createAction(RESET_MANAGER_TIMESHEET_ERROR_MESSAGE)
