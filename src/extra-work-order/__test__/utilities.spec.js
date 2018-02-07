import { Actions } from 'react-native-router-flux'
import {
  getWorkItemsAttribute,
  getQuantityDescriptionUnit,
  calculateTotalMoney,
  convertExtraLineForSubmit,
  formatMoney,
  compareIdOrUuid,
  openExtraWorkOrderDetail,
} from '../utilities'
import {
  workItems, workPackages, workOrders, descriptionQuantity, extraLineWithUuid, extraLineForSubmit,
  extraLineWithId, extraLineForSubmitWithId, extraWorkOrder,
} from '../fixture'
import ROLE from '../../constants/role'

jest.mock('react-native-router-flux', () => ({
  Actions: {
    extraWorkOrderDetail: jest.fn(),
    editExtraWorkOrder: jest.fn(),
  },
}))

describe('#extra-work-order utilities', () => {
  describe('#getWorkItemsAttribute', () => {
    it('duplicate work packages', () => {
      expect(getWorkItemsAttribute(workItems, 'work_package', 'work_package_name')).toEqual(workPackages)
    })
    it('null work packages', () => {
      expect(getWorkItemsAttribute([], 'work_package', 'work_package_name')).toEqual([])
    })
    it('duplicate work orders', () => {
      expect(getWorkItemsAttribute(workItems, 'work_order', 'work_order_name')).toEqual(workOrders)
    })
    it('null work orders', () => {
      expect(getWorkItemsAttribute([], 'work_order', 'work_order_name')).toEqual([])
    })
  })

  describe('#getQuantityDescriptionUnit', () => {
    it('get the imperial name when the standard_unit_system is imperial', () => {
      const quantity = { ...descriptionQuantity, standard_unit_system: 'imperial' }
      expect(getQuantityDescriptionUnit(quantity)).toEqual(quantity.unit_imperial_name)
    })
    it('get the metric name when the standard_unit_system is metric', () => {
      const quantity = { ...descriptionQuantity, standard_unit_system: 'metric' }
      expect(getQuantityDescriptionUnit(quantity)).toEqual(quantity.unit_metric_name)
    })
    it('should return empty if params is null', () => {
      expect(getQuantityDescriptionUnit()).toEqual('')
    })
    it('should return empty if standard_unit_system is hahaha', () => {
      const quantity = { ...descriptionQuantity, standard_unit_system: 'hahaha' }
      expect(getQuantityDescriptionUnit(quantity)).toEqual('')
    })
  })

  describe('#calculateTotalMoney', () => {
    it('should get 0 when the item is an empty array', () => {
      expect(calculateTotalMoney([])).toEqual(0)
    })
    it('should get total money when the item is not empty', () => {
      const item = [
        { quantity: 10, rate: 20 },
        { quantity: 1, rate: 20 },
      ]
      expect(calculateTotalMoney(item)).toEqual(220)
    })
    it('should get total money with large amount', () => {
      const item = [
        { quantity: 999999, rate: 999999.9 },
        { quantity: 999999, rate: 99999999 },
        { quantity: 999999, rate: 99999999 },
        { quantity: 999999, rate: 99999999 },
        { quantity: 999999, rate: 99999999 },
        { quantity: 999999, rate: 99999999 },
        { quantity: 999999, rate: 99999999 },
        { quantity: 999999, rate: 99999999 },
        { quantity: 999999, rate: 99999999 },
        { quantity: 999999, rate: 99999999 },
      ]
      expect(calculateTotalMoney(item)).toEqual(900999089900009.1)
    })
  })

  describe('#convertExtraLineForSubmit', () => {
    it('omit params without id', () => {
      expect(convertExtraLineForSubmit(extraLineWithUuid)).toEqual(extraLineForSubmit)
    })
    it('omit params id', () => {
      expect(convertExtraLineForSubmit(extraLineWithId)).toEqual(extraLineForSubmitWithId)
    })
  })

  describe('#formatMoney', () => {
    it('format money 1239', () => {
      const money = 1239000
      expect(formatMoney(money)).toEqual('1,239,000')
    })
    it('format money 1239.0', () => {
      const money = 1239000.0
      expect(formatMoney(money)).toEqual('1,239,000')
    })
    it('format money 1239000.1', () => {
      const money = 1239000.11234
      expect(formatMoney(money)).toEqual('1,239,000.1')
    })
    it('format money 15 digit', () => {
      const money = 450359962737049.1
      expect(formatMoney(money)).toEqual('450,359,962,737,049.1')
    })
    it('format money 16 digit, do not show decimal point', () => {
      const money = 4503599627370496.1
      expect(formatMoney(money)).not.toBe('4,503,599,627,370,496.1')
    })
    it('format money null', () => {
      const money = null
      expect(formatMoney(money)).toEqual('')
    })
    it('format money is empty', () => {
      const money = ''
      expect(formatMoney(money)).toEqual('')
    })
  })

  describe('#compareIdOrUuid', () => {
    it('compare with id true', () => {
      expect(compareIdOrUuid({ id: 1 }, { id: 1 })).toEqual(true)
    })
    it('compare with id false', () => {
      expect(compareIdOrUuid({ id: 1 }, { uuid: 1 })).toEqual(false)
    })
    it('compare with id false', () => {
      expect(compareIdOrUuid({ id: 1 }, { id: 2, uuid: 1 })).toEqual(false)
    })
    it('compare with uuid true', () => {
      expect(compareIdOrUuid({ uuid: '169e1965-de28-7b7e-444c-841b04fee881' }, { uuid: '169e1965-de28-7b7e-444c-841b04fee881' })).toEqual(true)
    })
    it('compare with uuid false', () => {
      expect(compareIdOrUuid({ uuid: '169e1965-de28-7b7e-444c-841b04fee881' }, { id: 1 })).toEqual(false)
    })
  })

  describe('#openReportDetail', () => {
    it('should go the the detail if the role is leader worker and report status is resubmitted', () => {
      const resubmittedExtraWorkOrder = { ...extraWorkOrder, status: 'resubmitted' }
      openExtraWorkOrderDetail(resubmittedExtraWorkOrder, ROLE.LEAD_WORKER)
      expect(Actions.extraWorkOrderDetail)
        .toHaveBeenCalledWith({ extraWorkOrder: resubmittedExtraWorkOrder })
    })

    it('should go the the edit if the role is leader worker and report status is flagged', () => {
      const flaggedExtraWorkOrder = { ...extraWorkOrder, status: 'flagged' }
      openExtraWorkOrderDetail(flaggedExtraWorkOrder, ROLE.LEAD_WORKER)
      expect(Actions.editExtraWorkOrder)
        .toHaveBeenCalledWith({ extraWorkOrder: flaggedExtraWorkOrder })
    })

    it('should go the the manage detail if the role is construction manager', () => {
      openExtraWorkOrderDetail(extraWorkOrder, ROLE.CONSTRUCTION_MANAGER)
      expect(Actions.extraWorkOrderDetail).toHaveBeenCalledWith({ extraWorkOrder: extraWorkOrder })
    })
  })
})
