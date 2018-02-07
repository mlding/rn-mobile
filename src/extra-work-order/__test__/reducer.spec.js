import reducer from '../reducer'
import { resolve, pend, reject } from '../../utilities/actions'
import {
  FETCH_EXTRA_WORK_ORDER, SET_EXTRA_WORK_ORDER_REFRESH, RESET_ERROR_MESSAGE, SET_BASIC_INFO,
  RESET_BASIC_INFO, ADD_EXTRA_LINE, UPDATE_EXTRA_LINE, DELETE_EXTRA_LINE, UPDATE_EXTRA_LINE_FORM,
  UPDATE_LOCATION, SET_LOCATION_ENTRANCE, PATCH_EXTRA_WORK_ORDER, SET_EXTRA_LINES,
  RESET_EXTRA_LINE_FORM, CHANGE_SHOW_ALERT_FOR_ITEM, SUBMIT_EXTRA_WORK_ORDER,
  UPDATE_EXTRA_WORK_ORDER,
} from '../actions'
import { DEFAULT_BASIC_INFO, DEFAULT_EXTRA_LINE_FORM, DEFAULT_LOCATION, DEFAULT_LOCATION_ORIGIN } from '../constants'
import { basicInfo, extraLineWithUuid, extraLineWithId, extraLineForm } from '../fixture'

