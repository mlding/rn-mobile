import { keys, isArray, isString } from 'lodash'
import { NO_NETWORK, UNABLE_CONNECT_TO_SERVER } from '../../constants/toast'
import { isNetworkConnect } from '../../utilities/networkInfo'

export async function createApiError(inputErr) { // eslint-disable-line
  const error = new Error()
  error.name = 'ApiError'
  const response = inputErr.response
  error.response = response
  if (response) {
    error.status = response.status
    if (response.status >= 500) {
      error.message = 'Server error'
    } else if (response.status === 404) {
      error.message = 'Not found'
    } else {
      const { data } = response
      if (typeof data === 'string') {
        error.message = data
      } else {
        const key = keys(data)
        const errorWrapper = data[key[0]]
        if (key && errorWrapper && (isArray(errorWrapper) || isString(errorWrapper))) {
          error.message = isArray(errorWrapper) ? errorWrapper[0] : errorWrapper
        } else {
          error.message = 'Server error'
        }
      }
    }
  } else {
    const isNetworkconnect = await isNetworkConnect()
    error.message = isNetworkconnect ? UNABLE_CONNECT_TO_SERVER : NO_NETWORK
  }
  return error
}
