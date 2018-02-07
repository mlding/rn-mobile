import { handleActions, combineActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { findIndex, isEmpty, isUndefined, omitBy, omit } from 'lodash'
import { removeArrayItem, replaceArrayItem } from '../utilities/array'
import {
  RESET_REPORT_INFO,
  SUBMIT_REPORT,
  ADD_WORK_ITEMS,
  DELETE_WORK_ITEM,
  SET_PRODUCTION_LINES,
  CHANGE_SHOW_ALERT_STATE,
  UPDATE_REPORT,
  MODIFY_REPORTLINE_FIELD,
  MODIFY_QUANTITY_FIELD,
  SET_REPORT_INFO,
  UPDATE_AS_BUILT,
  ADD_PICTURE,
  DELETE_PICTURE,
  ADD_QUANTITY,
  DELETE_QUANTITY,
  EDIT_QUANTITY_NAME,
  ADD_ORIGIN_WORK_ITEMS,
  SET_ORIGIN_WORK_ITEMS,
  PATCH_REPORT,
  SET_CURRENT_REPORT_ID,
  FETCH_WORK_ITEMS_BY_REPORT_ID,
  RESET_REPORT_WORK_ITEMS,
} from './actions'
import {
  BATCH_UPLOAD_PICTURES,
  BATCH_UPLOAD_PICTURES_FAILED,
  UPLOAD_PICTURE_SUCCESS,
  RESET_UPLOADED_PICTURES,
} from './pictureActions'
import { pend, reject, resolve } from '../utilities/actions'

const productReportLines = handleActions({
  [ADD_WORK_ITEMS]: (state, { payload }) => [...state, ...payload],
  // when the DPR has the report line change the is_active to false, else remove the DPR line
  [DELETE_WORK_ITEM]: (state, { payload }) => {
    const index = findIndex(state, item => item.work_item === payload.work_item)
    if (payload.id) {
      const reportLine = {
        ...omit(payload, ['is_active']),
        'is_active': false,
      }
      return replaceArrayItem(state, index, reportLine)
    }
    return removeArrayItem(state, index)
  },
  [combineActions(
    MODIFY_REPORTLINE_FIELD,
    MODIFY_QUANTITY_FIELD,
    ADD_QUANTITY,
    DELETE_QUANTITY,
    EDIT_QUANTITY_NAME,
    UPDATE_AS_BUILT,
    ADD_PICTURE,
    DELETE_PICTURE,
  )]: (state, { payload }) => {
    const index = findIndex(state, item => item.work_item === payload.work_item && item.is_active)
    return replaceArrayItem(state, index, payload)
  },
  [SET_PRODUCTION_LINES]: (state, { payload }) => (isEmpty(payload) ? [] : payload),
}, [])

const showLoading = handleActions({
  [combineActions(
    pend(SUBMIT_REPORT),
    pend(UPDATE_REPORT),
    pend(PATCH_REPORT),
    BATCH_UPLOAD_PICTURES,
  )]: () => true,
  [combineActions(
    resolve(SUBMIT_REPORT),
    resolve(UPDATE_REPORT),
    resolve(PATCH_REPORT),
    reject(SUBMIT_REPORT),
    reject(UPDATE_REPORT),
    reject(PATCH_REPORT),
    BATCH_UPLOAD_PICTURES_FAILED,
  )]: () => false,
}, false)

const mapLoading = handleActions({
  [pend(FETCH_WORK_ITEMS_BY_REPORT_ID)]: () => true,
  [combineActions(
    resolve(FETCH_WORK_ITEMS_BY_REPORT_ID),
    reject(FETCH_WORK_ITEMS_BY_REPORT_ID),
  )]: () => false,
}, false)

const showAlert = handleActions({
  [CHANGE_SHOW_ALERT_STATE]: (state, { payload }) => payload,
}, false)

const reportInfo = handleActions({
  [SET_REPORT_INFO]: (state, { payload }) => ({ ...state, ...omitBy(payload, isUndefined) }),
  [RESET_REPORT_INFO]: (state, { payload }) => payload,
}, {})


const uploadedPictures = handleActions({
  [UPLOAD_PICTURE_SUCCESS]: (state, { payload }) => [...state, payload],
  [RESET_UPLOADED_PICTURES]: () => [],
}, [])

const originWorkItems = handleActions({
  [ADD_ORIGIN_WORK_ITEMS]: (state, { payload }) => [...state, ...payload],
  [SET_ORIGIN_WORK_ITEMS]: (state, { payload }) => (isEmpty(payload) ? [] : payload),
  [DELETE_WORK_ITEM]: (state, { payload }) => {
    const index = findIndex(state, item => item.id === payload.work_item)
    return removeArrayItem(state, index)
  },
}, [])

const reportWorkItems = handleActions({
  [resolve(FETCH_WORK_ITEMS_BY_REPORT_ID)]: (state, { payload }) => payload.results,
  [RESET_REPORT_WORK_ITEMS]: () => [],
}, [])

const currentReportId = handleActions({
  [SET_CURRENT_REPORT_ID]: (state, { payload }) => payload,
}, null)

export default combineReducers({
  productReportLines,
  showLoading,
  showAlert,
  reportInfo,
  uploadedPictures,
  originWorkItems,
  reportWorkItems,
  currentReportId,
  mapLoading,
})
