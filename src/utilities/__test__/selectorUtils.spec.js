import {
  asBuiltAnnotationsData,
  asBuiltCombineData,
  asBuiltRequirementsData,
  asBuiltRequirements,
  workItemListCategory1,
  workItemListCategory1Combined,
  workItemListCategory1HasAnnotations,
  workItemListCategory1HasAnnotationsCombined,
  workItemListCategory3,
  workItemListCategory3Combined,
  workItemListCategory3HasAnnotations,
  workItemListCategory3HasAnnotationsCombined,
  workItemListNullAsBuiltRequirements,
  workItemListNullAsBuiltRequirementsCombined,
  workItemListNullAsBuiltRequirementsHasAnnotations,
  workItemListNullAsBuiltRequirementsHasAnnotationsCombined,
  workItemListNullNetworkElement,
  workItemListNullNetworkElementCombined,
} from '../../shared/fixture'
import { mapListWithAsBuiltRequirements, combineAsBuilt } from '../selectorUtils'

describe('#mapListWithAsBuiltRequirements', () => {
  it('should return workItemList combined with null AsBuiltRequirements, has not default annotations', () => {
    const workItems = mapListWithAsBuiltRequirements(workItemListNullAsBuiltRequirements, [])
    expect(workItems).toEqual(workItemListNullAsBuiltRequirementsCombined)
  })

  it('should return workItemList combined with null AsBuiltRequirements, has default annotations', () => {
    const workItems = mapListWithAsBuiltRequirements(
      workItemListNullAsBuiltRequirementsHasAnnotations, [])
    expect(workItems).toEqual(workItemListNullAsBuiltRequirementsHasAnnotationsCombined)
  })

  it('should return workItemList with category = 1, has not default annotations', () => {
    const workItems = mapListWithAsBuiltRequirements(workItemListCategory1, asBuiltRequirements)
    expect(workItems).toEqual(workItemListCategory1Combined)
  })

  it('should return workItemList with category = 1, has default annotations', () => {
    const workItems = mapListWithAsBuiltRequirements(workItemListCategory1HasAnnotations,
      asBuiltRequirements)
    expect(workItems).toEqual(workItemListCategory1HasAnnotationsCombined)
  })

  it('should return workItemList with category = 3, cannot mapping AsBuiltRequirements, has not default annotations', () => {
    const workItems = mapListWithAsBuiltRequirements(workItemListCategory3, asBuiltRequirements)
    expect(workItems).toEqual(workItemListCategory3Combined)
  })

  it('should return workItemList with category = 3, cannot mapping AsBuiltRequirements, has default annotations', () => {
    const workItems = mapListWithAsBuiltRequirements(workItemListCategory3HasAnnotations,
      asBuiltRequirements)
    expect(workItems).toEqual(workItemListCategory3HasAnnotationsCombined)
  })

  it('should return workItemList with null NetworkElement', () => {
    const workItems = mapListWithAsBuiltRequirements(workItemListNullNetworkElement,
      asBuiltRequirements)
    expect(workItems).toEqual(workItemListNullNetworkElementCombined)
  })
})

describe('#combineAsBuilt', () => {
  it('shoud combine asBuiltAnnotationsData and asBuiltRequirementsData', () => {
    expect(combineAsBuilt(asBuiltAnnotationsData, asBuiltRequirementsData))
      .toEqual(asBuiltCombineData)
  })

  it('shoud combine asBuiltAnnotationsData and asBuiltRequirementsData', () => {
    expect(combineAsBuilt([], asBuiltRequirementsData))
      .toEqual(asBuiltRequirementsData)
  })
})
