import moment from 'moment'
import STATUS from '../constants/status'

const leadWorkStatusOrder = [
  STATUS.FLAGGED.toLowerCase(),
  STATUS.RESUBMITTED.toLowerCase(),
  STATUS.SUBMITTED.toLowerCase(),
  STATUS.APPROVED.toLowerCase()]

const managerStatusOrder = [
  STATUS.RESUBMITTED.toLowerCase(),
  STATUS.SUBMITTED.toLowerCase(),
  STATUS.FLAGGED.toLowerCase(),
  STATUS.APPROVED.toLowerCase()]

const MAX_ORDER_VALUE = 100

const getOrderInStatus = (statusOrder, status) => {
  const index = statusOrder.indexOf(status)
  return index >= 0 ? index : MAX_ORDER_VALUE
}

const getTimeComparator = () => (left, right) => moment(right.created).diff(moment(left.created))

export const getStatusComparator = isLeadWorkerStatus => { //eslint-disable-line
  const timeComparator = getTimeComparator()
  const statusOrder = isLeadWorkerStatus ? leadWorkStatusOrder : managerStatusOrder
  return (left, right) => {
    const statusCompareRes = getOrderInStatus(statusOrder, left.status) -
      getOrderInStatus(statusOrder, right.status)
    if (statusCompareRes === 0) {
      return timeComparator(left, right)
    }
    return statusCompareRes
  }
}
