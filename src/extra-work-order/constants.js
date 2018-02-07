import { DEFAULT_COORDINATE } from '../constants/map'

export const STATUS = {
  EDIT: 'Edit',
}

export const APPROVE_STATE = {
  IN_PROGRESS: {
    text: 'In Progress',
    value: 'in progress',
  },
  ISSUE: {
    text: 'Issue',
    value: 'issued',
  },
  COMPLETE: {
    text: 'Complete',
    value: 'completed',
  },
}

export const DEFAULT_EXTRA_LINE_FORM = {
  uuid: '',
  name: '',
  quantity: null,
  quantity_description: null,
  quantity_description_unit_imperial: '',
  quantity_description_unit_metric: '',
  quantity_description_unit_system: '',
  rate: null,
  location: DEFAULT_COORDINATE,
  address: '',
  comments: '',
  description: '',
  code: '',
}

export const LOCATION_PLACEHOLDER = 'Point on map'
export const ADDRESS_NOT_RETRIEVED = 'Address not retrieved'

export const DEFAULT_LOCATION = {
  coordinate: DEFAULT_COORDINATE,
  address: '',
}

export const DEFAULT_LOCATION_ENTRANCE = 'from_edit_extra_line'

export const LOCATION_ENTRANCE = {
  EXTRA_WORK_ORDER: 'from_edit_extra_work_order',
  EXTRA_LINE: DEFAULT_LOCATION_ENTRANCE,
  VIEW_MAP: 'from_view_map',
}

export const DEFAULT_BASIC_INFO = {
  name: '',
  work_package: null,
  work_package_name: '',
  associated_work_order: null,
  associated_work_order_name: '',
  location: DEFAULT_COORDINATE,
  description: '',
  notes: '',
  address: '',
}

export const TITLE = {
  EDIT_DRAFT: 'Edit Draft Extra Work',
  CREATE: 'Create Extra Work',
  ADD_ITEM: 'Add Item',
  EDIT_ITEM: 'Edit Item',
}
