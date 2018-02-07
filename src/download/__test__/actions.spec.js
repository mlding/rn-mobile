import { downloadFile, moveFile } from 'react-native-fs'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { download, downloadAllFiles, shouldDownload } from '../actions'
import {
  getLocalFiles,
  clearUselessFiles,
  clearTempFiles,
  getTempFolder,
  getFilesFolder,
  filterFiles,
} from '../utilities'

jest.mock('../utilities', () => ({
  getLocalFiles: jest.fn(),
  clearUselessFiles: jest.fn(),
  clearTempFiles: jest.fn(),
  getTempFolder: jest.fn(),
  getFilesFolder: jest.fn(),
  filterFiles: jest.fn(),
}))

describe('download actions', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  let store = {}
  const mock = new MockAdapter(axios)
  const initStatus = {
    download: {
      downloadedFiles: [],
      downloadFilesCount: 0,
      downloadedFilesCount: 0,
      isDownloading: false,
      hasError: false,
    },
    cache: {
      workPackageFiles: [],
    },
  }

  beforeEach(() => {
    store = mockStore(initStatus)
    getLocalFiles.mockImplementation(() => Promise.resolve([]))
    clearUselessFiles.mockImplementation(() => Promise.resolve([]))
    clearTempFiles.mockImplementation(() => Promise.resolve([]))
    getTempFolder.mockImplementation(() => Promise.resolve([]))
    getFilesFolder.mockImplementation(() => Promise.resolve([]))
    moveFile.mockImplementation(() => Promise.resolve([]))
    downloadFile.mockImplementation(() => ({ promise: Promise.resolve([]) }))
    filterFiles.mockImplementation(() => [
      {
        id: 43,
        added: '2017-10-27T08:53:30Z',
        upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
        name: 'DPR big file1',
        description: null,
        extension: 'pdf',
        work_package: 27,
      },
      {
        id: 12,
        added: '2017-10-11T02:00:58Z',
        upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
        name: 'DPR Sample',
        description: '',
        extension: 'pdf',
        work_package: 27,
      },
    ])
  })

  afterEach(() => {
    store.clearActions()
    mock.reset()
  })

  describe('#download', () => {
    it('should not start download if workPackageFiles do not exist', () => {
      const expectedActions = [
        { type: 'DOWNLOAD/UPDATE_LOCAL_FILES', payload: [] },
      ]
      return store.dispatch(download()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should not start download if all files have been downloaded', () => {
      store = mockStore({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
            { id: 43, name: 'DPR big file1.pdf', path: '/document/directory/files/43_DPR big file1.pdf' },
            { id: 12, name: 'DPR Sample.pdf', path: '/document/directory/files/12_DPR Sample.pdf' },
          ],
        },
      })
      getLocalFiles.mockImplementation(() => Promise.resolve([
        { id: 43, name: 'DPR big file1.pdf', path: '/document/directory/files/43_DPR big file1.pdf' },
        { id: 12, name: 'DPR Sample.pdf', path: '/document/directory/files/12_DPR Sample.pdf' },
      ]))
      filterFiles.mockImplementation(() => [])
      const expectedActions = [
        {
          type: 'DOWNLOAD/UPDATE_LOCAL_FILES',
          payload: [
            { id: 43, name: 'DPR big file1.pdf', path: '/document/directory/files/43_DPR big file1.pdf' },
            { id: 12, name: 'DPR Sample.pdf', path: '/document/directory/files/12_DPR Sample.pdf' },
          ],
        },
      ]
      return store.dispatch(download()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should start download, even getLocalFiles failed', () => {
      store = mockStore({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      getLocalFiles.mockImplementation(() => Promise.reject('get local files failed.'))
      const expectedActions = [
        { type: 'DOWNLOAD/UPDATE_LOCAL_FILES' },
        { type: 'DOWNLOAD/DOWNLOAD_START', payload: 2 },
        {
          type: 'DOWNLOAD/DOWNLOAD_FILE_SUCCESS',
          payload: { id: 43, name: 'DPR big file1.pdf', path: '/document/directory/files/43_DPR big file1.pdf' },
        },
        {
          type: 'DOWNLOAD/DOWNLOAD_FILE_SUCCESS',
          payload: { id: 12, name: 'DPR Sample.pdf', path: '/document/directory/files/12_DPR Sample.pdf' },
        },
        { type: 'DOWNLOAD/DOWNLOAD_FINISHED' },
      ]
      return store.dispatch(download()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should start download, even clearTempFiles failed', () => {
      store = mockStore({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      clearTempFiles.mockImplementation(() => Promise.reject('clear downloading files failed.'))
      const expectedActions = [
        { type: 'DOWNLOAD/UPDATE_LOCAL_FILES', payload: [] },
        { type: 'DOWNLOAD/DOWNLOAD_START', payload: 2 },
        {
          type: 'DOWNLOAD/DOWNLOAD_FILE_SUCCESS',
          payload: { id: 43, name: 'DPR big file1.pdf', path: '/document/directory/files/43_DPR big file1.pdf' },
        },
        {
          type: 'DOWNLOAD/DOWNLOAD_FILE_SUCCESS',
          payload: { id: 12, name: 'DPR Sample.pdf', path: '/document/directory/files/12_DPR Sample.pdf' },
        },
        { type: 'DOWNLOAD/DOWNLOAD_FINISHED' },
      ]
      return store.dispatch(download()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should start download, downloadAllFiles successfully', () => {
      store = mockStore({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      const expectedActions = [
        { type: 'DOWNLOAD/UPDATE_LOCAL_FILES', payload: [] },
        { type: 'DOWNLOAD/DOWNLOAD_START', payload: 2 },
        {
          type: 'DOWNLOAD/DOWNLOAD_FILE_SUCCESS',
          payload: { id: 43, name: 'DPR big file1.pdf', path: '/document/directory/files/43_DPR big file1.pdf' },
        },
        {
          type: 'DOWNLOAD/DOWNLOAD_FILE_SUCCESS',
          payload: { id: 12, name: 'DPR Sample.pdf', path: '/document/directory/files/12_DPR Sample.pdf' },
        },
        { type: 'DOWNLOAD/DOWNLOAD_FINISHED' },
      ]
      return store.dispatch(download()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
    it('should start download with files, downloadAllFiles failed', () => {
      downloadFile.mockImplementation(() => ({ promise: Promise.reject('download file failed') }))
      store = mockStore({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      const expectedActions = [
        { type: 'DOWNLOAD/UPDATE_LOCAL_FILES', payload: [] },
        { type: 'DOWNLOAD/DOWNLOAD_START', payload: 2 },
        { type: 'DOWNLOAD/DOWNLOAD_FAILED' },
      ]
      return store.dispatch(download()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('#shouldDownload', () => {
    it('should not start download, workPackageFiles do not exist.', () => {
      const getState = () => ({
        cache: {
          workPackageFiles: [
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      return shouldDownload(getState).catch(err => {
        expect(err).toEqual('workPackageFiles do not exist.')
      })
    })
    it('should not start download, all files have been downloaded.', () => {
      const getState = () => ({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
            {
              id: 43,
              name: 'DPR big file1.pdf',
              path: '/Users/swyin/Library/Developer/CoreSimulator/Devices/A0F067C7-0B12-41A1-9F35-E0282F7B97A6/data/Containers/Data/Application/01C124DE-4CD8-4FE1-99B8-980D6F1946B1/Documents/temp/43_DPR big file1.pdf',
            },
            {
              id: 12,
              name: 'DPR Sample.pdf',
              path: '/Users/swyin/Library/Developer/CoreSimulator/Devices/A0F067C7-0B12-41A1-9F35-E0282F7B97A6/data/Containers/Data/Application/01C124DE-4CD8-4FE1-99B8-980D6F1946B1/Documents/temp/12_DPR Sample.pdf',
            },
          ],
        },
      })
      return shouldDownload(getState).catch(err => {
        expect(err).toEqual('all files have been downloaded.')
      })
    })
    it('should start download', () => {
      const getState = () => ({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      return shouldDownload(getState).then(result => {
        expect(result).toEqual(getState().cache.workPackageFiles)
      })
    })
  })

  describe('#downloadAllFiles', () => {
    it('should downloadAllFiles successfully, moveFile successfully', () => {
      const getState = () => ({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      downloadFile.mockImplementation(() => ({ promise: Promise.resolve([]) }))
      moveFile.mockImplementation(() => Promise.resolve([]))
      return downloadAllFiles(() => {}, getState).then(result => {
        expect(result.length).toEqual(2)
      })
    })
    it('should downloadAllFiles failed', () => {
      const getState = () => ({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      downloadFile.mockImplementation(() => ({ promise: Promise.reject('download file failed') }))
      return downloadAllFiles(() => {}, getState).catch(err => {
        expect(err).toEqual('download file failed')
      })
    })
    it('should downloadAllFiles successfully, moveFile failed', () => {
      const getState = () => ({
        cache: {
          workPackageFiles: [
            {
              id: 43,
              added: '2017-10-27T08:53:30Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/M.Fowler_et_al_-_Refactoring_-_Improving_the_Design_of_Existing.pdf',
              name: 'DPR big file1',
              description: null,
              extension: 'pdf',
              work_package: 27,
            },
            {
              id: 12,
              added: '2017-10-11T02:00:58Z',
              upload: 'https://vitruvi-backend-dev-static.s3.amazonaws.com/uploads/Daily_Production_Report.pdf',
              name: 'DPR Sample',
              description: '',
              extension: 'pdf',
              work_package: 27,
            },
          ],
        },
        download: {
          downloadedFiles: [
          ],
        },
      })
      downloadFile.mockImplementation(() => ({ promise: Promise.resolve([]) }))
      moveFile.mockImplementation(() => Promise.reject('move file failed'))
      return downloadAllFiles(() => {}, getState).catch(err => {
        expect(err).toEqual('move file failed')
      })
    })
  })
})
