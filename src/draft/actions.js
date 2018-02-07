import { createAction } from 'redux-actions'
import { setDraft, getDraft } from './utilities'
import STORAGE_KEY from '../constants/storageKey'

export const UPDATE_DRAFT_REPORT = 'REPORTS/UPDATE_DRAFT'
export const UPDATE_DRAFT_EXTRA_WORK_ORDER = 'EXTRA_WORK_ORDER/UPDATE_DRAFT'
export const UPDATE_DRAFT_TIMESHEET = 'TIMESHEET/UPDATE_DRAFT'
export const GET_DRAFT_REPORT = 'REPORTS/GET_DRAFT'
export const GET_DRAFT_EXTRA_WORK_ORDER = 'EXTRA_WORK_ORDER/GET_DRAFT'
export const GET_DRAFT_TIMESHEET = 'TIMESHEET/GET_DRAFT'

export const setDraftReport = createAction(UPDATE_DRAFT_REPORT,
  (draft, user) => (setDraft(draft, user.id, STORAGE_KEY.DRAFT_REPORT)))

export const setDraftExtraWorkOrder = createAction(UPDATE_DRAFT_EXTRA_WORK_ORDER,
  (draft, user) => (setDraft(draft, user.id, STORAGE_KEY.DRAFT_EXTRA_WORK_ORDER)))

export const setDraftTimesheet = createAction(UPDATE_DRAFT_TIMESHEET,
  (draft, user) => (setDraft(draft, user.id, STORAGE_KEY.DRAFT_TIMESHEET)))

export const getDraftReport = createAction(GET_DRAFT_REPORT,
  user => getDraft(user.id, STORAGE_KEY.DRAFT_REPORT))

export const getDraftExtraWorkOrder = createAction(GET_DRAFT_EXTRA_WORK_ORDER,
  user => getDraft(user.id, STORAGE_KEY.DRAFT_EXTRA_WORK_ORDER))

export const getDraftTimeSheet = createAction(GET_DRAFT_TIMESHEET,
  user => getDraft(user.id, STORAGE_KEY.DRAFT_TIMESHEET))
