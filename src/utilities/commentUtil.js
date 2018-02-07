import { capitalize } from 'lodash'
import STATUS from '../constants/status'


export const commentEditable = ({ isApprover, status }) => { //eslint-disable-line
  const formatStatus = capitalize(status)
  const editStatus = [STATUS.RESUBMITTED, STATUS.SUBMITTED]
  return (isApprover && editStatus.includes(formatStatus))
}
