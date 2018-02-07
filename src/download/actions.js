import { createAction } from 'redux-actions'
import { isEmpty, get, replace, map } from 'lodash'
import RNFS from 'react-native-fs'
import {
  getLocalFiles,
  clearTempFiles,
  getTempFolder,
  getFilesFolder,
  filterFiles,
  clearUselessFiles,
} from './utilities'
import { FILES_FOLDER_NAME, TEMP_FOLDER, TEMP_FOLDER_NAME } from '../constants/download'

export const DOWNLOAD_START = 'DOWNLOAD/DOWNLOAD_START'
export const DOWNLOAD_FILE_SUCCESS = 'DOWNLOAD/DOWNLOAD_FILE_SUCCESS'
export const DOWNLOAD_FAILED = 'DOWNLOAD/DOWNLOAD_FAILED'
export const DOWNLOAD_FINISHED = 'DOWNLOAD/DOWNLOAD_FINISHED'
export const UPDATE_LOCAL_FILES = 'DOWNLOAD/UPDATE_LOCAL_FILES'

export const downloadStart = createAction(DOWNLOAD_START)
export const downloadFileSuccess = createAction(DOWNLOAD_FILE_SUCCESS)
export const downloadFailed = createAction(DOWNLOAD_FAILED)
export const downloadFinished = createAction(DOWNLOAD_FINISHED)
export const updateLocalFiles = createAction(UPDATE_LOCAL_FILES)

export const shouldDownload = getState => {
  if (isEmpty(get(getState(), 'cache.workPackageFiles'))) return Promise.reject('workPackageFiles do not exist.')
  const allFiles = getState().cache.workPackageFiles
  const downloadedFiles = getState().download.downloadedFiles
  const willDownloadFiles = filterFiles(allFiles, downloadedFiles)
  clearUselessFiles(allFiles, downloadedFiles)
  if (isEmpty(willDownloadFiles)) return Promise.reject('all files have been downloaded.')
  return Promise.resolve(willDownloadFiles)
}

export const downloadFile = (dispatch, file) => {
  const name = `${file.name}.${file.extension}`
  const path = `${TEMP_FOLDER}/${file.id}_${name}`
  const downloadResult = RNFS.downloadFile({ fromUrl: file.upload, toFile: path })
  const filePath = replace(path, `/${TEMP_FOLDER_NAME}/`, `/${FILES_FOLDER_NAME}/`)
  return downloadResult.promise
    .then(() => RNFS.moveFile(path, filePath))
    .then(() => dispatch(downloadFileSuccess({ id: file.id, name: name, path: filePath })))
    .catch(err => {
      clearTempFiles(path).catch(err => console.log(err)) // eslint-disable-line
      return Promise.reject(err)
    })
}

export const downloadAllFiles = (dispatch, getState) => {
  const allFiles = getState().cache.workPackageFiles
  const downloadedFiles = getState().download.downloadedFiles
  const willDownloadFiles = filterFiles(allFiles, downloadedFiles)
  return Promise.all(map(willDownloadFiles, file => downloadFile(dispatch, file)))
}

export const download = () => (dispatch, getState) => (
  getLocalFiles()
    .then(files => dispatch(updateLocalFiles(files)), () => dispatch(updateLocalFiles()))
    .then(() => shouldDownload(getState))
    .then(willDownloadFiles => dispatch(downloadStart(willDownloadFiles.length)))
    .then(() => clearTempFiles(TEMP_FOLDER).catch(err => console.log(err))) // eslint-disable-line
    .then(() => getTempFolder())
    .then(() => getFilesFolder())
    .then(() => downloadAllFiles(dispatch, getState)
      .then(() => dispatch(downloadFinished()))
      .catch(() => dispatch(downloadFailed())))
    .catch(err => console.log(err)) // eslint-disable-line
)
