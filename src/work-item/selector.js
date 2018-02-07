import { createSelector } from 'reselect'
import { find, map, chain } from 'lodash'
import { asBuiltRequirementsSelector } from '../cache/selector'
import { getWorkItemsBySearchCondition, getWorkItemsByFilterConditions } from './utilities'
import { mapListWithAsBuiltRequirements } from '../utilities/selectorUtils'
import { FILTER_TYPE, EMPTY_FILTER_ITEM_ID, EMPTY_FILTER_ITEM_NAME, CATEGORY_FIELD, REGION_FIELD } from './filter/constants'
import { draftReportSelector } from '../draft/selector'

const workItemsState = state => state.workItems

export const workItemListSelector = createSelector(
  workItemsState,
  state => state.list,
)

export const workItemsSelector = createSelector(
  workItemListSelector, asBuiltRequirementsSelector,
  (list, asBuiltRequirements) => mapListWithAsBuiltRequirements(list, asBuiltRequirements),
)

export const nextSelector = createSelector(
  workItemsState,
  state => state.next,
)

export const loadingSelector = createSelector(
  workItemsState,
  state => state.loading,
)

export const refreshingSelector = createSelector(
  workItemsState,
  state => state.refreshing,
)

export const errorMessageSelector = createSelector(
  workItemsState,
  state => state.errorMessage,
)

export const selectedIdsSelector = createSelector(
  workItemsState,
  state => state.selectedIds,
)

export const selectedCountSelector = createSelector(
  selectedIdsSelector,
  selectedIds => selectedIds.length,
)

export const selectedWorkItemsSelector = createSelector(
  workItemsSelector, selectedIdsSelector,
  (workItems, selectedIds) =>
    map(selectedIds, id => find(workItems, workItem => workItem.id === id)),
)

export const searchConditionSelector = createSelector(
  workItemsState,
  state => state.searchCondition,
)

export const visibilitySelector = createSelector(
  workItemsState,
  state => state.visibility,
)

export const filterConditionsSelector = createSelector(
  workItemsState,
  state => state.filterConditions,
)

export const filteredWorkItemsSelector = createSelector(
  workItemsState,
  workItemsSelector,
  searchConditionSelector,
  filterConditionsSelector,
  draftReportSelector,
  (state, workItems, searchCondition, filterConditions, draft) => {
    const searchResult = getWorkItemsBySearchCondition(workItems, searchCondition)
    return getWorkItemsByFilterConditions(searchResult, filterConditions, draft)
  },
)

export const regionFilterSourceSelector = createSelector(
  workItemsSelector,
  workItems => {
    const workItemsWithUniqRegions =
      chain(workItems).uniqBy(REGION_FIELD).orderBy(REGION_FIELD).value()
    return workItemsWithUniqRegions.map((item, index) => {
      const regionId = item[REGION_FIELD] || `${EMPTY_FILTER_ITEM_ID}_${index}`
      const regionName = item.region_name || EMPTY_FILTER_ITEM_NAME
      return {
        key: `${FILTER_TYPE.REGION}_${regionId}`,
        id: regionId,
        filterType: FILTER_TYPE.REGION,
        name: regionName,
      }
    })
  },
)

export const categoryFilterSourceSelector = createSelector(
  workItemsSelector,
  workItems => {
    const workItemsWithUniqCategories =
      chain(workItems).uniqBy(CATEGORY_FIELD).orderBy(CATEGORY_FIELD).value()
    return workItemsWithUniqCategories.map((item, index) => {
      const categoryId = item[CATEGORY_FIELD] || `${EMPTY_FILTER_ITEM_ID}_${index}`
      const categoryName = item.work_item_category_name || EMPTY_FILTER_ITEM_NAME
      return {
        key: `${FILTER_TYPE.CATEGORY}_${categoryId}`,
        id: categoryId,
        filterType: FILTER_TYPE.CATEGORY,
        name: categoryName,
      }
    })
  },
)

