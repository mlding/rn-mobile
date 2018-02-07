import { map } from 'lodash'
import {
  categoryFilterSourceSelector,
  errorMessageSelector,
  filterConditionsSelector,
  filteredWorkItemsSelector,
  loadingSelector,
  nextSelector,
  refreshingSelector,
  regionFilterSourceSelector,
  searchConditionSelector,
  selectedCountSelector,
  selectedIdsSelector,
  selectedWorkItemsSelector,
  visibilitySelector,
  workItemListSelector,
  workItemsSelector,
} from '../selector'
import { asBuiltRequirementsSelector } from '../../cache/selector'
import {
  asBuiltRequirements,
  workItemListNullAsBuiltRequirementsCombined,
  workItemListWithoutRegionCategory,
} from '../../shared/fixture'
import { draftReportSelector } from '../../draft/selector'

describe('workItem selector', () => {
  const filterConditions = [{
    filterType: 'work_item',
    id: 'All Work Items',
    key: 'work_item_All Work Items',
    name: 'All Work Items',
    selected: true,
  }]
  const searchCondition = {
    searchField: 'activity_code',
    searchText: '',
  }
  const state = {
    detail: {},
    errorMessage: '',
    filterConditions: filterConditions,
    list: [],
    loading: false,
    next: null,
    refreshing: false,
    searchCondition: searchCondition,
    selectedIds: [],
    visibility: false,
  }
  const cache = {
    asBuiltRequirements: asBuiltRequirements,
  }
  const draft = {
    extraWorkOrder: null,
  }
  const rootState = {
    workItems: state,
    cache: cache,
    draft: draft,
  }
  const rootStateWithWorkItems = {
    workItems: {
      ...state,
      list: workItemListNullAsBuiltRequirementsCombined,
      selectedIds: [28],
    },
    cache: cache,
    draft: draft,
  }

  const rootStateWithWorkItemsNoRegionCategory = {
    workItems: {
      ...state,
      list: workItemListWithoutRegionCategory,
      selectedIds: [29],
    },
    cache: cache,
    draft: draft,
  }
  const workItems = map(workItemListNullAsBuiltRequirementsCombined, item => ({ ...item,
    'network_element': { ...item.network_element,
      'as_built_annotations': [{
        'code': 'BF',
        'data_type': 'string',
        'element_category': 1,
        'id': 3,
        'name': 'Backfill material',
      },
      {
        'code': 'SF',
        'data_type': 'string',
        'element_category': 1,
        'id': 4,
        'name': 'Surface material',
      }] },
  }))

  it('should return workItemList status', () => {
    expect(workItemListSelector(rootState)).toEqual([])
  })

  it('should return workItems status', () => {
    expect(workItemsSelector(rootStateWithWorkItems, asBuiltRequirementsSelector(rootState)))
    .toEqual(workItems)
  })

  it('should return next status', () => {
    expect(nextSelector(rootState)).toEqual(null)
  })

  it('should return loading status', () => {
    expect(loadingSelector(rootState)).toEqual(false)
  })

  it('should return refreshing status', () => {
    expect(refreshingSelector(rootState)).toEqual(false)
  })

  it('should return errorMessage status', () => {
    expect(errorMessageSelector(rootState)).toEqual('')
  })

  it('should return selectedIds status', () => {
    expect(selectedIdsSelector(rootState)).toEqual([])
    expect(selectedCountSelector(rootState)).toEqual(0)
  })

  it('should return selected workItems status', () => {
    const selectedWorkItems = selectedWorkItemsSelector(rootStateWithWorkItems,
      selectedIdsSelector(rootStateWithWorkItems))
    expect(selectedWorkItems).toEqual(workItems)
  })

  it('should return searchCondition status', () => {
    expect(searchConditionSelector(rootState)).toEqual(searchCondition)
  })

  it('should return visibility status', () => {
    expect(visibilitySelector(rootState)).toEqual(false)
  })

  it('should return filterConditions status', () => {
    expect(filterConditionsSelector(rootState)).toEqual(filterConditions)
  })

  it('should return WorkItemsByFilterConditions', () => {
    const workItemsList = workItemsSelector(rootStateWithWorkItems,
      asBuiltRequirementsSelector(rootState))

    expect(filteredWorkItemsSelector(rootStateWithWorkItems,
      workItemsList,
      searchConditionSelector(rootStateWithWorkItems),
      filterConditionsSelector(rootStateWithWorkItems),
      draftReportSelector(rootStateWithWorkItems),
    )).toEqual(workItems)
  })

  it('should return regionFilterSource status', () => {
    expect(regionFilterSourceSelector(rootStateWithWorkItems)).toEqual([{ 'filterType': 'region', 'id': 280, 'key': 'region_280', 'name': '3151a' }])
  })

  it('should return regionFilterSource status has no region', () => {
    expect(regionFilterSourceSelector(rootStateWithWorkItemsNoRegionCategory)).toEqual([{ 'filterType': 'region', 'id': 'empty_filter_item_0', 'key': 'region_empty_filter_item_0', 'name': 'Blanks' }])
  })

  it('should return categoryFilterSourcestatus', () => {
    expect(categoryFilterSourceSelector(rootStateWithWorkItems)).toEqual([{ 'filterType': 'category', 'id': 2920, 'key': 'category_2920', 'name': 'add desc' }])
  })

  it('should return categoryFilterSourcestatus has no category', () => {
    expect(categoryFilterSourceSelector(rootStateWithWorkItemsNoRegionCategory)).toEqual([{ 'filterType': 'category', 'id': 'empty_filter_item_0', 'key': 'category_empty_filter_item_0', 'name': 'Blanks' }])
  })
})
