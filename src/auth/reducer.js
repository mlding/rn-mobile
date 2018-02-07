import { handleActions, combineActions } from 'redux-actions'
import { AUTH } from './actions'

const initialState = {
  user: null,
  loading: false,
  refreshing: false,
  clearingToken: false,
}

export default handleActions({
  [combineActions(
    AUTH.REQUEST_LOGIN,
    AUTH.RESET_PASSWORD_PEND)]:
      state => ({ ...state, loading: true }),
  [combineActions(
    AUTH.LOGIN_SUCCESS,
    AUTH.LOGIN_FAILED,
    AUTH.RESET_PASSWORD_SUCCESS,
    AUTH.RESET_PASSWORD_FAILED)]:
      state => ({ ...state, loading: false }),
  [AUTH.UPDATE_USER]: (state, { payload }) => ({ ...state, user: payload }),
  [AUTH.REQUEST_REFRESH_TOKEN]: state => ({ ...state, refreshing: true }),
  [combineActions(AUTH.REFRESH_TOKEN_SUCCESS, AUTH.REFRESH_TOKEN_FAILED)]:
    state => ({ ...state, refreshing: false }),
  [AUTH.REQUEST_CLEAR_TOKEN]: state => ({ ...state, clearingToken: true }),
  [combineActions(AUTH.CLEAR_TOKEN_SUCCESS, AUTH.CLEAR_TOKEN_FAILED)]:
    state => ({ ...state, clearingToken: false }),
}, initialState)
