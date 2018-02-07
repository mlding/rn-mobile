import { Platform } from 'react-native'
import FCM, { FCMEvent } from 'react-native-fcm'
import DeviceInfo from 'react-native-device-info'
import api from '../api/api'
import { addArrayItem } from '../utilities/array'

let instance = null

export default class FCMService {
  constructor() {
    if (!instance) {
      instance = this
    }
    this.fcmToken = null
    this.refreshTokenListener = null
    this.user = null
    this.deviceId = DeviceInfo.getUniqueID()
    this.historyTabs = []
    return instance
  }

  setCurrentUser(user) {
    this.user = user
  }

  setLocalToken(token) {
    this.fcmToken = token
  }

  setHistoryTabs(tab) {
    if (tab && this.historyTabs.indexOf(tab) === -1) {
      this.historyTabs = addArrayItem(this.historyTabs, tab)
    }
  }

  addTokenToServer(token, userId) {
    api.post('/api/v1/mobile/devices/', {
      fcm_token: token,
      user: userId,
      device_id: this.deviceId,
      type: Platform.OS,
    })
  }

  removeTokenFromServer = token => (
    new Promise(resolve => {
      if (!token) return resolve()
      return api.delete('/api/v1/mobile/devices/', {
        data: {
          device_id: this.deviceId,
        },
      }).then(() => {
        console.log('fcmService::removeTokenFromServer success') //eslint-disable-line
        this.setLocalToken(null)
        return resolve()
      })
    })
  )

  updateToken(token, userId) {
    if (!token) return
    this.setLocalToken(token)
    this.addTokenToServer(token, userId)
  }

  register = userId => {
    FCM.requestPermissions()
    FCM.getFCMToken().then(token => {
      console.log('fcmSercive::register', token) //eslint-disable-line
      this.updateToken(token, userId)
    })
    FCM.on(FCMEvent.RefreshToken, token => {
      console.log('fcmSercive::refresh', token) //eslint-disable-line
      if (this.fcmToken === token) return
      this.updateToken(token, userId)
    })
  }

  unregister = () => (
    new Promise(resolve => {
      this.removeTokenFromServer(this.fcmToken).done(() => {
        if (this.refreshTokenListener) {
          this.refreshTokenListener.remove()
        }
        return resolve()
      })
    })
  )
}

