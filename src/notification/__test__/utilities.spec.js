import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {
  shouldRedirectForNotification,
  getManagerViewMode,
  showDetailAfterNotification,
} from '../utilities'
import { openReportDetail } from '../../report/utilities'
import { openExtraWorkOrderDetail } from '../../extra-work-order/utilities'
import { openTimesheetDetail } from '../../timesheet/utilities'
import { VIEW_MODE } from '../../timesheet/constants'
import { NOTIFICATION_KEY, NOTIFICATION_TYPE } from '../constants'
import ROLE from '../../constants/role'
import productionReport from '../../report/fixture'
import { timesheet } from '../../timesheet/fixture'
import { extraWorkOrder } from '../../extra-work-order/fixture'

jest.mock('../../report/utilities', () => ({
  openReportDetail: jest.fn(),
}))

jest.mock('../../extra-work-order/utilities', () => ({
  openExtraWorkOrderDetail: jest.fn(),
}))

jest.mock('../../timesheet/utilities', () => ({
  openTimesheetDetail: jest.fn(),
}))

describe('notification utilities', () => {
  describe('#shouldRedirectForNotification', () => {
    it('should return false when the notification key is timesheet and current view mode is not equal timesheet view mode', () => {
      const notification = { type: 'timesheet_approved' }
      expect(shouldRedirectForNotification(notification,
        NOTIFICATION_KEY.TIMESHEET, VIEW_MODE.CREATOR, VIEW_MODE.APPROVAL)).toEqual(false)
    })

    it('should return false when the notification key is timesheet current view mode equal timesheet view mode notification is null', () => {
      expect(shouldRedirectForNotification(null, NOTIFICATION_KEY.TIMESHEET,
        VIEW_MODE.CREATOR, VIEW_MODE.CREATOR)).toEqual(false)
    })

    it('should return true when the notification key is timesheet current view mode equal timesheet view mode notification type is timesheet_submitted', () => {
      const notification = { type: 'timesheet_assigned' }
      expect(shouldRedirectForNotification(notification, NOTIFICATION_KEY.TIMESHEET,
        VIEW_MODE.CREATOR, VIEW_MODE.CREATOR)).toEqual(true)
    })

    it('should return false when the notification key is work_item and notification type is production_report_approved', () => {
      const notification = { type: 'production_report_approved' }
      expect(shouldRedirectForNotification(notification, NOTIFICATION_KEY.WORK_ITEM,
        VIEW_MODE.CREATOR, VIEW_MODE.CREATOR)).toEqual(false)
    })

    it('should return true when the notification key is work_item and notification type is work_item_approved', () => {
      const notification = { type: 'work_item_approved' }
      expect(shouldRedirectForNotification(notification, NOTIFICATION_KEY.WORK_ITEM)).toEqual(true)
    })

    it('should return false when the notification key is null', () => {
      const notification = { type: 'work_item_approved' }
      expect(shouldRedirectForNotification(notification, null,
        VIEW_MODE.CREATOR, VIEW_MODE.CREATOR)).toEqual(false)
    })
  })

  describe('#getManagerViewMode', () => {
    it('should return creator view mode when current role is leader worker', () => {
      expect(getManagerViewMode(NOTIFICATION_KEY.WORK_ITEM, ROLE.LEAD_WORKER))
        .toEqual(VIEW_MODE.CREATOR)
    })

    it('should return creator view mode when current role is leader worker', () => {
      expect(getManagerViewMode(NOTIFICATION_TYPE.DPR_APPROVED, ROLE.LEAD_WORKER))
        .toEqual(VIEW_MODE.CREATOR)
    })

    it('should return creator view mode when current role is construction manager, and notification type is timesheet approved or flagged', () => {
      expect(getManagerViewMode(NOTIFICATION_TYPE.TIMESHEET_APPROVED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.CREATOR)
      expect(getManagerViewMode(NOTIFICATION_TYPE.TIMESHEETS_APPROVED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.CREATOR)
      expect(getManagerViewMode(NOTIFICATION_TYPE.TIMESHEET_FLAGGED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.CREATOR)
      expect(getManagerViewMode(NOTIFICATION_TYPE.TIMESHEETS_FLAGGED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.CREATOR)
    })

    it('should return creator view mode when current role is construction manager, and notification type is timesheet submitted or other type', () => {
      expect(getManagerViewMode(NOTIFICATION_TYPE.TIMESHEET_SUBMITTED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.APPROVAL)
      expect(getManagerViewMode(NOTIFICATION_TYPE.TIMESHEETS_SUBMITTED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.APPROVAL)
      expect(getManagerViewMode(NOTIFICATION_TYPE.WORK_ITEM_ASSIGNED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.APPROVAL)
      expect(getManagerViewMode(NOTIFICATION_TYPE.DPR_APPROVED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.APPROVAL)
      expect(getManagerViewMode(NOTIFICATION_TYPE.EWO_APPROVED, ROLE.CONSTRUCTION_MANAGER))
        .toEqual(VIEW_MODE.APPROVAL)
    })
  })

  describe('#showDetailAfterNotification', () => {
    const mock = new MockAdapter(axios)
    afterEach(() => {
      mock.reset()
      openTimesheetDetail.mockClear()
      openReportDetail.mockClear()
      openExtraWorkOrderDetail.mockClear()
    })
    it('should go to the DPR detail page when notification type is production_report_approved and localItems has this item', () => {
      const notification = { type: NOTIFICATION_TYPE.DPR_APPROVED, itemId: `${productionReport.id}` }

      showDetailAfterNotification([productionReport], notification, ROLE.LEAD_WORKER)
      expect(openReportDetail).toHaveBeenCalledWith(productionReport, ROLE.LEAD_WORKER)
    })

    it('should get the DPR detail when notification type is production_report_approved and localItems not have this item', () => {
      const notification = { type: NOTIFICATION_TYPE.DPR_APPROVED, itemId: '1234' }
      const responseData = { ...productionReport, id: 1234 }

      mock.onGet('/api/v1/mobile/production_reports/1234/').reply(201, responseData)
      showDetailAfterNotification([productionReport], notification, ROLE.LEAD_WORKER)

      return new Promise(resolve => setTimeout(() => resolve(), 0))
        .then(() => {
          expect(openReportDetail).toHaveBeenCalledWith(responseData, ROLE.LEAD_WORKER)
        })
    })

    it('should go to the extra work order detail page when notification type is extra_work_order_flagged and localItems has this item', () => {
      const extraWorkOrderItem = { ...extraWorkOrder, id: 1 }
      const notification = { type: NOTIFICATION_TYPE.EWO_FLAGGED, itemId: '1' }

      showDetailAfterNotification([extraWorkOrderItem], notification, ROLE.LEAD_WORKER)
      expect(openExtraWorkOrderDetail).toHaveBeenCalledWith(extraWorkOrderItem, ROLE.LEAD_WORKER)
    })

    it('should get the extra work order detail when notification type is extra_work_order_flagged and localItems not have this item', () => {
      const extraWorkOrderItem = { ...extraWorkOrder, id: 1 }
      const notification = { type: NOTIFICATION_TYPE.EWO_FLAGGED, itemId: 2 }
      const responseData = { ...extraWorkOrder, id: 2 }

      mock.onGet('/api/v1/mobile/extra_work_order_requests/2/').reply(201, responseData)
      showDetailAfterNotification([extraWorkOrderItem], notification, ROLE.LEAD_WORKER)

      return new Promise(resolve => setTimeout(() => resolve(), 0))
        .then(() => {
          expect(openExtraWorkOrderDetail).toHaveBeenCalledWith(responseData, ROLE.LEAD_WORKER)
        })
    })

    it('should go to the timesheet detail page when notification type is timesheet_submitted and localItems has this item', () => {
      const timesheetItem = { ...timesheet, id: 1 }
      const notification = { type: NOTIFICATION_TYPE.TIMESHEET_SUBMITTED, itemId: '1' }

      showDetailAfterNotification([timesheetItem], notification, ROLE.CONSTRUCTION_MANAGER)
      expect(openTimesheetDetail)
        .toHaveBeenCalledWith(timesheetItem, ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.APPROVAL)
    })

    it('should get the timesheet detail when notification type is timesheet_submitted and localItems not have this item', () => {
      const timesheetItem = { ...timesheet, id: 1 }
      const notification = { type: NOTIFICATION_TYPE.TIMESHEET_SUBMITTED, itemId: '2' }
      const responseData = { ...timesheet, id: 2 }

      mock.onGet('/api/v1/mobile/timesheets/2/').reply(201, responseData)
      showDetailAfterNotification([timesheetItem], notification, ROLE.CONSTRUCTION_MANAGER)

      return new Promise(resolve => setTimeout(() => resolve(), 0))
        .then(() => {
          expect(openTimesheetDetail)
            .toHaveBeenCalledWith(responseData, ROLE.CONSTRUCTION_MANAGER, VIEW_MODE.APPROVAL)
        })
    })

    it('should not go to detail page if the item id is null', () => {
      const notification = { type: NOTIFICATION_TYPE.TIMESHEET_SUBMITTED }

      showDetailAfterNotification([productionReport], notification, ROLE.CONSTRUCTION_MANAGER)

      return new Promise(resolve => setTimeout(() => resolve(), 0))
        .then(() => {
          expect(openTimesheetDetail).not.toHaveBeenCalled()
        })
    })

    it('should not go to detail page if the notification type is not one of timesheet dpr and ewo', () => {
      const notification = { type: NOTIFICATION_TYPE.WORK_ITEMS_ASSIGNED }

      showDetailAfterNotification([productionReport], notification, ROLE.CONSTRUCTION_MANAGER)

      return new Promise(resolve => setTimeout(() => resolve(), 0))
        .then(() => {
          expect(openTimesheetDetail).not.toHaveBeenCalled()
          expect(openExtraWorkOrderDetail).not.toHaveBeenCalled()
          expect(openReportDetail).not.toHaveBeenCalled()
        })
    })
  })
})
