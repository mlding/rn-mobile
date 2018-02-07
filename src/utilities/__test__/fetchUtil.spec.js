import { ORDERING, ORDERING_BY_STATUS } from '../../constants/status'
import { getFetchParams, PAGE_SIZE } from '../fetchUtil'

describe('#getFetchParams', () => {
  it('isLeadWorker', () => {
    const offset = 0
    const user = {
      id: 16,
      role: 'lead_worker',
    }
    const params = {
      limit: PAGE_SIZE,
      offset: offset,
      ordering: ORDERING.SUBMITTED_DATE,
      created_by: user.id,
      ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
    }
    expect(getFetchParams(offset, user)).toEqual(params)
  })
  it('isConstructionManager', () => {
    const offset = 0
    const user = {
      id: 17,
      role: 'construction_manager',
    }
    const params = {
      limit: PAGE_SIZE,
      offset: offset,
      ordering: ORDERING.SUBMITTED_DATE,
      approver: user.id,
      ordering_by_status: ORDERING_BY_STATUS.CONSTRUCTION_MANAGER,
    }
    expect(getFetchParams(offset, user)).toEqual(params)
  })
})
