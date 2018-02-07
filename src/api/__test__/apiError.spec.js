import { createApiError } from '../error/apiError'
import { NO_NETWORK, UNABLE_CONNECT_TO_SERVER } from '../../constants/toast'
import { isNetworkConnect } from '../../utilities/networkInfo'

describe('ApiError', () => {
  let error
  beforeEach(() => {
    error = new Error()
  })
  describe('#When online', () => {
    it('message should be server error when stautus code >=500', () => {
      error.response = {
        status: 500,
      }
      return createApiError(error)
        .then(wrappedError => {
          expect(wrappedError.message).toEqual('Server error')
        })
    })
    it('message should be not found when stautus code = 404', () => {
      error.response = {
        status: 404,
      }
      return createApiError(error)
        .then(wrappedError => {
          expect(wrappedError.message).toEqual('Not found')
        })
    })
    it('message should be response data when server return single string error data', () => {
      error.response = {
        data: 'Something is wrong',
      }
      return createApiError(error)
        .then(wrappedError => {
          expect(wrappedError.message).toEqual('Something is wrong')
        })
    })
    it('message should be response data when multiple fileds error', () => {
      error.response = {
        data: {
          'email': [
            'This field is required.',
          ],
          'password': [
            'This field is required.',
          ],
        },
      }
      return createApiError(error)
        .then(wrappedError => {
          expect(wrappedError.message).toEqual('This field is required.')
        })
    })
    it('message should be response data when multiple fileds single error', () => {
      error.response = {
        data: {
          'email': 'This field is required.',
          'password': 'This field is required.',
        },
      }
      return createApiError(error)
        .then(wrappedError => {
          expect(wrappedError.message).toEqual('This field is required.')
        })
    })
    it('message should be Server error for ruleless errors', () => {
      error.response = { data: {} }
      return createApiError(error)
        .then(wrappedError => {
          expect(wrappedError.message).toEqual('Server error')
        })
    })
  })
  describe('#When offline', () => {
    it('message should be NO_NETWORK', () => {
      error.response = undefined
      isNetworkConnect.mockImplementation(() => Promise.resolve(false))
      return createApiError(error)
        .then(wrappedError => {
          expect(wrappedError.message).toEqual(NO_NETWORK)
        })
    })
  })

  describe('#When online but cannot connect to server', () => {
    it('message should be UNABLE TO CONNECT SERVER', () => {
      error.response = undefined
      isNetworkConnect.mockImplementation(() => Promise.resolve(true))
      return createApiError(error)
        .then(wrappedError => {
          expect(wrappedError.message).toEqual(UNABLE_CONNECT_TO_SERVER)
        })
    })
  })
})
