import { commentEditable } from '../commentUtil'
import STATUS from '../../constants/status'

describe('commentUtil', () => {
  it('#commentEditable', () => {
    expect(commentEditable({ isApprover: false, status: STATUS.SUBMITTED })).toEqual(false)
    expect(commentEditable({ isApprover: true, status: STATUS.SUBMITTED })).toEqual(true)
    expect(commentEditable({ isApprover: false, status: STATUS.RESUBMITTED })).toEqual(false)
    expect(commentEditable({ isApprover: true, status: STATUS.RESUBMITTED })).toEqual(true)
  })
})
