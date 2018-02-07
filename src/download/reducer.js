import { combineActions, handleActions } from 'redux-actions'
import { combineReducers } from 'redux'
import { isEmpty } from 'lodash'
import {
  DOWNLOAD_START,
  DOWNLOAD_FILE_SUCCESS,
  DOWNLOAD_FAILED,
  DOWNLOAD_FINISHED,
  UPDATE_LOCAL_FILES,
} from './actions'
import { addArrayItem } from '../utilities/array'

const downloadedFiles = handleActions({
  [UPDATE_LOCAL_FILES]: (state, { payload }) => (isEmpty(payload) ? [] : [...payload]),
  [DOWNLOAD_FILE_SUCCESS]: (state, { payload }) => addArrayItem(state, payload),
}, [])

const downloadFilesCount = handleActions({
  [DOWNLOAD_START]: (state, { payload }) => payload,
}, 0)

const downloadedFilesCount = handleActions({
  [DOWNLOAD_START]: () => 0,
  [DOWNLOAD_FILE_SUCCESS]: state => state + 1,
}, 0)

const isDownloading = handleActions({
  [DOWNLOAD_START]: () => true,
  [combineActions(DOWNLOAD_FAILED, DOWNLOAD_FINISHED)]: () => false,
}, false)

const hasError = handleActions({
  [DOWNLOAD_START]: () => false,
  [DOWNLOAD_FAILED]: () => true,
}, false)

export default combineReducers({
  downloadedFiles,
  downloadFilesCount,
  downloadedFilesCount,
  isDownloading,
  hasError,
})
