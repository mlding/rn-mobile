import { Actions } from 'react-native-router-flux'
import { isLeadWorker, isConstructionManager } from '../utilities/role'
import { TAB_BAR_LABEL } from '../constants/tab'

export const NOTIFICATION_TYPE = {
  WORK_ITEMS_ASSIGNED: 'work_items_assigned',
  DPR_APPROVED: 'production_report_approved',
  DPR_FLAGGED: 'production_report_flagged',
  DPR_SUBMITTED: 'production_report_submitted',
  EWO_APPROVED: 'extra_work_order_approved',
  EWO_FLAGGED: 'extra_work_order_flagged',
  EWO_SUBMITTED: 'extra_work_order_submitted',
  TIMESHEET_APPROVED: 'timesheet_approved',
  TIMESHEET_FLAGGED: 'timesheet_flagged',
  TIMESHEET_SUBMITTED: 'timesheet_submitted',
  WORK_ITEM_ASSIGNED: 'work_item_assigned',
  DPRS_APPROVED: 'production_reports_approved',
  DPRS_FLAGGED: 'production_reports_flagged',
  DPRS_SUBMITTED: 'production_reports_submitted',
  EWOS_APPROVED: 'extra_work_orders_approved',
  EWOS_FLAGGED: 'extra_work_orders_flagged',
  EWOS_SUBMITTED: 'extra_work_orders_submitted',
  TIMESHEETS_APPROVED: 'timesheets_approved',
  TIMESHEETS_FLAGGED: 'timesheets_flagged',
  TIMESHEETS_SUBMITTED: 'timesheets_submitted',
}

export const NOTIFICATION_KEY = {
  WORK_ITEM: 'work_item',
  DPR: 'production_report',
  EWO: 'extra_work_order',
  TIMESHEET: 'timesheet',
}

const WORK_ITEM_CONFIG = {
  roleValidation: role => isLeadWorker(role),
  tabLabel: TAB_BAR_LABEL.WORK_ITEMS,
  listRedirection: () => Actions.leadWorkerTabWorkItems(),
  itemKey: 'work_item',
}

const DPR_CONFIG = {
  tabLabel: TAB_BAR_LABEL.REPORT,
  itemKey: 'production_report',
}

const TIMESHEET_CONFIG = {
  tabLabel: TAB_BAR_LABEL.TIME_SHEET,
  itemKey: 'timesheet',
}

const EWO_CONFIG = {
  tabLabel: TAB_BAR_LABEL.EXTRA_WORK,
  itemKey: 'production_report',
}

const WORKER_DPR_CONFIG = {
  ...DPR_CONFIG,
  roleValidation: role => isLeadWorker(role),
  listRedirection: () => Actions.leadWorkerTabWorkReport(),
}

const MANAGER_DPR_CONFIG = {
  ...DPR_CONFIG,
  roleValidation: role => isConstructionManager(role),
  listRedirection: () => Actions.constructionManagerTabReport(),
}

const CREATOR_TIMESHEET_CONFIG = {
  ...TIMESHEET_CONFIG,
  listRedirection: role => {
    if (isConstructionManager(role)) {
      Actions.constructionManagerTabTimesheet()
    } else {
      Actions.leadWorkerTabTimesheet()
    }
  },
}

const APPROVER_TIMESHEET_CONFIG = {
  roleValidation: role => isConstructionManager(role),
  ...TIMESHEET_CONFIG,
  listRedirection: () => Actions.constructionManagerTabTimesheet(),
}

const WORKER_EWO_CONFIG = {
  ...EWO_CONFIG,
  roleValidation: role => isLeadWorker(role),
  listRedirection: () => Actions.leadWorkerTabExtraWorkOrder(),
}

const MANAGER_EWO_CONFIG = {
  ...EWO_CONFIG,
  roleValidation: role => isConstructionManager(role),
  listRedirection: () => Actions.constructManagerTabExtraWorkOrder(),
}

export const NOTIFICATION_CONFIG = [
  {
    operations: NOTIFICATION_TYPE.WORK_ITEM_ASSIGNED,
    ...WORK_ITEM_CONFIG,
  },
  {
    operations: NOTIFICATION_TYPE.WORK_ITEMS_ASSIGNED,
    ...WORK_ITEM_CONFIG,
    itemKey: null,
  },
  {
    operations: [NOTIFICATION_TYPE.DPR_APPROVED, NOTIFICATION_TYPE.DPR_FLAGGED],
    ...WORKER_DPR_CONFIG,
  },
  {
    operations: [NOTIFICATION_TYPE.DPR_SUBMITTED],
    ...MANAGER_DPR_CONFIG,
  },
  {
    operations: [NOTIFICATION_TYPE.DPRS_APPROVED, NOTIFICATION_TYPE.DPRS_FLAGGED],
    ...WORKER_DPR_CONFIG,
    itemKey: null,
  },
  {
    operations: [NOTIFICATION_TYPE.DPRS_SUBMITTED],
    ...MANAGER_DPR_CONFIG,
    itemKey: null,
  },
  {
    operations: [NOTIFICATION_TYPE.TIMESHEET_APPROVED, NOTIFICATION_TYPE.TIMESHEET_FLAGGED],
    ...CREATOR_TIMESHEET_CONFIG,
  },
  {
    operations: [NOTIFICATION_TYPE.TIMESHEET_SUBMITTED],
    ...APPROVER_TIMESHEET_CONFIG,
  },
  {
    operations: [NOTIFICATION_TYPE.TIMESHEETS_APPROVED, NOTIFICATION_TYPE.TIMESHEETS_FLAGGED],
    ...CREATOR_TIMESHEET_CONFIG,
    itemKey: null,
  },
  {
    operations: [NOTIFICATION_TYPE.TIMESHEETS_SUBMITTED],
    ...APPROVER_TIMESHEET_CONFIG,
    itemKey: null,
  },
  {
    operations: [NOTIFICATION_TYPE.EWO_APPROVED, NOTIFICATION_TYPE.EWO_FLAGGED],
    ...WORKER_EWO_CONFIG,
  },
  {
    operations: [NOTIFICATION_TYPE.EWO_SUBMITTED],
    ...MANAGER_EWO_CONFIG,
  },
  {
    operations: [NOTIFICATION_TYPE.EWOS_APPROVED, NOTIFICATION_TYPE.EWOS_FLAGGED],
    ...WORKER_EWO_CONFIG,
    itemKey: null,
  },
  {
    operations: [NOTIFICATION_TYPE.EWOS_SUBMITTED],
    ...MANAGER_EWO_CONFIG,
    itemKey: null,
  },
]

