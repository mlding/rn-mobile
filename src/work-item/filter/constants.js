import { getDraftFilter } from './utilities'

export const FILTER_TYPE = {
  DRAFT: 'draft',
  REGION: 'region',
  CATEGORY: 'category',
}

export const FILTER_BAR_ITEMS = [
  {
    text: 'All Work Items',
    filterType: FILTER_TYPE.DRAFT,
  },
  {
    text: 'Region',
    filterType: FILTER_TYPE.REGION,
  },
  {
    text: 'Work Item Category',
    filterType: FILTER_TYPE.CATEGORY,
  },
]

export const DRAFT_FILTER = {
  ALL: 'All Work Items',
  IN_DRAFT: 'Work Items in Draft Report',
  NOT_IN_DRAFT: 'Work Items not in Draft Report',
}

export const DRAFT_FILTERS = [
  {
    text: DRAFT_FILTER.ALL,
    label: DRAFT_FILTER.ALL,
  },
  {
    text: DRAFT_FILTER.IN_DRAFT,
    label: 'In Draft Report',
  },
  {
    text: DRAFT_FILTER.NOT_IN_DRAFT,
    label: 'Not In Draft',
  },
]

export const DEFAULT_FILTER_CONDITIONS = [{
  ...getDraftFilter(DRAFT_FILTER.ALL),
  selected: true,
}]

export const FILTER_BAR_HEIGHT = 34
export const FILTER_ITEM_HEIGHT = 47
export const FILTER_ITEM_SEPARATOR_HEIGHT = 0.4
export const MAX_FILTER_ITEMS = 6
export const FILTER_BUTTON_GROUP_HEIGHT = 40

export const EMPTY_FILTER_ITEM_ID = 'empty_filter_item'
export const EMPTY_FILTER_ITEM_NAME = 'Blanks'
export const CATEGORY_FIELD = 'work_item_category'
export const REGION_FIELD = 'region'
