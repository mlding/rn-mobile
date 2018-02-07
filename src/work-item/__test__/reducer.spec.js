import reducer from '../reducer'
import { DEFAULT_FILTER_CONDITIONS } from '../filter/constants'
import { resolve, reject } from '../../utilities/actions'
import {
  FETCH_WORK_ITEMS,
  RESET_FILTER_AND_SEARCH,
  RESET_FILTER_CONDITIONS,
  RESET_SELECTED_IDS,
  SET_FILTER_CONDITIONS,
  SET_SEARCH_CONDITION,
  SET_WORK_ITEMS_REFRESHING, SET_WORK_ITEMS_VISIBILITY,
  TOGGLE_SELECTED_BY_ID,
} from '../actions'

describe('#timesheet reducer', () => {
  let initStatus = {}
  beforeEach(() => {
    initStatus = {
      list: [],
      next: null,
      loading: false,
      refreshing: false,
      errorMessage: '',
      selectedIds: [],
      filterConditions: DEFAULT_FILTER_CONDITIONS,
      searchCondition: {},
      visibility: false,
    }
  })

  describe('#list', () => {
    it('should reset list when no previous', () => {
      initStatus.list = ['1', '2']
      const action = {
        type: resolve(FETCH_WORK_ITEMS),
        payload: {
          previous: null,
          next: null,
          results: ['3', '4'],
        },
      }
      expect(reducer(initStatus, action).list).toEqual(['3', '4'])
    })

    it('should reset list when has previous', () => {
      initStatus.list = ['1', '2']
      const action = {
        type: resolve(FETCH_WORK_ITEMS),
        payload: {
          previous: true,
          next: null,
          results: ['3', '4'],
        },
      }
      expect(reducer(initStatus, action).list).toEqual(['1', '2', '3', '4'])
    })
  })

  describe('#next value', () => {
    it('should set next when  next has value', () => {
      const action = {
        type: resolve(FETCH_WORK_ITEMS),
        payload: {
          previous: true,
          next: 'abc',
          results: ['3', '4'],
        },
      }
      expect(reducer(initStatus, action).next).toEqual('abc')
    })
  })

  describe('#loading value', () => {
    it('should set loading true when  FETCH_WORK_ITEMS', () => {
      const action = {
        type: FETCH_WORK_ITEMS,
      }
      expect(reducer(initStatus, action).loading).toEqual(true)
    })

    it('should set loading false when resovle FETCH_WORK_ITEMS', () => {
      initStatus.loading = true
      const action = {
        type: resolve(FETCH_WORK_ITEMS),
        payload: {
          previous: true,
          next: 'abc',
          results: ['3', '4'],
        },
      }
      expect(reducer(initStatus, action).loading).toEqual(false)
    })

    it('should set loading false when reject FETCH_WORK_ITEMS', () => {
      initStatus.loading = true
      const action = {
        type: reject(FETCH_WORK_ITEMS),
        payload: {
          message: 'reject',
        },
      }
      expect(reducer(initStatus, action).loading).toEqual(false)
    })
  })

  describe('#refreshing value', () => {
    it('should set refreshing true when action is SET_WORK_ITEMS_REFRESHING', () => {
      initStatus.refreshing = false
      const action = {
        type: SET_WORK_ITEMS_REFRESHING,
      }
      expect(reducer(initStatus, action).refreshing).toEqual(true)
    })

    it('should set refreshing false when action is resovle FETCH_WORK_ITEMS', () => {
      initStatus.refreshing = true
      const action = {
        type: resolve(FETCH_WORK_ITEMS),
        payload: {
          previous: true,
          next: 'abc',
          results: ['3', '4'],
        },
      }
      expect(reducer(initStatus, action).refreshing).toEqual(false)
    })

    it('should set refreshing false when action is reject FETCH_WORK_ITEMS', () => {
      initStatus.refreshing = false
      const action = {
        type: reject(FETCH_WORK_ITEMS),
        payload: {
          message: 'reject',
        },
      }
      expect(reducer(initStatus, action).refreshing).toEqual(false)
    })
  })

  describe('#error message value', () => {
    it('should reset error message when action is FETCH_WORK_ITEMS', () => {
      initStatus.errorMessage = 'abc'
      const action = {
        type: FETCH_WORK_ITEMS,
      }
      expect(reducer(initStatus, action).errorMessage).toEqual('')
    })

    it('should reset error message when action is resolve FETCH_WORK_ITEMS', () => {
      initStatus.errorMessage = 'abc'
      const action = {
        type: FETCH_WORK_ITEMS,
        payload: {
          previous: true,
          next: 'abc',
          results: ['3', '4'],
        },
      }
      expect(reducer(initStatus, action).errorMessage).toEqual('')
    })

    it('should reset error message when action is reject FETCH_WORK_ITEMS', () => {
      initStatus.errorMessage = 'abc'
      const action = {
        type: reject(FETCH_WORK_ITEMS),
        payload: {
          message: 'error',
        },
      }
      expect(reducer(initStatus, action).errorMessage).toEqual('error')
    })
  })

  describe('#selectedIds value', () => {
    it('should addArrayItem select ids when can not find selectedIds', () => {
      initStatus.selectedIds = [1, 2]
      const action = {
        type: TOGGLE_SELECTED_BY_ID,
        payload: 3,
      }
      expect(reducer(initStatus, action).selectedIds).toEqual([1, 2, 3])
    })

    it('should removeArrayItem select ids when could find selectedIds', () => {
      initStatus.selectedIds = [1, 2]
      const action = {
        type: TOGGLE_SELECTED_BY_ID,
        payload: 1,
      }
      expect(reducer(initStatus, action).selectedIds).toEqual([2])
    })

    it('should reset select ids when action is RESET_SELECTED_IDS', () => {
      initStatus.selectedIds = [1, 2]
      const action = {
        type: RESET_SELECTED_IDS,
      }
      expect(reducer(initStatus, action).selectedIds).toEqual([])
    })
  })

  describe('#filterConditions', () => {
    it('should set filterConditions when action is SET_FILTER_CONDITIONS', () => {
      const action = {
        type: SET_FILTER_CONDITIONS,
        payload: 'testcondition',
      }
      expect(reducer(initStatus, action).filterConditions).toEqual('testcondition')
    })
    it('should reset  filterConditions when action is RESET_FILTER_AND_SEARCH', () => {
      initStatus.filterConditions = 'abc'
      const action = {
        type: RESET_FILTER_AND_SEARCH,
      }
      expect(reducer(initStatus, action).filterConditions).toEqual(DEFAULT_FILTER_CONDITIONS)
    })

    it('should reset  filterConditions when action is RESET_FILTER_CONDITIONS and payload is empty', () => {
      initStatus.filterConditions = 'abc'
      const action = {
        type: RESET_FILTER_CONDITIONS,
      }
      expect(reducer(initStatus, action).filterConditions).toEqual(DEFAULT_FILTER_CONDITIONS)
    })

    it('should reset  filterConditions when action is RESET_FILTER_CONDITIONS', () => {
      initStatus.filterConditions = [{ filterType: 'des' }, { filterType: 'name' }]
      const action = {
        type: RESET_FILTER_CONDITIONS,
        payload: 'name',
      }
      expect(reducer(initStatus, action).filterConditions).toEqual([{ filterType: 'des' }])
    })
  })

  describe('#searchCondition', () => {
    it('should set searchCondition when action is SET_SEARCH_CONDITION', () => {
      const action = {
        type: SET_SEARCH_CONDITION,
        payload: {
          searchText: 'test',
        },
      }
      expect(reducer(initStatus, action).searchCondition).toEqual({ searchText: 'test' })
    })

    it('should set searchCondition when action is RESET_FILTER_AND_SEARCH', () => {
      initStatus.searchCondition = 'filter'
      const action = {
        type: RESET_FILTER_AND_SEARCH,
        payload: {
          searchText: 'test',
        },
      }
      expect(reducer(initStatus, action).searchCondition).toEqual({})
    })
  })

  describe('#visibility', () => {
    it('should set visible value when action is SET_WORK_ITEMS_VISIBILITY', () => {
      const action = {
        type: SET_WORK_ITEMS_VISIBILITY,
        payload: true,
      }
      expect(reducer(initStatus, action).visibility).toEqual(true)
    })
  })
})
