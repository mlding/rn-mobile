import {
  authSelector,
  userSelector,
  roleSelector,
  userFullNameSelector,
} from '../selector'

describe('auth selector', () => {
  const user = {
    id: 'test_user',
    role: 'lead_worker',
    first_name: 'Bill',
    last_name: 'Will',
  }
  const state = {
    user: user,
    loading: false,
    refreshing: false,
    clearingToken: false,
  }
  const rootState = {
    auth: state,
  }

  it('should return auth status', () => {
    expect(authSelector(rootState)).toEqual(state)
  })
  it('should return as user', () => {
    expect(userSelector(rootState)).toEqual(user)
  })
  it('should return as role', () => {
    expect(roleSelector(rootState)).toEqual('lead_worker')
  })
  it('should return as user full name', () => {
    expect(userFullNameSelector(rootState)).toEqual('Bill Will')
  })
})
