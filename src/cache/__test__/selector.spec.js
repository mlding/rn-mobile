import {
  asBuiltRequirementsSelector,
  cacheState,
  downloadedWorkPackageListSelector,
  materialsSelector,
  workPackageFilesSelector,
  quantityDescriptionsSelector,
} from '../selector'

describe('cache selector', () => {
  const state = {
    asBuiltRequirements: ['asBuiltRequirements'],
    workPackageFiles: ['workPackageFiles'],
    materials: ['materials'],
    downloadedWorkPackageList: ['downloadedWorkPackageList'],
    quantityDescriptions: ['quantityDescriptions'],
  }

  const rootState = {
    cache: state,
  }
  it('should return cache state', () => {
    expect(cacheState(rootState)).toEqual(state)
  })

  it('it should return as build requirements', () => {
    expect(asBuiltRequirementsSelector(rootState)).toEqual(['asBuiltRequirements'])
  })

  it('it should return work package files', () => {
    expect(workPackageFilesSelector(rootState)).toEqual(['workPackageFiles'])
  })

  it('it should return materials', () => {
    expect(materialsSelector(rootState)).toEqual(['materials'])
  })

  it('it should return download work package list', () => {
    expect(downloadedWorkPackageListSelector(rootState)).toEqual(['downloadedWorkPackageList'])
  })

  it('it should return quantity descriptions', () => {
    expect(quantityDescriptionsSelector(rootState)).toEqual(['quantityDescriptions'])
  })
})
