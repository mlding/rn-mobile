import FCM from 'react-native-fcm'
import fcmListener from '../fcmListener'
import ROLE from '../../constants/role'
import { redirectAfterLogin } from '../../auth/helper'
import Storage from '../../utilities/Storage'
import { NOTIFICATION_TYPE } from '../constants'
import StorageKey from '../../constants/storageKey'


jest.mock('../../auth/helper', () => ({
  redirectAfterLogin: jest.fn(),
}))

describe('FCMListener', () => {
  describe('#autoLoginRedirect', () => {
    it('Should redirect to login when getInitialNotification failed', async () => {
      FCM.getInitialNotification.mockImplementation(() => Promise.reject())
      const role = ROLE.LEAD_WORKER
      fcmListener.autoLoginRedirect(role)
      return new Promise(resolve => setTimeout(() => resolve(), 0))
        .then(() => {
          expect(redirectAfterLogin).toBeCalledWith(role)
        })
    })
    it('Should redirect to login when getInitialNotification operation is empty', async () => {
      FCM.getInitialNotification.mockImplementation(() => Promise.resolve({}))
      const role = ROLE.LEAD_WORKER
      fcmListener.autoLoginRedirect(role)
      return new Promise(resolve => setTimeout(() => resolve(), 0))
        .then(() => {
          expect(redirectAfterLogin).toBeCalledWith(role)
        })
    })
    it('Should redirect to login when notification has been handled', async () => {
      const messageId = 'notification_message_id'
      const payload = {
        'operation': NOTIFICATION_TYPE.DPR_APPROVED,
        'production_report': 16,
        'gcm.message_id': messageId,
      }
      FCM.getInitialNotification.mockImplementation(() => Promise.resolve(payload))
      Storage.get.mockImplementation(() => Promise.resolve(messageId))
      const role = ROLE.LEAD_WORKER
      fcmListener.autoLoginRedirect(role)
      return new Promise(resolve => setTimeout(() => resolve(), 10)).then(() => {
        expect(Storage.get).toBeCalledWith(StorageKey.NOTIFICATION_MESSAGE_ID)
        expect(redirectAfterLogin).toBeCalledWith(role)
      })
    })
    it('Should handle notification has not been handled', async () => {
      const oldMessageId = 'notification_message_id'
      const newMessageId = 'new_message_id'
      const payload = {
        'operation': NOTIFICATION_TYPE.DPR_APPROVED,
        'production_report': 16,
        'gcm.message_id': newMessageId,
      }
      FCM.getInitialNotification.mockImplementation(() => Promise.resolve(payload))
      Storage.get.mockImplementation(() => Promise.resolve(oldMessageId))
      const role = ROLE.LEAD_WORKER
      fcmListener.autoLoginRedirect(role)
      return new Promise(resolve => setTimeout(() => resolve(), 0)).then(() => {
        expect(Storage.get).toBeCalledWith(StorageKey.NOTIFICATION_MESSAGE_ID)
        expect(Storage.set).toBeCalledWith(StorageKey.NOTIFICATION_MESSAGE_ID, newMessageId)
      })
    })
    it('Should redirect to login when get old message id failed', async () => {
      const newMessageId = 'new_message_id'
      const payload = {
        'operation': NOTIFICATION_TYPE.DPR_APPROVED,
        'production_report': 16,
        'gcm.message_id': newMessageId,
      }
      FCM.getInitialNotification.mockImplementation(() => Promise.resolve(payload))
      Storage.get.mockImplementation(() => Promise.reject())
      const role = ROLE.LEAD_WORKER
      fcmListener.autoLoginRedirect(role)
      return new Promise(resolve => setTimeout(() => resolve(), 0)).then(() => {
        expect(Storage.get).toBeCalledWith(StorageKey.NOTIFICATION_MESSAGE_ID)
        expect(redirectAfterLogin).toBeCalledWith(role)
      })
    })
  })
})
