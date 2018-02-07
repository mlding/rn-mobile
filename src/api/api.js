import axios from 'axios'
import { isEmpty } from 'lodash'
import { createApiError } from './error/apiError'
import KeychainStorage from '../utilities/keychainStorage'
import { getWorkspace, redirectToLogin } from '../auth/helper'

axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.timeout = 15000

const isAbsolutePath = url => /^(http|https|http:|https:|\/\/)/.test(url)

async function fillBaseUrl(config) {
  if (config.baseURL || isAbsolutePath(config.url)) {
    return config
  }
  const baseUrl = await getWorkspace()
  if (isEmpty(baseUrl)) {
    return config
  }
  const authConfig = { ...config }
  authConfig.baseURL = baseUrl
  authConfig.url = baseUrl + config.url
  return authConfig
}

async function fillToken(config) {
  const token = await KeychainStorage.getToken()
  if (!token) {
    return config
  }
  const authConfig = { ...config }
  authConfig.headers.Authorization = `JWT ${token}`
  return authConfig
}


async function setRequestConfig(config) {
  try {
    let authConfig = config
    authConfig = await fillBaseUrl(authConfig)
    authConfig = await fillToken(authConfig)
    return authConfig
  } catch (error) {
    return Promise.reject(error)
  }
}

const handleError = error =>
     createApiError(error)
    .then(apiError => {
      const response = apiError.response
      if (response && response.status === 401) {
        redirectToLogin()
      }
      return Promise.reject(apiError)
    })

axios.interceptors.request.use(config => setRequestConfig(config), error => Promise.reject(error))

axios.interceptors.response.use(response => response.data, error => handleError(error))

export default axios
