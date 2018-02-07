import { createSelector } from 'reselect'

export const cacheState = state => state.cache

export const asBuiltRequirementsSelector = createSelector(
  cacheState,
  state => state.asBuiltRequirements,
)

export const materialsSelector = createSelector(
  cacheState,
  state => state.materials,
)

export const workPackageFilesSelector = createSelector(
  cacheState,
  state => state.workPackageFiles,
)

export const downloadedWorkPackageListSelector = createSelector(
  cacheState,
  state => state.downloadedWorkPackageList,
)

export const quantityDescriptionsSelector = createSelector(
  cacheState, state => state.quantityDescriptions,
)
