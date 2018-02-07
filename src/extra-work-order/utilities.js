import { Actions } from 'react-native-router-flux'
import { uniqBy, pick, isEmpty, map, reduce, omit, isNumber, get, capitalize, isEqual } from 'lodash'
import { isConstructionManager, isLeadWorker } from '../utilities/role'
import STATUS, { READ_ONLY_STATUS_FOR_LEAD_WORKER } from '../constants/status'


export const getWorkItemsAttribute = (workItems, id, name) => {
  if (isEmpty(workItems)) return []
  const uniqWorkPackages = uniqBy(workItems, id)
  return map(uniqWorkPackages, workPacakge => pick(workPacakge, [id, name]))
}

export const getQuantityDescriptionUnit = quantityDescription => {
  if (isEmpty(quantityDescription)) {
    return ''
  }
  return quantityDescription[`unit_${quantityDescription.standard_unit_system}_name`] || ''
}

export const calculateTotalMoney = items =>
  (reduce(items, (sum, item) => sum + (item.quantity * item.rate), 0))

export const convertExtraLineForSubmit = extraLine => {
  const omitParams = ['quantity_description_unit_imperial', 'quantity_description_unit_metric', 'quantity_description_unit_system', 'uuid']
  return omit(extraLine, ...omitParams)
}

export const formatMoney = money => {
  if (!isNumber(money)) return ''
  const moneyFixed = money.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  return moneyFixed.replace('.0', '')
}

export const compareIdOrUuid = (item, payload) => (
  get(item, 'id') ? item.id === payload.id : item.uuid === payload.uuid
)

export const openExtraWorkOrderDetail = (extraWorkOrder, role) => {
  const formatStatus = capitalize(extraWorkOrder.status)

  if (isLeadWorker(role)) {
    if (READ_ONLY_STATUS_FOR_LEAD_WORKER.includes(formatStatus)) {
      Actions.extraWorkOrderDetail({ extraWorkOrder })
    } else if (isEqual(STATUS.FLAGGED, formatStatus)) {
      Actions.editExtraWorkOrder({ extraWorkOrder })
    }
  } else if (isConstructionManager(role)) {
    Actions.extraWorkOrderDetail({ extraWorkOrder })
  }
}
