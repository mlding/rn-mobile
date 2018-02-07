import { createAction } from 'redux-actions'
import { Actions } from 'react-native-router-flux'
import { isEmpty } from 'lodash'
import api from '../api/api'
import { getDefaultName } from '../utilities/utils'
import { DEFAULT_BASIC_INFO, TITLE } from './constants'
import alert from '../utilities/prompt'
import STATUS from '../constants/status'
import { getFetchParams } from '../utilities/fetchUtil'

export const FETCH_EXTRA_WORK_ORDER = 'EXTRA_WORK_ORDER/FETCH_LIST'
export const SET_EXTRA_WORK_ORDER_REFRESH = 'EXTRA_WORK_ORDER/REFRESHING'
export const RESET_ERROR_MESSAGE = 'EXTRA_WORK_ORDER/RESET_ERROR_MESSAGE'
export const SET_BASIC_INFO = 'EXTRA_WORK_ORDER/SET_BASIC_INFO'
export const RESET_BASIC_INFO = 'EXTRA_WORK_ORDER/RESET_BASIC_INFO'
export const ADD_EXTRA_LINE = 'EXTRA_WORK_ORDER/ADD_EXTRA_LINE'
export const UPDATE_EXTRA_LINE = 'EXTRA_WORK_ORDER/UPDATE_EXTRA_LINE'
export const DELETE_EXTRA_LINE = 'EXTRA_WORK_ORDER/DELETE_EXTRA_LINE'
export const SET_EXTRA_LINES = 'EXTRA_WORK_ORDER/SET_EXTRA_LINES'
export const UPDATE_EXTRA_LINE_FORM = 'EXTRA_WORK_ORDER/UPDATE_EXTRA_LINE_FORM'
export const UPDATE_LOCATION = 'EXTRA_WORK_ORDER/UPDATE_LOCATION'
export const SET_LOCATION_ENTRANCE = 'EXTRA_WORK_ORDER/SET_LOCATION_ENTRANCE'
export const SUBMIT_EXTRA_WORK_ORDER = 'EXTRA_WORK_ORDER/SUBMIT_EXTRA_WORK_ORDER'
export const RESET_EXTRA_LINE_FORM = 'EXTRA_WORK_ORDER/RESET_EXTRA_LINE_FORM'
export const UPDATE_EXTRA_WORK_ORDER = 'EXTRA_WORK_ORDER/UPDATE_EXTRA_WORK_ORDER'
export const PATCH_EXTRA_WORK_ORDER = 'EXTRA_WORK_ORDER/PATCH'
export const CHANGE_SHOW_ALERT_FOR_ITEM = 'EXTRA_WORK_ORDER/CHANGE_SHOW_ALERT_FOR_ITEM'

export const EXTRA_WORK_ORDER_URL = '/api/v1/mobile/extra_work_order_requests/'

export const fetchExtraWorkOrder = createAction(FETCH_EXTRA_WORK_ORDER, (offset, user) =>
  api.get(EXTRA_WORK_ORDER_URL, {
    params: getFetchParams(offset, user),
  }))

export const setExtraWorkOrderRefreshing = createAction(SET_EXTRA_WORK_ORDER_REFRESH)

export const refreshExtraWorkOrders = () => (dispatch, getState) => {
  dispatch(setExtraWorkOrderRefreshing())
  dispatch(fetchExtraWorkOrder(0, getState().auth.user))
}

export const resetErrorMessage = createAction(RESET_ERROR_MESSAGE)

export const createExtraWorkOrder = () => (dispatch, getState) => {
  if (!isEmpty(getState().draft.extraWorkOrder)) {
    alert({
      message: 'You have a draft extra work order. Do you want finish extra work order first?',
      leftText: 'Edit draft',
      leftFunc: () =>
        Actions.createExtraWorkOrder({ title: TITLE.EDIT_DRAFT, status: STATUS.DRAFT }),
      rightText: 'Create new',
      rightFunc: () => Actions.createExtraWorkOrder({ title: TITLE.CREATE }),
    })
  } else {
    Actions.createExtraWorkOrder({ title: TITLE.CREATE })
  }
}

export const setBasicInfo = createAction(SET_BASIC_INFO)
export const setExtraLines = createAction(SET_EXTRA_LINES)

export const resetBasicInfo = createAction(RESET_BASIC_INFO, user => (
  { ...DEFAULT_BASIC_INFO, name: getDefaultName(user) }
))

export const addExtraLine = createAction(ADD_EXTRA_LINE)
export const updateExtraLine = createAction(UPDATE_EXTRA_LINE)
export const deleteExtraLine = createAction(DELETE_EXTRA_LINE)
export const updateExtraLineForm = createAction(UPDATE_EXTRA_LINE_FORM)
export const resetExtraLineForm = createAction(RESET_EXTRA_LINE_FORM)
export const updateLocation = createAction(UPDATE_LOCATION)
export const setLocationEntrance = createAction(SET_LOCATION_ENTRANCE)
export const patchExtraWorkOrder = createAction(PATCH_EXTRA_WORK_ORDER,
  ({ id, status, comments, workorderStatus }) => {
    const url = `${EXTRA_WORK_ORDER_URL}${id}/`
    let patchParams = {
      status: status,
      comments: comments }
    if (workorderStatus) {
      patchParams = { ...patchParams, ewo_status: workorderStatus }
    }
    return api.patch(url, patchParams)
  })

export const submitExtraWorkOrder = createAction(SUBMIT_EXTRA_WORK_ORDER, params =>
  api.post(EXTRA_WORK_ORDER_URL, params),
)

export const updateExtraWorkOrder = createAction(UPDATE_EXTRA_WORK_ORDER, params =>
  api.put(`${EXTRA_WORK_ORDER_URL + params.id}/`, params),
)

export const changeShowAlertForItem = createAction(CHANGE_SHOW_ALERT_FOR_ITEM)
