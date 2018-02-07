import { createAction } from 'redux-actions'
import { createOfflineAction, GET } from '../utilities/actions'

const FETCH_AS_BUILT_REQUIREMENTS_URL = '/api/v1/network_operator/as_built_requirements/'
const FETCH_WEB_PACKAGE_FILES_URL = '/api/v1/wbs/work_package_files/'
const FETCH_MATERIALS_URL = '/api/v1/mobile/materials/'
const FETCH_QUANTITY_DESCRIPTIONS_URL = '/api/v1/quantity_descriptions/'

export const FETCH_AS_BUILT_REQUIREMENTS = 'WORK_ITEMS/FETCH_AS_BUILT_REQUIREMENTS'
export const CLEAR_AS_BUILT_REQUIREMENTS = 'WORK_ITEMS/CLEAR_AS_BUILT_REQUIREMENTS'
export const FETCH_WEB_PACKAGE_FILES = 'WORK_ITEMS/FETCH_WEB_PACKAGE_FILES'
export const CLEAR_WEB_PACKAGE_FILES = 'WORK_ITEMS/CLEAR_WEB_PACKAGE_FILES'
export const FETCH_MATERIALS = 'WORK_ITEMS/FETCH_MATERIALS'
export const CLEAR_MATERIALS = 'WORK_ITEMS/CLEAR_MATERIALS'
export const FETCH_QUANTITY_DESCRIPTIONS = 'EXTRA_WORK_ORDER/FETCH_QUANTITY_DESCRIPTIONS'

export const fetchAsBuiltRequirements = createOfflineAction(FETCH_AS_BUILT_REQUIREMENTS,
  networkOperator => ({
    url: FETCH_AS_BUILT_REQUIREMENTS_URL,
    method: GET,
    params: {
      network_operator: networkOperator,
    },
  }))

export const clearAsBuiltRequirements = createAction(CLEAR_AS_BUILT_REQUIREMENTS)

export const fetchWorkPackageFiles = createOfflineAction(FETCH_WEB_PACKAGE_FILES,
  workPackage => ({
    url: FETCH_WEB_PACKAGE_FILES_URL,
    method: GET,
    params: {
      work_package: workPackage,
    },
  }))

export const clearWorkPackageFiles = createAction(CLEAR_WEB_PACKAGE_FILES)

export const fetchMaterials = createOfflineAction(FETCH_MATERIALS,
  networkOperator => ({
    url: FETCH_MATERIALS_URL,
    method: GET,
    params: {
      network_operator: networkOperator,
    },
  }))

export const clearMaterials = createAction(CLEAR_MATERIALS)

export const fetchQuantityDescriptions = createOfflineAction(FETCH_QUANTITY_DESCRIPTIONS,
  () => ({
    url: FETCH_QUANTITY_DESCRIPTIONS_URL,
    method: GET,
  }))
