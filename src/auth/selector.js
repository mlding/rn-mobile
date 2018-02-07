import { createSelector } from 'reselect'

export const authSelector = state => state.auth

export const userSelector = createSelector(
  authSelector,
  auth => auth.user,
)

export const roleSelector = createSelector(
  userSelector,
  user => user.role,
)

export const userFullNameSelector = createSelector(
  userSelector,
  user => `${user.first_name} ${user.last_name}`,
)
