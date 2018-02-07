export const COMPLETED = 'Completed'

export const NOT_COMPLETED = 'Not Completed'

export const ROLE_MAPPING = {
  LEAD_WORKER: {
    nameLabel: 'Review By',
    dateLabel: 'Submitted',
    name: 'approver_name',
    date: 'submitted_date',
  },
  CONSTRUCTION_MANAGER: {
    nameLabel: 'Submitted by',
    dateLabel: 'Report for',
    name: 'created_by_name',
    date: 'reported_date',
  },
}

export const SORT_TYPE_STATUS = 'status'
export const SORT_TYPE_DATE = 'date'
export const DEFAULT_SORT_TYPE = SORT_TYPE_STATUS

export const SORT_MAPPING = {
  LEAD_WORKER: [
    {
      label: 'ReportStatus',
      value: SORT_TYPE_STATUS,
    },
    {
      label: 'Submitted Date',
      value: SORT_TYPE_DATE,
    },
  ],

  CONSTRUCTION_MANAGER: [
    {
      label: 'ReportStatus',
      value: SORT_TYPE_STATUS,
    },
    {
      label: 'Report Date',
      value: SORT_TYPE_DATE,
    },
  ],
}

export const TITLE = {
  EDIT_DRAFT: 'Edit Draft Report',
  CREATE: 'Create Report',
}

export const SORT_PANEL_KEY = 'sortPanel'

export const SHOW_MAP_MODE = {
  VIEW: 'view',
  EDIT: 'edit',
}
