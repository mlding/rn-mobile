import { createAction } from 'redux-actions'
import { map, findIndex, isEmpty, get, filter } from 'lodash'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import api from '../api/api'
import { getListRequestParameters } from './utilities'
import { convertMaterialToReportLineQuantity, convertWorkItemToReportLine } from '../utilities/reportDataProcess'
import { getDefaultName, uuid } from '../utilities/utils'
import { replaceArrayItem, addArrayItem, removeArrayItem } from '../utilities/array'
import alert from '../utilities/prompt'
import { monthNames } from '../utilities/dateUtils'
import { SORT_PANEL_KEY, TITLE } from './constants'
import STATUS from '../constants/status'
import { FETCH_WORK_ITEMS_URL } from '../work-item/actions'

const PAGE_SIZE = 20
const REPORT_URL = '/api/v1/mobile/production_reports/'

export const FETCH_REPORTS = 'REPORTS/FETCH_LIST'
export const SET_REPORTS_REFRESH = 'REPORTS/SET_REFRESH'
export const ADD_WORK_ITEMS = 'REPORTS/ADD_WORK_ITEMS'
export const PATCH_REPORT = 'REPORTS/PATCH_REPORT'
export const DELETE_WORK_ITEM = 'REPORTS/DELETE_WORK_ITEM'
export const ADD_QUANTITY = 'REPORTS/ADD_QUANTITY'
export const DELETE_QUANTITY = 'REPORTS/DELETE_QUANTITY'
export const EDIT_QUANTITY_NAME = 'REPORTS/EDIT_QUANTITY_NAME'
export const SUBMIT_REPORT = 'REPORTS/SUBMIT_REPORT'
export const UPDATE_REPORT = 'REPORTS/UPDATE_REPORT'
export const SET_PRODUCTION_LINES = 'REPORTS/SET_PRODUCTION_LINES'
export const MODIFY_REPORTLINE_FIELD = 'REPORTS/MODIFY_REPORTLINE_FIELD'
export const MODIFY_QUANTITY_FIELD = 'REPORTS/MODIFY_QUANTITY_FIELD'
export const CHANGE_SHOW_ALERT_STATE = 'REPORTS/CHANGE_SHOW_ALERT_STATE '
export const RESET_REPORT_INFO = 'REPORT/RESET_REPORT_INFO'
export const SET_REPORT_INFO = 'REPORT/SET_REPORT_INFO'
export const UPDATE_AS_BUILT = 'REPORTS/UPDATE_AS_BUILT'
export const ADD_PICTURE = 'REPORTS/ADD_PICTURE'
export const DELETE_PICTURE = 'REPORTS/DELETE_PICTURE'
export const RESET_ERROR_MESSAGE = 'REPORTS/RESET_ERROR_MESSAGE'
export const TOGGLE_SORT_PANEL = 'REPORTS/TOGGLE_SORT_PANEL'
export const CHANGE_SORT_TYPE = 'REPORTS/CHANGE_SORT_TYPE'
export const ADD_ORIGIN_WORK_ITEMS = 'REPORTS/ADD_ORIGIN_WORK_ITEMS'
export const SET_ORIGIN_WORK_ITEMS = 'REPORTS/SET_ORIGIN_WORK_ITEMS'
export const SET_CURRENT_REPORT_ID = 'REPORTS/SET_CURRENT_REPORT_ID'
export const RESET_REPORT_WORK_ITEMS = 'REPORTS/RESET_REPORT_WORK_ITEMS'
export const FETCH_WORK_ITEMS_BY_REPORT_ID = 'REPORTS/FETCH_WORK_ITEMS_BY_REPORT_ID'

export const fetchReportsAction = createAction(FETCH_REPORTS, (offset, user, sortType) =>
  api.get(REPORT_URL, {
    params: {
      limit: PAGE_SIZE,
      offset: offset,
      ...getListRequestParameters(user, sortType),
    },
  }))

export const fetchReports = offset => (dispatch, getState) => {
  const { user } = getState().auth
  const { sortType } = getState().reports
  dispatch(fetchReportsAction(offset, user, sortType))
}

const setReportRefresh = createAction(SET_REPORTS_REFRESH)

export const refreshReports = () => dispatch => {
  dispatch(setReportRefresh())
  dispatch(fetchReports(0))
}

export const addWorkItems = createAction(ADD_WORK_ITEMS,
    workItems => map(workItems, workItem => convertWorkItemToReportLine(workItem)))

export const addQuantity = createAction(ADD_QUANTITY, (reportLine, material) => {
  const quantity = { ...convertMaterialToReportLineQuantity(material), estimated_quantity: 0 }
  return { ...reportLine, quantities: [...reportLine.quantities, quantity] }
})

export const deleteQuantity = createAction(DELETE_QUANTITY, (reportLine, quantity) =>
  ({ ...reportLine, quantities: filter(reportLine.quantities, item => item !== quantity) }))