describe('#extra-work-order reducer', () => {
  let initStatus = {}

  beforeEach(() => {
    initStatus = {
      list: [],
      next: null,
      loading: false,
      refreshing: false,
      errorMessage: false,
      basicInfo: DEFAULT_BASIC_INFO,
      extraLines: [],
      extraLineForm: DEFAULT_EXTRA_LINE_FORM,
      location: DEFAULT_LOCATION,
      locationEntrance: DEFAULT_LOCATION_ORIGIN,
      submitting: false,
    }
  })

  describe('#list', () => {
    it('should reset list when load finish with no previous', () => {
      initStatus.list = ['1', '2']
      const action = {
        type: resolve(FETCH_EXTRA_WORK_ORDER),
        payload: {
          previous: null,
          next: null,
          results: ['3', '4'],
        },
      }
      expect(reducer(initStatus, action).list).toEqual(['3', '4'])
    })
    it('should append list when load finish with exist previous', () => {
      initStatus.list = ['1', '2']
      const action = {
        type: resolve(FETCH_EXTRA_WORK_ORDER),
        payload: {
          previous: true,
          next: null,
          results: ['3', '4'],
        },
      }
      expect(reducer(initStatus, action).list).toEqual(['1', '2', '3', '4'])
    })
  })

  describe('#loading', () => {
    it('should set loading when load finish with next value', () => {
      const action = {
        type: pend(FETCH_EXTRA_WORK_ORDER),
        payload: {},
      }
      expect(reducer(initStatus, action).loading).toEqual(true)
    })
    it('should set loading true and errormessage when load finish with next value', () => {
      const action = {
        type: reject(FETCH_EXTRA_WORK_ORDER),
        payload: { message: 'xx' },
      }
      expect(reducer(initStatus, action).loading).toEqual(false)
      expect(reducer(initStatus, action).errorMessage).toEqual('xx')
    })
  })

  describe('#refreshing', () => {
    it('should set refreshing true when call SET_EXTRA_WORK_ORDER_REFRESH', () => {
      const action = {
        type: SET_EXTRA_WORK_ORDER_REFRESH,
        payload: {},
      }
      expect(reducer(initStatus, action).refreshing).toEqual(true)
    })
  })

  describe('#errorMessage', () => {
    it('should reset error message true when action is RESET_ERROR_MESSAGE', () => {
      initStatus.errorMessage = 'errorMessage'
      const action = {
        type: RESET_ERROR_MESSAGE,
        payload: {},
      }
      expect(reducer(initStatus, action).errorMessage).toEqual('')
    })
  })

  describe('#basicInfo', () => {
    it('should set basic info, SET_BASIC_INFO', () => {
      const action = {
        type: SET_BASIC_INFO,
        payload: basicInfo,
      }
      expect(reducer(initStatus, action).basicInfo).toEqual(basicInfo)
    })
    it('should reset basic info, RESET_BASIC_INFO', () => {
      const action = {
        type: RESET_BASIC_INFO,
        payload: DEFAULT_BASIC_INFO,
      }
      expect(reducer(initStatus, action).basicInfo).toEqual(DEFAULT_BASIC_INFO)
    })
  })

  describe('#extraLines', () => {
    it('should add extra line, ADD_EXTRA_LINE', () => {
      const action = {
        type: ADD_EXTRA_LINE,
        payload: extraLineWithUuid,
      }
      expect(reducer(initStatus, action).extraLines).toEqual([extraLineWithUuid])
    })
    it('should update extra line with uuid, UPDATE_EXTRA_LINE', () => {
      initStatus.extraLines = [extraLineWithUuid]
      const action = {
        type: UPDATE_EXTRA_LINE,
        payload: { ...extraLineWithUuid, name: 'change name' },
      }
      expect(reducer(initStatus, action).extraLines).toEqual([{ ...extraLineWithUuid, name: 'change name' }])
    })
    it('should update extra line with id, UPDATE_EXTRA_LINE', () => {
      initStatus.extraLines = [extraLineWithId]
      const action = {
        type: UPDATE_EXTRA_LINE,
        payload: { ...extraLineWithId, name: 'change name' },
      }
      expect(reducer(initStatus, action).extraLines).toEqual([{ ...extraLineWithId, name: 'change name' }])
    })
    it('should clear extra line if payload is null, UPDATE_EXTRA_LINE', () => {
      initStatus.extraLines = [extraLineWithId]
      const action = {
        type: UPDATE_EXTRA_LINE,
      }
      expect(reducer(initStatus, action).extraLines).toEqual([])
    })
    it('should delete extra line with id, DELETE_EXTRA_LINE', () => {
      initStatus.extraLines = [extraLineWithId]
      const action = {
        type: DELETE_EXTRA_LINE,
        payload: extraLineWithId,
      }
      expect(reducer(initStatus, action).extraLines).toEqual([])
    })
    it('should set extra lines, SET_EXTRA_LINES', () => {
      const action = {
        type: SET_EXTRA_LINES,
        payload: [],
      }
      expect(reducer(initStatus, action).extraLines).toEqual([])
    })
  })

  describe('#extraLineForm', () => {
    it('should update extra line form, UPDATE_EXTRA_LINE_FORM', () => {
      const action = {
        type: UPDATE_EXTRA_LINE_FORM,
        payload: extraLineForm,
      }
      expect(reducer(initStatus, action).extraLineForm).toEqual(extraLineForm)
    })
    it('should reset extra line form, RESET_EXTRA_LINE_FORM', () => {
      const action = {
        type: RESET_EXTRA_LINE_FORM,
      }
      expect(reducer(initStatus, action).extraLineForm).toEqual(DEFAULT_EXTRA_LINE_FORM)
    })
  })

  describe('#location', () => {
    it('should update location, UPDATE_LOCATION', () => {
      const location = {
        coordinate: {
          longitude: -122.406580462504,
          latitude: 37.7860376705271,
        },
        address: 'address',
      }
      const action = {
        type: UPDATE_LOCATION,
        payload: location,
      }
      expect(reducer(initStatus, action).location).toEqual(location)
    })
  })

  describe('#locationEntrance', () => {
    it('should set location entrance, SET_LOCATION_ORIGIN', () => {
      const locationEntrance = 'from_edit_extra_line new'
      const action = {
        type: SET_LOCATION_ENTRANCE,
        payload: locationEntrance,
      }
      expect(reducer(initStatus, action).locationEntrance).toEqual(locationEntrance)
    })
  })

  describe('#submitting', () => {
    it('should set submitting true, when pending submit extra work order', () => {
      const action = {
        type: pend(SUBMIT_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(true)
    })
    it('should set submitting false, when resovle submit extra work order', () => {
      const action = {
        type: resolve(SUBMIT_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(false)
    })
    it('should set submitting true, when reject submit extra work order', () => {
      const action = {
        type: reject(SUBMIT_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(false)
    })
    it('should set submitting true, when pending update extra work order', () => {
      const action = {
        type: pend(UPDATE_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(true)
    })
    it('should set submitting false, when resovle update extra work order', () => {
      const action = {
        type: resolve(UPDATE_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(false)
    })
    it('should set submitting true, when reject update extra work order', () => {
      const action = {
        type: reject(UPDATE_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(false)
    })
    it('should set submitting true, when pending patching extra work order', () => {
      const action = {
        type: pend(PATCH_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(true)
    })
    it('should set submitting false, when resovle patching extra work order', () => {
      const action = {
        type: resolve(PATCH_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(false)
    })
    it('should set submitting true, when reject patching extra work order', () => {
      const action = {
        type: reject(PATCH_EXTRA_WORK_ORDER),
      }
      expect(reducer(initStatus, action).submitting).toEqual(false)
    })
  })

  describe('#showAlertForItem', () => {
    it('should set showAlertForItem true, CHANGE_SHOW_ALERT_FOR_ITEM', () => {
      const action = {
        type: CHANGE_SHOW_ALERT_FOR_ITEM,
        payload: true,
      }
      expect(reducer(initStatus, action).showAlertForItem).toEqual(true)
    })
  })
})
