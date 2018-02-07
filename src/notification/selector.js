import { createSelector } from 'reselect'

const notificationState = state => state.notification

export const notificationSelector = createSelector(
  notificationState,
  state => state.notification,
)

export const isManualRefreshSelector = createSelector(
  notificationState,
  state => state.isManualRefresh,
)
