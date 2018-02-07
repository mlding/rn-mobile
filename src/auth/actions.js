import { createAction } from 'redux-actions'
import { Actions } from 'react-native-router-flux'
import { isEmpty } from 'lodash'
import api from '../api/api'
import KeychainStorage from '../utilities/keychainStorage'
import Storage from '../utilities/Storage'
import STORAGE_KEY from '../constants/storageKey'
import { getUser, getWorkspace, isInvalidRole, redirectAfterLogin, redirectToLogin, saveWorkspace } from './helper'
import { showError, showInfo } from '../utilities/messageBar'
import fcmListener from '../notification/fcmListener'
import FCMService from '../notification/fcmService'

const INVALID_ROLE_MESSAGE = 'Username or password is incorrect.'
const RESET_PASSWORD_URL = '/auth/reset_password'

export const AUTH = {
  REQUEST_LOGIN: 'AUTH/REQUEST_LOGIN',
  LOGIN_SUCCESS: 'AUTH/LOGIN_SUCCESS',
  LOGIN_FAILED: 'AUTH/LOGIN_FAILED',
  UPDATE_USER: 'AUTH/UPDATE_USER',
  REQUEST_REFRESH_TOKEN: 'AUTH/REQUEST_REFRESH_TOKEN',
  REFRESH_TOKEN_SUCCESS: 'AUTH/REFRESH_TOKEN_SUCCESS',
  REFRESH_TOKEN_FAILED: 'AUTH/REFRESH_TOKEN_FAILED',
  REQUEST_CLEAR_TOKEN: 'AUTH/REQUEST_CLEAR_TOKEN',
  CLEAR_TOKEN_SUCCESS: 'AUTH/CLEAR_TOKEN_SUCCESS',
  CLEAR_TOKEN_FAILED: 'AUTH/CLEAR_TOKEN_FAILED',
  RESET_PASSWORD_PEND: 'AUTH/RESET_PASSWORD_PEND',
  RESET_PASSWORD_SUCCESS: 'AUTH/RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FAILED: 'AUTH/RESET_PASSWORD_FAILED',
}

const requestLogin = createAction(AUTH.REQUEST_LOGIN)
const loginSuccess = createAction(AUTH.LOGIN_SUCCESS)
const loginFailed = createAction(AUTH.LOGIN_FAILED)

const updateUser = user => {
  Storage.set(STORAGE_KEY.USER, user)
  return { type: AUTH.UPDATE_USER, payload: user }
}

export const login = (loginParams, workspace) => {
  const url = '/auth/token/obtain'
  return dispatch => {
    dispatch(requestLogin())
    return api.post(url, loginParams, { baseURL: workspace })
      .then(res => saveWorkspace(workspace).then(() => res))
      .then(res => {
        const { token, user, modules } = res
        const currentUser = getUser(user, modules)
        if (isInvalidRole(currentUser.role)) {
          return Promise.reject(INVALID_ROLE_MESSAGE)
        }
        dispatch(loginSuccess())
        dispatch(updateUser(currentUser))
        const fcmService = new FCMService()
        fcmService.setCurrentUser(currentUser)
        fcmService.register(currentUser.originUserId)
        return KeychainStorage.set(currentUser.id, token)
          .then(() => redirectAfterLogin(currentUser.role))
      }).catch(error => {
        dispatch(loginFailed())
        return Promise.reject(error.message || error)
      })
  }
}

const requestRefresh = createAction(AUTH.REQUEST_REFRESH_TOKEN)
const refreshTokenSuccess = createAction(AUTH.REFRESH_TOKEN_SUCCESS)
const refreshTokenFailed = createAction(AUTH.REFRESH_TOKEN_FAILED)

export const refreshToken = () => (
  dispatch => {
    dispatch(requestRefresh())
    return getWorkspace().then(workspace => {
      if (isEmpty(workspace)) {
        return Promise.reject()
      }
      const fcmService = new FCMService()
      return KeychainStorage.getToken().then(token => (
        api.post('/auth/token/refresh', {
          token: token,
        }).then(res => {
          const { user, modules } = res
          const currentUser = getUser(user, modules)
          fcmService.setCurrentUser(currentUser)
          fcmService.register(currentUser.originUserId)
          dispatch(refreshTokenSuccess())
          dispatch(updateUser(currentUser))
          KeychainStorage.set(currentUser.id, token).done(() => {
            fcmListener.autoLoginRedirect(currentUser.role)
          })
        }).catch(() => {
          dispatch(refreshTokenFailed())
          Storage.get(STORAGE_KEY.USER).then(user => {
            dispatch(updateUser(user))
            fcmService.setCurrentUser(user)
            fcmService.register(user.originUserId)
            fcmListener.autoLoginRedirect(user.role)
          }).catch(() => {
            // If local data is missing, redirect to login
            redirectToLogin()
          })
        })
      ))
    }).catch(() => {
      dispatch(refreshTokenFailed())
      return redirectToLogin()
    })
  }
)

const requestClearToken = createAction(AUTH.REQUEST_CLEAR_TOKEN)
const clearTokenSuccess = createAction(AUTH.CLEAR_TOKEN_SUCCESS)
const clearTokenFailed = createAction(AUTH.CLEAR_TOKEN_FAILED)

export const clearToken = () => (
  async dispatch => {
    dispatch(requestClearToken())
    const fcmService = new FCMService()
    return fcmService.unregister().then(() => (
      KeychainStorage.reset().then(() => {
        dispatch(clearTokenSuccess())
      }).catch(error => {
        dispatch(clearTokenFailed(error))
      })
    ))
  }
)

const resetPasswordPend = createAction(AUTH.RESET_PASSWORD_PEND)
const resetPasswordSuccess = createAction(AUTH.RESET_PASSWORD_SUCCESS)
const resetPasswordFailed = createAction(AUTH.RESET_PASSWORD_FAILED)

export const resetPassword = (email, workspace) => (
  dispatch => {
    dispatch(resetPasswordPend())
    return (api.post(
      RESET_PASSWORD_URL,
      { email },
      { baseURL: workspace },
    ).then(() => {
      dispatch(resetPasswordSuccess())
      Actions.pop()
      showInfo('We\'ve sent a link to reset your password to your email.')
    }).catch(error => {
      dispatch(resetPasswordFailed())
      showError(error.message)
    }))
  }
)
