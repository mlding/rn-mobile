import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import FCM from 'react-native-fcm'
import FCMService from '../fcmService'
import api from '../../api/api'

jest.mock('react-native-fcm', () => ({
  requestPermissions: jest.fn(),
  getFCMToken: () => Promise.resolve(),
  on: jest.fn(),
  FCMEvent: {
    RefreshToken: jest.fn(),
  },
}))

describe('#fcmService', () => {
  let fcmService

  beforeEach(() => {
    fcmService = new FCMService()
  })

  it('should set the user when call setCurrentUser', () => {
    fcmService.setCurrentUser({ id: 1 })
    expect(fcmService.user).toEqual({ id: 1 })
  })

  it('should set the token when call setLocalToken', () => {
    fcmService.setLocalToken('123')
    expect(fcmService.fcmToken).toEqual('123')
  })

  it('should set history tab when call setHistoryTabs', () => {
    fcmService.setHistoryTabs('workItem')
    expect(fcmService.historyTabs).toEqual(['workItem'])

    fcmService.setHistoryTabs('workItem')
    expect(fcmService.historyTabs).toEqual(['workItem'])
  })

  it('should call post api when call addTokenToServer', () => {
    const spy = jest.spyOn(api, 'post')
    fcmService.addTokenToServer('123', 1)
    expect(spy).toHaveBeenCalled()
  })

  it('should remove the token from sever when call removeTokenFromServer success', () => {
    const mock = new MockAdapter(axios)
    mock.onDelete('/api/v1/mobile/devices/').reply(201, 'ok')
    fcmService.setLocalToken('123')
    return fcmService.removeTokenFromServer('123').then(() => {
      expect(fcmService.fcmToken).toEqual(null)
    })
  })

  it('should not remove the token from sever when the token is empty', () => {
    const mock = new MockAdapter(axios)
    mock.onDelete('/api/v1/mobile/devices/').reply(201, 'ok')
    fcmService.setLocalToken('123')
    return fcmService.removeTokenFromServer().then(() => {
      expect(fcmService.fcmToken).toEqual('123')
    })
  })

  describe('#updateToken', () => {
    it('should return if no token', () => {
      expect(fcmService.updateToken(null)).toEqual(undefined)
    })

    it('should  update token', () => {
      const spy = jest.spyOn(fcmService, 'setLocalToken')
      const spyAddToken = jest.spyOn(fcmService, 'addTokenToServer')
      fcmService.updateToken('TOKEN', 16)
      expect(spy).toBeCalled()
      expect(spyAddToken).toBeCalled()
    })
  })

  describe('#register', () => {
    it('should register success', () => {
      fcmService.updateToken = jest.fn()
      console.log = jest.fn()  // eslint-disable-line
      fcmService.register(16)
      expect(FCM.requestPermissions).toBeCalled()
      expect(FCM.on).toBeCalled()


      return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
        expect(console.log).toBeCalled()  // eslint-disable-line
        expect(fcmService.updateToken).toBeCalled()
      })
    })
  })

  it('should unregister the notification when call unregister', () => {
    const refreshTokenListener = {
      remove: jest.fn(),
    }
    fcmService.removeTokenFromServer = jest.fn(() => Promise.resolve())
    fcmService.refreshTokenListener = refreshTokenListener

    return fcmService.unregister().then(() => {
      expect(refreshTokenListener.remove).toHaveBeenCalled()
    })
  })
})
