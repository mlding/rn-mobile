import configureMockStore from 'redux-mock-store'
import { Actions } from 'react-native-router-flux'
import thunk from 'redux-thunk'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { login, refreshToken, clearToken, AUTH, resetPassword } from '../actions'
import Storage from '../../utilities/Storage'
import storageKey from '../../constants/storageKey'
import KeychainStorage from '../../utilities/keychainStorage'

jest.mock('react-native-router-flux', () => ({
  ActionConst: { RESET: 'reset' },
  Actions: {
    login: jest.fn(),
    constructionManagerTab: jest.fn(),
    leadWorkerTab: jest.fn(),
    pop: jest.fn(),
  },
}))

jest.mock('../../notification/fcmService.js', () => {
  class MockService {
    constructor() {
      this.register = jest.fn()
      this.unregister = jest.fn(() => Promise.resolve())
      this.autoLoginRedirect = jest.fn()
      this.setCurrentUser = jest.fn()
    }
  }
  return MockService
})

jest.mock('../../notification/fcmListener.js', () => ({
  autoLoginRedirect: jest.fn(),
}))

describe('Auth Actions', () => {
  const initialState = {
    user: null,
    loading: false,
    refreshing: false,
    clearingToken: false,
  }

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  let store = {}
  const mock = new MockAdapter(axios)
  const response = {
    user: {
      id: 16,
      email: 'bernie@fresnel.cc',
      first_name: 'Bernie',
      last_name: 'Quora',
      profile: {
        id: 16,
        email: 'bernie@fresnel.cc',
        first_name: 'Bernie',
        last_name: 'Quora',
        full_name: 'Bernie Quora',
      },
    },
    modules: [
      'lead_worker',
    ],
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MDkzNTc0MzIsInVzZXJfaWQiOjE2LCJlbWFpbCI6ImJlcm5pZUBmcmVzbmVsLmNjIiwidXNlcm5hbWUiOiJiZXJuaWVAZnJlc25lbC5jYyIsIm9yaWdfaWF0IjoxNTA3OTc1MDMyfQ.-nVhYWZTnUN7NjogwEUVCGsUN8TYQVtpCAR0z-qcxbE',
  }
  const expectedUser = {
    role: 'lead_worker',
    id: 16,
    email: 'bernie@fresnel.cc',
    first_name: 'Bernie',
    last_name: 'Quora',
    profile: {
      id: 16,
      email: 'bernie@fresnel.cc',
      first_name: 'Bernie',
      last_name: 'Quora',
      full_name: 'Bernie Quora',
    },
    originUserId: 16,
  }
  const workspace = 'http://api.dev.vitruevi.cc'

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
    mock.reset()
  })

  describe('#login', () => {
    const URL = '/auth/token/obtain'
    it('should login lead_worker successfully with correct email and password', () => {
      const loginParams = {
        email: 'bernie@fresnel.cc',
        password: '123456',
      }
      mock.onPost(URL, loginParams).reply(201, response)
      const expectedActions = [
        { type: AUTH.REQUEST_LOGIN },
        { type: AUTH.LOGIN_SUCCESS },
        {
          type: AUTH.UPDATE_USER,
          payload: expectedUser,
        },
      ]
      return store.dispatch(login(loginParams, workspace)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should login failed when user role is not lead_worker nor construction_manager', () => {
      const loginParams = {
        email: 'bernie@fresnel.cc',
        password: '123456',
      }
      mock.onPost(URL, loginParams).reply(201, { ...response, modules: ['invlalid_role'] })
      const expectedActions = [
        { type: AUTH.REQUEST_LOGIN },
        { type: AUTH.LOGIN_FAILED },
      ]
      return store.dispatch(login(loginParams, workspace)).catch(error => {
        expect(error).toEqual('Username or password is incorrect.')
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should not login with invalid email or password', () => {
      const loginParams = {
        email: 'bernie@fresnel.cc',
        password: 'wrong_password',
      }
      mock.onPost(URL, loginParams).reply(400, { message: 'Username or password is incorrect.' })
      const expectedActions = [
        { type: AUTH.REQUEST_LOGIN },
        { type: AUTH.LOGIN_FAILED },
      ]
      return store.dispatch(login(loginParams, workspace)).catch(error => {
        expect(error).toEqual('Username or password is incorrect.')
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('#refreshToken', () => {
    const URL = '/auth/token/refresh'
    const token = 'localToken'
    it('should update local token and user information when refresh token successfully', () => {
      Storage.get.mockImplementation(() => Promise.resolve(workspace))
      mock.onPost(URL, { token: token }).reply(200, response)
      const expectedActions = [
        { type: AUTH.REQUEST_REFRESH_TOKEN },
        { type: AUTH.REFRESH_TOKEN_SUCCESS },
        { type: AUTH.UPDATE_USER, payload: expectedUser },
      ]
      return store.dispatch(refreshToken()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should update user information when refresh token failed', () => {
      Storage.get.mockImplementation(key => {
        let value = {}
        if (key === storageKey.WORKSPACE) {
          value = workspace
        }
        return Promise.resolve(value)
      })
      mock.onPost(URL, { token: token }).reply(400)
      const expectedActions = [
        { type: AUTH.REQUEST_REFRESH_TOKEN },
        { type: AUTH.REFRESH_TOKEN_FAILED },
        { type: AUTH.UPDATE_USER, payload: {} },
      ]
      return store.dispatch(refreshToken()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should redirectToLogin when refresh token and work space storage is empty', () => {
      Storage.get.mockImplementation(() => Promise.resolve(null))
      mock.onPost(URL, { token: token }).reply(400)
      return store.dispatch(refreshToken()).done(() => {
        expect(Actions.login).toBeCalled()
      })
    })

    it('should redirectToLogin when refresh token and work space storage is not empty and user is empty', () => {
      Storage.get.mockImplementation(key =>
        Promise.resolve(key === storageKey.WORKSPACE ? workspace : null))
      mock.onPost(URL, { token: token }).reply(400)
      return store.dispatch(refreshToken()).done(() => {
        expect(Actions.login).toBeCalled()
      })
    })
  })

  describe('#clearToken', () => {
    it('should handle clear token successfully', () => {
      const expectedActions = [
        { type: AUTH.REQUEST_CLEAR_TOKEN },
        { type: AUTH.CLEAR_TOKEN_SUCCESS },
      ]
      return store.dispatch(clearToken()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should handle clear token failed', () => {
      KeychainStorage.reset.mockImplementation(() => Promise.reject('Clear token error'))
      const expectedActions = [
        { type: AUTH.REQUEST_CLEAR_TOKEN },
        { type: AUTH.CLEAR_TOKEN_FAILED,
          payload: 'Clear token error' },
      ]
      return store.dispatch(clearToken()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('#resetPassword', () => {
    const email = 'testmail@thoughtworks.com'
    const URL = '/auth/reset_password'

    it('should handle reset password successfully', () => {
      mock.onPost(URL, { email }).reply(200, response)
      const expectedActions = [
        {
          type: AUTH.RESET_PASSWORD_PEND,
        },
        {
          type: AUTH.RESET_PASSWORD_SUCCESS,
        },
      ]
      return store.dispatch(resetPassword(email, workspace)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    it('should handle reset password failed', () => {
      mock.onPost(URL, { email }).reply(400)
      const expectedActions = [
        {
          type: AUTH.RESET_PASSWORD_PEND,
        },
        {
          type: AUTH.RESET_PASSWORD_FAILED,
        },
      ]
      return store.dispatch(resetPassword(email, workspace)).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })
})
