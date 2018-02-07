import reducer from '../reducer'
import { AUTH } from '../actions'

describe('auth reduer', () => {
  const initialState = {
    user: null,
    loading: false,
    refreshing: false,
    clearingToken: false,
  }

  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should set loading to true when dispatch REQUEST_LOGIN', () => {
    expect(reducer(initialState, {
      type: AUTH.REQUEST_LOGIN,
    })).toEqual({
      ...initialState,
      loading: true,
    })
  })

  it('should set loading to false when login successfully', () => {
    expect(reducer(initialState, {
      type: AUTH.LOGIN_SUCCESS,
    })).toEqual({
      ...initialState,
      loading: false,
    })
  })

  it('should set loading to false when login failed', () => {
    expect(reducer(initialState, {
      type: AUTH.LOGIN_FAILED,
    })).toEqual({
      ...initialState,
      loading: false,
    })
  })

  it('should update user info when update user', () => {
    const userInfo = {
      id: 1,
      name: 'test_user',
    }
    expect(reducer(initialState, {
      type: AUTH.UPDATE_USER,
      payload: userInfo,
    })).toEqual({
      ...initialState,
      user: userInfo,
    })
  })

  it('should update refreshing when request refreshing token', () => {
    expect(reducer(initialState, {
      type: AUTH.REQUEST_REFRESH_TOKEN,
    })).toEqual({
      ...initialState, refreshing: true,
    })
  })

  it('should update refreshing to be false when refresh token success', () => {
    expect(reducer(initialState, {
      type: AUTH.REFRESH_TOKEN_SUCCESS,
    })).toEqual({
      ...initialState,
      refreshing: false,
    })
  })

  it('should update refreshing to be false when refresh token failed', () => {
    expect(reducer(initialState, {
      type: AUTH.REFRESH_TOKEN_FAILED,
    })).toEqual({
      ...initialState,
      refreshing: false,
    })
  })

  it('should set clearingToken to be true when clear token', () => {
    expect(reducer(initialState, {
      type: AUTH.REQUEST_CLEAR_TOKEN,
    })).toEqual({
      ...initialState,
      clearingToken: true,
    })
  })

  it('should set clearingToken to be false when clear token successfully', () => {
    expect(reducer(initialState, {
      type: AUTH.CLEAR_TOKEN_SUCCESS,
    })).toEqual({
      ...initialState,
      clearingToken: false,
    })
  })

  it('should set clearingToken to be false when clear token failed', () => {
    expect(reducer(initialState, {
      type: AUTH.CLEAR_TOKEN_FAILED,
    })).toEqual({
      ...initialState,
      clearingToken: false,
    })
  })

  it('should update user info when update user', () => {
    const userInfo = {
      id: 1,
      name: 'test_user',
    }
    expect(reducer(initialState, {
      type: AUTH.UPDATE_USER,
      payload: userInfo,
    })).toEqual({
      ...initialState,
      user: userInfo,
    })
  })

  it('should update refreshing when request refreshing token', () => {
    expect(reducer(initialState, {
      type: AUTH.REQUEST_REFRESH_TOKEN,
    })).toEqual({
      ...initialState, refreshing: true,
    })
  })

  it('should update refreshing to be false when refresh token success', () => {
    expect(reducer(initialState, {
      type: AUTH.REFRESH_TOKEN_SUCCESS,
    })).toEqual({
      ...initialState,
      refreshing: false,
    })
  })

  it('should update refreshing to be false when refresh token failed', () => {
    expect(reducer(initialState, {
      type: AUTH.REFRESH_TOKEN_FAILED,
    })).toEqual({
      ...initialState,
      refreshing: false,
    })
  })

  it('should set clearingToken to be true when clear token', () => {
    expect(reducer(initialState, {
      type: AUTH.REQUEST_CLEAR_TOKEN,
    })).toEqual({
      ...initialState,
      clearingToken: true,
    })
  })

  it('should set clearingToken to be false when clear token successfully', () => {
    expect(reducer(initialState, {
      type: AUTH.CLEAR_TOKEN_SUCCESS,
    })).toEqual({
      ...initialState,
      clearingToken: false,
    })
  })

  it('should set clearingToken to be false when clear token failed', () => {
    expect(reducer(initialState, {
      type: AUTH.CLEAR_TOKEN_FAILED,
    })).toEqual({
      ...initialState,
      clearingToken: false,
    })
  })

  it('should set loading to true when reset password pend', () => {
    expect(reducer(initialState, {
      type: AUTH.RESET_PASSWORD_PEND,
    })).toEqual({
      ...initialState,
      loading: true,
    })
  })

  it('should set loading to false when reset password successfully', () => {
    expect(reducer(initialState, {
      type: AUTH.RESET_PASSWORD_SUCCESS,
    })).toEqual({
      ...initialState,
      loading: false,
    })
  })

  it('should set loading to false when reset password failed', () => {
    expect(reducer(initialState, {
      type: AUTH.RESET_PASSWORD_FAILED,
    })).toEqual({
      ...initialState,
      loading: false,
    })
  })
})
