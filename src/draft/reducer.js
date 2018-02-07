import { isEmpty } from 'lodash'
import { handleActions, combineActions } from 'redux-actions'
import { combineReducers } from 'redux'
import {
  UPDATE_DRAFT_REPORT,
  UPDATE_DRAFT_EXTRA_WORK_ORDER,
  GET_DRAFT_REPORT,
  GET_DRAFT_EXTRA_WORK_ORDER, UPDATE_DRAFT_TIMESHEET, GET_DRAFT_TIMESHEET,
} from './actions'
import { resolve } from '../utilities/actions'

const report = handleActions({
  [combineActions(
    resolve(UPDATE_DRAFT_REPORT),
    resolve(GET_DRAFT_REPORT),
  )]: (state, { payload }) => (isEmpty(payload) ? null : payload),
}, null)

const extraWorkOrder = handleActions({
  [combineActions(
    resolve(UPDATE_DRAFT_EXTRA_WORK_ORDER),
    resolve(GET_DRAFT_EXTRA_WORK_ORDER),
  )]: (state, { payload }) => (isEmpty(payload) ? null : payload),
}, null)

const timesheet = handleActions({
  [combineActions(
    resolve(UPDATE_DRAFT_TIMESHEET),
    resolve(GET_DRAFT_TIMESHEET),
  )]: (state, { payload }) => (isEmpty(payload) ? null : payload),
}, null)

export default combineReducers({
  report,
  extraWorkOrder,
  timesheet,
})
