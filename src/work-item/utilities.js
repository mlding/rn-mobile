import { assign, chain, filter, find, get, includes, isEmpty, map, omit, pick, toLower, isNil } from 'lodash'
import { formatDate } from '../utilities/dateUtils'
import { isNumberOrNotEmptyString } from '../utilities/utils'
import { DRAFT_FILTER, FILTER_TYPE, EMPTY_FILTER_ITEM_ID, CATEGORY_FIELD, REGION_FIELD } from './filter/constants'

export const getQuantityUnit = quantity =>
  quantity[`quantity_description_unit_${quantity.quantity_description_unit_system}`] || ''

export const formatNumber = value => {
  if (!isNumberOrNotEmptyString(value)) return null
  return parseFloat(value).toFixed(1).replace('.0', '')
}

export const getQuantityWithUnit = quantity => `${formatNumber(quantity.estimated_quantity)}${getQuantityUnit(quantity)}`

export const getPrimaryQuantity = quantities => {
  if (isEmpty(quantities)) {
    return undefined
  }
  return find(quantities, 'is_primary_quantity') || quantities[0]
}

export const getPrimaryQuantityWithUnit = quantities => {
  const primaryQuantity = getPrimaryQuantity(quantities)
  return primaryQuantity ? getQuantityWithUnit(primaryQuantity) : ''
}

export const getWorkItemSections = workItems => (
  chain(workItems)
    .reduce((result, workItem) => {
      const found = find(result, item => item.workOrder === workItem.work_order)
      if (found) {
        found.data.push(workItem)
      } else {
        result.push({
          data: [workItem],
          title: workItem.work_order_name,
          dueDate: workItem.work_order_schedule_end_date &&
            formatDate(workItem.work_order_schedule_end_date),
          workOrder: workItem.work_order,
        })
      }
      return result
    }, [])
    .map(section => omit(section, 'workOrder'))
    .value()
)

export const getUniqProps = (workItems, prop) => chain(workItems).map(prop).uniq().value()

export const isInDraft = (draft, item) => (
  isEmpty(draft) ? false : draft.productReportLines.some(reportLine =>
    reportLine.work_item === get(item, 'id'))
)

export const getAttachments = (workPackage, workPackageFiles,
      downloadedWorkPackageList, downloadedFiles) => {
  let attachments = []
  if (includes(downloadedWorkPackageList, workPackage)) {
    const workPackageList = filter(workPackageFiles, { 'work_package': workPackage })
    if (isEmpty(workPackageList)) return []
    attachments = map(workPackageList, file => {
      const fileList = filter(downloadedFiles, { 'id': file.id })
      const downloadedFilePath = get(fileList[0], 'path')
      const attachment = pick(file, ['upload', 'name', 'extension'])
      if (!isEmpty(fileList) && !isEmpty(downloadedFilePath)) {
        return assign(attachment, { 'upload': downloadedFilePath })
      }
      return attachment
    })
  }
  return attachments
}

export const getWorkItemsBySearchCondition = (workItems, searchCondition) => {
  if (isEmpty(workItems)) {
    return []
  }
  if (isEmpty(searchCondition)) {
    return [...workItems]
  }
  return chain(workItems).filter(item =>
    (isEmpty(searchCondition.searchField) ||
      isEmpty(searchCondition.searchText) ||
      toLower(get(item, searchCondition.searchField, '')).includes(toLower(searchCondition.searchText))),
  ).value()
}

const getDraftFilter = conditions => (
  get(find(conditions, item => item.filterType === FILTER_TYPE.DRAFT), 'name')
)

const matchBlankFilterItem = (workItem, filterField, filterIds) => {
  if (isEmpty(find(filterIds, item => includes(item, EMPTY_FILTER_ITEM_ID)))) return false
  return isNil(workItem[filterField])
}

const matchFilterConditions = (workItem, draftFilter, regionIds, categoryIds, draft) => {
  const isMatchDraftFilter = draftFilter === DRAFT_FILTER.ALL ||
    (draftFilter === DRAFT_FILTER.IN_DRAFT && isInDraft(draft, workItem)) ||
    (draftFilter === DRAFT_FILTER.NOT_IN_DRAFT && !isInDraft(draft, workItem))
  const isMatchRegionFilter = isEmpty(regionIds) ||
    regionIds.includes(workItem[REGION_FIELD]) ||
    matchBlankFilterItem(workItem, REGION_FIELD, regionIds)
  const isMatchCategoryFilter = isEmpty(categoryIds) ||
    categoryIds.includes(workItem[CATEGORY_FIELD]) ||
    matchBlankFilterItem(workItem, CATEGORY_FIELD, categoryIds)
  return isMatchDraftFilter && isMatchRegionFilter && isMatchCategoryFilter
}

export const getWorkItemsByFilterConditions = (workItems, conditions, draft) => {
  if (isEmpty(workItems)) return []
  if (conditions.length === 1 && get(conditions[0], 'name') === DRAFT_FILTER.ALL) {
    return [...workItems]
  }
  const draftFilter = getDraftFilter(conditions)
  const isInReport = draftFilter === DRAFT_FILTER.IN_DRAFT
  if (isInReport && isEmpty(draft)) return []

  const regionIds =
    chain(conditions)
      .filter(condition => condition.filterType === FILTER_TYPE.REGION)
      .map(condition => condition.id)
      .value()

  const categoryIds =
    chain(conditions)
      .filter(condition => condition.filterType === FILTER_TYPE.CATEGORY)
      .map(condition => condition.id)
      .value()
  return filter(workItems, workItem =>
    matchFilterConditions(workItem, draftFilter, regionIds, categoryIds, draft))
}
