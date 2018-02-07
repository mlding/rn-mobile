import { createSelector } from 'reselect'

const downloadState = state => state.download

export const downloadedFilesSelector = createSelector(
  downloadState,
  state => state.downloadedFiles,
)

export const downloadFilesCountSelector = createSelector(
  downloadState,
  state => state.downloadFilesCount,
)

export const downloadedFilesCountSelector = createSelector(
  downloadState,
  state => state.downloadedFilesCount,
)

export const isDownloadingSelector = createSelector(
  downloadState,
  state => state.isDownloading,
)

export const hasErrorSelector = createSelector(
  downloadState,
  state => state.hasError,
)
