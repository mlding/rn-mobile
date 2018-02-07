import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { SET_NOTIFICATION, RESET_NOTIFICATION, RESET_MANUAL_REFRESH } from './actions'

const notification = handleActions({
  [SET_NOTIFICATION]: (state, { payload }) => ({
    type: payload.type,
    itemId: payload.itemId,
  }),
  [RESET_NOTIFICATION]: () => null,
}, null)

const isManualRefresh = handleActions({
  [SET_NOTIFICATION]: (state, { payload }) => payload.refresh,
  [RESET_MANUAL_REFRESH]: () => false,
}, false)

export default combineReducers({
  notification,
  isManualRefresh,
})