export const editQuantityName = createAction(EDIT_QUANTITY_NAME,
  (reportLine, quantity, selectedMaterial) => {
    const selectedQuantity = { ...quantity,
      ...convertMaterialToReportLineQuantity(selectedMaterial) }
    return {
      ...reportLine,
      quantities: replaceArrayItem(reportLine.quantities, it => it === quantity, selectedQuantity),
    }
  })

export const setProductionLines = createAction(SET_PRODUCTION_LINES)

export const patchReport = createAction(PATCH_REPORT, ({ id, status, comments }) => {
  const url = `${REPORT_URL}${id}/`
  return api.patch(url, { status, comments })
})

export const deleteWorkItem = createAction(DELETE_WORK_ITEM)

export const modifyReportLineField = createAction(MODIFY_REPORTLINE_FIELD, (reportLine, fieldObj) =>
    ({ ...reportLine, ...fieldObj }))

export const submitReport = createAction(SUBMIT_REPORT, params => api.post(REPORT_URL, params))

export const updateReport = createAction(UPDATE_REPORT, params => api.put(`${REPORT_URL}${params.id}/`, params))

export const modifyQuantityField = createAction(MODIFY_QUANTITY_FIELD,
    (reportLine, quantity, quantityField) => ({
      ...reportLine,
      quantities: replaceArrayItem(reportLine.quantities,
          it => it === quantity,
          { ...quantity, ...quantityField }),
    }))

export const updateAsBuilt = createAction(UPDATE_AS_BUILT,
  (reportLine, asBuiltAnnotation) => {
    if (!get(reportLine, 'network_element.as_built_annotations')) {
      return reportLine
    }
    const index = findIndex(reportLine.network_element.as_built_annotations,
      item => item.name === asBuiltAnnotation.name)
    const asBuiltAnnotations = replaceArrayItem(reportLine.network_element.as_built_annotations,
      index, asBuiltAnnotation)
    const networkElement = {
      ...reportLine.network_element,
      as_built_annotations: asBuiltAnnotations,
    }
    return {
      ...reportLine,
      network_element: networkElement,
    }
  })

export const addPicture = createAction(ADD_PICTURE, (reportLine, picture) =>
  ({
    ...reportLine,
    pictures: addArrayItem(reportLine.pictures,
      { ...picture,
        workItemId: reportLine.work_item,
        uuid: uuid(),
      }, false),
  }))

export const deletePicture = createAction(DELETE_PICTURE, (reportLine, index) =>
  ({
    ...reportLine,
    pictures: removeArrayItem(reportLine.pictures, index),
  }
))

export const changeShowAlertState = createAction(CHANGE_SHOW_ALERT_STATE)

export const setReportInfo = createAction(SET_REPORT_INFO,
  ({ documentReference, reportedDate, notes }) => ({ documentReference, reportedDate, notes }))

export const resetReportInfo = () => (dispatch, getState) => {
  const { auth } = getState()
  dispatch({
    type: RESET_REPORT_INFO,
    payload: {
      documentReference: getDefaultName(auth.user),
      notes: '',
      reportedDate: [moment().year(), monthNames[moment().month()], moment().date()],
    },
  })
}

export const createReport = () => (dispatch, getState) => {
  if (SORT_PANEL_KEY === Actions.currentScene) {
    Actions.pop()
  }
  if (!isEmpty(getState().draft.report)) {
    alert({
      message: 'You have a draft report. Do you want finish draft report first?',
      leftText: 'Edit draft',
      leftFunc: () => Actions.createReport({ title: TITLE.EDIT_DRAFT, status: STATUS.DRAFT }),
      rightText: 'Create new',
      rightFunc: () => Actions.createReport({ title: TITLE.CREATE }),
    })
  } else {
    Actions.createReport({ title: TITLE.CREATE })
  }
}

export const toggleSortPanel = createAction(TOGGLE_SORT_PANEL, () => {
  if (SORT_PANEL_KEY === Actions.currentScene) {
    Actions.pop()
    return
  }
  Actions.sortPanel()
})
const changeSortType = createAction(CHANGE_SORT_TYPE)

export const sortReportList = sortType => dispatch => {
  dispatch(changeSortType(sortType))
  dispatch(fetchReports(0))
}

export const resetErrorMessage = createAction(RESET_ERROR_MESSAGE)

export const addOriginWorkItems = createAction(ADD_ORIGIN_WORK_ITEMS)

export const setOriginWorkItems = createAction(SET_ORIGIN_WORK_ITEMS)

export const setCurrentReportId = createAction(SET_CURRENT_REPORT_ID)

export const resetReportWorkItems = createAction(RESET_REPORT_WORK_ITEMS)

export const fetchWorkItemsByReportId = createAction(FETCH_WORK_ITEMS_BY_REPORT_ID, reportId =>
  api.get(FETCH_WORK_ITEMS_URL, {
    params: {
      production_report: reportId,
    },
  }))

