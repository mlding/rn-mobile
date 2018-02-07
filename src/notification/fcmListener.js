import FCM, { FCMEvent } from 'react-native-fcm'
import { includes, find } from 'lodash'
import { NOTIFICATION_CONFIG } from './constants'
import { redirectAfterLogin } from '../auth/helper'
import FCMService from './fcmService'
import Storage from '../utilities/Storage'
import StorageKey from '../constants/storageKey'
import { setNotification } from './actions'

let notificationListener
let dispatch
const fcmService = new FCMService()

const getNotificationConfig = operation =>
  find(NOTIFICATION_CONFIG, item => includes(item.operations, operation))

const isManualRefresh = tab => (includes(fcmService.historyTabs, tab))

const setNotificationThenRedirect = (role, operation, targetTab, redirectAction, itemId = null) => {
  dispatch(setNotification({
    type: operation,
    itemId: itemId,
    refresh: isManualRefresh(targetTab),
  }))
  redirectAction(role)
}

const handleNotificationRedirection = notif => {
  const { operation } = notif
  const user = fcmService.user
  if (!user || !dispatch) return
  const role = user.role
  const notificationConfig = getNotificationConfig(operation)
  if (!notificationConfig) return
  const { roleValidation, tabLabel, listRedirection, itemKey } = notificationConfig
  if (roleValidation && !roleValidation(role)) return
  setNotificationThenRedirect(
    role, operation, tabLabel, listRedirection, itemKey ? notif[itemKey] : null)
}

const subscribeBackgroundNotification = reduxDispatch => {
  dispatch = reduxDispatch
  notificationListener = FCM.on(FCMEvent.Notification, notif => {
    const { opened_from_tray, operation } = notif
    if (opened_from_tray && getNotificationConfig(operation)) { // eslint-disable-line
      handleNotificationRedirection(notif)
    }
  })
}

const unsubscribeBackrdoundNotification = () => {
  if (notificationListener) {
    notificationListener.remove()
    dispatch = null
  }
}

const autoLoginRedirect = role => {
  // Kill App and then open it after clicks notification bar
  FCM.getInitialNotification().then(notif => {
    const { operation } = notif
    if (notif && getNotificationConfig(operation)) {
      const messageId = notif['gcm.message_id']
      Storage.get(StorageKey.NOTIFICATION_MESSAGE_ID).then(perviousMessageId => {
        if (perviousMessageId !== messageId) {
          Storage.set(StorageKey.NOTIFICATION_MESSAGE_ID, messageId)
          return handleNotificationRedirection(notif)
        }
        return redirectAfterLogin(role)
      }).catch(() => redirectAfterLogin(role))
    }
    return redirectAfterLogin(role)
  }).catch(() => redirectAfterLogin(role))
}

export default {
  subscribeBackgroundNotification,
  unsubscribeBackrdoundNotification,
  autoLoginRedirect,
}
