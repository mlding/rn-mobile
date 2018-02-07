import reducer from '../reducer'
import {
  DOWNLOAD_FAILED,
  DOWNLOAD_FILE_SUCCESS,
  DOWNLOAD_FINISHED,
  DOWNLOAD_START,
  UPDATE_LOCAL_FILES,
} from '../actions'
import { downloadedAllFiles, localFiles, willDownloadedFile } from '../fixture'

describe('download reducer', () => {
  let initStatus

  beforeEach(() => {
    initStatus = {
      downloadedFiles: [],
      downloadFilesCount: 0,
      downloadedFilesCount: 0,
      isDownloading: false,
      hasError: false,
    }
  })

  describe('#downloadedFiles', () => {
    it('UPDATE_LOCAL_FILES', () => {
      const result = reducer(initStatus, {
        type: UPDATE_LOCAL_FILES,
        payload: downloadedAllFiles,
      })
      expect(result.downloadedFiles).toEqual(downloadedAllFiles)
    })
    it('UPDATE_LOCAL_FILES, empty payload', () => {
      const result = reducer(initStatus, {
        type: UPDATE_LOCAL_FILES,
      })
      expect(result.downloadedFiles).toEqual([])
    })
    it('DOWNLOAD_FILE_SUCCESS', () => {
      initStatus.downloadedFiles = localFiles
      const result = reducer(initStatus, {
        type: DOWNLOAD_FILE_SUCCESS,
        payload: willDownloadedFile,
      })
      expect(result.downloadedFiles).toEqual(downloadedAllFiles)
    })
  })

  describe('#downloadFilesCount', () => {
    it('DOWNLOAD_START', () => {
      const result = reducer(initStatus, {
        type: DOWNLOAD_START,
        payload: 5,
      })
      expect(result.downloadFilesCount).toEqual(5)
    })
  })

  describe('#downloadedFilesCount', () => {
    it('DOWNLOAD_START', () => {
      const result = reducer(initStatus, {
        type: DOWNLOAD_START,
        payload: null,
      })
      expect(result.downloadedFilesCount).toEqual(0)
    })
    it('DOWNLOAD_FILE_SUCCESS', () => {
      initStatus.downloadedFilesCount = 2
      const result = reducer(initStatus, {
        type: DOWNLOAD_FILE_SUCCESS,
        payload: null,
      })
      expect(result.downloadedFilesCount).toEqual(3)
    })
  })

  describe('#isDownloading', () => {
    it('DOWNLOAD_START', () => {
      const result = reducer(initStatus, {
        type: DOWNLOAD_START,
        payload: null,
      })
      expect(result.isDownloading).toEqual(true)
    })
    it('DOWNLOAD_FAILED', () => {
      const result = reducer(initStatus, {
        type: DOWNLOAD_FAILED,
        payload: null,
      })
      expect(result.isDownloading).toEqual(false)
    })
    it('DOWNLOAD_FINISHED', () => {
      const result = reducer(initStatus, {
        type: DOWNLOAD_FINISHED,
        payload: null,
      })
      expect(result.isDownloading).toEqual(false)
    })
  })

  describe('#hasError', () => {
    it('DOWNLOAD_START', () => {
      const result = reducer(initStatus, {
        type: DOWNLOAD_START,
        payload: null,
      })
      expect(result.hasError).toEqual(false)
    })
    it('DOWNLOAD_FAILED', () => {
      const result = reducer(initStatus, {
        type: DOWNLOAD_FAILED,
        payload: null,
      })
      expect(result.hasError).toEqual(true)
    })
  })
})
