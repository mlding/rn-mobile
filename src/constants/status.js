const STATUS = {
  APPROVED: 'Approved',
  FLAGGED: 'Flagged',
  RESUBMITTED: 'Resubmitted',
  SUBMITTED: 'Submitted',
  DRAFT: 'Draft',
}

export const ORDERING_BY_STATUS = {
  LEAD_WORKER: 'flagged,resubmitted,submitted,approved',
  CONSTRUCTION_MANAGER: 'resubmitted,submitted,flagged,approved',
}

export const ORDERING = {
  SUBMITTED_DATE: '-submitted_date',
}

export const READ_ONLY_STATUS_FOR_LEAD_WORKER =
  [STATUS.APPROVED, STATUS.RESUBMITTED, STATUS.SUBMITTED]

export default STATUS
