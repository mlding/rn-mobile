import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  setDraftReport,
  setDraftExtraWorkOrder,
  getDraftReport,
  getDraftExtraWorkOrder,
  setDraftTimesheet,
  getDraftTimeSheet,
} from '../actions'
import { setDraft, getDraft } from '../utilities'
import { leadWorker, draftReport } from '../../shared/fixture'
import { draftExtraWorkOrder } from '../../extra-work-order/fixture'
import STORAGE_KEY from '../../constants/storageKey'


jest.mock('../utilities', () => ({
  setDraft: jest.fn(),
  getDraft: jest.fn(),
}))

describe('#draft actions', () => {
  const mockStore = configureMockStore([thunk])
  let store = {}
  const initialState = {
    auth: {
      user: leadWorker,
    },
    draft: {
      extraWorkOrder: null,
      report: null,
    },
  }

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
  })

  describe('#setDraftReport', () => {
    it('it should called setDraft with DRAFT_REPORT storage key', () => {
      store.dispatch(setDraftReport(draftReport, leadWorker))
      expect(setDraft).toHaveBeenCalledWith(draftReport, leadWorker.id, STORAGE_KEY.DRAFT_REPORT)
    })
  })

  describe('#getDraftReport', () => {
    it('it should called getDraft with DRAFT_REPORT storage key', () => {
      store.dispatch(getDraftReport(leadWorker))
      expect(getDraft).toHaveBeenCalledWith(leadWorker.id, STORAGE_KEY.DRAFT_REPORT)
    })
  })

  describe('#setDraftExtraWorkOrder', () => {
    it('it should called setDraft with DRAFT_REPORT storage key', () => {
      store.dispatch(setDraftExtraWorkOrder(draftExtraWorkOrder, leadWorker))
      expect(setDraft).toHaveBeenCalledWith(
        draftExtraWorkOrder,
        leadWorker.id,
        STORAGE_KEY.DRAFT_EXTRA_WORK_ORDER,
      )
    })
  })

  describe('#getDraftExtraWorkOrder', () => {
    it('it should called getDraft with DRAFT_REPORT storage key', () => {
      store.dispatch(getDraftExtraWorkOrder(leadWorker))
      expect(getDraft).toHaveBeenCalledWith(leadWorker.id, STORAGE_KEY.DRAFT_EXTRA_WORK_ORDER)
    })
  })

  describe('#getDraftExtraWorkOrder', () => {
    it('it should called getDraft with DRAFT_REPORT storage key', () => {
      store.dispatch(getDraftExtraWorkOrder(leadWorker))
      expect(getDraft).toHaveBeenCalledWith(leadWorker.id, STORAGE_KEY.DRAFT_EXTRA_WORK_ORDER)
    })
  })

  describe('#setDraftTimesheet', () => {
    it('it should called setDraft with DRAFT_TIMESHEET storage key', () => {
      store.dispatch(setDraftTimesheet({}, leadWorker))
      expect(setDraft).toHaveBeenCalledWith({}, leadWorker.id, STORAGE_KEY.DRAFT_TIMESHEET)
    })
  })

  describe('#getDraftTimesheet', () => {
    it('it should called getDraft with DRAFT_TIMESHEET storage key', () => {
      store.dispatch(getDraftTimeSheet(leadWorker))
      expect(getDraft).toHaveBeenCalledWith(leadWorker.id, STORAGE_KEY.DRAFT_TIMESHEET)
    })
  })
})
