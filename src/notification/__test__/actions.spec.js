import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { leadWorker, constructionManager } from '../../shared/fixture'
import { setNotification, SET_NOTIFICATION, RESET_NOTIFICATION, resetNotification, RESET_MANUAL_REFRESH, resetManualRefresh } from '../actions'
import { NOTIFICATION_TYPE } from '../constants'
import { SET_VIEW_MODE } from '../../timesheet/actions'
import { VIEW_MODE } from '../../timesheet/constants'

describe('Notification Actions', () => {
  let initialState = {
    auth: { user: leadWorker },
    notification: null,
    isManualRefresh: false,
  }
  const mockStore = configureMockStore([thunk])
  let store = {}
  afterEach(() => {
    store.clearActions()
  })

  describe('#setNotification', () => {
    it('should set notification when current user is lead worker', () => {
      store = mockStore(initialState)
      const params = {
        type: NOTIFICATION_TYPE.DPR_APPROVED,
        itemId: null,
        refresh: false,
      }
      const expectedActions = [
        { type: SET_VIEW_MODE, payload: VIEW_MODE.CREATOR },
        { type: SET_NOTIFICATION, payload: params },
      ]
      store.dispatch(setNotification(params))
      expect(store.getActions()).toEqual(expectedActions)
    })
    it('should set notification when current user is construction manager and need to change view mode', () => {
      initialState = {
        ...initialState,
        auth: { user: constructionManager },
        timesheet: { viewMode: VIEW_MODE.APPROVAL },
      }
      store = mockStore(initialState)
      const params = {
        type: NOTIFICATION_TYPE.TIMESHEET_FLAGGED,
        itemId: null,
        refresh: false,
      }
      const expectedActions = [
        { type: SET_VIEW_MODE, payload: VIEW_MODE.CREATOR },
        { type: SET_NOTIFICATION, payload: params },
      ]
      store.dispatch(setNotification(params))
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
  describe('#resetNotification', () => {
    beforeEach(() => {
      store = mockStore(initialState)
    })
    it('should handle reset notification', () => {
      const expectedActions = [{ type: RESET_NOTIFICATION }]
      store.dispatch(resetNotification())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
  describe('#resetManualRefresh', () => {
    beforeEach(() => {
      store = mockStore(initialState)
    })
    it('should handle reset manual refresh flag', () => {
      const expectedActions = [{ type: RESET_MANUAL_REFRESH }]
      store.dispatch(resetManualRefresh())
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
