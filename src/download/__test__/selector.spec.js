import {
  downloadedFilesCountSelector,
  downloadedFilesSelector,
  downloadFilesCountSelector,
  hasErrorSelector,
  isDownloadingSelector,
} from '../selector'

describe('download selector', () => {
  const state = {
    download: {
      downloadedFiles: ['downloadedFiles'],
      downloadFilesCount: ['downloadFilesCount'],
      downloadedFilesCount: ['downloadedFilesCount'],
      isDownloading: true,
      hasError: false,
    },
  }

  it('#downloadedFilesSelector', () => {
    expect(downloadedFilesSelector(state)).toEqual(['downloadedFiles'])
  })
  it('#downloadFilesCountSelector', () => {
    expect(downloadFilesCountSelector(state)).toEqual(['downloadFilesCount'])
  })
  it('#downloadedFilesCountSelector', () => {
    expect(downloadedFilesCountSelector(state)).toEqual(['downloadedFilesCount'])
  })
  it('#isDownloadingSelector', () => {
    expect(isDownloadingSelector(state)).toEqual(true)
  })
  it('#hasErrorSelector', () => {
    expect(hasErrorSelector(state)).toEqual(false)
  })
})
