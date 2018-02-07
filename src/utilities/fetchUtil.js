import { isEmpty } from 'lodash'
import { isConstructionManager, isLeadWorker } from './role'
import { ORDERING, ORDERING_BY_STATUS } from '../constants/status'
import { VIEW_MODE } from '../timesheet/constants'

export const PAGE_SIZE = 20

export const getFetchParams = (offset, user, viewMode) => {
  const { role, id } = user
  let params = {
    limit: PAGE_SIZE,
    offset: offset,
    ordering: ORDERING.SUBMITTED_DATE,
  }
  if (isLeadWorker(role) || (!isEmpty(viewMode) && viewMode === VIEW_MODE.CREATOR)) {
    params = {
      ...params,
      created_by: id,
      ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
    }
  } else if (isConstructionManager(role)) {
    params = {
      ...params,
      approver: id,
      ordering_by_status: ORDERING_BY_STATUS.CONSTRUCTION_MANAGER,
    }
  }
  return params
}
