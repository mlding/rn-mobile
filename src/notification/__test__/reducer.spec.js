import reducer from '../reducer'
import { SET_NOTIFICATION, RESET_NOTIFICATION, RESET_MANUAL_REFRESH } from '../actions'
import { NOTIFICATION_TYPE } from '../constants'

describe('notification reducer', () => {
  const initialState = {
    notification: null,
    isManualRefresh: false,
  }

  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })
  it('should handle SET_NOTIFICATION', () => {
    expect(reducer(initialState, {
      type: SET_NOTIFICATION,
      payload: {
        type: NOTIFICATION_TYPE.DPR_APPROVED,
        itemId: 'testId',
        refresh: true,
      },
    })).toEqual({
      ...initialState,
      notification: {
        type: NOTIFICATION_TYPE.DPR_APPROVED,
        itemId: 'testId',
      },
      isManualRefresh: true,
    })
  })
  it('should handle RESET_NOTIFICATION', () => {
    expect(reducer(initialState, { type: RESET_NOTIFICATION })).toEqual({
      ...initialState,
      notification: null,
    })
  })
  it('should handle RESET_MANUAL_REFRESH', () => {
    expect(reducer(initialState, { type: RESET_MANUAL_REFRESH })).toEqual({
      ...initialState,
      isManualRefresh: false,
    })
  })
})
