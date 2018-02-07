import { createSelector } from 'reselect'
import { userSelector } from '../auth/selector'
import { getStatusComparator } from '../utilities/sort'
import { isLeadWorker } from '../utilities/role'

const selector = state => state.extraWorkOrder

export const listSelector = createSelector(
  selector, userSelector,
  (extraWorkOrder, user) =>
    [...extraWorkOrder.list].sort(getStatusComparator(isLeadWorker(user.role))),
)

export const nextSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.next,
)

export const loadingSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.loading,
)

export const refreshingSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.refreshing,
)

export const errorMsgSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.errorMessage,
)

export const basicInfoSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.basicInfo,
)

export const extraLinesSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.extraLines,
)

export const extraLineFormSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.extraLineForm,
)

export const locationSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.location,
)

export const locationEntranceSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.locationEntrance,
)

export const submittingSelector = createSelector(
  selector,
  extraWorkOrder => extraWorkOrder.submitting,
)
