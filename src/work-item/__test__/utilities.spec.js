import { Actions } from 'react-native-router-flux'
import {
  formatNumber,
  getAttachments,
  getPrimaryQuantityWithUnit,
  getUniqProps,
  getWorkItemsByFilterConditions,
  getWorkItemsBySearchCondition,
  getWorkItemSections,
  isInDraft,
} from '../utilities'
import { draftExsitWorkItem, draftReport, workItem, workItemListWithoutRegionCategory } from '../../shared/fixture'
import { downloadedFiles, workItemsForWithWorkOrder, workPackageFiles } from '../fixture'
import { DEFAULT_FILTER_CONDITIONS, DRAFT_FILTER, FILTER_BAR_ITEMS, FILTER_TYPE } from '../filter/constants'
import {
  getDraftFilter,
  getDraftFilters,
  getFilterBarLabel,
  getFilterItemsByType,
  hideFilterPanel,
  showToast,
} from '../filter/utilities'
import SCENE_KEY from '../../constants/sceneKey'

jest.mock('react-native-router-flux', () => ({
  Actions: {
    pop: jest.fn(),
    toast: jest.fn(),
    currentScene: '',
  },
}))

describe('#work-item utilities', () => {
  beforeEach(() => {
    Actions.pop.mockClear()
    Actions.toast.mockClear()
    Actions.currentScene = ''
  })

  describe('#getPrimaryQuantityWithUnit', () => {
    it('should get the primary quantity', () => {
      const quantities = [{
        id: 5410,
        estimated_quantity: 100,
        quantity_description_unit_imperial: 'ft',
        quantity_description_unit_system: 'imperial',
        quantity_description_unit_metric: 'm',
      }, {
        id: 5411,
        estimated_quantity: 200,
        quantity_description_unit_imperial: 'ft',
        quantity_description_unit_system: 'metric',
        quantity_description_unit_metric: 'm',
        is_primary_quantity: true,
      }]

      const primaryQuantityWithUnit = getPrimaryQuantityWithUnit(quantities)

      expect(primaryQuantityWithUnit).toEqual('200m')
    })
    it('should get the first quantity if no primary quantity', () => {
      const quantities = [{
        id: 5410,
        estimated_quantity: 100,
        quantity_description_unit_imperial: 'ft',
        quantity_description_unit_system: 'imperial',
        quantity_description_unit_metric: 'm',
      }, {
        id: 5411,
        estimated_quantity: 200,
        quantity_description_unit_imperial: 'ft',
        quantity_description_unit_system: 'metric',
        quantity_description_unit_metric: 'm',
      }]

      const primaryQuantityWithUnit = getPrimaryQuantityWithUnit(quantities)

      expect(primaryQuantityWithUnit).toEqual('100ft')
    })
    it('should get null if quantity', () => {
      const quantities = []

      const primaryQuantityWithUnit = getPrimaryQuantityWithUnit(quantities)

      expect(primaryQuantityWithUnit).toEqual('')
    })
  })

  describe('#getWorkItemSections', () => {
    it('should return work items sections by work order', () => {
      const workItemSections = getWorkItemSections(workItemsForWithWorkOrder)
      expect(workItemSections.length).toEqual(3)
      expect(workItemSections[0].data.length).toEqual(2)
      expect(workItemSections[0].title).toEqual('Cabling')
    // expect(workItemSections[0].dueDate).toEqual('20.07.2017')
      expect(workItemSections[1].data.length).toEqual(1)
      expect(workItemSections[1].title).toEqual('Distribution Network')
    // expect(workItemSections[1].dueDate).toEqual('21.10.2017')
      expect(workItemSections[2].data.length).toEqual(1)
      expect(workItemSections[2].title).toEqual('DBO')
      expect(workItemSections[2].dueDate).toEqual(null)
    })
  })

  describe('#getUniqProps', () => {
    it('should get groupped uniq value for some property for work items', () => {
      const workItems = [workItem, { ...workItem, name: 'Different Work Item Name' }]
      const result = getUniqProps(workItems, 'name')
      expect(result).toEqual(['Setup splice case', 'Different Work Item Name'])
    })
  })

  describe('#isInDraft', () => {
    it('should get false when draftReport has not added the work item', () => {
      const result = isInDraft(draftReport, workItem)
      expect(result).toEqual(false)
    })

    it('should get true when draftReport has added the work item', () => {
      const result = isInDraft(draftExsitWorkItem, workItem)
      expect(result).toEqual(true)
    })

    it('should get false when draftReport is null', () => {
      const result = isInDraft(null, workItem)
      expect(result).toEqual(false)
    })
  })

  describe('#getAttachments', () => {
    it('should get attachments when downloadedWorkPackageList include work_package', () => {
      const workPackage = 27
      const downloadedWorkPackageList = [27, 31, 34]
      const attachments = getAttachments(workPackage, workPackageFiles,
      downloadedWorkPackageList, downloadedFiles)

      expect(attachments).toEqual([{
        'name': 'DPR big file1',
        'extension': 'pdf',
        'upload': 'local uri 12',
      },
      {
        'name': 'DPR big file1',
        'extension': 'pdf',
        'upload': 'cached uri 34',
      }])
    })

    it('should get empty attachments when downloadedWorkPackageList not include work_package', () => {
      const workPackage = 11
      const downloadedWorkPackageList = [27, 31, 34]
      const attachments = getAttachments(workPackage, workPackageFiles,
      downloadedWorkPackageList, downloadedFiles)

      expect(attachments).toEqual([])
    })
  })

  describe('#formatNumber', () => {
    it('should return number with number', () => {
      const value = 18.943467231312
      expect(formatNumber(value)).toEqual('18.9')
    })
    it('should return number with string', () => {
      const value = '18.943467231312'
      expect(formatNumber(value)).toEqual('18.9')
    })
    it('should return number with number', () => {
      const value = 18.953467231312
      expect(formatNumber(value)).toEqual('19')
    })
    it('should return number with string', () => {
      const value = '18.953467231312'
      expect(formatNumber(value)).toEqual('19')
    })
    it('should return null with undefined', () => {
      const value = undefined
      expect(formatNumber(value)).toEqual(null)
    })
    it('should return number with null', () => {
      const value = null
      expect(formatNumber(value)).toEqual(null)
    })
  })

  describe('#getWorkItemsBySearchCondition', () => {
    const searchCondition = {
      searchField: 'name',
      searchText: 'Setup splice case',
    }
    it('should return empty array when work items is empty', () => {
      expect(getWorkItemsBySearchCondition([], searchCondition)).toEqual([])
    })
    it('should return work items when search condition is empty', () => {
      expect(getWorkItemsBySearchCondition([workItem], [])).toEqual([workItem])
    })
    it('should return work items that match search conditions', () => {
      expect(getWorkItemsBySearchCondition([workItem], searchCondition)).toEqual([workItem])
    })
  })

  describe('#getWorkItemsByFilterConditions', () => {
    // let filters = DEFAULT_FILTER_CONDITIONS
    it('should return empty array when work items is empty', () => {
      expect(getWorkItemsByFilterConditions([], DEFAULT_FILTER_CONDITIONS, draftReport)).toEqual([])
    })
    it('should return work items when search condition is empty', () => {
      expect(getWorkItemsByFilterConditions([workItem], DEFAULT_FILTER_CONDITIONS, draftReport))
    .toEqual([workItem])
    })
    it('should return empty array when filter WI in draftReport and draftReport does not exist', () => {
      const filters = [{ ...DEFAULT_FILTER_CONDITIONS[0], name: DRAFT_FILTER.IN_DRAFT }]
      expect(getWorkItemsByFilterConditions([workItem], filters, null)).toEqual([])
    })
    it('should return work items when match not in draft condition', () => {
      const filters = [{ ...DEFAULT_FILTER_CONDITIONS[0], name: DRAFT_FILTER.NOT_IN_DRAFT }]
      expect(getWorkItemsByFilterConditions([workItem], filters, null)).toEqual([workItem])
    })
    it('should filter work items that match draftReport condition', () => {
      const filters = [...DEFAULT_FILTER_CONDITIONS, getDraftFilter(DRAFT_FILTER.IN_DRAFT)]
      const workItems = [{ ...workItem, id: 4667 }]
      expect(getWorkItemsByFilterConditions(workItems, filters, draftReport)).toEqual(workItems)
    })
    it('should filter work items has no region', () => {
      const filters = [...DEFAULT_FILTER_CONDITIONS, { 'filterType': 'region', 'id': 'empty_filter_item_0', 'key': 'region_empty_filter_item_0', 'name': 'Blanks' }]
      expect(getWorkItemsByFilterConditions(
        workItemListWithoutRegionCategory, filters, null))
        .toEqual(workItemListWithoutRegionCategory)
    })
    it('should return empty array when filter not match', () => {
      const filters = [...DEFAULT_FILTER_CONDITIONS, { 'filterType': 'region', 'id': 200, 'key': 'region_200', 'name': 'region name' }]
      expect(getWorkItemsByFilterConditions(
        workItemListWithoutRegionCategory, filters, null))
        .toEqual([])
    })
    it('should filter work items has no category', () => {
      const filters = [...DEFAULT_FILTER_CONDITIONS, { 'filterType': 'category', 'id': 'empty_filter_item_0', 'key': 'category_empty_filter_item_0', 'name': 'Blanks' }]
      expect(getWorkItemsByFilterConditions(
        workItemListWithoutRegionCategory, filters, null))
        .toEqual(workItemListWithoutRegionCategory)
    })
  })

  describe('#getDraftFilters', () => {
    it('should getDraftFilters', () => {
      const res = [
        getDraftFilter(DRAFT_FILTER.ALL),
        getDraftFilter(DRAFT_FILTER.IN_DRAFT),
        getDraftFilter(DRAFT_FILTER.NOT_IN_DRAFT),
      ]
      expect(getDraftFilters()).toEqual(res)
    })
  })

  describe('#getFilterItemsByType', () => {
    it('should getFilterItemsByType', () => {
      const res = getFilterItemsByType(FILTER_TYPE.REGION, FILTER_BAR_ITEMS)
      expect(res).toEqual([{
        text: 'Region',
        filterType: FILTER_TYPE.REGION,
      }])
    })
  })

  describe('#getFilterBarLabel', () => {
    it('should getFilterBarLabel', () => {
      const res = getFilterBarLabel(DRAFT_FILTER.IN_DRAFT)
      expect(res).toEqual('In Draft Report')
    })
  })

  describe('#hideFilterPanel', () => {
    it('should hideFilterPanel', () => {
      Actions.currentScene = SCENE_KEY.FILTER_PANEL
      hideFilterPanel()
      expect(Actions.pop).toBeCalled()
    })
    it('should not hideFilterPanel', () => {
      Actions.pop.mockImplementation(jest.fn())
      hideFilterPanel()
      expect(Actions.pop).not.toBeCalled()
    })
  })

  describe('#showToast', () => {
    it('should showToast', () => {
      Actions.currentScene = SCENE_KEY.WORK_ITEMS_TAB
      showToast()
      expect(Actions.pop).not.toBeCalled()
    })
    it('should not showToast', () => {
      showToast()
      expect(Actions.pop).not.toBeCalled()
    })
  })
})
