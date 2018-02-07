import { combineReducers } from 'redux'
import { uniq, uniqBy } from 'lodash'
import { handleActions } from 'redux-actions'
import { resolve } from '../utilities/actions'

import {
  CLEAR_AS_BUILT_REQUIREMENTS,
  CLEAR_MATERIALS,
  CLEAR_WEB_PACKAGE_FILES,
  FETCH_AS_BUILT_REQUIREMENTS,
  FETCH_MATERIALS,
  FETCH_WEB_PACKAGE_FILES,
  FETCH_QUANTITY_DESCRIPTIONS,
} from './actions'

const createOfflineReducer = (clearActionType, fetchActionType) => (
  handleActions({
    [clearActionType]: () => [],
    [resolve(fetchActionType)]: (state, { payload }) => (
      uniqBy([...state, ...payload.results], item => item.id)
    ),
  }, [])
)

const asBuiltRequirements = createOfflineReducer(
  CLEAR_AS_BUILT_REQUIREMENTS, FETCH_AS_BUILT_REQUIREMENTS)
const workPackageFiles = createOfflineReducer(CLEAR_WEB_PACKAGE_FILES, FETCH_WEB_PACKAGE_FILES)
const materials = createOfflineReducer(CLEAR_MATERIALS, FETCH_MATERIALS)

const downloadedWorkPackageList = handleActions({
  [CLEAR_WEB_PACKAGE_FILES]: () => [],
  [resolve(FETCH_WEB_PACKAGE_FILES)]: (state, { meta }) => uniq([...state, meta[0]]),
}, [])

const quantityDescriptions = handleActions({
  [resolve(FETCH_QUANTITY_DESCRIPTIONS)]: (state, { payload }) => payload.results,
}, [])

export default combineReducers({
  asBuiltRequirements,
  workPackageFiles,
  materials,
  quantityDescriptions,
  downloadedWorkPackageList,
})
