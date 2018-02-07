import { includes, isEmpty, get } from 'lodash'
import { openReportDetail } from '../report/utilities'
import { openExtraWorkOrderDetail } from '../extra-work-order/utilities'
import { openTimesheetDetail } from '../timesheet/utilities'
import { NOTIFICATION_KEY, NOTIFICATION_TYPE } from './constants'
import { isConstructionManager } from '../utilities/role'
import { VIEW_MODE } from '../timesheet/constants'
import api from '../api/api'

const DPR_NOTIFICATION_TYPES = [
  NOTIFICATION_TYPE.DPR_APPROVED,
  NOTIFICATION_TYPE.DPR_FLAGGED,
  NOTIFICATION_TYPE.DPR_SUBMITTED,
]

const TIMESHEET_NOTIFICATION_TYPES = [
  NOTIFICATION_TYPE.TIMESHEET_APPROVED,
  NOTIFICATION_TYPE.TIMESHEET_FLAGGED,
  NOTIFICATION_TYPE.TIMESHEET_SUBMITTED,
]

const EWO_NOTIFICATION_TYPES = [
  NOTIFICATION_TYPE.EWO_APPROVED,
  NOTIFICATION_TYPE.EWO_FLAGGED,
  NOTIFICATION_TYPE.EWO_SUBMITTED,
]

export const getManagerViewMode = (notificationType, role) => {
  if (!isConstructionManager(role)) return VIEW_MODE.CREATOR
  if ((notificationType === NOTIFICATION_TYPE.TIMESHEET_APPROVED ||
    notificationType === NOTIFICATION_TYPE.TIMESHEET_FLAGGED ||
    notificationType === NOTIFICATION_TYPE.TIMESHEETS_APPROVED ||
    notificationType === NOTIFICATION_TYPE.TIMESHEETS_FLAGGED)) return VIEW_MODE.CREATOR
  return VIEW_MODE.APPROVAL
}

const isTimesheetNotification = notificationType =>
  includes(TIMESHEET_NOTIFICATION_TYPES, notificationType)
const isDPRNotification = notificationType => includes(DPR_NOTIFICATION_TYPES, notificationType)
const isEWONotification = notificationType => includes(EWO_NOTIFICATION_TYPES, notificationType)

const goDetailAfterNotificatin = (notificationType, item, role) => {
  if (isTimesheetNotification(notificationType)) {
    openTimesheetDetail(item, role, getManagerViewMode(notificationType, role))
  } else if (isDPRNotification(notificationType)) {
    openReportDetail(item, role)
  } else if (isEWONotification(notificationType)) {
    openExtraWorkOrderDetail(item, role)
  }
}

const goDetailAfterFetchItemInfo = (notificationType, itemId, role) => {
  if (!itemId) return
  const TIMESHEET_URL = `/api/v1/mobile/timesheets/${itemId}/`
  const DPR_URL = `/api/v1/mobile/production_reports/${itemId}/`
  const EWO_URL = `/api/v1/mobile/extra_work_order_requests/${itemId}/`
  let url
  if (isTimesheetNotification(notificationType)) {
    url = TIMESHEET_URL
  } else if (isDPRNotification(notificationType)) {
    url = DPR_URL
  } else if (isEWONotification(notificationType)) {
    url = EWO_URL
  }
  if (url) {
    api.get(url).then(item => {
      goDetailAfterNotificatin(notificationType, item, role)
    })
  }
}

export const showDetailAfterNotification = (localItems, notification, role) => {
  const targetItem = localItems.find(item => `${item.id}` === notification.itemId)
  const { type, itemId } = notification
  if (targetItem) {
    goDetailAfterNotificatin(type, targetItem, role)
  } else {
    goDetailAfterFetchItemInfo(type, itemId, role)
  }
}

export const shouldRedirectForNotification =
  (notification, notificationKey, timesheetViewMode, viewMode) => {
    if (notificationKey === NOTIFICATION_KEY.TIMESHEET
      && timesheetViewMode !== viewMode) return false

    if (!isEmpty(notificationKey) && includes(get(notification, 'type', ''), notificationKey)) {
      return true
    }
    return false
  }
