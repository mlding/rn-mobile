import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { leadWorker } from '../../shared/fixture'
import {
  FETCH_WORK_ITEMS,
  fetchWorkItems,
  refreshWorkItems,
  RESET_FILTER_AND_SEARCH,
  RESET_FILTER_CONDITIONS,
  RESET_SELECTED_IDS,
  resetFilterAndSearch,
  resetFilterConditions,
  resetSelectedIds,
  SET_FILTER_CONDITIONS,
  SET_SEARCH_CONDITION,
  SET_WORK_ITEMS_REFRESHING,
  SET_WORK_ITEMS_VISIBILITY,
  setFilterConditions,
  setSearchCondition,
  setWorkItemsRefreshing,
  setWorkItemsVisibility,
  TOGGLE_SELECTED_BY_ID,
  toggleSelectedById,
} from '../actions'

describe('Report Actions', () => {
  const mockStore = configureMockStore([thunk])
  let store = {}
  const initialState = {
    auth: { user: leadWorker },
  }

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
  })

  describe('#fetchWorkItems', () => {
    it('it should called actions when user is leadWorker ', () => {
      const user = leadWorker
      const expectActions = [FETCH_WORK_ITEMS]
      store.dispatch(fetchWorkItems(0, user))
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#setWorkItemsRefreshing', () => {
    it('it should called actions when call setWorkItemsRefreshing ', () => {
      const expectActions = [SET_WORK_ITEMS_REFRESHING]
      store.dispatch(setWorkItemsRefreshing())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#refreshWorkItems', () => {
    it('it should called actions when call refreshWorkItems ', () => {
      const expectActions = [SET_WORK_ITEMS_REFRESHING, FETCH_WORK_ITEMS]
      store.dispatch(refreshWorkItems())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })


  describe('#toggleSelectedById', () => {
    it('it should called actions when call toggleSelectedById ', () => {
      const expectActions = [TOGGLE_SELECTED_BY_ID]
      store.dispatch(toggleSelectedById())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#resetSelectedIds', () => {
    it('it should called actions when call resetSelectedIds ', () => {
      const expectActions = [RESET_SELECTED_IDS]
      store.dispatch(resetSelectedIds())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#setSearchCondition', () => {
    it('it should called actions when call setSearchCondition ', () => {
      const expectActions = [SET_SEARCH_CONDITION]
      store.dispatch(setSearchCondition())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#resetFilterAndSearch', () => {
    it('it should called actions when call resetFilterAndSearch ', () => {
      const expectActions = [RESET_FILTER_AND_SEARCH]
      store.dispatch(resetFilterAndSearch())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#setWorkItemsVisibility', () => {
    it('it should called actions when call setWorkItemsVisibility ', () => {
      const expectActions = [SET_WORK_ITEMS_VISIBILITY]
      store.dispatch(setWorkItemsVisibility())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#resetFilterConditions', () => {
    it('it should called actions when call resetFilterConditions ', () => {
      const expectActions = [RESET_FILTER_CONDITIONS]
      store.dispatch(resetFilterConditions())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#setFilterConditions', () => {
    it('it should called actions when call setFilterConditions ', () => {
      const expectActions = [SET_FILTER_CONDITIONS]
      store.dispatch(setFilterConditions())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })
})
